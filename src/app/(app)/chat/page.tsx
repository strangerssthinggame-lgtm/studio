
'use client';

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Search, Bell, Users, Heart, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Chat } from "@/lib/chat-data";
import { useAuth } from "@/hooks/use-auth";
import { firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, onSnapshot, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

type FilterType = 'all' | 'friends' | 'date' | 'spicy';
type ChatWithUserInfo = Chat & {
    otherUserName: string;
    otherUserAvatar: string;
}

export default function ChatListPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const chatsQuery = query(
      collection(firestore, 'chats'),
      where('userIds', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (querySnapshot) => {
      const chatsDataPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const chatData = docSnapshot.data() as Chat;
        const otherUserId = chatData.userIds.find(id => id !== user.uid);
        
        let otherUserName = "Unknown User";
        let otherUserAvatar = "https://picsum.photos/seed/unknown/100";

        if(otherUserId) {
            const userDoc = await getDoc(doc(firestore, 'users', otherUserId));
            if(userDoc.exists()) {
                const userData = userDoc.data();
                otherUserName = userData.name;
                otherUserAvatar = userData.avatar;
            }
        }
        
        return {
            ...chatData,
            id: docSnapshot.id,
            otherUserName,
            otherUserAvatar,
        };
      });
      
      const resolvedChats = await Promise.all(chatsDataPromises);
      
      // Sort by last message timestamp
      resolvedChats.sort((a, b) => {
        const timeA = a.lastMessageTimestamp?.toDate() || new Date(0);
        const timeB = b.lastMessageTimestamp?.toDate() || new Date(0);
        return timeB.getTime() - timeA.getTime();
      });

      setChats(resolvedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);


  const filteredChats = chats.filter(chat => {
    const filterMatch = activeFilter === 'all' || chat.vibe === activeFilter;
    const searchMatch = chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
    return filterMatch && searchMatch;
  });

  const filterButtons = [
      { name: 'All', value: 'all' as FilterType },
      { name: 'Friends', value: 'friends' as FilterType, icon: Users },
      { name: 'Date', value: 'date' as FilterType, icon: Heart },
      { name: 'Spicy', value: 'spicy' as FilterType, icon: Flame },
  ]

  if (loading || authLoading) {
      return (
          <div className="flex flex-col h-full gap-4">
             <div className="flex items-center justify-between pb-4 border-b">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full"/>
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {[...Array(3)].map((_, i) => (
                     <div key={i} className="flex items-center gap-4 p-2">
                        <Skeleton className="h-14 w-14 rounded-full"/>
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                     </div>
                ))}
            </div>
          </div>
      )
  }

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
        <Input 
          placeholder="Search chats..." 
          className="pl-10 h-12 text-base" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
                    // chat.unread > 0 && "bg-primary/5"
                )}>
                  <Link href={`/users/${chat.userIds.find(id => id !== user?.uid)}`}>
                    <div className="relative">
                      <Avatar className={cn(
                        "h-14 w-14 border-2 cursor-pointer transition-colors",
                      )}>
                        <AvatarImage src={chat.otherUserAvatar} alt={chat.otherUserName} data-ai-hint="profile avatar" />
                        <AvatarFallback>{chat.otherUserName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {/* {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                      )} */}
                    </div>
                  </Link>
                  <Link href={`/chat/${chat.id}`} className="flex-1">
                    <div className="grid gap-1.5">
                      <div className="flex items-baseline gap-2">
                          <p className="text-base font-bold font-headline tracking-wide">{chat.otherUserName}</p>
                          <p className="text-xs text-muted-foreground">
                            {chat.lastMessageTimestamp ? formatDistanceToNow(chat.lastMessageTimestamp.toDate(), { addSuffix: true }) : ''}
                          </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                  </Link>
                  {/* {chat.unread > 0 && (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{chat.unread}</span>
                      </div>
                  )} */}
                </div>
            ))}
             {filteredChats.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                    <p>No chats found.</p>
                </div>
             )}
          </div>
      </div>
    </div>
  )
}
