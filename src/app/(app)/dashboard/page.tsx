import { ProfileCard } from '@/components/profile-card';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const users = [
  {
    name: 'Sophia',
    age: 24,
    bio: 'Lover of art, long walks on the beach, and deep conversations. Looking for someone to explore new cafes with.',
    tags: ['Art', 'Coffee', 'Philosophy', 'Travel'],
    image: 'https://picsum.photos/seed/sophia/600/800',
    aiHint: 'woman portrait'
  },
  {
    name: 'Liam',
    age: 27,
    bio: 'Tech enthusiast and weekend hiker. My dog is my best friend. Let\'s talk about the future of AI or the best trails.',
    tags: ['Tech', 'Hiking', 'Dogs', 'Sci-Fi'],
    image: 'https://picsum.photos/seed/liam/600/800',
    aiHint: 'man portrait'
  },
  {
    name: 'Chloe',
    age: 22,
    bio: 'Musician and dreamer. I find beauty in small things. Let\'s create a playlist for our first date.',
    tags: ['Music', 'Concerts', 'Creative', 'Vegan'],
    image: 'https://picsum.photos/seed/chloe/600/800',
    aiHint: 'woman smiling'
  },
    {
    name: 'Mason',
    age: 29,
    bio: 'Fitness junkie with a love for cooking. I can make you a great protein shake and an even better lasagna.',
    tags: ['Fitness', 'Cooking', 'Health', 'Movies'],
    image: 'https://picsum.photos/seed/mason/600/800',
    aiHint: 'man gym'
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-headline font-semibold tracking-tight">
            Discover
            </h1>
            <p className="text-sm text-muted-foreground">
            Swipe right to connect, left to pass. Find your next vibe.
            </p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-sm h-[60vh] md:h-[70vh]">
          {users.map((user, index) => (
            <ProfileCard key={user.name} user={user} index={index} total={users.length} />
          ))}
        </div>
      </div>
    </>
  );
}
