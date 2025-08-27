import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const chats = [
  { id: '1', name: 'Sophia', message: "Hey! Loved your profile. Up for a game?", time: "5m ago", unread: 2, avatar: "https://picsum.photos/seed/sophia/100" },
  { id: '2', name: 'Liam', message: "That was a fun game! Rematch soon?", time: "1h ago", unread: 0, avatar: "https://picsum.photos/seed/liam/100" },
  { id: '3', name: 'Chloe', message: "You have a great taste in music!", time: "3h ago", unread: 0, avatar: "https://picsum.photos/seed/chloe/100" },
  { id: '4', name: 'Mason', message: "Let's do this! Vibe Check, Date mode?", time: "1d ago", unread: 1, avatar: "https://picsum.photos/seed/mason/100" },
]

export default function ChatListPage() {
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

      <div className="flex-1 -mx-4 -mb-4">
          <div className="flex flex-col">
            {chats.map(chat => (
              <Link href={`/chat/${chat.id}`} key={chat.id}>
                <div className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors duration-200">
                  <Avatar className="h-14 w-14 border">
                    <AvatarImage src={chat.avatar} alt={chat.name} data-ai-hint="profile avatar" />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1.5 flex-1">
                    <div className="flex items-baseline gap-2">
                        <p className="text-base font-bold font-headline tracking-wide">{chat.name}</p>
                        <p className="text-xs text-muted-foreground">{chat.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                  </div>
                  {chat.unread > 0 && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{chat.unread}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
      </div>
    </div>
  )
}
