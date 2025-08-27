
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, MapPin, User, FileImage, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const userProfile = {
  name: 'Alex',
  username: '@alex_codes',
  location: 'San Francisco, CA',
  bio: 'Just a human vibing. Developer by day, dreamer by night. I believe in connecting with people on a deeper level. Let\'s talk about anything from the latest tech trends to the mysteries of the universe.',
  avatar: 'https://picsum.photos/100',
  banner: 'https://picsum.photos/1600/400',
  interests: ['Photography', 'Hiking', 'Indie Music', 'Sci-Fi Movies', 'Coffee Enthusiast', 'Yoga'],
  gallery: [
    { id: 1, src: 'https://picsum.photos/seed/gallery1/400/400', hint: 'mountain landscape' },
    { id: 2, src: 'https://picsum.photos/seed/gallery2/400/400', hint: 'city skyline' },
    { id: 3, src: 'https://picsum.photos/seed/gallery3/400/400', hint: 'abstract art' },
    { id: 4, src: 'https://picsum.photos/seed/gallery4/400/400', hint: 'portrait smiling' },
    { id: 5, src: 'https://picsum.photos/seed/gallery5/400/400', hint: 'pet dog' },
    { id: 6, src: 'https://picsum.photos/seed/gallery6/400/400', hint: 'food plate' },
  ],
};

export default function ProfilePage() {
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
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8"
        >
          <Camera className="h-4 w-4" />
          <span className="sr-only">Edit banner</span>
        </Button>
      </div>

      <div className="relative bg-card p-6 rounded-b-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-start">
          <div className="relative -mt-20 md:-mt-24">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-md">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} data-ai-hint="profile photo" />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Edit avatar</span>
            </Button>
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
              <Link href="/profile/edit">
                <Button variant="outline" className="mt-4 md:mt-0">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-headline font-semibold flex items-center">
                    About Me
                </h2>
                <p className="mt-2 text-muted-foreground text-base">{userProfile.bio}</p>
            </div>

          </div>
        </div>

        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><FileImage/> My Gallery</CardTitle>
                    <CardDescription>A glimpse into my world. Add or remove photos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {userProfile.gallery.map((photo) => (
                            <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden group">
                                <Image src={photo.src} alt={`Gallery photo ${photo.id}`} fill objectFit="cover" data-ai-hint={photo.hint} />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" size="sm">Remove</Button>
                                 </div>
                            </div>
                        ))}
                         <button className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                            <PlusCircle className="h-8 w-8"/>
                            <span className="mt-2 text-sm">Add Photo</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>

         <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><User/> My Interests</CardTitle>
                    <CardDescription>The things that make me, me. Click to edit your interests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-base px-3 py-1 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                                {interest}
                            </Badge>
                        ))}
                         <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Interest
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
