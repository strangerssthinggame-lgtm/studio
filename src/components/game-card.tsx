
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Flame, Send, RefreshCw } from 'lucide-react';

const gameDecks = {
  Friends: [
    "What's the most useless talent you have?",
    "If you could only eat one food for the rest of your life, what would it be?",
    "What's the most embarrassing thing you've ever done?",
    "What's a weird food combination you love?",
  ],
  Date: [
    "What's a relationship deal-breaker for you?",
    "What are you most passionate about in life?",
    "What's the most important lesson you've learned from past relationships?",
    "What does your ideal weekend look like?",
  ],
  Spicy: [
    "What's your biggest turn-on?",
    "Describe your ideal romantic fantasy.",
    "What's the most adventurous thing you've ever done?",
    "What's a secret you've never told anyone?",
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
    onSendQuestion: (question: string) => void;
    opponentName: string;
};

export default function GameCard({ onGameFinish, deckName, onSendQuestion, opponentName }: GameCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = gameDecks[deckName];
  const { icon: Icon, title } = deckInfo[deckName];

  const handleSendQuestion = () => {
    onSendQuestion(questions[currentQuestionIndex]);
  }

  const handleCycleQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="mx-auto w-full max-w-md text-center overflow-hidden animate-in fade-in-50 zoom-in-95 bg-card border-primary/20 shadow-lg shadow-primary/10">
        <CardHeader className="bg-muted/50 p-4">
            <CardTitle className="font-headline text-lg flex items-center justify-center gap-2 text-primary">
                <Icon className="w-5 h-5"/> {title}: Your Turn
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[250px]">
           
            <p className="text-xl font-semibold text-center text-card-foreground">{currentQuestion}</p>
            
            <p className="text-sm text-muted-foreground">It's your turn to ask {opponentName} a question.</p>
            
            <div className="flex gap-4 w-full">
                <Button 
                    variant="outline"
                    size="icon" 
                    onClick={handleCycleQuestion}
                    className="h-14 w-14"
                >
                    <RefreshCw className="w-6 h-6"/>
                    <span className="sr-only">Next Question</span>
                </Button>
                <Button 
                    onClick={handleSendQuestion}
                    className="w-full h-14 text-lg"
                >
                    <Send className="w-5 h-5 mr-2"/>
                    Send Question
                </Button>
            </div>

            <Button variant="link" className="mt-4 text-muted-foreground" onClick={onGameFinish}>
                End Game
            </Button>
        </CardContent>
    </Card>
  );
}
