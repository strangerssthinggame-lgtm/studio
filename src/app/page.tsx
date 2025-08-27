
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, Users } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';


const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AppleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path fill="currentColor" d="M16.5,5.12c1.23,0,2.36.46,3.16,1.25a4.34,4.34,0,0,1,1.29,3.15c0,2.94-2,4.89-4.2,4.89-1,0-1.89-.47-2.83-.47s-1.7.47-2.83.47-2.18-2-4.14-2c-2.31,0-4,2.24-4,5.44,0,3.32,2.31,5.2,4.5,5.2.95,0,2.06-.5,3.29-.5s2.21.5,3.35.5a4.4,4.4,0,0,0,4.72-4.39c0-.21,0-1.12-1.38-2.17C20.4,15.6,21,14.6,21,12.55a4.83,4.83,0,0,0-3.23-4.63,4.5,4.5,0,0,0-1.27-.25M15,2.18c.64.05,1.27.35,1.88.88,1.15,1,1.75,2.3,1.75,3.79,0,1.13-.35,2.17-.92,3a3.53,3.53,0,0,1-2.68,1.26c-.63,0-1.26-.25-1.88-.75-1.12-1-1.75-2.29-1.75-3.79S13.25,3.08,14.38,2.18Z" />
    </svg>
);


export default function Home() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      // Send the token to your backend to create a session cookie
      await fetch('/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-4xl font-headline font-bold text-primary">VibeVerse</h1>
            <p className="text-balance text-muted-foreground">
              Connect, play, and find your vibe.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Login</CardTitle>
              <CardDescription>
                Sign in to start your next conversation adventure.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Button variant="outline" onClick={handleGoogleSignIn}>
                  <GoogleIcon />
                  Sign in with Google
                </Button>
                <Button variant="outline">
                  <AppleIcon />
                  Sign in with Apple
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue to
                  </span>
                </div>
              </div>
                <Link href="/dashboard">
                    <Button variant="default" className="w-full">
                        Explore the App
                    </Button>
                </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center relative overflow-hidden">
        <Image
          src="https://picsum.photos/1200/1800"
          alt="Abstract art representing connection"
          data-ai-hint="abstract connection"
          width={1200}
          height={1800}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute bottom-10 left-10 right-10 p-6 bg-black/30 backdrop-blur-md rounded-xl text-white">
            <h2 className="text-3xl font-headline font-bold">Meaningful Connections, Made Fun.</h2>
            <p className="mt-2 text-lg">VibeVerse is more than just a chat app. It's a space for genuine interaction through playful, structured games.</p>
            <div className="mt-4 flex space-x-6">
                <div className="flex items-center space-x-2">
                    <Heart className="text-accent"/>
                    <span>Date, Friends, Spicy</span>
                </div>
                <div className="flex items-center space-x-2">
                    <MessageSquare className="text-accent"/>
                    <span>Q&A and Truth or Dare</span>
                </div>
                 <div className="flex items-center space-x-2">
                    <Users className="text-accent"/>
                    <span>Find Your People</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
