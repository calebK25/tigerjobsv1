import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Use setTimeout to prevent auth deadlock
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              setUser({
                id: session.user.id,
                name: profile?.name || '',
                email: session.user.email || '',
                major: profile?.major || '',
                photoURL: session.user.user_metadata?.avatar_url || null,
              });
            } catch (error) {
              console.error('Error fetching profile:', error);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Then check current session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            setUser({
              id: session.user.id,
              name: profile?.name || '',
              email: session.user.email || '',
              major: profile?.major || '',
              photoURL: session.user.user_metadata?.avatar_url || null,
            });
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });
      
      if (error) {
        if (error.message.includes('refused to connect')) {
          toast.error('Google authentication failed. Please check your network connection and try again.');
        } else {
          toast.error(`Login failed: ${error.message}`);
        }
        throw error;
      }
      
      toast.success('Redirecting to Google authentication...');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(`Failed to log out: ${error.message}`);
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true
        }
      });
      
      if (error) throw error;
      toast.success('Magic link sent to your email');
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      toast.error(`Failed to send magic link: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    loading, 
    login, 
    logout, 
    setUser,
    loginWithEmail 
  };
};
