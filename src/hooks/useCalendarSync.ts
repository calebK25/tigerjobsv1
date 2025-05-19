
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCalendarSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');

  // Check if the user has already connected to Google Calendar
  const checkConnectionStatus = async () => {
    try {
      console.log('Checking calendar connection status...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError || !authData.session) {
        console.log('User not authenticated, connection status: disconnected');
        setConnectionStatus('disconnected');
        return false;
      }
      
      const { data, error } = await supabase
        .from('calendar_sync')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error checking connection status:', error);
        throw error;
      }
      
      const isConnected = data && data.length > 0;
      console.log('Calendar connection status:', isConnected ? 'connected' : 'disconnected');
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch (error) {
      console.error('Error checking connection status:', error);
      setConnectionStatus('unknown');
      return false;
    }
  };

  const connectToGoogle = async () => {
    try {
      setSyncing(true);
      
      // Check if user is authenticated first
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError || !authData.session) {
        console.error('User not authenticated');
        toast.error('Please log in to connect to Google Calendar');
        setSyncing(false);
        return;
      }
      
      // Get the current URL's origin for the redirect
      const redirectUri = `${window.location.origin}/calendar`;
      console.log('Using redirect URI:', redirectUri);
      
      console.log('Invoking calendar-sync function with action: getAuthUrl');
      const { data, error } = await supabase.functions.invoke('calendar-sync', {
        body: { 
          action: 'getAuthUrl',
          redirectUri 
        }
      });

      if (error) {
        console.error('Error invoking calendar-sync function:', error);
        throw new Error(`Failed to get auth URL: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || !data.url) {
        console.error('No URL returned from calendar-sync function', data);
        throw new Error('No authentication URL returned from the server');
      }
      
      toast.info('Redirecting to Google authentication...');
      console.log('Redirecting to:', data.url);
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Google Calendar connection error:', error);
      toast.error(`Failed to connect to Google Calendar: ${error.message || 'Unknown error'}`);
      setSyncing(false);
    }
  };

  const handleCallback = async (code: string) => {
    try {
      setSyncing(true);
      toast.info('Processing Google authentication...');
      
      // Check if user is authenticated first
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError || !authData.session) {
        console.error('User not authenticated');
        toast.error('Please log in to connect to Google Calendar');
        setSyncing(false);
        return;
      }
      
      // Use the current URL's origin for the redirect
      const redirectUri = `${window.location.origin}/calendar`;
      console.log('Using redirect URI for callback:', redirectUri);
      
      console.log('Invoking calendar-sync function with action: exchangeCode');
      const { data, error } = await supabase.functions.invoke('calendar-sync', {
        body: { 
          code, 
          action: 'exchangeCode',
          redirectUri 
        }
      });

      if (error) {
        console.error('Exchange code error details:', error);
        throw new Error(`Failed to exchange code: ${error.message || 'Unknown error'}`);
      }
      
      setConnectionStatus('connected');
      toast.success('Successfully connected to Google Calendar');
      
      // Sync interviews after successful connection
      await syncInterviews();
    } catch (error: any) {
      console.error('Exchange code error:', error);
      toast.error(`Failed to connect to Google Calendar: ${error.message || 'Unknown error'}`);
      setConnectionStatus('disconnected');
    } finally {
      setSyncing(false);
    }
  };

  // New function to refresh the token if needed before syncing
  const refreshTokenIfNeeded = async () => {
    try {
      console.log('Checking if token refresh is needed...');
      const { data, error } = await supabase.functions.invoke('calendar-sync', {
        body: { action: 'refreshTokenIfNeeded' }
      });
      
      if (error) {
        console.error('Token refresh check failed:', error);
        throw new Error(`Failed to check token status: ${error.message || 'Unknown error'}`);
      }
      
      if (data?.refreshed) {
        console.log('Token successfully refreshed');
      } else {
        console.log('Token refresh not needed or already valid');
      }
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      toast.error('Failed to refresh authentication. Please reconnect your Google Calendar.');
      return false;
    }
  };

  const syncInterviews = async () => {
    try {
      setSyncing(true);
      
      // Check if user is authenticated first
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError || !authData.session) {
        console.error('User not authenticated');
        toast.error('Please log in to sync interviews with Google Calendar');
        setSyncing(false);
        return;
      }
      
      toast.info('Syncing interviews with Google Calendar...');
      
      // First refresh the token if needed
      const tokenValid = await refreshTokenIfNeeded();
      if (!tokenValid) {
        setSyncing(false);
        return;
      }
      
      console.log('Invoking calendar-sync function with action: syncInterviews');
      const { data, error } = await supabase.functions.invoke('calendar-sync', {
        body: { action: 'syncInterviews' }
      });

      if (error) {
        console.error('Sync interviews error details:', error);
        throw new Error(`Failed to sync interviews: ${error.message || 'Unknown error'}`);
      }
      
      if (data?.results) {
        const successful = data.results.filter(r => r.success).length;
        const failed = data.results.filter(r => !r.success).length;
        
        if (failed > 0) {
          toast.warning(`Synced ${successful} interviews, but ${failed} failed`);
        } else if (successful > 0) {
          toast.success(`Successfully synced ${successful} interviews to Google Calendar`);
        } else {
          toast.info('No interviews to sync');
        }
      } else {
        toast.success('Interviews synced with Google Calendar');
      }
    } catch (error: any) {
      console.error('Error syncing interviews:', error);
      toast.error(`Failed to sync interviews: ${error.message || 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  return {
    syncing,
    connectionStatus,
    connectToGoogle,
    handleCallback,
    syncInterviews,
    checkConnectionStatus,
  };
};
