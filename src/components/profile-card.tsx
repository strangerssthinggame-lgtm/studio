
"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { UserProfile } from '@/lib/user-profile-data';
import { useAuth } from '@/hooks/use-auth';

type AnimationState = {
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
};


type ProfileCardProps = {
  user: UserProfile;
  onSwipe: (user: UserProfile, direction: 'left' | 'right') => void;
  style?: React.CSSProperties;
  isTopCard: boolean;
  animationState?: AnimationState;
  setAnimationState?: React.Dispatch<React.SetStateAction<AnimationState>>;
};

export function ProfileCard({ user, onSwipe, style, isTopCard, animationState, setAnimationState }: ProfileCardProps) {
    const { user: currentUser } = useAuth();
    
    const cardRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);

    const handleDragStart = (clientX: number) => {
        if (!isTopCard || !setAnimationState) return;
        setAnimationState(prev => ({ ...prev, isDragging: true }));
        startX.current = clientX;
    };

    const handleDragMove = (clientX: number) => {
        if (!isTopCard || !animationState?.isDragging || !setAnimationState) return;
        const deltaX = clientX - startX.current;
        const rotation = deltaX / 20;
        setAnimationState(prev => ({ ...prev, x: deltaX, rotation }));
    };

    const handleDragEnd = () => {
        if (!isTopCard || !animationState?.isDragging || !setAnimationState) return;
        
        setAnimationState(prev => ({ ...prev, isDragging: false }));

        const swipeThreshold = 100;

        if (animationState.x > swipeThreshold) {
            handleSwipeAction('right');
        } else if (animationState.x < -swipeThreshold) {
            handleSwipeAction('left');
        } else {
            setAnimationState({ x: 0, y: 0, rotation: 0, isDragging: false });
        }
    };
    
    const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    const onMouseLeave = () => handleDragEnd();

    const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = () => handleDragEnd();


    const handleSwipeAction = async (direction: 'left' | 'right') => {
        if (!setAnimationState || !currentUser) return;
        
        setAnimationState({
            x: direction === 'right' ? 500 : -500,
            y: 0,
            rotation: direction === 'right' ? 30 : -30,
            isDragging: false
        });

        setTimeout(() => {
            onSwipe(user, direction);
        }, 300);
    };
    
    const cardTransform = isTopCard && animationState
      ? `translate(${animationState.x}px, ${animationState.y}px) rotate(${animationState.rotation}deg)`
      : '';
  
  return (
    <>
        <Card
            ref={cardRef}
            style={{
                ...style,
                transform: `${style?.transform || ''} ${cardTransform}`.trim(),
                transition: animationState?.isDragging ? 'none' : 'all 0.3s ease-in-out',
                touchAction: isTopCard ? 'none' : 'auto'
            }}
            className={cn(
                "absolute w-full h-full shadow-2xl rounded-2xl overflow-hidden",
                isTopCard ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                "bg-background/10 border-0"
            )}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="relative h-full w-full">
            <Image
                src={user.banner}
                alt={`Profile of ${user.name}`}
                data-ai-hint="profile banner"
                fill
                className="object-cover pointer-events-none" // prevent image drag
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
        </Card>
    </>
  );
}
