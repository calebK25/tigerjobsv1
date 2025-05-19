
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!resumeText) {
      throw new Error('Resume text is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Sending resume text to OpenAI, length:', resumeText.length);

    // Make sure we're using the latest OpenAI API version
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Your task is to enhance the resume while maintaining its core content and structure. Focus on improving clarity, impact, and professional language. Return ONLY the enhanced resume text without any commentary or explanations.'
          },
          {
            role: 'user',
            content: `Professionally enhance this resume, focusing on clarity, impact, and ATS optimization:\n\n${resumeText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    // Log response status for debugging
    console.log('OpenAI API response status:', response.status);
    
    // Handle non-successful API responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.error('Parsed OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      } catch (parseError) {
        throw new Error(`OpenAI API error (status ${response.status}): ${errorText.substring(0, 100)}`);
      }
    }

    const data = await response.json();
    console.log('OpenAI API successful response, content length:', data.choices?.[0]?.message?.content?.length || 0);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response format:', JSON.stringify(data).substring(0, 200));
      throw new Error('Invalid response from OpenAI');
    }
    
    return new Response(JSON.stringify({
      enhancedResume: data.choices[0].message.content,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in enhance-resume function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unknown error occurred',
      stack: error.stack
    }), {
      status: 200, // Return 200 even for errors, and handle them client-side
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
