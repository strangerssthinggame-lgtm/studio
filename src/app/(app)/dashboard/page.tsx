

'use client';

import { ProfileCard } from '@/components/profile-card';
import { Filter, Users, Calendar, MapPin, Sparkles, RotateCw } from 'lucide-react';
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
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { UserProfile } from '@/lib/user-profile-data';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState({
    vibe: 'date',
    region: '',
    ageRange: [18, 40],
    gender: 'all',
  });
  
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [userQueue, setUserQueue] = useState<UserProfile[]>([]);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) {
        // Wait until the user object is loaded.
        if (!authLoading) {
            setIsLoading(false);
        }
        return;
      }
      setIsLoading(true);
      try {
        const usersRef = collection(firestore, 'users');
        // Query all users except the current one
        const q = query(usersRef, where('uid', '!=', user.uid));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Map Firestore data to UserProfile, providing sensible defaults
            return {
                id: doc.id,
                name: data.displayName || 'Anonymous',
                age: data.age || 25, // Default age
                gender: data.gender || 'unknown', // Default gender
                username: data.username || `@${data.displayName?.toLowerCase().replace(/\s/g, '') || 'user'}`,
                location: data.location || 'Unknown Location',
                bio: data.bio || 'No bio yet. Tap to learn more!',
                avatar: data.photoURL || `https://picsum.photos/seed/${doc.id}/400/400`,
                banner: `https://picsum.photos/seed/${doc.id}-banner/800/600`,
                vibes: data.vibes || ['Friend'], // Default vibe
                interests: data.interests || ['Music', 'Movies'], // Default interests
                gallery: data.gallery || [],
                availability: data.availability || 'Not specified',
            } as UserProfile;
        });
        setAllUsers(usersData);
      } catch (error) {
          console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [user, authLoading]);

  const filteredUsers = useMemo(() => {
    if (isLoading) return [];
    return allUsers.filter(u => {
      const [minAge, maxAge] = filters.ageRange;
      const regionMatch = filters.region === '' || u.location.toLowerCase().includes(filters.region.toLowerCase());
      const ageMatch = u.age >= minAge && u.age <= maxAge;
      const genderMatch = filters.gender === 'all' || u.gender.toLowerCase() === filters.gender;
      
      const userVibes = Array.isArray(u.vibes) ? u.vibes.map(v => v.toLowerCase()) : [];
      const vibeMatch = userVibes.includes(filters.vibe);
      
      return regionMatch && ageMatch && genderMatch && vibeMatch;
    });
  }, [filters, allUsers, isLoading]);

  const handleSwipe = useCallback((swipedUser: UserProfile, direction: 'left' | 'right') => {
    setUserQueue(currentQueue => currentQueue.slice(0, currentQueue.length - 1));
    setHistory(prev => [...prev, swipedUser]);
  }, []);

  const applyFilters = useCallback(() => {
    setUserQueue(filteredUsers);
    setHistory([]);
  }, [filteredUsers]);


  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetDeck = useCallback(() => {
      setUserQueue(filteredUsers);
      history.length > 0 && setHistory([]);
  }, [filteredUsers, history.length])

  // Apply filters whenever the source data or filter settings change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);


  return (
    <div className={cn(
        "flex flex-col h-full",
        `theme-${filters.vibe}`
    )}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-headline font-semibold tracking-tight">
            Discover
          </h1>
          <p className="text-sm text-muted-foreground">
            Find your next vibe. Filters are applied below.
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
      <div className="flex flex-1 items-center justify-center -mx-4">
        <div className="relative w-full max-w-sm h-[60vh] md:h-[70vh]">
          {isLoading ? (
            <Card className="absolute w-full h-full rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-full"/>
            </Card>
          ) : userQueue.length > 0 ? (
             <div className="relative w-full h-full">
              {userQueue.map((user, index) => (
                  <ProfileCard
                    key={user.id}
                    user={user}
                    onSwipe={handleSwipe}
                    isTopCard={index === userQueue.length - 1}
                    style={{ 
                        zIndex: userQueue.length - index,
                        transform: `scale(${1 - ((userQueue.length - 1 - index) * 0.05)}) translateY(${(userQueue.length - 1 - index) * -10}px)`,
                        opacity: (userQueue.length - 1 - index) > 2 ? 0 : 1,
                    }}
                  />
                ))}
            {userQueue.length <= 1 && (
                 <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground p-4 bg-muted rounded-lg -z-10">
                    <div>
                        <p className="text-lg font-semibold">That's everyone for now!</p>
                        <p>You've seen all profiles matching your filters. Why not try adjusting them?</p>
                        <Button onClick={resetDeck} variant="link" className="mt-4">
                            <RotateCw className="mr-2"/>
                            Reset Deck
                        </Button>
                    </div>
                </div>
            )}
             </div>
          ) : (
            <div className="text-center text-muted-foreground p-4 bg-muted rounded-lg">
                <p className="text-lg font-semibold">No More Profiles</p>
                <p>You've seen everyone who matches your criteria. Try expanding your filters!</p>
                <Button onClick={resetDeck} variant="link" className="mt-4">
                    <RotateCw className="mr-2"/>
                    Reset Deck
                </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
