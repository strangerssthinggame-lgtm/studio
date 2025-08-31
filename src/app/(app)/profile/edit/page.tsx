
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, MapPin, User, FileImage, PlusCircle, X, Save, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const userProfile = {
  name: 'Alex',
  username: '@alex_codes',
  location: 'San Francisco, CA',
  bio: 'Just a human vibing. Developer by day, dreamer by night. I believe in connecting with people on a deeper level. Let\'s talk about anything from the latest tech trends to the mysteries of the universe.',
  avatar: 'https://picsum.photos/100',
  banner: 'https://picsum.photos/1600/400',
  vibe: 'Date', // Changed from 'vibes' array to single 'vibe'
  interests: ['Photography', 'Hiking', 'Indie Music', 'Sci-Fi Movies', 'Coffee Enthusiast', 'Yoga'],
  gallery: [
    { id: 1, src: 'https://picsum.photos/seed/gallery1/400/400', hint: 'mountain landscape' },
    { id: 2, src: 'https://picsum.photos/seed/gallery2/400/400', hint: 'city skyline' },
    { id: 3, src: 'https://picsum.photos/seed/gallery3/400/400', hint: 'abstract art' },
    { id: 4, src: 'https://picsum.photos/seed/gallery4/400/400', hint: 'portrait smiling' },
  ],
  availability: 'Evenings & Weekends',
};

const allVibes = ['Friend', 'Date', 'Casual', 'Spicy', 'Serious'];

export default function EditProfilePage() {
  const [profile, setProfile] = useState(userProfile);
  const [newInterest, setNewInterest] = useState('');

  const handleInterestAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      e.preventDefault();
      if (!profile.interests.includes(newInterest.trim())) {
        setProfile({
          ...profile,
          interests: [...profile.interests, newInterest.trim()],
        });
      }
      setNewInterest('');
    }
  };

  const handleInterestRemove = (interestToRemove: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove),
    });
  };
  
  const handleVibeSelect = (vibe: string) => {
      setProfile(prev => ({ ...prev, vibe: vibe }));
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-bold">Edit Profile</h1>
        <div className="flex gap-2">
            <Link href="/profile">
                <Button variant="outline">Cancel</Button>
            </Link>
            <Button>
                <Save className="mr-2 h-4 w-4"/>
                Save Changes
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile Information</CardTitle>
          <CardDescription>Update your public profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value})} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} rows={5} />
            </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><Clock/> My Availability</CardTitle>
                <CardDescription>Let others know when you're typically free to chat or play.</CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="availability">Availability</Label>
                <Input id="availability" value={profile.availability} onChange={(e) => setProfile({...profile, availability: e.target.value})} placeholder="e.g., Evenings & Weekends" />
            </CardContent>
        </Card>
      </div>

       <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Sparkles/> My Vibe</CardTitle>
                    <CardDescription>Select the tag that best describes the connection you're looking for.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {allVibes.map((vibe) => (
                            <button key={vibe} onClick={() => handleVibeSelect(vibe)}>
                                <Badge variant={profile.vibe === vibe ? 'default' : 'secondary'} className="text-base px-4 py-2 cursor-pointer">
                                    {vibe}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      
       <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><FileImage/> My Gallery</CardTitle>
                    <CardDescription>Manage your photo gallery.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {profile.gallery.map((photo) => (
                            <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden group">
                                <Image src={photo.src} alt={`Gallery photo ${photo.id}`} fill objectFit="cover" data-ai-hint={photo.hint} />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" size="icon"><X className="h-4 w-4"/></Button>
                                 </div>
                            </div>
                        ))}
                         <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                            <PlusCircle className="h-8 w-8"/>
                            <span className="mt-2 text-sm">Add Photo</span>
                            <input type="file" className="sr-only" />
                        </label>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><User/> My Interests</CardTitle>
                    <CardDescription>Add or remove your interests to help others connect with you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                             <Badge key={interest} variant="secondary" className="text-base px-3 py-1 items-center">
                                {interest}
                                <button onClick={() => handleInterestRemove(interest)} className="ml-2 rounded-full hover:bg-destructive/20 p-0.5">
                                    <X className="h-3 w-3"/>
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="new-interest">Add a new interest</Label>
                        <Input 
                            id="new-interest" 
                            placeholder="Type an interest and press Enter" 
                            className="mt-2"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyDown={handleInterestAdd}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
