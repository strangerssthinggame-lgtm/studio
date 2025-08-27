
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Sparkles, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';

const questions = [
  {
    text: "The perfect first date is a spontaneous adventure, not a fancy dinner. Agree or Disagree?",
    options: ["Agree", "Disagree"],
    theirAnswer: "Agree"
  },
  {
    text: "A quiet night in with a movie is better than a loud party. Thoughts?",
    options: ["Movie Night", "Big Party"],
    theirAnswer: "Movie Night"
  },
  {
    text: "Is it a deal-breaker if your partner is a messy person?",
    options: ["Yes, a deal-breaker", "No, I can live with it"],
    theirAnswer: "No, I can live with it"
  }
];

type VibeCheckCardProps = {
    onGameFinish: () => void;
};


export default function VibeCheckCard({ onGameFinish }: VibeCheckCardProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [myAnswers, setMyAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleChoice = (choice: string) => {
    const newAnswers = [...myAnswers];
    newAnswers[currentQuestionIndex] = choice;
    setMyAnswers(newAnswers);
    setShowResult(true);
  };
  
  const handleNextQuestion = () => {
      if(currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowResult(false);
      } else {
        setGameState('results');
        onGameFinish();
      }
  }

  const currentQuestion = questions[currentQuestionIndex];
  const myCurrentChoice = myAnswers[currentQuestionIndex];
  const isMatch = myCurrentChoice === currentQuestion.theirAnswer;
  
  const totalMatches = myAnswers.filter((answer, index) => answer === questions[index].theirAnswer).length;

  if (gameState === 'results') {
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
                <p className="text-lg font-semibold text-center">You matched on {totalMatches} out of {questions.length} questions!</p>
                <p className="text-sm text-muted-foreground px-4">{resultText}</p>
            </CardContent>
        </Card>
    )
  }

  const renderIntro = () => (
    <div className="animate-in fade-in-50 zoom-in-95">
        <CardHeader className="bg-muted/50">
            <CardTitle className="font-headline text-xl flex items-center justify-center gap-2">
                <Sparkles className="text-primary"/> Vibe Check Time!
            </CardTitle>
            <CardDescription>Sophia has invited you to play a game. The first card is ready.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[250px]">
             <p className="text-lg font-semibold text-center">See if your vibes align before you start chatting.</p>
             <Button onClick={handleStart}>
                Start Vibe Check
             </Button>
        </CardContent>
    </div>
  );

  const renderPlaying = () => (
    <div className="animate-in fade-in-50 zoom-in-95">
        <CardHeader className="bg-muted/50 p-4">
            <CardTitle className="font-headline text-base flex items-center justify-center gap-2">
                <Zap className="text-primary w-4 h-4"/> Vibe Check: Question {currentQuestionIndex + 1}/{questions.length}
            </CardTitle>
            <Progress value={((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100} className="mt-2 h-2" />
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[250px]">
            <p className="text-lg font-semibold text-center">{currentQuestion.text}</p>
            
            {!showResult ? (
                <div className="flex gap-4 w-full">
                    {currentQuestion.options.map((option) => (
                        <Button 
                            key={option}
                            variant="outline" 
                            className="w-full h-16 text-base"
                            onClick={() => handleChoice(option)}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 w-full">
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
                            <span className="text-sm text-muted-foreground">{myCurrentChoice}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Avatar>
                                <AvatarImage src="https://picsum.photos/seed/sophia/100" alt="Sophia" data-ai-hint="profile avatar"/>
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">Sophia</span>
                            <span className="text-sm text-muted-foreground">{currentQuestion.theirAnswer}</span>
                        </div>
                    </div>

                    <Button variant="secondary" className="mt-4" onClick={handleNextQuestion}>
                         {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Final Results'}
                         <ChevronsRight className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            )}
        </CardContent>
    </div>
  );

  return (
    <Card className="mx-auto w-full max-w-md text-center overflow-hidden">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderPlaying()}
    </Card>
  );
}
