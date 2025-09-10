
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, MapPin, User, FileImage, Clock, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { userProfiles as mockUserProfiles } from '@/lib/user-profile-data'; // Use mock for fallbacks
import { notFound, useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { UserProfile } from '@/lib/user-profile-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = params.id as string;
  const isOwnProfile = currentUser?.uid === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
        if (!userId) return;
        setIsLoading(true);
        const userDocRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
                id: userId,
                name: data.displayName || 'New User',
                username: data.username || `@${data.displayName?.toLowerCase() || 'newuser'}`,
                age: data.age || 18,
                gender: data.gender || 'not specified',
                location: data.location || 'Not specified',
                bio: data.bio || 'No bio yet.',
                avatar: data.photoURL || `https://picsum.photos/seed/${userId}/400/400`,
                banner: data.banner || `https://picsum.photos/seed/${userId}-banner/800/600`,
                vibes: data.vibes || [],
                interests: data.interests || [],
                photos: data.photos || [],
                availability: data.availability || 'Not specified',
                preferences: data.preferences || { minAge: 18, maxAge: 40, maxDistance: 100 },
                liked: data.liked || [],
                passed: data.passed || [],
                matches: data.matches || [],
            });
        } else {
            const mockUser = mockUserProfiles.find(p => p.id === userId);
            if (mockUser) {
                setUserProfile(mockUser);
            } else {
                setUserProfile(null);
            }
        }
        setIsLoading(false);
    };

    fetchUserProfile();
  }, [userId]);


  const handleEditRedirect = () => {
    router.push('/profile/edit');
  }

  if (isLoading) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Skeleton className="h-48 md:h-64 w-full rounded-t-xl" />
            <div className="relative glassy p-6 rounded-b-xl shadow-lg">
                <div className="flex flex-col md:flex-row items-start">
                    <div className="relative -mt-20 md:-mt-24">
                       <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background shadow-md" />
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex-1 space-y-4">
                       <Skeleton className="h-10 w-1/2" />
                       <Skeleton className="h-6 w-1/3" />
                       <Skeleton className="h-6 w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (!userProfile) {
    return notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative h-48 md:h-64 w-full rounded-t-xl overflow-hidden">
        <Image
          src={userProfile.banner}
          alt="Profile banner"
          fill
          className="object-cover"
          data-ai-hint="profile banner"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative bg-card p-6 rounded-b-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-start">
          <div className="relative -mt-20 md:-mt-24">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-md">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} data-ai-hint="profile photo" />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
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
                  {isOwnProfile ? (
                       <Button onClick={handleEditRedirect}>
                          <Edit className="mr-2 h-4 w-4" /> Edit My Profile
                      </Button>
                  ) : (
                    <>
                      <Button variant="outline">
                          <Heart className="mr-2 h-4 w-4" /> Like
                      </Button>
                      <Link href={`/chat/${userProfile.id}`}>
                          <Button>
                              <MessageSquare className="mr-2 h-4 w-4" /> Message
                          </Button>
                      </Link>
                    </>
                  )}
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
                    About {isOwnProfile ? 'Me' : userProfile.name}
                </h2>
                <p className="mt-2 text-muted-foreground text-base">{userProfile.bio}</p>
            </div>

          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Clock/> Availability</CardTitle>
                    <CardDescription>When {isOwnProfile ? 'I am' : `${userProfile.name} is`} usually active.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Badge variant="secondary" className="text-base px-4 py-2 w-full justify-center">
                        {userProfile.availability}
                    </Badge>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><User/> Interests</CardTitle>
                    <CardDescription>The things that make {isOwnProfile ? 'me' : 'them'}, {isOwnProfile ? 'me' : 'them'}.</CardDescription>
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><FileImage/> Photo Gallery</CardTitle>
                    <CardDescription>A glimpse into {isOwnProfile ? 'my' : `${userProfile.name}'s`} world.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {userProfile.photos.map((photo, index) => (
                            <div key={index} className="aspect-square relative rounded-lg overflow-hidden group">
                                <Image src={photo} alt={`Gallery photo ${index + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    