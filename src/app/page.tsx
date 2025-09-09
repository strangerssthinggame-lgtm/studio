
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function RootPage() {
  const router = useRouter();
  const { user, loading, isNewUser } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (isNewUser) {
          router.replace('/profile/edit');
        } else {
          router.replace('/profile');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [router, user, loading, isNewUser]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    </div>
  );
}
