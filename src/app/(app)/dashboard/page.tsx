

'use client';

import { ProfileCard } from '@/components/profile-card';
import { RotateCw, Heart, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { UserProfile } from '@/lib/user-profile-data';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { handleSwipe as handleSwipeFlow } from '@/ai/flows/handle-swipe-flow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [userQueue, setUserQueue] = useState<UserProfile[]>([]);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  // Animation state lifted to the parent
  const [animationState, setAnimationState] = useState({ x: 0, y: 0, rotation: 0, isDragging: false });
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return; // Don't fetch if user is not logged in

      setIsLoading(true);
      try {
        const usersCollection = collection(firestore, 'users');
        // Query users, excluding the current user
        const q = query(
          usersCollection
        );
        const querySnapshot = await getDocs(q);
        
        const usersData = querySnapshot.docs
            .map(doc => ({
                ...doc.data(),
                id: doc.id,
                 // Provide sensible defaults if fields are missing
                age: doc.data().age || 25, 
                gender: doc.data().gender || 'not specified',
                vibes: doc.data().vibes || [],
                interests: doc.data().interests || [],
                photos: doc.data().photos || [],
                availability: doc.data().availability || 'Not specified',
                banner: doc.data().banner || 'https://picsum.photos/800/600'
            } as UserProfile))
            .filter(u => u.id !== user.uid); // Filter out current user on client

        setAllUsers(usersData);
        setUserQueue(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUsers();
    }
  }, [user, authLoading]);

  
  const handleSwipe = useCallback((swipedUser: UserProfile, direction: 'left' | 'right') => {
    setUserQueue(currentQueue => currentQueue.slice(1));
    setHistory(prev => [...prev, swipedUser]);
    setAnimationState({ x: 0, y: 0, rotation: 0, isDragging: false });
    
    if (!user) return;

    handleSwipeFlow({
        swiperId: user.uid,
        swipedId: swipedUser.id,
        direction,
    }).then(result => {
        if (result.isMatch) {
            setMatchedUser(swipedUser);
            setShowMatchDialog(true);
        }
    }).catch(error => {
        console.error("Error handling swipe:", error);
    });
  }, [user]);

  const resetDeck = useCallback(() => {
      setUserQueue(allUsers);
      setHistory([]);
  }, [allUsers]);

  const reversedQueue = [...userQueue].reverse();
  const topCard = reversedQueue.length > 0 ? reversedQueue[0] : null;

  const handleManualSwipe = (direction: 'left' | 'right') => {
    if (!topCard) return;

    const exitX = direction === 'right' ? 500 : -500;
    const rotation = direction === 'right' ? 30 : -30;

    setAnimationState({
      x: exitX,
      y: 0,
      rotation,
      isDragging: false,
    });
    
    setTimeout(() => {
      handleSwipe(topCard, direction);
    }, 300); // Match animation duration
  }
  
  const onDialogClose = () => {
    setShowMatchDialog(false);
    setMatchedUser(null);
  }

  return (
    <>
    <div className={cn("flex flex-col h-full")}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-headline font-semibold tracking-tight">
            Discover
          </h1>
          <p className="text-sm text-muted-foreground">
            Find your next vibe.
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center -mx-4">
        <div className="relative w-full max-w-sm h-[60vh] md:h-[70vh]">
          {isLoading || authLoading ? (
            <Card className="absolute w-full h-full rounded-2xl overflow-hidden glassy">
                <Skeleton className="w-full h-full"/>
            </Card>
          ) : reversedQueue.length > 0 ? (
             <div className="relative w-full h-full">
              {reversedQueue.map((user, index) => {
                  const isTopCard = index === 0;
                  const isSecondCard = index === 1;
                  
                  const dragDistance = Math.abs(animationState.x);
                  const swipeProgress = isTopCard ? Math.min(dragDistance / 200, 1) : 0; // 200 is swipe threshold

                  let cardStyle: React.CSSProperties = {
                    zIndex: reversedQueue.length - index,
                    opacity: index > 1 ? 0 : 1,
                    transition: animationState.isDragging ? 'none' : 'all 0.3s ease-in-out',
                  };

                  if (isTopCard) {
                      cardStyle.transform = `translate(${animationState.x}px, ${animationState.y}px) rotate(${animationState.rotation}deg)`;
                  } else if (isSecondCard) {
                      const scale = 0.95 + 0.05 * swipeProgress;
                      const translateY = -10 + 10 * swipeProgress;
                      cardStyle.transform = `scale(${scale}) translateY(${translateY}px)`;
                  } else {
                       if (index > 1) {
                        cardStyle.transform = `scale(${1 - (index) * 0.05}) translateY(${index * -10}px)`;
                       }
                  }
                  
                  return (
                      <ProfileCard
                        key={user.id}
                        user={user}
                        onSwipe={handleSwipe}
                        isTopCard={isTopCard}
                        animationState={isTopCard ? animationState : undefined}
                        setAnimationState={isTopCard ? setAnimationState : undefined}
                        style={cardStyle}
                      />
                  )
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-4 bg-muted/50 glassy rounded-lg">
                <p className="text-lg font-semibold">No More Profiles</p>
                <p>You've seen everyone for now. Check back later!</p>
                <Button onClick={resetDeck} variant="link" className="mt-4">
                    <RotateCw className="mr-2"/>
                    Reset Deck
                </Button>
            </div>
          )}
        </div>
         <div className="flex items-center justify-center space-x-4 w-full p-6 mt-4">
            <Button onClick={() => handleManualSwipe('left')} variant="destructive" size="icon" className="w-16 h-16 rounded-full shadow-lg bg-white/90 hover:bg-white text-destructive backdrop-blur-sm transition-transform hover:scale-105" disabled={!topCard}>
                <X className="w-8 h-8"/>
            </Button>
            <Link href={topCard ? `/chat/${topCard.id}` : '#'}>
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-full shadow-lg bg-white/80 hover:bg-white text-primary backdrop-blur-sm transition-transform hover:scale-105" disabled={!topCard}>
                    <Zap className="w-6 h-6"/>
                </Button>
            </Link>
            <Button onClick={() => handleManualSwipe('right')} variant="default" size="icon" className="w-16 h-16 rounded-full shadow-lg bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm transition-transform hover:scale-105" disabled={!topCard}>
                <Heart className="w-8 h-8" fill="currentColor"/>
            </Button>
        </div>
      </div>
    </div>
     <AlertDialog open={showMatchDialog} onOpenChange={onDialogClose}>
        <AlertDialogContent className="max-w-sm glassy">
            <AlertDialogHeader className="items-center text-center">
                <div className="relative h-24 w-40 mb-4">
                    <Avatar className="w-24 h-24 border-4 border-background absolute left-0 top-0">
                        <AvatarImage src={user?.photoURL || "https://picsum.photos/100"} alt="You" data-ai-hint="profile avatar" />
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'Y'}</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-24 h-24 border-4 border-background absolute right-0 top-0">
                        <AvatarImage src={matchedUser?.avatar} alt={matchedUser?.name} data-ai-hint="profile avatar" />
                        <AvatarFallback>{matchedUser?.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Heart className="w-7 h-7 text-primary-foreground" fill="currentColor" />
                    </div>
                </div>
                <AlertDialogTitle className="font-headline text-3xl">It's a Vibe!</AlertDialogTitle>
                <AlertDialogDescription>
                    You and {matchedUser?.name || 'someone'} have liked each other. How about breaking the ice?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 mt-2">
                <Link href={matchedUser ? `/chat/${matchedUser.id}` : '#'} className="w-full">
                    <AlertDialogAction className="w-full h-12 text-lg">
                        <Zap className="mr-2 h-5 w-5" />
                        Start Vibe Check
                    </AlertDialogAction>
                </Link>
                <AlertDialogCancel className="m-0">Keep Swiping</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
