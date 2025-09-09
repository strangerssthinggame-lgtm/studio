
'use client';

import { Suspense } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { orders } from '@/lib/order-data';
import type { Order } from '@/lib/order-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Truck, Package, CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

function OrderDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const order: Order | undefined = orders.find((o) => o.id === `#${id}`);

    if (!order) {
        // Since our data is static, we can check for this format.
        // In a real app, you might just check for the existence of the order.
        const orderById = orders.find(o => o.id === id);
        if(!orderById) {
            notFound();
        }
    }
    
    // In case the `#` is missing from the URL param
    const finalOrder = order || orders.find(o => o.id === id || o.id === `#${id}`);
    
    if(!finalOrder) {
        notFound();
    }
    
    const subtotal = finalOrder.items.reduce((acc, item) => acc + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    const shipping = 5.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'Processing': return <Package className="w-5 h-5"/>;
            case 'Shipped': return <Truck className="w-5 h-5"/>;
            case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500"/>;
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="self-start gap-2 text-muted-foreground">
                    <ArrowLeft />
                    Back to Profile
                </Button>
                 <Link href="/support">
                    <Button variant="outline">
                        Help with this order
                    </Button>
                </Link>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Order Details</CardTitle>
                    <CardDescription>Order ID: <span className="font-semibold text-primary">{finalOrder.id}</span></CardDescription>
                    <div className="flex items-center gap-2 pt-2">
                        {getStatusIcon(finalOrder.status)}
                        <span className="font-semibold">{finalOrder.status}</span>
                         <Badge variant={finalOrder.status === 'Delivered' ? 'default' : 'secondary'}
                            className={cn(
                                'ml-auto',
                                finalOrder.status === 'Delivered' && 'bg-green-100 text-green-800',
                                finalOrder.status === 'Processing' && 'bg-amber-100 text-amber-800',
                                finalOrder.status === 'Shipped' && 'bg-blue-100 text-blue-800',
                            )}
                        >
                            {finalOrder.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-4">
                        {finalOrder.items.map(item => (
                            <li key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                        </ul>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4 bg-muted/50 p-6">
                     <h3 className="font-semibold">Price Summary</h3>
                     <div className="w-full space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>${shipping.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Taxes</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}


export default function OrderDetailsPage() {
    return (
        <Suspense fallback={<div>Loading order details...</div>}>
            <OrderDetailsContent />
        </Suspense>
    )
}
