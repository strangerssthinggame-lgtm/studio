
'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Search, Bell, Users, Heart, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chats } from "@/lib/chat-data";

type FilterType = 'all' | 'friends' | 'date' | 'spicy';

export default function ChatListPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredChats = chats.filter(chat => 
    activeFilter === 'all' || chat.vibe === activeFilter
  );

  const filterButtons = [
      { name: 'All', value: 'all' as FilterType },
      { name: 'Friends', value: 'friends' as FilterType, icon: Users },
      { name: 'Date', value: 'date' as FilterType, icon: Heart },
      { name: 'Spicy', value: 'spicy' as FilterType, icon: Flame },
  ]

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Chats</h1>
        <Link href="/notifications">
            <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search chats..." className="pl-10 h-12 text-base" />
      </div>

      <div className="flex items-center gap-2">
        {filterButtons.map(filter => (
             <Button 
                key={filter.value} 
                variant={activeFilter === filter.value ? 'default' : 'outline'}
                onClick={() => setActiveFilter(filter.value)}
                className="gap-2"
            >
                {filter.icon && <filter.icon />}
                {filter.name}
            </Button>
        ))}
      </div>


      <div className="flex-1 -mx-4 -mb-4 overflow-y-auto">
          <div className="flex flex-col">
            {filteredChats.map(chat => (
                <div key={chat.id} className={cn(
                    "flex items-center gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors duration-200",
                    chat.unread > 0 && "bg-primary/5"
                )}>
                  <Link href={`/users/${chat.id}`}>
                    <div className="relative">
                      <Avatar className={cn(
                        "h-14 w-14 border-2 cursor-pointer transition-colors",
                        chat.unread > 0 && chat.vibe === 'friends' && 'border-sky-500',
                        chat.unread > 0 && chat.vibe === 'date' && 'border-rose-500',
                        chat.unread > 0 && chat.vibe === 'spicy' && 'border-orange-500',
                        chat.unread > 0 && 'ring-2 ring-offset-2 ring-offset-background',
                        chat.unread > 0 && chat.vibe === 'friends' && 'ring-sky-500/50',
                        chat.unread > 0 && chat.vibe === 'date' && 'ring-rose-500/50',
                        chat.unread > 0 && chat.vibe === 'spicy' && 'ring-orange-500/50'
                      )}>
                        <AvatarImage src={chat.avatar} alt={chat.name} data-ai-hint="profile avatar" />
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                  </Link>
                  <Link href={`/chat/${chat.id}`} className="flex-1">
                    <div className="grid gap-1.5">
                      <div className="flex items-baseline gap-2">
                          <p className="text-base font-bold font-headline tracking-wide">{chat.name}</p>
                          <p className="text-xs text-muted-foreground">{chat.time}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                    </div>
                  </Link>
                  {chat.unread > 0 && (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{chat.unread}</span>
                      </div>
                  )}
                </div>
            ))}
             {filteredChats.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                    <p>No chats found for the "{activeFilter}" filter.</p>
                </div>
             )}
          </div>
      </div>
    </div>
  )
}
