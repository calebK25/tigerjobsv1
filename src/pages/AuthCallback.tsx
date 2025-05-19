import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Clear any existing sessions
        const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
        if (signOutError) {
          console.error('Error clearing existing sessions:', signOutError);
        }
        
        // Fetch the new session from the URL
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          throw error;
        }
        
        // If successful, redirect to the dashboard
        navigate('/', { replace: true });
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
    </div>
  );
};

export default AuthCallback;
