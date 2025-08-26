
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const question = {
  text: "The perfect first date is a spontaneous adventure, not a fancy dinner. Agree or Disagree?",
  options: [
    { text: "Agree", icon: <ThumbsUp className="w-5 h-5" /> },
    { text: "Disagree", icon: <ThumbsDown className="w-5 h-5" /> }
  ]
};

// Mock data for user's choice
const theirChoice = "Agree";

export default function VibeCheckCard() {
  const [myChoice, setMyChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleChoice = (choice: string) => {
    setMyChoice(choice);
    // In a real app, this would submit the choice and wait for the other user.
    // For this demo, we'll reveal immediately.
    setTimeout(() => setRevealed(true), 500);
  };

  const isMatch = myChoice === theirChoice;

  return (
    <Card className="mx-auto w-full max-w-md text-center overflow-hidden">
        <CardHeader className="bg-muted/50">
            <CardTitle className="font-headline text-xl flex items-center justify-center gap-2">
                <Zap className="text-primary"/> Vibe Check
            </CardTitle>
            <CardDescription>Answer the question to see if you vibe.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[250px]">
            <p className="text-lg font-semibold text-center">{question.text}</p>
            
            {!revealed ? (
                <div className="flex gap-4 w-full">
                    {question.options.map((option) => (
                        <Button 
                            key={option.text}
                            variant="outline" 
                            className="w-full h-16 text-base"
                            onClick={() => handleChoice(option.text)}
                        >
                            {option.icon}
                            {option.text}
                        </Button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95">
                    <div className={cn(
                        "flex items-center justify-center gap-2 p-3 rounded-full text-lg font-bold",
                        isMatch ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}>
                        {isMatch ? <Heart className="w-6 h-6" fill="currentColor"/> : <Zap className="w-6 h-6"/>}
                        {isMatch ? "It's a Vibe!" : "Not this time"}
                    </div>
                    
                    <div className="flex items-center justify-around w-full mt-4">
                        <div className="flex flex-col items-center gap-2">
                            <Avatar>
                                <AvatarImage src="https://picsum.photos/100" alt="You" data-ai-hint="profile avatar"/>
                                <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">You</span>
                            <span className="text-sm text-muted-foreground">{myChoice}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Avatar>
                                <AvatarImage src="https://picsum.photos/seed/sophia/100" alt="Sophia" data-ai-hint="profile avatar"/>
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">Sophia</span>
                            <span className="text-sm text-muted-foreground">{theirChoice}</span>
                        </div>
                    </div>

                    <Button variant="secondary" className="mt-4">Next Question</Button>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
