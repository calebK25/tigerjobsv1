import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a hash with token (Lovable redirect issue)
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log('Detected token in URL hash, extracting...');
          
          // Extract parameters from the hash
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          
          // Get the tokens
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const expiresIn = params.get('expires_in');
          
          if (accessToken) {
            console.log('Setting session with extracted token');
            
            // Set the session manually
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (error) {
              console.error('Failed to set session with token:', error);
              throw error;
            }
            
            console.log('Session set successfully, redirecting to dashboard');
            navigate('/', { replace: true });
            return;
          }
        }
        
        // Standard flow - get the session from the URL
        console.log('Getting session from URL params');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          throw error;
        }
        
        if (data?.session) {
          console.log('Session obtained successfully, redirecting to dashboard');
          navigate('/', { replace: true });
        } else {
          console.error('No session data found');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback processing error:', error);
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-xl">Completing authentication...</p>
      <p className="text-sm text-gray-500 mt-4">If you're redirected to another site, please come back to this page.</p>
    </div>
  );
};

export default AuthCallback;
