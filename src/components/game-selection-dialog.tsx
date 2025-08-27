
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
import { Zap, Heart, Users, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type Deck = 'Friends' | 'Date' | 'Spicy';

const decks = [
  { name: 'Friends', icon: Users, description: 'Lighthearted questions to get to know each other.', color: 'bg-sky-500' },
  { name: 'Date', icon: Heart, description: 'Go a little deeper and see if your values align.', color: 'bg-rose-500' },
  { name: 'Spicy', icon: Flame, description: 'Turn up the heat with some flirty questions.', color: 'bg-orange-500' },
] as const;

type GameSelectionDialogProps = {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectDeck: (deck: Deck) => void;
};

export default function GameSelectionDialog({ children, open, onOpenChange, onSelectDeck }: GameSelectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Zap className="text-primary"/>
            Choose Your Game
          </DialogTitle>
          <DialogDescription>
            Select a deck to start a new game with Sophia. She will be notified to accept your invitation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {decks.map((deck) => (
                <button
                    key={deck.name}
                    className="flex items-start gap-4 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent"
                    onClick={() => onSelectDeck(deck.name)}
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
      </DialogContent>
    </Dialog>
  );
}
