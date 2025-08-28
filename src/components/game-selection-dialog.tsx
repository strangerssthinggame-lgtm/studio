
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Heart, Users, Flame, Gamepad2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type Deck = 'Friends' | 'Date' | 'Spicy';
type GameType = 'Vibe Game' | 'Truth or Dare';

const decks = [
  { name: 'Friends', icon: Users, description: 'Lighthearted questions to get to know each other.', color: 'bg-sky-500' },
  { name: 'Date', icon: Heart, description: 'Go a little deeper and see if your values align.', color: 'bg-rose-500' },
  { name: 'Spicy', icon: Flame, description: 'Turn up the heat with some flirty questions.', color: 'bg-orange-500' },
] as const;

type GameSelectionDialogProps = {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectDeck: (deck: Deck, gameType: GameType) => void;
};

export default function GameSelectionDialog({ children, open, onOpenChange, onSelectDeck }: GameSelectionDialogProps) {
  const [selectionStep, setSelectionStep] = useState<'gameType' | 'deck'>('gameType');
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);

  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
    setSelectionStep('deck');
  }

  const handleBack = () => {
    setSelectionStep('gameType');
    setSelectedGameType(null);
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    // Reset state when dialog is closed
    if (!isOpen) {
        setTimeout(() => {
            setSelectionStep('gameType');
            setSelectedGameType(null);
        }, 200);
    }
  }
  
  const handleDeckSelect = (deck: Deck) => {
    onSelectDeck(deck, selectedGameType!);
  }


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {selectionStep === 'deck' && (
                <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                    <ArrowLeft />
                </Button>
            )}
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                <Zap className="text-primary"/>
                {selectionStep === 'gameType' ? 'Choose Your Game' : `Decks for ${selectedGameType}`}
            </DialogTitle>
          </div>
          <DialogDescription className={cn(selectionStep === 'deck' && "pl-10")}>
            {selectionStep === 'gameType' 
              ? "Select which game you'd like to play with Sophia."
              : "Select a deck to start the game."}
          </DialogDescription>
        </DialogHeader>
        
        {selectionStep === 'gameType' ? (
             <div className="grid gap-4 py-4">
                <button
                    className="flex items-start gap-4 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent"
                    onClick={() => handleGameTypeSelect('Vibe Game')}
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Gamepad2 className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Vibe Game</p>
                        <p className="text-muted-foreground">Ask questions and see if your personalities match.</p>
                    </div>
                </button>
                 <button
                    className="flex items-start gap-4 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent"
                    onClick={() => handleGameTypeSelect('Truth or Dare')}
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/80 text-accent-foreground">
                        <Flame className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Truth or Dare</p>
                        <p className="text-muted-foreground">The classic party game with a Bondly twist.</p>
                    </div>
                </button>
            </div>
        ) : (
             <div className="grid gap-4 py-4">
                {decks.map((deck) => (
                    <button
                        key={deck.name}
                        className="flex items-start gap-4 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent"
                        onClick={() => handleDeckSelect(deck.name)}
                    >
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white", deck.color)}>
                            <deck.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{deck.name}</p>
                            <p className="text-muted-foreground">{deck.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
