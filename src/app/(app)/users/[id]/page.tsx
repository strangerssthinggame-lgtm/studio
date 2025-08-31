
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, MapPin, User, FileImage, Clock, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { userProfiles } from '@/lib/user-profile-data';
import { notFound, useRouter } from 'next/navigation';

// Mock current user ID
const currentUserId = 'current_user_id';

const currentUserProfile = {
  id: 'current_user_id',
  name: 'Alex',
  username: '@alex_codes',
  location: 'San Francisco, CA',
  bio: 'Just a human vibing. Developer by day, dreamer by night. I believe in connecting with people on a deeper level. Let\'s talk about anything from the latest tech trends to the mysteries of the universe.',
  avatar: 'https://picsum.photos/100',
  banner: 'https://picsum.photos/1600/400',
  vibes: ['Friend', 'Date', 'Casual'],
  interests: ['Photography', 'Hiking', 'Indie Music', 'Sci-Fi Movies', 'Coffee Enthusiast', 'Yoga'],
  gallery: [
    { id: 1, src: 'https://picsum.photos/seed/gallery1/400/400', hint: 'mountain landscape' },
    { id: 2, src: 'https://picsum.photos/seed/gallery2/400/400', hint: 'city skyline' },
    { id: 3, src: 'https://picsum.photos/seed/gallery3/400/400', hint: 'abstract art' },
    { id: 4, src: 'https://picsum.photos/seed/gallery4/400/400', hint: 'portrait smiling' },
    { id: 5, src: 'https://picsum.photos/seed/gallery5/400/400', hint: 'pet dog' },
    { id: 6, src: 'https://picsum.photos/seed/gallery6/400/400', hint: 'food plate' },
  ],
  availability: 'Evenings & Weekends',
};


export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const isOwnProfile = params.id === currentUserId;
  
  // Use the mock current user's data if it's their own profile preview
  const userProfileData = isOwnProfile ? currentUserProfile : userProfiles.find(p => p.id === params.id);

  if (!userProfileData) {
    notFound();
  }
  
  const userProfile = {
      ...userProfileData,
      // If it's a preview of own profile, don't show the real user's profile data
      name: isOwnProfile ? currentUserProfile.name : userProfileData.name,
  }

  const handleEditRedirect = () => {
    router.push('/profile/edit');
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative h-48 md:h-64 w-full rounded-t-xl overflow-hidden">
        <Image
          src={userProfile.banner}
          alt="Profile banner"
          fill
          objectFit="cover"
          data-ai-hint="profile banner"
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
                        {userProfile.gallery.map((photo) => (
                            <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden group">
                                <Image src={photo.src} alt={`Gallery photo ${photo.id}`} fill objectFit="cover" data-ai-hint={photo.hint} />
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
