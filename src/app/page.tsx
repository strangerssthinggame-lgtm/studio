
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function RootPage() {
  const router = useRouter();
  const { user, loading, isNewUser } = useAuth();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (user) {
      // User is logged in
      if (isNewUser) {
        // New user, redirect to complete profile
        router.replace('/profile/edit');
      } else {
        // Existing user, redirect to their dashboard
        router.replace('/dashboard');
      }
    } else {
      // No user is logged in, redirect to login page
      router.replace('/login');
    }
  }, [router, user, loading, isNewUser]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary animate-pulse">
                <path 
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6.45C10.42 5.06 8.36 4.5 6.75 5.25c-2.32 1.09-3.43 3.99-2.58 6.38 1.15 3.23 4.28 5.37 7.83 5.37s6.68-2.14 7.83-5.37c.85-2.39-.26-5.29-2.58-6.38-1.61-.75-3.67-.19-5.25 1.2z"
                />
            </svg>
            <p className="text-muted-foreground">Connecting...</p>
        </div>
    </div>
  );
}

    