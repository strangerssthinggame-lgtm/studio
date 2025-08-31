

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  MessageSquare,
  Search,
  Users,
  WandSparkles,
  User,
  LogOut,
  Settings,
  Share2,
  LifeBuoy,
  ShoppingCart,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { CartProvider, useCart } from "@/hooks/use-cart";

const AppLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/');
    } catch (error) {
        console.error('Error signing out: ', error);
    }
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    if(query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Feed" },
    { href: "/chat", icon: MessageSquare, label: "Chats", badge: 3 },
    { href: "/store", icon: ShoppingCart, label: "Store" },
    { href: "/notifications", icon: Bell, label: "Notifications", badge: 5 },
    { href: "/invite", icon: Share2, label: "Invite Friends" },
    { href: "/dashboard/ai-prompts", icon: WandSparkles, label: "AI Prompts" },
  ];

  if (loading) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block p-4">
                <Skeleton className="h-[60px] w-full mb-4" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                   <Skeleton className="h-8 w-full" />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-transparent">
                    <Skeleton className="h-full w-full"/>
                </main>
            </div>
        </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                  <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
                      </linearGradient>
                  </defs>
                  <path 
                      fill="url(#logoGradient)"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6.45C10.42 5.06 8.36 4.5 6.75 5.25c-2.32 1.09-3.43 3.99-2.58 6.38 1.15 3.23 4.28 5.37 7.83 5.37s6.68-2.14 7.83-5.37c.85-2.39-.26-5.29-2.58-6.38-1.61-.75-3.67-.19-5.25 1.2z"
                  />
                  <path
                      fill="white"
                      d="M12 11.23c-.78-1.1-2.25-1.55-3.5-1.12-1.39.49-2.07 2.22-1.5 3.5.67 1.77 2.37 2.94 4.33 2.94s3.66-1.17 4.33-2.94c.57-1.28-.11-3.01-1.5-3.5-1.25-.43-2.72.02-3.5 1.12z"
                  />
              </svg>
              <span className="">Bondly</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      isActive
                        ? "bg-muted text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    {link.badge && (
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                </svg>
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                    <defs>
                      <linearGradient id="logoGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
                      </linearGradient>
                  </defs>
                  <path 
                      fill="url(#logoGradientMobile)"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6.45C10.42 5.06 8.36 4.5 6.75 5.25c-2.32 1.09-3.43 3.99-2.58 6.38 1.15 3.23 4.28 5.37 7.83 5.37s6.68-2.14 7.83-5.37c.85-2.39-.26-5.29-2.58-6.38-1.61-.75-3.67-.19-5.25 1.2z"
                  />
                  <path
                      fill="white"
                      d="M12 11.23c-.78-1.1-2.25-1.55-3.5-1.12-1.39.49-2.07 2.22-1.5 3.5.67 1.77 2.37 2.94 4.33 2.94s3.66-1.17 4.33-2.94c.57-1.28-.11-3.01-1.5-3.5-1.25-.43-2.72.02-3.5 1.12z"
                  />
                 </svg>
                  <span className="font-headline">Bondly</span>
                </Link>
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2",
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                      {link.badge && (
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search users..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
                <ShoppingCart/>
                <span className="sr-only">Open cart</span>
            </Button>
            {cart.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0" variant="destructive">{cart.length}</Badge>
            )}
          </Link>
          <Link href="/notifications">
            <Button variant="ghost" size="icon">
                <Bell/>
                <span className="sr-only">Toggle notifications</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100"} alt="User avatar" data-ai-hint="profile avatar" />
                  <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
      <AuthProvider>
        <CartProvider>
          <AppLayoutContent>{children}</AppLayoutContent>
        </CartProvider>
      </AuthProvider>
    )
}
