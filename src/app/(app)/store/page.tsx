

'use client';

import Image from 'next/image';
import { products } from '@/lib/store-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

export default function StorePage() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };


  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Bondly Store</h1>
          <p className="text-muted-foreground">Get your hands on our exclusive physical card games.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  objectFit="cover"
                  data-ai-hint={product.aiHint}
                />
                 <Badge className="absolute top-2 right-2">{product.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              <CardTitle className="font-headline text-xl mb-2">{product.name}</CardTitle>
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
  );
}
