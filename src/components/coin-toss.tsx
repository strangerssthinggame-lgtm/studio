
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const CoinIcon = ({ isFlipping }: { isFlipping: boolean }) => (
  <div className={cn("w-24 h-24 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center transition-transform duration-1000", isFlipping && "animate-[spin_1s_ease-out]")}
    style={{ transformStyle: 'preserve-3d' }}
  >
    <Sparkles className="w-12 h-12 text-yellow-700" />
  </div>
);

type CoinTossProps = {
  onTossFinish: (winner: 'You' | 'Sophia') => void;
};

export default function CoinToss({ onTossFinish }: CoinTossProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'You' | 'Sophia' | null>(null);

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? 'You' : 'Sophia';
      setResult(winner);
      setIsFlipping(false);
      
      setTimeout(() => onTossFinish(winner), 2000);

    }, 1000);
  };
  
  return (
    <Card className="mx-auto w-full max-w-md text-center overflow-hidden animate-in fade-in-50 zoom-in-95">
      <CardHeader className="bg-muted/50">
        <CardTitle className="font-headline text-xl flex items-center justify-center gap-2">
          Who Goes First?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[300px]">
        <div className="flex justify-around w-full items-center">
            <div className="flex flex-col items-center gap-2">
                <Avatar className="w-16 h-16 border-4 border-transparent data-[winner=true]:border-primary transition-all">
                    <AvatarImage src="https://picsum.photos/100" alt="You" data-ai-hint="profile avatar"/>
                    <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <span className="font-semibold">You</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <Avatar className="w-16 h-16 border-4 border-transparent data-[winner=true]:border-primary transition-all">
                    <AvatarImage src="https://picsum.photos/seed/sophia/100" alt="Sophia" data-ai-hint="profile avatar"/>
                    <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <span className="font-semibold">Sophia</span>
            </div>
        </div>
        
        <div className="h-24 flex items-center justify-center">
            {result ? (
                <div className="text-2xl font-bold animate-in fade-in-50 zoom-in-95 text-primary">
                    {result} will go first!
                </div>
            ) : (
                <CoinIcon isFlipping={isFlipping} />
            )}
        </div>
        
        <Button onClick={handleFlip} disabled={isFlipping || !!result}>
          {isFlipping ? 'Flipping...' : (result ? 'Starting Game...' : 'Flip Coin')}
        </Button>

      </CardContent>
    </Card>
  );
}
