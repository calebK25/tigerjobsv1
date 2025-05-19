
import React, { useState } from 'react';
import { User } from '@/types/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface ProfileInformationProps {
  user: User | null;
  onUpdate: (updates: Partial<User>) => void;
}

export const ProfileInformation = ({ user, onUpdate }: ProfileInformationProps) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [major, setMajor] = useState(user?.major || '');
  
  const handleProfileUpdate = () => {
    onUpdate({
      ...user!,
      name,
      email,
      major
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Your email"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <Input 
            id="major" 
            value={major} 
            onChange={(e) => setMajor(e.target.value)} 
            placeholder="Your field of study"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleProfileUpdate} className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
