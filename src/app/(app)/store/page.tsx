
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/store-data';
import type { Product } from '@/lib/store-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StorePage() {
  const { addToCart, cart, totalPrice } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <div className="flex flex-col h-full gap-6 pb-24">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-headline font-bold tracking-tight">Bondly Store</h1>
            <p className="text-muted-foreground">Get your hands on our exclusive physical card games or create your own.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Link href="/store/create-deck">
                <Card className="flex flex-col overflow-hidden group border-2 border-dashed hover:border-primary/50 transition-colors h-full">
                     <CardContent className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                        <PlusCircle className="w-12 h-12 text-muted-foreground mb-4"/>
                        <CardTitle className="font-headline text-xl mb-2">Create Your Own Deck</CardTitle>
                        <CardDescription className="flex-1">Unleash your creativity and design a custom deck of questions for any occasion.</CardDescription>
                         <Button variant="outline" className="mt-4">
                          Start Creating
                        </Button>
                    </CardContent>
                </Card>
            </Link>

          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden group">
                <Link href={`/store/${product.id}`} className="block">
                  <CardHeader className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={product.aiHint}
                      />
                      <Badge className="absolute top-3 right-3">{product.category}</Badge>
                    </div>
                  </CardHeader>
                </Link>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <Link href={`/store/${product.id}`} className="block">
                    <CardTitle className="font-headline text-xl mb-2 hover:text-primary transition-colors">{product.name}</CardTitle>
                  </Link>
                  <CardDescription className="flex-1">{product.description}</CardDescription>
                </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                  <p className="text-2xl font-bold text-primary">{product.price}</p>
                  <Button onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="mr-2"/>
                      Add to Cart
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div className={cn(
        "fixed bottom-0 left-0 right-0 p-4 flex justify-center transition-transform duration-500 ease-in-out",
        cart.length > 0 ? 'translate-y-0' : 'translate-y-full'
      )}>
        <div className="w-full max-w-lg">
          <Link href="/cart">
            <Card className="bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90 transition-all cursor-pointer animate-in slide-in-from-bottom-10 fade-in-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-foreground/20 rounded-full h-10 w-10 flex items-center justify-center">
                    <ShoppingCart />
                  </div>
                  <div>
                    <p className="font-bold">{totalItems} Item{totalItems > 1 ? 's' : ''}</p>
                    <p className="text-sm font-semibold">${totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">View Cart</p>
                  <ArrowRight />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
