import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback...');
        
        // Clear client-side storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Clear any existing Supabase session
        const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
        if (signOutError) {
          console.error('Error clearing existing sessions:', signOutError);
        }
        
        // Extract hash if present (contains token)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          console.log('Hash contains access_token, redirecting to proper callback');
          // We have a hashed URL with tokens - need to handle this properly
          
          // Get the current URL without the hash
          const baseUrl = window.location.href.split('#')[0];
          
          // Rebuild the URL correctly for Supabase
          const urlWithoutHash = `${baseUrl}?${hash.substring(1)}`;
          
          // Redirect to the new URL format
          window.location.href = urlWithoutHash;
          return;
        }
        
        // Process the standard callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          throw error;
        }
        
        if (data?.session) {
          console.log('Authentication successful, redirecting to dashboard');
          toast.success('Successfully logged in!');
          navigate('/', { replace: true });
        } else {
          console.error('No session created during callback');
          toast.error('Login failed. Please try again.');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback processing error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-xl">Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;
