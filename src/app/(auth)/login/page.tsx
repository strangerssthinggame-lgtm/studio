
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, MessageSquare, Users, Smartphone, KeyRound } from 'lucide-react';
import { signInWithPopup, type ConfirmationResult } from 'firebase/auth';
import { auth, googleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';


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


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  useEffect(() => {
    if (!loading && user) {
        router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  const setupRecaptcha = () => {
    if (!auth) return;
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }
  
  const handlePhoneSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!phoneNumber) {
        toast({ title: 'Phone number required', variant: 'destructive'});
        return;
      }
      setIsSendingCode(true);
      try {
        setupRecaptcha();
        const appVerifier = (window as any).recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, appVerifier);
        setConfirmationResult(result);
        toast({ title: 'Verification code sent!', description: 'Please check your phone for an SMS.'});
      } catch (error: any) {
        console.error(error);
        toast({ title: 'Error sending code', description: error.message, variant: 'destructive'});
        setConfirmationResult(null); // Reset on error
      } finally {
        setIsSendingCode(false);
      }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!confirmationResult || !verificationCode) {
        toast({ title: 'Verification code required', variant: 'destructive' });
        return;
      }
      setIsVerifyingCode(true);
      try {
        await confirmationResult.confirm(verificationCode);
        // Auth state change will handle redirect
      } catch(error: any) {
          console.error(error);
          toast({ title: 'Invalid Code', description: 'The code you entered is incorrect.', variant: 'destructive' });
      } finally {
        setIsVerifyingCode(false);
      }
  }


  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      // Redirection is handled by the useAuth hook.
    } catch (error: any) {
       toast({
          title: 'Authentication Error',
          description: error.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div id="recaptcha-container"></div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-4xl font-headline font-bold text-primary">Bondly</h1>
            <p className="text-balance text-muted-foreground">
              Connect, play, and find your vibe.
            </p>
          </div>
          <Card className="shadow-lg glassy">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Get Started</CardTitle>
              <CardDescription>
                Sign in with Google or your phone number.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button variant="outline" onClick={handleGoogleSignIn}>
                <GoogleIcon />
                Continue with Google
              </Button>
             
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {!confirmationResult ? (
                <form onSubmit={handlePhoneSignIn} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                         <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                         <Input
                            id="phone"
                            type="tel"
                            placeholder="16505551234"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="pl-10"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isSendingCode} className="w-full">
                        {isSendingCode ? "Sending Code..." : "Continue with Phone"}
                    </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="grid gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="code">Verification Code</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                id="code"
                                type="text"
                                placeholder="123456"
                                required
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                     <Button type="submit" disabled={isVerifyingCode} className="w-full">
                        {isVerifyingCode ? "Verifying..." : "Sign In"}
                    </Button>
                    <Button variant="link" size="sm" onClick={() => setConfirmationResult(null)}>
                        Use a different phone number
                    </Button>
                </form>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center relative overflow-hidden">
        <Image
          src="https://picsum.photos/id/119/1200/1800"
          alt="Abstract art representing connection"
          data-ai-hint="abstract clean white"
          width={1200}
          height={1800}
          className="h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/20"></div>
        <div className="absolute bottom-10 left-10 right-10 p-6 glassy rounded-xl text-foreground">
            <h2 className="text-3xl font-headline font-bold">Meaningful Connections, Made Fun.</h2>
            <p className="mt-2 text-lg">Bondly is more than just a chat app. It's a space for genuine interaction through playful, structured games.</p>
            <div className="mt-4 flex space-x-6">
                <div className="flex items-center space-x-2">
                    <Heart className="text-primary"/>
                    <span>Date, Friends, Spicy</span>
                </div>
                <div className="flex items-center space-x-2">
                    <MessageSquare className="text-primary"/>
                    <span>Q&A and Truth or Dare</span>
                </div>
                 <div className="flex items-center space-x-2">
                    <Users className="text-primary"/>
                    <span>Find Your People</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
