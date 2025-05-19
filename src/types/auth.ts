
import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  id: string;
  name: string;
  email: string;
  major?: string;
  photoURL?: string;
};

export interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  calendarSync: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  userSettings: UserSettings;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}
