
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, MapPin, User, FileImage, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import OrderHistory from '@/components/order-history';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { UserProfile } from '@/lib/user-profile-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authLoading) return;
            if (!user) {
                router.replace('/login');
                return;
            };

            setIsLoading(true);
            const userDocRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const profileData = {
                    id: user.uid,
                    name: data.name || 'Ajay',
                    username: data.username || `@ajay`,
                    age: data.age || 18,
                    gender: data.gender || 'not specified',
                    location: data.location || 'Not specified',
                    bio: data.bio || 'No bio yet. Click "Edit Profile" to add one!',
                    avatar: data.avatar || `https://picsum.photos/seed/${user.uid}/400/400`,
                    banner: data.banner || `https://picsum.photos/seed/${user.uid}-banner/800/600`,
                    vibes: data.vibes || ['Date'],
                    interests: data.interests || [],
                    photos: data.photos || [],
                    availability: data.availability || 'Not specified',
                    profileComplete: data.profileComplete || false,
                    preferences: data.preferences || { minAge: 18, maxAge: 40, maxDistance: 100 },
                    liked: data.liked || [],
                    passed: data.passed || [],
                    matches: data.matches || [],
                };
                setUserProfile(profileData);
            } else {
                 router.replace('/profile/edit');
            }
            setIsLoading(false);
        };

        fetchUserProfile();
    }, [user, authLoading, router]);

    const isPageLoading = isLoading || authLoading;

    if (isPageLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <Skeleton className="h-48 md:h-64 w-full rounded-t-xl" />
                <div className="relative glassy p-6 rounded-b-xl shadow-lg">
                    <div className="flex flex-col md:flex-row items-start">
                        <div className="relative -mt-20 md:-mt-24">
                           <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background shadow-md" />
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                           <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                               <div className='space-y-2'>
                                   <Skeleton className="h-10 w-48" />
                                   <Skeleton className="h-6 w-32" />
                                   <Skeleton className="h-5 w-24" />
                               </div>
                               <div className="flex gap-2">
                                   <Skeleton className="h-10 w-28" />
                                   <Skeleton className="h-10 w-32" />
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!userProfile) {
        return null; 
    }


  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="group relative h-48 md:h-64 w-full rounded-t-xl overflow-hidden">
        <Image
          src={userProfile.banner || 'https://picsum.photos/1600/400'}
          alt="Profile banner"
          fill
          className="object-cover"
          data-ai-hint="profile banner"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <Button 
            variant="secondary"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <Camera className="mr-2 h-4 w-4"/>
            Change Banner
        </Button>
      </div>

      <div className="relative glassy p-6 rounded-b-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-start">
          <div className="relative -mt-20 md:-mt-24 group">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-md">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} data-ai-hint="profile photo" />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Camera className="w-8 h-8"/>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-headline font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.username}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  {userProfile.location}
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Link href={`/users/${user?.uid}`}>
                  <Button variant="secondary" disabled={isPageLoading}>
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Button>
                </Link>
                <Link href="/profile/edit">
                  <Button variant="outline" disabled={isPageLoading}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {userProfile.vibes.map((vibe) => (
                    <Badge key={vibe} variant="default" className="text-base px-3 py-1">
                        {vibe}
                    </Badge>
                ))}
            </div>
            
            <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-headline font-semibold flex items-center">
                    About Me
                </h2>
                <p className="mt-2 text-muted-foreground text-base">{userProfile.bio}</p>
            </div>

          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="glassy">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Clock/> My Availability</CardTitle>
                    <CardDescription>When you're usually active.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Badge variant="secondary" className="text-base px-4 py-2 w-full justify-center">
                        {userProfile.availability}
                    </Badge>
                </CardContent>
            </Card>
             <Card className="glassy">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><User/> My Interests</CardTitle>
                    <CardDescription>The things that make me, me.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-base px-3 py-1">
                                {interest}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>


        <div className="mt-8">
            <Card className="glassy">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><FileImage/> My Photos</CardTitle>
                    <CardDescription>A glimpse into my world.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {userProfile.photos && userProfile.photos.map((photo, index) => (
                            <div key={index} className="aspect-square relative rounded-lg overflow-hidden group">
                                <Image src={photo} alt={`Gallery photo ${index + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        
         <div className="mt-8">
            <Card className="glassy">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">Order History</CardTitle>
                    <CardDescription>Your past purchases from the Bondly store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrderHistory />
                </CardContent>
            </Card>
        </div>


      </div>
    </div>
  );
}
