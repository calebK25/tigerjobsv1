import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error(`Error parsing request body: ${error.message}`);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: error.message
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { code, action, redirectUri } = requestBody;
    
    // Validate required action parameter
    if (!action) {
      console.error('Missing required parameter: action');
      return new Response(JSON.stringify({ 
        error: 'Missing required parameter: action' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get environment variables
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Validate environment variables
    if (!clientId || !clientSecret) {
      console.error('Missing Google API credentials in environment variables');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing Google API credentials' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials in environment variables');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing Supabase credentials' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role key for admin operations if needed
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey || supabaseKey, // Fallback to anon key if service role key is not set
      { auth: { persistSession: false } }
    );
    
    // Initialize regular Supabase client for user operations
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      { auth: { persistSession: false } }
    );
    
    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(JSON.stringify({ 
        error: 'Unauthorized: Missing authentication token' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    
    if (userError || !user) {
      console.error(`User error: ${userError?.message || "No user found"}`);
      return new Response(JSON.stringify({ 
        error: 'Unauthorized: Invalid or expired token',
        details: userError?.message
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle getAuthUrl action
    if (action === 'getAuthUrl') {
      // Get the host from request headers
      const host = req.headers.get('host') || 'localhost:8080';
      // Determine if it's http or https based on headers
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      // Get origin from headers or construct from host
      const origin = req.headers.get('origin') || `${protocol}://${host}`;
      // Use the provided redirectUri or fall back to the origin + /calendar
      const finalRedirectUri = redirectUri || `${origin}/calendar`;
      console.log(`Using redirect URI: ${finalRedirectUri}`);
      
      const scope = 'https://www.googleapis.com/auth/calendar.events';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${finalRedirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
      
      return new Response(JSON.stringify({ url: authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle exchangeCode action
    if (action === 'exchangeCode') {
      // Validate code parameter
      if (!code) {
        console.error('Missing required parameter: code');
        return new Response(JSON.stringify({ 
          error: 'Missing required parameter: code' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Get the host from request headers
      const host = req.headers.get('host') || 'localhost:8080';
      // Determine if it's http or https based on headers
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      // Get origin from headers or construct from host
      const origin = req.headers.get('origin') || `${protocol}://${host}`;
      // Use the provided redirectUri or fall back to the origin + /calendar
      const finalRedirectUri = redirectUri || `${origin}/calendar`;
      console.log(`Using redirect URI for token exchange: ${finalRedirectUri}`);
      
      // Build token exchange request body
      const tokenParams = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: finalRedirectUri,
        grant_type: 'authorization_code',
      });
      
      console.log(`Exchanging code for token with redirect URI: ${finalRedirectUri}`);
      
      // Make token exchange request
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams,
      });
      
      // Handle token exchange errors
      if (!tokenResponse.ok) {
        let errorData;
        try {
          errorData = await tokenResponse.json();
        } catch (e) {
          errorData = await tokenResponse.text();
        }
        
        console.error(`Token exchange failed: ${JSON.stringify(errorData)}`);
        return new Response(JSON.stringify({ 
          error: `Failed to exchange code: ${tokenResponse.status}`,
          details: errorData
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Parse token data
      const tokenData: GoogleTokenResponse = await tokenResponse.json();
      console.log("Token exchange successful");

      // Store the tokens in the database using service role to bypass RLS
      try {
        // Using service role client for admin operations to bypass RLS
        const { error: dbError } = await supabaseAdmin
          .from('calendar_sync')
          .upsert({
            user_id: user.id,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          });

        if (dbError) {
          console.error(`Database error: ${dbError.message}`);
          return new Response(JSON.stringify({ 
            error: 'Database error',
            details: dbError.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (error) {
        console.error(`Database operation error: ${error.message}`);
        return new Response(JSON.stringify({ 
          error: 'Database operation failed',
          details: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle token refresh check and refresh if needed
    if (action === 'refreshTokenIfNeeded') {
      console.log(`Checking token status for user: ${user.id}`);

      // Get the user's calendar sync tokens
      const { data: syncData, error: syncError } = await supabaseAdmin
        .from('calendar_sync')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (syncError || !syncData) {
        console.error(`Sync data error: ${syncError?.message || "No sync data found"}`);
        return new Response(JSON.stringify({ 
          error: 'No calendar sync found. Please connect to Google Calendar first.',
          details: syncError?.message
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if token is expired or about to expire (within 5 minutes)
      const expiresAt = new Date(syncData.expires_at).getTime();
      const now = Date.now();
      const fiveMinutesInMs = 5 * 60 * 1000;
      
      // If token is still valid for more than 5 minutes, no need to refresh
      if (expiresAt > now + fiveMinutesInMs) {
        console.log('Token is still valid, no need to refresh');
        return new Response(JSON.stringify({ 
          refreshed: false,
          message: 'Token is still valid'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Token expired or about to expire, refreshing...');
      
      // If refresh token is not available, can't refresh
      if (!syncData.refresh_token) {
        console.error('No refresh token available');
        return new Response(JSON.stringify({ 
          error: 'No refresh token available. Please reconnect to Google Calendar.',
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Build token refresh request body
      const refreshParams = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: syncData.refresh_token,
        grant_type: 'refresh_token',
      });
      
      // Make token refresh request
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: refreshParams,
      });
      
      // Handle refresh errors
      if (!refreshResponse.ok) {
        let errorData;
        try {
          errorData = await refreshResponse.json();
        } catch (e) {
          errorData = await refreshResponse.text();
        }
        
        console.error(`Token refresh failed: ${JSON.stringify(errorData)}`);
        return new Response(JSON.stringify({ 
          error: `Failed to refresh token: ${refreshResponse.status}`,
          details: errorData
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Parse new token data
      const newTokenData: GoogleTokenResponse = await refreshResponse.json();
      console.log("Token refresh successful");

      // Update the token in the database
      try {
        const updateData: any = {
          access_token: newTokenData.access_token,
          expires_at: new Date(Date.now() + newTokenData.expires_in * 1000).toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Only update refresh token if a new one was provided
        if (newTokenData.refresh_token) {
          updateData.refresh_token = newTokenData.refresh_token;
        }
        
        const { error: dbError } = await supabaseAdmin
          .from('calendar_sync')
          .update(updateData)
          .eq('user_id', user.id);

        if (dbError) {
          console.error(`Database error updating token: ${dbError.message}`);
          return new Response(JSON.stringify({ 
            error: 'Database error',
            details: dbError.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (error) {
        console.error(`Database operation error: ${error.message}`);
        return new Response(JSON.stringify({ 
          error: 'Database operation failed',
          details: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        refreshed: true,
        message: 'Token successfully refreshed'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle syncInterviews action
    if (action === 'syncInterviews') {
      console.log(`Syncing interviews for user: ${user.id}`);

      // Get the user's calendar sync tokens
      // Using service role to bypass RLS
      const { data: syncData, error: syncError } = await supabaseAdmin
        .from('calendar_sync')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (syncError || !syncData) {
        console.error(`Sync data error: ${syncError?.message || "No sync data found"}`);
        return new Response(JSON.stringify({ 
          error: 'No calendar sync found. Please connect to Google Calendar first.',
          details: syncError?.message
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get the user's interviews
      // Using service role to bypass RLS
      const { data: interviews, error: interviewsError } = await supabaseAdmin
        .from('interviews')
        .select('*')
        .eq('user_id', user.id);

      if (interviewsError) {
        console.error(`Interviews fetch error: ${interviewsError.message}`);
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch interviews',
          details: interviewsError.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Found ${interviews?.length || 0} interviews to sync`);

      // Array to track successful syncs
      const syncResults = [];

      // Sync each interview to Google Calendar
      for (const interview of interviews || []) {
        if (!interview.next_interview_date) {
          console.log(`Skipping interview ${interview.id} with no date`);
          continue;
        }

        try {
          const event = {
            summary: `Interview with ${interview.company}`,
            description: `${interview.role}\n\nNotes: ${interview.notes || 'No notes'}`,
            start: {
              dateTime: new Date(interview.next_interview_date).toISOString(),
              timeZone: 'UTC',
            },
            end: {
              dateTime: new Date(new Date(interview.next_interview_date).getTime() + 60 * 60 * 1000).toISOString(),
              timeZone: 'UTC',
            },
            location: interview.location || 'Remote',
          };

          const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${syncData.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          });

          if (!calendarResponse.ok) {
            let errorData;
            try {
              errorData = await calendarResponse.json();
            } catch (e) {
              errorData = await calendarResponse.text();
            }
            
            console.error(`Calendar API error for interview ${interview.id}: ${JSON.stringify(errorData)}`);
            throw new Error(`Calendar API failed: ${calendarResponse.status} ${JSON.stringify(errorData)}`);
          }

          const calendarData = await calendarResponse.json();
          console.log(`Successfully created calendar event for interview ${interview.id}`);
          syncResults.push({ interviewId: interview.id, success: true, eventId: calendarData.id });
        } catch (error) {
          console.error(`Error syncing interview ${interview.id}:`, error);
          syncResults.push({ interviewId: interview.id, success: false, error: error.message });
        }
      }

      return new Response(JSON.stringify({ success: true, results: syncResults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle unknown action
    return new Response(JSON.stringify({ 
      error: `Invalid action: ${action}` 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Function error: ${error.message}`, error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
