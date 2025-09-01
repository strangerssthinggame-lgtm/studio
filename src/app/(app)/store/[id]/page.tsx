
'use client';

import { Suspense } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/store-data';
import type { Product } from '@/lib/store-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

function ProductDetailPageContent() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { addToCart } = useCart();
    const { toast } = useToast();

    const product: Product | undefined = products.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    const handleAddToCart = () => {
        addToCart(product);
        toast({
            title: 'Added to Cart',
            description: `${product.name} has been added to your cart.`,
        });
    };

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

    return (
        <div className="flex flex-col gap-8">
            <Button variant="ghost" onClick={() => router.back()} className="self-start gap-2">
                <ArrowLeft />
                Back to Store
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="overflow-hidden">
                    <div className="relative aspect-square">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={product.aiHint}
                        />
                    </div>
                </Card>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Badge variant="secondary" className="w-fit">{product.category}</Badge>
                        <h1 className="text-4xl font-headline font-bold">{product.name}</h1>
                        <p className="text-3xl font-bold text-primary">{product.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            <Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star className="text-muted-foreground" fill="currentColor"/>
                        </div>
                        <span className="text-muted-foreground text-sm">(123 reviews)</span>
                    </div>
                    
                    <p className="text-muted-foreground text-lg">{product.description}</p>
                    
                    <Button onClick={handleAddToCart} size="lg" className="h-12 text-lg">
                        <ShoppingCart className="mr-2" />
                        Add to Cart
                    </Button>
                </div>
            </div>
            
            <Separator />

            <div>
                <h2 className="text-2xl font-headline font-bold mb-4">You Might Also Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedProducts.map((relatedProduct) => (
                         <Card key={relatedProduct.id} className="flex flex-col overflow-hidden group">
                            <Link href={`/store/${relatedProduct.id}`}>
                                <CardHeader className="p-0">
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            data-ai-hint={relatedProduct.aiHint}
                                        />
                                    </div>
                                </CardHeader>
                            </Link>
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <Link href={`/store/${relatedProduct.id}`}>
                                    <CardTitle className="font-headline text-lg mb-2 hover:text-primary">{relatedProduct.name}</CardTitle>
                                </Link>
                                <CardDescription className="flex-1">{relatedProduct.description.substring(0, 80)}...</CardDescription>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex justify-between items-center">
                                <p className="text-xl font-bold text-primary">{relatedProduct.price}</p>
                                <Button variant="outline" size="sm" onClick={() => router.push(`/store/${relatedProduct.id}`)}>
                                    <Eye className="mr-2"/>
                                    View
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailPage() {
    return (
        <Suspense fallback={<div>Loading product...</div>}>
            <ProductDetailPageContent />
        </Suspense>
    )
}
