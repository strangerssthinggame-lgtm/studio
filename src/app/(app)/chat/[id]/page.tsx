
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile, MoreVertical } from "lucide-react";
import { useState } from "react";
import VibeCheckCard from "@/components/vibe-check-card";

const messages = [
  { sender: 'other', text: "Hey! Loved your profile. Up for a game?", time: "10:00 AM", avatar: "https://picsum.photos/seed/sophia/100" },
  { sender: 'me', text: "Hey Sophia! For sure. What did you have in mind?", time: "10:01 AM" },
  { sender: 'other', text: "How about we start with a Vibe Check, Date mode?", time: "10:02 AM", avatar: "https://picsum.photos/seed/sophia/100" },
];

export default function ChatPage({ params }: { params: { id: string } }) {
  const [isGameFinished, setIsGameFinished] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh_-_theme(spacing.24))] bg-card rounded-xl border">
        <div className="flex items-center p-4 border-b">
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/sophia/100" alt="Sophia" data-ai-hint="profile avatar" />
                <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
                <p className="text-lg font-semibold font-headline">Sophia</p>
                <p className="text-sm text-muted-foreground">Online</p>
            </div>
            <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5"/>
            </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="text-center text-xs text-muted-foreground">Today</div>
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                    {msg.sender === 'other' && (
                        <Avatar className="h-8 w-8 self-start">
                            <AvatarImage src={msg.avatar} alt="Avatar" data-ai-hint="profile avatar"/>
                            <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md shadow-sm ${msg.sender === 'me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} text-right`}>{msg.time}</p>
                    </div>
                </div>
            ))}
            
            <VibeCheckCard onGameFinish={() => setIsGameFinished(true)} />

        </div>

        <div className="p-4 border-t bg-background">
            <form className="relative">
                <Input 
                    placeholder={isGameFinished ? "Type a message..." : "Finish the Vibe Check to chat"} 
                    className="pr-24" 
                    disabled={!isGameFinished} 
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
