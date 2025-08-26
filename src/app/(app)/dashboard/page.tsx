import { ProfileCard } from '@/components/profile-card';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

const users = [
  {
    name: 'Sophia',
    age: 24,
    bio: 'Lover of art, long walks on the beach, and deep conversations. Looking for someone to explore new cafes with.',
    tags: ['Art', 'Coffee', 'Philosophy', 'Travel'],
    image: 'https://picsum.photos/seed/sophia/600/800',
    aiHint: 'woman portrait',
  },
  {
    name: 'Liam',
    age: 27,
    bio: 'Tech enthusiast and weekend hiker. My dog is my best friend. Let\'s talk about the future of AI or the best trails.',
    tags: ['Tech', 'Hiking', 'Dogs', 'Sci-Fi'],
    image: 'https://picsum.photos/seed/liam/600/800',
    aiHint: 'man portrait',
  },
  {
    name: 'Chloe',
    age: 22,
    bio: 'Musician and dreamer. I find beauty in small things. Let\'s create a playlist for our first date.',
    tags: ['Music', 'Concerts', 'Creative', 'Vegan'],
    image: 'https://picsum.photos/seed/chloe/600/800',
    aiHint: 'woman smiling',
  },
  {
    name: 'Mason',
    age: 29,
    bio: 'Fitness junkie with a love for cooking. I can make you a great protein shake and an even better lasagna.',
    tags: ['Fitness', 'Cooking', 'Health', 'Movies'],
    image: 'https://picsum.photos/seed/mason/600/800',
    aiHint: 'man gym',
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="text-left">
              <SheetTitle className="font-headline">Filters</SheetTitle>
              <SheetDescription>
                Refine your discovery settings to find the perfect vibe.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="geography">Geography</Label>
                <Input id="geography" placeholder="New York, USA" />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="age-range">Age Range</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">18</span>
                  <Slider
                    id="age-range"
                    defaultValue={[18, 35]}
                    max={60}
                    min={18}
                    step={1}
                  />
                  <span className="text-sm text-muted-foreground">60</span>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Gender</Label>
                <RadioGroup defaultValue="all" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="font-normal">
                      All
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal">
                      Other
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-sm h-[60vh] md:h-[70vh]">
          {users.map((user, index) => (
            <ProfileCard
              key={user.name}
              user={user}
              index={index}
              total={users.length}
            />
          ))}
        </div>
      </div>
    </>
  );
}