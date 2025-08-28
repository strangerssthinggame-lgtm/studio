
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldQuestion, Check, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
    id: string;
    sender: 'me' | 'them';
    type?: 'question' | 'answer' | 'challenge' | 'system';
    text?: string;
    challenge?: {
        truth: string;
        dare: string;
        isResponded: boolean;
        choice?: 'truth' | 'dare';
    }
};

type ChallengeCardProps = {
    message: Message;
    onRespond: (messageId: string, choice: 'truth' | 'dare') => void;
    currentUser: 'me' | 'them';
};

export function ChallengeCard({ message, onRespond, currentUser }: ChallengeCardProps) {
    if (!message.challenge) return null;

    const { truth, dare, isResponded, choice } = message.challenge;
    const isMyTurnToRespond = message.sender !== currentUser && !isResponded;
    const opponentName = message.sender === 'me' ? 'You' : 'They';

    return (
        <Card className={cn(
            "mx-auto w-full max-w-md overflow-hidden animate-in fade-in-50 zoom-in-95 border-primary/20 shadow-lg shadow-primary/10",
            message.sender === 'me' ? 'bg-card' : 'bg-muted'
        )}>
            <CardHeader className="bg-muted/50 p-4">
                <CardTitle className="font-headline text-base flex items-center justify-center gap-2 text-primary">
                    <ShieldQuestion className="w-5 h-5"/> 
                    Truth or Dare Challenge
                </CardTitle>
                 <CardDescription className="text-xs text-center">
                    {isResponded ? `${opponentName} chose ${choice}!` : `It's your turn to choose!`}
                 </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {/* Truth Option */}
                <div className={cn(
                    "group relative p-4 rounded-lg border-2 text-center transition-all duration-300 w-full",
                     !isResponded || choice === 'truth' ? 'border-sky-500 bg-sky-500/10' : 'border-muted bg-muted/30 opacity-60'
                )}>
                    <div className="absolute top-2 right-2 bg-sky-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">TRUTH</div>
                    <p className="font-semibold mt-4 text-sky-800 dark:text-sky-200">{truth}</p>
                </div>

                {/* Dare Option */}
                 <div className={cn(
                    "group relative p-4 rounded-lg border-2 text-center transition-all duration-300 w-full",
                     !isResponded || choice === 'dare' ? 'border-orange-500 bg-orange-500/10' : 'border-muted bg-muted/30 opacity-60'
                )}>
                    <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">DARE</div>
                    <p className="font-semibold mt-4 text-orange-800 dark:text-orange-200">{dare}</p>
                </div>

                {isMyTurnToRespond && (
                    <div className="flex items-center gap-4 w-full pt-4">
                        <Button
                            onClick={() => onRespond(message.id, 'truth')}
                            className="w-full h-12 text-base bg-sky-500 hover:bg-sky-600 text-white"
                        >
                            I Choose Truth
                        </Button>
                         <Button
                            onClick={() => onRespond(message.id, 'dare')}
                            className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            I Choose Dare
                        </Button>
                    </div>
                )}
                
                {isResponded && (
                    <div className="text-center pt-4 text-muted-foreground flex items-center justify-center gap-2">
                        <Check className="w-5 h-5 text-green-500"/>
                        <p>Waiting for their response...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
