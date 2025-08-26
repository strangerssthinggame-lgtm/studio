"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type User = {
  name: string;
  age: number;
  bio: string;
  tags: string[];
  image: string;
  aiHint: string;
};

type ProfileCardProps = {
  user: User;
  index: number;
  total: number;
};

export function ProfileCard({ user, index, total }: ProfileCardProps) {
    const [isSwiped, setIsSwiped] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

    const handleSwipe = (direction: 'left' | 'right') => {
        setSwipeDirection(direction);
        setIsSwiped(true);
    };
    
    // This is a mock reset for demo purposes
    const handleReset = () => {
        setIsSwiped(false);
        setSwipeDirection(null);
    }

  return (
    <Card
      className={cn(
        "absolute w-full h-full transition-all duration-500 ease-in-out transform shadow-2xl rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing",
        isSwiped && swipeDirection === 'left' && '-rotate-12 -translate-x-full opacity-0',
        isSwiped && swipeDirection === 'right' && 'rotate-12 translate-x-full opacity-0',
        `z-${total - index}`
      )}
      style={{
        transform: `scale(${1 - (index * 0.05)}) translateY(-${index * 10}px)`
      }}
    >
        {!isSwiped ? (
            <>
                <div className="relative h-full w-full">
                <Image
                    src={user.image}
                    alt={`Profile of ${user.name}`}
                    data-ai-hint={user.aiHint}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-4xl font-headline font-bold">{user.name}, <span className="font-light">{user.age}</span></h2>
                    <p className="mt-2 text-base font-body">{user.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                    {user.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-0">
                        {tag}
                        </Badge>
                    ))}
                    </div>
                </div>
                </div>
                <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center justify-center space-x-4 w-full p-6">
                    <Button onClick={() => handleSwipe('left')} variant="destructive" size="icon" className="w-16 h-16 rounded-full shadow-lg bg-white hover:bg-red-100 text-destructive">
                        <X className="w-8 h-8"/>
                    </Button>
                    <Button onClick={() => handleSwipe('right')} variant="default" size="icon" className="w-16 h-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Heart className="w-8 h-8" fill="currentColor"/>
                    </Button>
                </div>
            </>
        ) : (
             <div className="flex flex-col items-center justify-center h-full bg-muted">
                <p className="text-muted-foreground">Card swiped {swipeDirection}!</p>
                <Button onClick={handleReset} variant="outline" className="mt-4">
                    <RotateCw className="mr-2 h-4 w-4"/>
                    Bring it back (for demo)
                </Button>
            </div>
        )}
    </Card>
  );
}
