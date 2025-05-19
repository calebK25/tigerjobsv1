
import { useState, useEffect } from 'react';
import { UserSettings } from '@/types/auth';
import { toast } from "sonner";

const defaultSettings: UserSettings = {
  emailNotifications: true,
  darkMode: false,
  calendarSync: false,
};

export const useUserSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('userSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      console.error('Error parsing saved settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      
      // Apply dark mode
      if (userSettings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [userSettings]);

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    try {
      console.log('Updating settings with:', settings);
      setUserSettings(prev => ({ ...prev, ...settings }));
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error("Failed to update settings");
    }
  };

  return { userSettings, updateUserSettings };
};
