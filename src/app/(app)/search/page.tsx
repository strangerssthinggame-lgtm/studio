
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { userProfiles } from '@/lib/user-profile-data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const filteredUsers = userProfiles.filter(user =>
    query ? user.name.toLowerCase().includes(query.toLowerCase()) : false
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Search Results</h1>
          {query && <p className="text-muted-foreground">Showing results for: <span className="font-semibold text-primary">"{query}"</span></p>}
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <Card key={user.id}>
              <CardHeader className="items-center text-center">
                <Link href={`/users/${user.id}`}>
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile photo" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                <CardTitle className="font-headline pt-2">{user.name}</CardTitle>
                <CardDescription>{user.location}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">{user.bio}</p>
                 <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" /> Follow
                    </Button>
                     <Link href={`/chat/${user.id}`}>
                        <Button size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                    </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-8">
            <p className="text-lg font-semibold">No users found</p>
            <p>We couldn't find anyone matching your search for "{query}". Try a different name.</p>
        </div>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
