
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile, MoreVertical, Zap } from "lucide-react";
import { useState } from "react";
import VibeCheckCard from "@/components/vibe-check-card";
import { cn } from "@/lib/utils";
import GameSelectionDialog from "@/components/game-selection-dialog";

type Message = {
    id: string;
    text: string;
    sender: 'me' | 'them';
};

type DeckTheme = 'default' | 'friends' | 'date' | 'spicy';

export default function ChatPage({ params }: { params: { id: string } }) {
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGameSelectionOpen, setIsGameSelectionOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<DeckTheme>('default');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
        id: (messages.length + 1).toString(),
        text: inputValue,
        sender: 'me',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleGameFinish = () => {
    setIsGameFinished(true);
  }

  const handleGameSelect = (deck: 'Friends' | 'Date' | 'Spicy') => {
    setActiveTheme(deck.toLowerCase() as DeckTheme);
    setIsGameSelectionOpen(false);
  }

  return (
    <div className={cn(
        "flex flex-col h-[calc(100vh_-_theme(spacing.24))] rounded-xl border transition-colors duration-500",
        `theme-${activeTheme}`
    )}>
        <div className="flex items-center p-4 border-b bg-card">
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/sophia/100" alt="Sophia" data-ai-hint="profile avatar" />
                <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
                <p className="text-lg font-semibold font-headline">Sophia</p>
                <p className="text-sm text-muted-foreground">Online</p>
            </div>
            <GameSelectionDialog 
              open={isGameSelectionOpen} 
              onOpenChange={setIsGameSelectionOpen}
              onSelectDeck={handleGameSelect}
            >
              <Button variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Start Game
              </Button>
            </GameSelectionDialog>
            <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5"/>
            </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background">
            
            <VibeCheckCard onGameFinish={handleGameFinish} />

            {isGameFinished && (
                <div className="space-y-4">
                     {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={cn(
                                "flex items-end gap-2",
                                message.sender === 'me' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.sender === 'them' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://picsum.photos/seed/sophia/100" alt="Sophia" data-ai-hint="profile avatar"/>
                                    <AvatarFallback>S</AvatarFallback>
                                </Avatar>
                            )}
                             <div className={cn(
                                "max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-sm",
                                message.sender === 'me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                            )}>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
           
        </div>

        <div className="p-4 border-t bg-card">
            <form className="relative" onSubmit={handleSendMessage}>
                <Input 
                    placeholder={isGameFinished ? "Type a message..." : "Finish the Vibe Check to chat"} 
                    className="pr-24" 
                    disabled={!isGameFinished} 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button variant="ghost" size="icon" type="button" disabled={!isGameFinished}><Smile className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" type="button" disabled={!isGameFinished}><Paperclip className="h-5 w-5"/></Button>
                    <Button variant="default" size="icon" className="mr-2" type="submit" disabled={!isGameFinished}><Send className="h-5 w-5"/></Button>
                </div>
            </form>
        </div>
    </div>
  )
}
