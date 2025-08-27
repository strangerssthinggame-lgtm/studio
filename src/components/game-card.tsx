
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Flame, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

const gameDecks = {
  Friends: [
    { text: "What's the most useless talent you have?", options: ["Answer", "Dare"], type: 'truth' },
    { text: "Show the most embarrassing photo on your phone.", options: ["Answer", "Dare"], type: 'dare' },
    { text: "If you could only eat one food for the rest of your life, what would it be?", options: ["Answer", "Dare"], type: 'truth' },
  ],
  Date: [
    { text: "What's a relationship deal-breaker for you?", options: ["Answer", "Dare"], type: 'truth' },
    { text: "Serenade the other person with a love song.", options: ["Answer", "Dare"], type: 'dare' },
    { text: "What are you most passionate about in life?", options: ["Answer", "Dare"], type: 'truth' },
  ],
  Spicy: [
    { text: "What's your biggest turn-on?", options: ["Answer", "Dare"], type: 'truth' },
    { text: "Send a flirty selfie to the other person.", options: ["Answer", "Dare"], type: 'dare' },
    { text: "Describe your ideal romantic fantasy.", options: ["Answer", "Dare"], type: 'truth' },
  ],
};

const deckInfo = {
    'Friends': { icon: Users, title: "Friends Game" },
    'Date': { icon: Heart, title: "Date Game" },
    'Spicy': { icon: Flame, title: "Spicy Game" },
}

type GameCardProps = {
    onGameFinish: () => void;
    deckName: 'Friends' | 'Date' | 'Spicy';
};

export default function GameCard({ onGameFinish, deckName }: GameCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const questions = gameDecks[deckName];
  const { icon: Icon, title } = deckInfo[deckName];

  const handleNextQuestion = () => {
      if(currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsFinished(true);
        // You could have a results screen here, for now we just finish.
        setTimeout(onGameFinish, 2000);
      }
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="mx-auto w-full max-w-md text-center overflow-hidden animate-in fade-in-50 zoom-in-95 bg-card border-primary/20 shadow-lg shadow-primary/10">
        <CardHeader className="bg-muted/50 p-4">
            <CardTitle className="font-headline text-lg flex items-center justify-center gap-2 text-primary">
                <Icon className="w-5 h-5"/> {title}
            </CardTitle>
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mt-2 h-2" />
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[300px]">
           
           {isFinished ? (
                <div className="text-2xl font-bold text-primary animate-in fade-in zoom-in-95">
                    Game Over!
                </div>
           ) : (
            <>
                <p className="text-xl font-semibold text-center text-card-foreground">{currentQuestion.text}</p>
                
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">It's your turn to ask.</p>
                    <p className="text-sm text-muted-foreground">Sophia has to choose...</p>
                </div>
                
                <div className="flex gap-4 w-full">
                    <Button 
                        variant="outline" 
                        className="w-full h-16 text-lg border-primary/50 text-primary hover:bg-primary/10"
                    >
                        Truth
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full h-16 text-lg border-primary/50 text-primary hover:bg-primary/10"
                    >
                        Dare
                    </Button>
                </div>

                <Button variant="ghost" className="mt-4 text-muted-foreground" onClick={handleNextQuestion}>
                    {currentQuestionIndex < questions.length - 1 ? 'Skip & Go to Next Question' : 'Finish Game'}
                    <ChevronsRight className="w-4 h-4 ml-2"/>
                </Button>
            </>
           )}

        </CardContent>
    </Card>
  );
}
