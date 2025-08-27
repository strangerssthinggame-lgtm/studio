
'use client';

import { ProfileCard } from '@/components/profile-card';
import { Filter, Users, Calendar, MapPin, Sparkles } from 'lucide-react';
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
import { useState, useCallback } from 'react';

const allUsers = [
  {
    name: 'Sophia',
    age: 24,
    gender: 'female',
    location: 'New York, USA',
    vibe: 'date',
    bio: 'Lover of art, long walks on the beach, and deep conversations. Looking for someone to explore new cafes with.',
    tags: ['Art', 'Coffee', 'Philosophy', 'Travel'],
    image: 'https://picsum.photos/seed/sophia/600/800',
    aiHint: 'woman portrait',
  },
  {
    name: 'Liam',
    age: 27,
    gender: 'male',
    location: 'London, UK',
    vibe: 'friends',
    bio: "Tech enthusiast and weekend hiker. My dog is my best friend. Let's talk about the future of AI or the best trails.",
    tags: ['Tech', 'Hiking', 'Dogs', 'Sci-Fi'],
    image: 'https://picsum.photos/seed/liam/600/800',
    aiHint: 'man portrait',
  },
  {
    name: 'Chloe',
    age: 22,
    gender: 'female',
    location: 'Paris, France',
    vibe: 'spicy',
    bio: "Musician and dreamer. I find beauty in small things. Let's create a playlist for our first date.",
    tags: ['Music', 'Concerts', 'Creative', 'Vegan'],
    image: 'https://picsum.photos/seed/chloe/600/800',
    aiHint: 'woman smiling',
  },
  {
    name: 'Mason',
    age: 29,
    gender: 'male',
    location: 'New York, USA',
    vibe: 'date',
    bio: 'Fitness junkie with a love for cooking. I can make you a great protein shake and an even better lasagna.',
    tags: ['Fitness', 'Cooking', 'Health', 'Movies'],
    image: 'https://picsum.photos/seed/mason/600/800',
    aiHint: 'man gym',
  },
  {
    name: 'Olivia',
    age: 31,
    gender: 'female',
    location: 'New York, USA',
    vibe: 'friends',
    bio: 'Bookworm and aspiring novelist. Let\'s get lost in a story.',
    tags: ['Books', 'Writing', 'Tea'],
    image: 'https://picsum.photos/seed/olivia/600/800',
    aiHint: 'woman reading',
    },
];

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    vibe: 'date',
    region: '',
    ageRange: [18, 35],
    gender: 'all',
  });
  
  const [userQueue, setUserQueue] = useState(allUsers);
  
  const handleSwipe = useCallback(() => {
    setUserQueue(currentQueue => currentQueue.slice(1));
  }, []);
  
  const applyFilters = () => {
    const newFilteredUsers = allUsers.filter(user => {
      const [minAge, maxAge] = filters.ageRange;
      const regionMatch = filters.region === '' || user.location.toLowerCase().includes(filters.region.toLowerCase());
      const ageMatch = user.age >= minAge && user.age <= maxAge;
      const genderMatch = filters.gender === 'all' || user.gender === filters.gender;
      const vibeMatch = user.vibe === filters.vibe;
      
      return regionMatch && ageMatch && genderMatch && vibeMatch;
    });
    setUserQueue(newFilteredUsers);
  };
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // This will apply initial filters
  useState(() => {
    applyFilters();
  });


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
            <SheetHeader className="text-left border-b pb-4">
              <SheetTitle className="font-headline">Discovery Settings</SheetTitle>
              <SheetDescription>
                Refine your discovery settings to find the perfect vibe.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-8 py-6">
              <div className="grid grid-cols-1 items-start gap-4">
                <Label className="flex items-center gap-2 text-base font-semibold"><Sparkles className="w-5 h-5 text-primary"/> Vibe</Label>
                <RadioGroup 
                    value={filters.vibe}
                    onValueChange={(value) => handleFilterChange('vibe', value)}
                    className="grid grid-cols-3 gap-2">
                    <Label htmlFor="friends" className="rounded-lg border p-4 text-center cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                        <RadioGroupItem value="friends" id="friends" className="sr-only"/>
                        Friends
                    </Label>
                    <Label htmlFor="date" className="rounded-lg border p-4 text-center cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                        <RadioGroupItem value="date" id="date" className="sr-only"/>
                        Date
                    </Label>
                    <Label htmlFor="spicy" className="rounded-lg border p-4 text-center cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                        <RadioGroupItem value="spicy" id="spicy" className="sr-only"/>
                        Spicy
                    </Label>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 items-start gap-4">
                <Label htmlFor="geography" className="flex items-center gap-2 text-base font-semibold"><MapPin className="w-5 h-5 text-primary"/> Region</Label>
                <Input 
                  id="geography" 
                  placeholder="New York, USA"
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 items-start gap-4">
                <Label htmlFor="age-range" className="flex items-center gap-2 text-base font-semibold"><Calendar className="w-5 h-5 text-primary"/> Age Range</Label>
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-sm text-muted-foreground w-8 text-center">{filters.ageRange[0]}</span>
                  <Slider
                    id="age-range"
                    value={filters.ageRange}
                    onValueChange={(value) => handleFilterChange('ageRange', value)}
                    max={60}
                    min={18}
                    step={1}
                  />
                  <span className="text-sm text-muted-foreground w-8 text-center">{filters.ageRange[1]}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 items-start gap-4">
                <Label className="flex items-center gap-2 text-base font-semibold"><Users className="w-5 h-5 text-primary"/> Gender</Label>
                <RadioGroup 
                    value={filters.gender}
                    onValueChange={(value) => handleFilterChange('gender', value)}
                    className="grid grid-cols-3 gap-2">
                   <Label htmlFor="all" className="rounded-lg border p-4 text-center cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                    <RadioGroupItem value="all" id="all" className="sr-only"/>
                    All
                  </Label>
                   <Label htmlFor="male" className="rounded-lg border p-4 text-center cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                    <RadioGroupItem value="male" id="male" className="sr-only"/>
                    Male
                  </Label>
                   <Label htmlFor="female" className="rounded-lg border p-4 text-center cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                    <RadioGroupItem value="female" id="female" className="sr-only"/>
                    Female
                  </Label>
                </RadioGroup>
              </div>

            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-sm h-[60vh] md:h-[70vh]">
          {userQueue.length > 0 ? (
            userQueue.map((user, index) => {
              // We only render the top card to avoid performance issues
              if (index === 0) {
                return (
                  <ProfileCard
                    key={user.name}
                    user={user}
                    onSwipe={handleSwipe}
                  />
                );
              }
              return null;
            }).reverse() // a little trick to stack the cards correctly
          ) : (
            <div className="text-center text-muted-foreground p-4 bg-muted rounded-lg">
                <p className="text-lg font-semibold">No More Profiles</p>
                <p>You've seen everyone who matches your criteria. Try expanding your filters!</p>
                <Button onClick={() => setUserQueue(allUsers)} variant="link" className="mt-4">Reset Deck</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
