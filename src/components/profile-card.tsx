"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { UserProfile } from '@/lib/user-profile-data';

type ProfileCardProps = {
  user: UserProfile;
  onSwipe: (user: UserProfile, direction: 'left' | 'right') => void;
  style?: React.CSSProperties;
};

export function ProfileCard({ user, onSwipe, style }: ProfileCardProps) {
    const [isSwiped, setIsSwiped] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const [showMatchDialog, setShowMatchDialog] = useState(false);

    const handleSwipe = (direction: 'left' | 'right') => {
        if (isSwiped) return; // Prevent multiple swipes
        
        setSwipeDirection(direction);
        setIsSwiped(true);

        setTimeout(() => {
            onSwipe(user, direction);
            if (direction === 'right') {
                // Simulate a match for demonstration
                setShowMatchDialog(true);
            }
        }, 300);
    };
    
    const onDialogClose = () => {
        setShowMatchDialog(false);
    }
  
  return (
    <>
        <Card
        style={style}
        className={cn(
            "absolute w-full h-full transition-all duration-300 ease-in-out transform shadow-2xl rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing",
            isSwiped && swipeDirection === 'left' && '-rotate-[25deg] -translate-x-[120%] opacity-0',
            isSwiped && swipeDirection === 'right' && 'rotate-[25deg] translate-x-[120%] opacity-0',
        )}
        >
            <div className="relative h-full w-full">
            <Image
                src={user.banner}
                alt={`Profile of ${user.name}`}
                data-ai-hint="profile banner"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end h-1/2">
                <div>
                    <h2 className="text-4xl font-headline font-bold">{user.name}, <span className="font-light">{user.age}</span></h2>
                    <p className="mt-2 text-base font-body line-clamp-3">{user.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                    {user.interests.slice(0,4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-0">
                        {tag}
                        </Badge>
                    ))}
                    </div>
                </div>
            </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-4 w-full p-6">
                <Button onClick={() => handleSwipe('left')} variant="destructive" size="icon" className="w-16 h-16 rounded-full shadow-lg bg-white/90 hover:bg-white text-destructive backdrop-blur-sm transition-transform hover:scale-105">
                    <X className="w-8 h-8"/>
                </Button>
                 <Link href={`/chat/${user.id}`}>
                    <Button variant="outline" size="icon" className="w-12 h-12 rounded-full shadow-lg bg-white/80 hover:bg-white text-primary backdrop-blur-sm transition-transform hover:scale-105">
                        <Zap className="w-6 h-6"/>
                    </Button>
                </Link>
                <Button onClick={() => handleSwipe('right')} variant="default" size="icon" className="w-16 h-16 rounded-full shadow-lg bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm transition-transform hover:scale-105">
                    <Heart className="w-8 h-8" fill="currentColor"/>
                </Button>
            </div>
        </Card>
        <AlertDialog open={showMatchDialog} onOpenChange={onDialogClose}>
            <AlertDialogContent className="max-w-sm">
                <AlertDialogHeader className="items-center text-center">
                    <div className="relative h-24 w-40 mb-4">
                        <Avatar className="w-24 h-24 border-4 border-background absolute left-0 top-0">
                            <AvatarImage src="https://picsum.photos/100" alt="You" data-ai-hint="profile avatar" />
                            <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-24 h-24 border-4 border-background absolute right-0 top-0">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile avatar" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Heart className="w-7 h-7 text-primary-foreground" fill="currentColor" />
                        </div>
                    </div>
                    <AlertDialogTitle className="font-headline text-3xl">It's a Vibe!</AlertDialogTitle>
                    <AlertDialogDescription>
                        You and {user.name} have liked each other. How about breaking the ice?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-2 mt-2">
                    <Link href={`/chat/${user.id}`} className="w-full">
                        <AlertDialogAction className="w-full h-12 text-lg">
                            <Sparkles className="mr-2 h-5 w-5" />
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
