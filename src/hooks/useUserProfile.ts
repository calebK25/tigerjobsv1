
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useUserProfile = (user: User | null, setUser: (user: User) => void) => {
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          email: updates.email,
          major: updates.major,
        })
        .eq('id', user.id);

      if (error) throw error;
      setUser({ ...user, ...updates });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return { updateUserProfile };
};
