
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Flame, Send, RefreshCw, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameType } from '@/app/(app)/chat/[id]/page';

const gameDecks = {
  Friends: {
    truth: [
      "What's the most useless talent you have?",
      "If you could only eat one food for the rest of your life, what would it be?",
      "What's the most embarrassing thing you've ever done?",
      "What's a weird food combination you love?",
    ],
    dare: [
      "Send the 3rd emoji on your recently used list.",
      "Share a screenshot of your phone's home screen.",
      "Tell a cheesy joke.",
      "Spell your name backwards with your eyes closed.",
    ],
  },
  Date: {
    truth: [
      "What's a relationship deal-breaker for you?",
      "What are you most passionate about in life?",
      "What's the most important lesson you've learned from past relationships?",
      "What does your ideal weekend look like?",
    ],
     dare: [
      "Send a 10-second voice note saying 'hello'.",
      "Describe your perfect date in 3 words.",
      "Send a selfie right now.",
      "Share your most-played song on Spotify/Apple Music.",
    ],
  },
  Spicy: {
    truth: [
      "What's your biggest turn-on?",
      "Describe your ideal romantic fantasy.",
      "What's the most adventurous thing you've ever done?",
      "What's a secret you've never told anyone?",
    ],
     dare: [
      "Take a picture of your neck.",
      "Describe what you're wearing in one sentence.",
      "Send a GIF that describes your current mood.",
      "Whisper a secret to the camera (or phone).",
    ],
  },
};

const deckInfo = {
    'Friends': { icon: Users, title: "Friends" },
    'Date': { icon: Heart, title: "Date" },
    'Spicy': { icon: Flame, title: "Spicy" },
}

type GameCardProps = {
    onGameFinish: () => void;
    deckName: 'Friends' | 'Date' | 'Spicy';
    gameType: GameType;
    onSendQuestion: (question: string) => void;
    opponentName: string;
};

export default function GameCard({ onGameFinish, deckName, gameType, onSendQuestion, opponentName }: GameCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const questions = gameDecks[deckName].truth;
  const dares = gameDecks[deckName].dare;

  const { icon: Icon, title } = deckInfo[deckName];

  const handleSendQuestion = (question: string) => {
    onSendQuestion(question);
  }

  const handleCycleContent = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentDare = dares[currentQuestionIndex];

  const renderVibeGame = () => (
    <>
      <p className="text-xl font-semibold text-center text-card-foreground">{currentQuestion}</p>
      <p className="text-sm text-muted-foreground">It's your turn to ask {opponentName} a question.</p>
      <div className="flex gap-4 w-full">
          <Button 
              variant="outline"
              size="icon" 
              onClick={handleCycleContent}
              className="h-14 w-14"
          >
              <RefreshCw className="w-6 h-6"/>
              <span className="sr-only">Next Question</span>
          </Button>
          <Button 
              onClick={() => handleSendQuestion(currentQuestion)}
              className="w-full h-14 text-lg"
          >
              <Send className="w-5 h-5 mr-2"/>
              Send Question
          </Button>
      </div>
    </>
  );

  const renderTruthOrDare = () => (
      <>
        <div className="flex gap-4 w-full">
            {/* Truth Card */}
            <button 
              onClick={() => handleSendQuestion(`Truth: ${currentQuestion}`)}
              className="group relative w-1/2 p-4 rounded-lg border-2 border-sky-500 bg-sky-500/10 hover:bg-sky-500/20 text-center transition-all duration-300"
            >
                <div className="absolute top-2 right-2 bg-sky-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">TRUTH</div>
                <p className="font-semibold text-sky-800 dark:text-sky-200 mt-4">{currentQuestion}</p>
            </button>

            {/* Dare Card */}
             <button 
              onClick={() => handleSendQuestion(`Dare: ${currentDare}`)}
              className="group relative w-1/2 p-4 rounded-lg border-2 border-orange-500 bg-orange-500/10 hover:bg-orange-500/20 text-center transition-all duration-300"
            >
                <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">DARE</div>
                <p className="font-semibold text-orange-800 dark:text-orange-200 mt-4">{currentDare}</p>
            </button>
        </div>
         <div className="flex items-center gap-4 w-full">
             <Button 
                variant="outline"
                onClick={handleCycleContent}
                className="w-full"
            >
                <RefreshCw className="w-5 h-5 mr-2"/>
                Shuffle
            </Button>
         </div>
      </>
  );


  return (
    <Card className="mx-auto w-full max-w-md text-center overflow-hidden animate-in fade-in-50 zoom-in-95 bg-card border-primary/20 shadow-lg shadow-primary/10">
        <CardHeader className="bg-muted/50 p-4">
            <CardTitle className="font-headline text-lg flex items-center justify-center gap-2 text-primary">
                <Icon className="w-5 h-5"/> 
                {gameType === 'truth-or-dare' ? "Truth or Dare" : "Vibe Game"}: Your Turn
            </CardTitle>
            <CardDescription className="text-xs">
                {gameType === 'truth-or-dare' 
                    ? `Pick a Truth or a Dare to send to ${opponentName}.`
                    : `Pick a question to send to ${opponentName}.`
                }
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6 min-h-[250px]">
            {gameType === 'vibe' ? renderVibeGame() : renderTruthOrDare()}
            <Button variant="link" className="mt-4 text-muted-foreground" onClick={onGameFinish}>
                End Game
            </Button>
        </CardContent>
    </Card>
  );
}
