
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, CreditCard, Lock, Check } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    clearCart();
    router.push('/confirmation');
  };
  
  if (cart.length === 0 && currentStep !== 3) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-2xl font-bold">Your cart is empty.</h1>
            <p>You can't proceed to checkout without any items.</p>
            <Link href="/store"><Button>Go to Store</Button></Link>
        </div>
      )
  }

  const tax = totalPrice * 0.08;
  const shipping = 5.00;
  const finalTotal = totalPrice + tax + shipping;

  return (
    <div className="max-w-4xl mx-auto">
        <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft />
            Back to Cart
        </Link>
        <h1 className="text-3xl font-headline font-bold tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="lg:order-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                        {cart.map(item => (
                            <li key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                                        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{item.quantity}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">${parseFloat(item.price.replace('$', '')).toFixed(2)}</p>
                                    </div>
                                </div>
                                <p className="font-medium">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                        </ul>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
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
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:order-1">
                <form onSubmit={handleSubmit}>
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xl font-semibold">Shipping Information</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                               <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" required />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" required />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input id="zip" required />
                                    </div>
                                </div>
                                 <Button onClick={() => setCurrentStep(2)} className="w-full">Continue to Payment</Button>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                            <AccordionTrigger className="text-xl font-semibold">Payment Details</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <div className="relative">
                                        <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input id="expiry" placeholder="MM/YY" required />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 text-lg">
                                    <Lock className="mr-2"/>
                                    Pay ${finalTotal.toFixed(2)}
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </form>
            </div>
        </div>
    </div>
  );
}
