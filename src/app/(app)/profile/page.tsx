
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, MapPin, User, FileImage, PlusCircle, Sparkles, Clock, ShoppingBag, Eye, X } from 'lucide-react';
import Link from 'next/link';
import OrderHistory from '@/components/order-history';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import type { UserProfile } from '@/lib/user-profile-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

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
                setUserProfile({
                    id: user.uid,
                    name: data.name || 'New User',
                    username: data.username || `@newuser`,
                    age: data.age || 18,
                    gender: data.gender || 'not specified',
                    location: data.location || 'Not specified',
                    bio: data.bio || 'No bio yet. Click "Edit Profile" to add one!',
                    avatar: data.avatar || `https://picsum.photos/seed/${user.uid}/400/400`,
                    banner: data.banner || `https://picsum.photos/seed/${user.uid}-banner/800/600`,
                    vibes: data.vibes || [],
                    interests: data.interests || [],
                    gallery: data.gallery || [],
                    availability: data.availability || 'Not specified',
                    profileComplete: data.profileComplete || false,
                });
            } else {
                 router.replace('/profile/edit');
            }
            setIsLoading(false);
        };

        fetchUserProfile();
    }, [user, authLoading, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'gallery' | 'avatar' | 'banner') => {
        if (e.target.files && e.target.files[0] && userProfile && user) {
          const file = e.target.files[0];
          const imageId = Date.now();
          
          let storagePath: string;
          if (imageType === 'avatar') {
            storagePath = `users/${user.uid}/avatars/avatar_${imageId}`;
          } else if (imageType === 'banner') {
            storagePath = `users/${user.uid}/banners/banner_${imageId}`;
          } else {
            storagePath = `users/${user.uid}/gallery/${imageId}_${file.name}`;
          }
          
          const storageRef = ref(storage, storagePath);
          
          toast({ title: "Uploading...", description: "Your photo is being uploaded. Please wait." });

          try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const userDocRef = doc(firestore, 'users', user.uid);

            if (imageType === 'gallery') {
                 const newImage = {
                    id: imageId,
                    src: downloadURL,
                    hint: 'custom upload',
                    path: snapshot.ref.fullPath
                };
                const updatedGallery = [...userProfile.gallery, newImage];
                await updateDoc(userDocRef, { gallery: updatedGallery });
                setUserProfile({ ...userProfile, gallery: updatedGallery });
                toast({ title: "Photo Added!", description: "Your new photo has been added to your gallery." });
            } else if (imageType === 'avatar') {
                await updateDoc(userDocRef, { avatar: downloadURL, photoURL: downloadURL });
                setUserProfile({ ...userProfile, avatar: downloadURL });
                toast({ title: "Profile Picture Updated!", description: "Your new picture is now live." });
            } else if (imageType === 'banner') {
                await updateDoc(userDocRef, { banner: downloadURL });
                setUserProfile({ ...userProfile, banner: downloadURL });
                toast({ title: "Banner Updated!", description: "Your new banner is now live." });
            }

          } catch(error) {
             console.error("Error uploading image: ", error);
             toast({ variant: 'destructive', title: "Upload Failed", description: "There was an error uploading your photo." });
          }
        }
    };

    const handleImageRemove = async (photoId: number, photoPath: string) => {
        if (userProfile && user) {
          const updatedGallery = userProfile.gallery.filter((photo) => photo.id !== photoId);
          
          try {
            // Delete from storage
            const imageRef = ref(storage, photoPath);
            await deleteObject(imageRef);
            
            // Delete from firestore
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, { gallery: updatedGallery });

            setUserProfile({ ...userProfile, gallery: updatedGallery });

            toast({ title: "Photo Removed", description: "The photo has been removed from your gallery." });
          } catch (error) {
             console.error("Error removing image: ", error);
             toast({ variant: 'destructive', title: "Deletion Failed", description: "There was an error removing your photo." });
          }
        }
    };


    if (isLoading || authLoading) {
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
        return null; // Or a message indicating profile is being created
    }


  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative h-48 md:h-64 w-full rounded-t-xl overflow-hidden">
        <Image
          src={userProfile.banner || 'https://picsum.photos/1600/400'}
          alt="Profile banner"
          fill
          objectFit="cover"
          data-ai-hint="profile banner"
        />
        <div className="absolute inset-0 bg-black/30" />
        <label htmlFor="banner-upload" className="absolute top-4 right-4 h-8 w-8 cursor-pointer">
            <Button
              variant="secondary"
              size="icon"
              className="h-full w-full as-child"
              asChild
            >
              <div>
                <Camera className="h-4 w-4" />
                <span className="sr-only">Edit banner</span>
              </div>
            </Button>
            <input id="banner-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
        </label>
      </div>

      <div className="relative glassy p-6 rounded-b-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-start">
          <div className="relative -mt-20 md:-mt-24">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-md">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} data-ai-hint="profile photo" />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
             <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 h-8 w-8 rounded-full cursor-pointer">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-full w-full rounded-full"
                  asChild
                >
                  <div>
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Edit avatar</span>
                  </div>
                </Button>
                 <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
            </label>
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
                  <Button variant="secondary">
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Button>
                </Link>
                <Link href="/profile/edit">
                  <Button variant="outline">
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


        <div className="mt-8">
            <Card className="glassy">
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
                                    <Button variant="destructive" size="icon" onClick={() => handleImageRemove(photo.id, photo.path)}>
                                        <X className="h-4 w-4"/>
                                    </Button>
                                 </div>
                            </div>
                        ))}
                         <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                            <PlusCircle className="h-8 w-8"/>
                            <span className="mt-2 text-sm">Add Photo</span>
                            <input type="file" className="sr-only" onChange={(e) => handleImageUpload(e, 'gallery')} accept="image/*" />
                        </label>
                    </div>
                </CardContent>
            </Card>
        </div>
        
         <div className="mt-8">
            <Card className="glassy">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><ShoppingBag/> Order History</CardTitle>
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
