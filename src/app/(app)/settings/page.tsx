
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, User, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    notifications: {
      newMessages: true,
      newMatches: true,
      gameInvites: false,
    },
    theme: 'light',
  });

  const handleSwitchChange = (id: keyof typeof settings | 'darkMode') => {
      if (id === 'darkMode') {
          const newTheme = settings.theme === 'light' ? 'dark' : 'light';
          setSettings(prev => ({ ...prev, theme: newTheme }));
           if (typeof window !== 'undefined') {
              document.documentElement.classList.toggle('dark', newTheme === 'dark');
              document.documentElement.classList.toggle('light', newTheme === 'light');
          }
      } else if (id === 'profileVisibility') {
        setSettings(prev => ({ ...prev, profileVisibility: !prev.profileVisibility }));
      }
  };

  const handleCheckboxChange = (id: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [id]: !prev.notifications[id],
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
       <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and notification preferences.
          </p>
        </div>
         <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
         </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><User /> Account Settings</CardTitle>
          <CardDescription>Control your public visibility and account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="profile-visibility">Public Profile</Label>
                    <p className="text-xs text-muted-foreground">
                        Allow other users to see your profile.
                    </p>
                </div>
                <Switch 
                    id="profile-visibility" 
                    checked={settings.profileVisibility}
                    onCheckedChange={() => handleSwitchChange('profileVisibility')}
                />
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Palette /> Theme Settings</CardTitle>
          <CardDescription>Choose how you want the app to look.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                     <p className="text-xs text-muted-foreground">
                        Enable a darker theme for the app.
                    </p>
                </div>
                <Switch 
                    id="dark-mode" 
                    checked={settings.theme === 'dark'}
                    onCheckedChange={() => handleSwitchChange('darkMode')}
                />
            </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Bell /> Notification Settings</CardTitle>
          <CardDescription>Select which notifications you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 rounded-lg border p-4">
                <Checkbox 
                    id="new-messages" 
                    checked={settings.notifications.newMessages}
                    onCheckedChange={() => handleCheckboxChange('newMessages')}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="new-messages">New Messages</Label>
                    <p className="text-xs text-muted-foreground">
                        Receive notifications for new direct messages.
                    </p>
                </div>
            </div>
             <div className="flex items-center space-x-3 rounded-lg border p-4">
                <Checkbox 
                    id="new-matches" 
                    checked={settings.notifications.newMatches}
                    onCheckedChange={() => handleCheckboxChange('newMatches')}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="new-matches">New Matches</Label>
                    <p className="text-xs text-muted-foreground">
                        Get notified when you match with someone.
                    </p>
                </div>
            </div>
             <div className="flex items-center space-x-3 rounded-lg border p-4">
                <Checkbox 
                    id="game-invites" 
                    checked={settings.notifications.gameInvites}
                    onCheckedChange={() => handleCheckboxChange('gameInvites')}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="game-invites">Game Invites</Label>
                    <p className="text-xs text-muted-foreground">
                        Be alerted when someone invites you to a game.
                    </p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
