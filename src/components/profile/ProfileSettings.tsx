
import React from 'react';
import { UserSettings } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail, Calendar, Moon } from 'lucide-react';

interface ProfileSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export const ProfileSettings = ({ settings, onUpdate }: ProfileSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Customize your user experience and notification preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <Switch 
              id="dark-mode" 
              checked={settings.darkMode}
              onCheckedChange={(checked) => onUpdate({ darkMode: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts about new job recommendations and interview reminders.
                </p>
              </div>
            </div>
            <Switch 
              id="email-notifications" 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => onUpdate({ emailNotifications: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Integration</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="calendar-sync">Calendar Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync interviews with your Google Calendar.
                </p>
              </div>
            </div>
            <Switch 
              id="calendar-sync" 
              checked={settings.calendarSync}
              onCheckedChange={(checked) => onUpdate({ calendarSync: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
