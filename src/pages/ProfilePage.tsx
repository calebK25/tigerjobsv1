
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings } from 'lucide-react';
import { ProfileInformation } from '@/components/profile/ProfileInformation';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

const ProfilePage = () => {
  const { user, userSettings, updateUserProfile, updateUserSettings } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 mt-6">
          <ProfileInformation 
            user={user}
            onUpdate={updateUserProfile}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-6">
          <ProfileSettings
            settings={userSettings}
            onUpdate={updateUserSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
