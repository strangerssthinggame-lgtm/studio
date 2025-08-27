
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type VibeCheckResultsProps = {
    totalMatches: number;
};

const questionsCount = 3;

export function VibeCheckResults({ totalMatches }: VibeCheckResultsProps) {
    const isMajorVibe = totalMatches >= 2;
    const resultText = isMajorVibe 
        ? "You two are definitely on the same wavelength. The chat is now open!" 
        : "You have some things in common. See where the conversation goes! The chat is now open.";

    return (
        <Card className="mx-auto w-full max-w-md text-center overflow-hidden animate-in fade-in-50 zoom-in-95">
             <CardHeader className="bg-muted/50">
                <CardTitle className="font-headline text-xl flex items-center justify-center gap-2">
                    <Sparkles className="text-primary"/> Final Vibe Results
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4 min-h-[250px]">
                <div className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-full text-xl font-bold",
                    isMajorVibe ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                )}>
                    {isMajorVibe ? <Heart className="w-7 h-7" fill="currentColor"/> : <Zap className="w-7 h-7"/>}
                    {isMajorVibe ? "It's a Major Vibe!" : "Good Start!"}
                </div>
                <p className="text-lg font-semibold text-center">You matched on {totalMatches} out of {questionsCount} questions!</p>
                <p className="text-sm text-muted-foreground px-4">{resultText}</p>
            </CardContent>
        </Card>
    )
}
