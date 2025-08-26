import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const chats = [
  { id: '1', name: 'Sophia', message: "Hey! Loved your profile. Up for a game?", time: "5m ago", unread: 2, avatar: "https://picsum.photos/seed/sophia/100" },
  { id: '2', name: 'Liam', message: "That was a fun game! Rematch soon?", time: "1h ago", unread: 0, avatar: "https://picsum.photos/seed/liam/100" },
  { id: '3', name: 'Chloe', message: "You have a great taste in music!", time: "3h ago", unread: 0, avatar: "https://picsum.photos/seed/chloe/100" },
  { id: '4', name: 'Mason', message: "Let's do this! Vibe Check, Date mode?", time: "1d ago", unread: 1, avatar: "https://picsum.photos/seed/mason/100" },
]

export default function ChatListPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-2xl font-headline font-semibold">Chats</h1>
      </div>
      <Card className="mt-4 flex-1">
        <CardContent className="p-0">
          <div className="divide-y">
            {chats.map(chat => (
              <Link href={`/chat/${chat.id}`} key={chat.id}>
                <div className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} data-ai-hint="profile avatar" />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1 flex-1">
                    <p className="text-sm font-medium leading-none">{chat.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                  </div>
                  <div className="flex flex-col items-end text-xs text-muted-foreground">
                    <span>{chat.time}</span>
                    {chat.unread > 0 && (
                      <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{chat.unread}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
