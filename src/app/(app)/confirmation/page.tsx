
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConfirmationContent() {
    // In a real app, you'd fetch order details using an ID from the URL
    // const searchParams = useSearchParams();
    // const orderId = searchParams.get('orderId');

    return (
        <div className="flex flex-col h-full items-center justify-center p-4 gap-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="items-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <CardTitle className="font-headline text-3xl">Order Confirmed!</CardTitle>
                    <CardDescription>Thank you for your purchase. A confirmation email has been sent to you.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <p className="text-muted-foreground">Your order ID is <span className="font-semibold text-foreground">#BONDLY-12345</span>.</p>
                    <div className="w-full space-y-2">
                        <Link href="/store">
                            <Button className="w-full">Continue Shopping</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full">Go to Dashboard</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading confirmation...</div>}>
            <ConfirmationContent />
        </Suspense>
    )
}

