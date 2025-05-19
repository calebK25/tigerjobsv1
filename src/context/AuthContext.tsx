
import React, { createContext, useContext } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    loading, 
    login, 
    logout, 
    setUser,
    loginWithEmail
  } = useSupabaseAuth();
  
  const { userSettings, updateUserSettings } = useUserSettings();
  
  // Create a wrapper function that matches the expected type
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      try {
        setUser({ ...user, ...updates });
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update profile');
      }
    }
  };
  
  const { updateUserProfile } = useUserProfile(user, updateUser);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        userSettings,
        login, 
        logout, 
        loginWithEmail,
        updateUserProfile,
        updateUserSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
