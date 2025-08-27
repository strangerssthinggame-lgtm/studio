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
    bio: "Tech enthusiast and weekend hiker. My dog is my best friend. Let's talk about the future of AI or the best trails.",
    tags: ['Tech', 'Hiking', 'Dogs', 'Sci-Fi'],
    image: 'https://picsum.photos/seed/liam/600/800',
    aiHint: 'man portrait',
  },
  {
    name: 'Chloe',
    age: 22,
    bio: "Musician and dreamer. I find beauty in small things. Let's create a playlist for our first date.",
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
            <SheetHeader className="text-left border-b pb-4">
              <SheetTitle className="font-headline">Discovery Settings</SheetTitle>
              <SheetDescription>
                Refine your discovery settings to find the perfect vibe.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-8 py-6">
              <div className="grid grid-cols-1 items-start gap-4">
                <Label className="flex items-center gap-2 text-base font-semibold"><Sparkles className="w-5 h-5 text-primary"/> Vibe</Label>
                <RadioGroup defaultValue="date" className="grid grid-cols-3 gap-2">
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
                <Input id="geography" placeholder="New York, USA" />
              </div>
              
              <div className="grid grid-cols-1 items-start gap-4">
                <Label htmlFor="age-range" className="flex items-center gap-2 text-base font-semibold"><Calendar className="w-5 h-5 text-primary"/> Age Range</Label>
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-sm text-muted-foreground w-4">18</span>
                  <Slider
                    id="age-range"
                    defaultValue={[18, 35]}
                    max={60}
                    min={18}
                    step={1}
                  />
                  <span className="text-sm text-muted-foreground w-4">60</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 items-start gap-4">
                <Label className="flex items-center gap-2 text-base font-semibold"><Users className="w-5 h-5 text-primary"/> Gender</Label>
                <RadioGroup defaultValue="all" className="grid grid-cols-3 gap-2">
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
