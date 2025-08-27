
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Sparkles, Users, Heart, Flame } from 'lucide-react';
import type { DeckTheme } from '@/app/(app)/chat/[id]/page';


const CoinIcon = ({ isFlipping, theme }: { isFlipping: boolean; theme: DeckTheme }) => (
  <div className={cn(
    "w-24 h-24 rounded-full border-4 flex items-center justify-center transition-transform duration-1000", 
    isFlipping && "animate-[spin_1s_ease-out]",
    theme === 'friends' && 'bg-blue-100 border-blue-300',
    theme === 'date' && 'bg-rose-100 border-rose-300',
    theme === 'spicy' && 'bg-orange-100 border-orange-300',
    theme === 'default' && 'bg-gray-100 border-gray-300',
    )}
    style={{ transformStyle: 'preserve-3d' }}
  >
    <Sparkles className={cn(
        "w-12 h-12",
        theme === 'friends' && 'text-blue-500',
        theme === 'date' && 'text-rose-500',
        theme === 'spicy' && 'text-orange-500',
        theme === 'default' && 'text-gray-500',
    )} />
  </div>
);

type CoinTossProps = {
  onTossFinish: (winner: 'You' | string) => void;
  deckName: 'Friends' | 'Date' | 'Spicy';
  opponentName: string;
  opponentAvatar: string;
};

const deckInfo = {
    'Friends': { theme: 'friends' as DeckTheme, icon: Users, title: "Friends Deck" },
    'Date': { theme: 'date' as DeckTheme, icon: Heart, title: "Date Deck" },
    'Spicy': { theme: 'spicy' as DeckTheme, icon: Flame, title: "Spicy Deck" },
}

export default function CoinToss({ onTossFinish, deckName, opponentName, opponentAvatar }: CoinTossProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'You' | string | null>(null);

  const { theme, icon: Icon, title } = deckInfo[deckName];

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      const winner = Math.random() < (2 / 3) ? 'You' : opponentName;
      setResult(winner);
      setIsFlipping(false);
      
      setTimeout(() => onTossFinish(winner), 2000);

    }, 1000);
  };
  
  return (
    <Card className="mx-auto w-full max-w-md text-center overflow-hidden animate-in fade-in-50 zoom-in-95 bg-card">
      <CardHeader className="bg-muted/50">
        <CardTitle className="font-headline text-xl flex items-center justify-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {title}: Coin Toss
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[300px]">
        <p className="text-muted-foreground">Let's flip a coin to see who asks the first question.</p>
        <div className="flex justify-around w-full items-center">
            <div className="flex flex-col items-center gap-2">
                <Avatar className={cn("w-20 h-20 border-4 border-transparent transition-all duration-500", result === 'You' && 'border-primary ring-4 ring-primary/20')}>
                    <AvatarImage src="https://picsum.photos/100" alt="You" data-ai-hint="profile avatar"/>
                    <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-lg">You</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <Avatar className={cn("w-20 h-20 border-4 border-transparent transition-all duration-500", result === opponentName && 'border-primary ring-4 ring-primary/20')}>
                    <AvatarImage src={opponentAvatar} alt={opponentName} data-ai-hint="profile avatar"/>
                    <AvatarFallback>{opponentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-lg">{opponentName}</span>
            </div>
        </div>
        
        <div className="h-24 flex items-center justify-center">
            {result ? (
                <div className="text-2xl font-bold animate-in fade-in-50 zoom-in-95 text-primary">
                    {result} will go first!
                </div>
            ) : (
                <CoinIcon isFlipping={isFlipping} theme={theme} />
            )}
        </div>
        
        <Button onClick={handleFlip} disabled={isFlipping || !!result} size="lg" className="min-w-[150px] h-12 text-lg">
          {isFlipping ? 'Flipping...' : (result ? 'Starting...' : 'Flip Coin')}
        </Button>

      </CardContent>
    </Card>
  );
}
