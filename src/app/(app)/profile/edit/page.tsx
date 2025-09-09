
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { firestore, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, MapPin, User, FileImage, PlusCircle, X, Save, Sparkles, Clock, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/user-profile-data';


const allVibes = ['Friend', 'Date', 'Casual', 'Spicy', 'Serious'];

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Handle case where profile doesn't exist for some reason
          console.error("No such document!");
          // Maybe redirect or show an error
        }
      }
      setIsLoading(false);
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);


  const handleInterestAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newInterest.trim() && profile) {
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
    if (profile) {
        setProfile({
        ...profile,
        interests: profile.interests.filter(interest => interest !== interestToRemove),
        });
    }
  };
  
  const handleVibeSelect = (vibe: string) => {
      if (profile) {
        setProfile(prev => prev ? ({ ...prev, vibes: prev.vibes.includes(vibe) ? prev.vibes.filter(v => v !== vibe) : [...prev.vibes, vibe] }) : null);
      }
  }

  const handleSaveChanges = async () => {
    if (!user || !profile) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save.' });
        return;
    }
    setIsSaving(true);
    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        // Using updateDoc to only change fields. Use setDoc with merge if you want to create if not exists.
        await updateDoc(userDocRef, {
            ...profile,
            profileComplete: true, // Mark profile as complete
        });
        toast({ title: 'Success!', description: 'Your profile has been saved successfully.' });
        router.push('/profile');
    } catch (error) {
        console.error("Error saving profile: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save profile.' });
    } finally {
        setIsSaving(false);
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
        setProfile(prev => prev ? ({ ...prev, [field]: value }) : null)
    }
  }
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile && user) {
      const file = e.target.files[0];
      const imageId = Date.now();
      const storageRef = ref(storage, `users/${user.uid}/gallery/${imageId}_${file.name}`);
      
      toast({ title: "Uploading...", description: "Your photo is being uploaded." });

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const newImage = {
          id: imageId,
          src: downloadURL,
          hint: 'custom upload',
          path: snapshot.ref.fullPath // Important for deletion
        };

        setProfile(prevProfile => prevProfile ? {
          ...prevProfile,
          gallery: [...prevProfile.gallery, newImage],
        } : null);

        toast({ title: "Photo Added", description: "Your new photo has been added to the gallery. Don't forget to save your changes!" });
      } catch (error) {
        console.error("Error uploading image: ", error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload your photo.' });
      }
    }
  };

  const handleImageRemove = (photoId: number) => {
    if (profile) {
      setProfile(prevProfile => prevProfile ? {
        ...prevProfile,
        gallery: prevProfile.gallery.filter((photo) => photo.id !== photoId),
      } : null);
       toast({ title: "Photo Removed", description: "The photo has been removed from your gallery. Save changes to make it permanent." });
    }
  };

  if (isLoading || authLoading) {
      return (
          <div className="w-full max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
          </div>
      )
  }
  
  if (!profile) {
      return <div>Could not load profile. Please try again.</div>
  }


  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-bold">Edit Profile</h1>
        <div className="flex gap-2">
            <Link href="/profile">
                <Button variant="outline" disabled={isSaving}>Cancel</Button>
            </Link>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? <RotateCw className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                {isSaving ? 'Saving...' : 'Save Changes'}
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
                    <Input id="name" value={profile.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={profile.username} onChange={(e) => handleInputChange('username', e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={profile.location} onChange={(e) => handleInputChange('location', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea id="bio" value={profile.bio} onChange={(e) => handleInputChange('bio', e.target.value)} rows={5} />
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
                <Input id="availability" value={profile.availability} onChange={(e) => handleInputChange('availability', e.target.value)} placeholder="e.g., Evenings & Weekends" />
            </CardContent>
        </Card>
      </div>

       <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Sparkles/> My Vibes</CardTitle>
                    <CardDescription>Select tags that best describe the connection you're looking for. Select all that apply.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {allVibes.map((vibe) => (
                            <button key={vibe} onClick={() => handleVibeSelect(vibe)}>
                                <Badge variant={profile.vibes.includes(vibe) ? 'default' : 'secondary'} className="text-base px-4 py-2 cursor-pointer">
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
                    <CardDescription>Manage your photo gallery. Click 'Save Changes' at the top to make your edits permanent.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {profile.gallery.map((photo) => (
                            <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden group">
                                <Image src={photo.src} alt={`Gallery photo ${photo.id}`} fill className="object-cover" data-ai-hint={photo.hint} />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" size="icon" onClick={() => handleImageRemove(photo.id)}><X className="h-4 w-4"/></Button>
                                 </div>
                            </div>
                        ))}
                         <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                            <PlusCircle className="h-8 w-8"/>
                            <span className="mt-2 text-sm">Add Photo</span>
                            <input type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
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
