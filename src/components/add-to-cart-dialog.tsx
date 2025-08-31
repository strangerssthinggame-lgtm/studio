
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingCart } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/store-data";
import Link from "next/link";
import { DialogClose } from "@radix-ui/react-dialog";


type AddToCartDialogProps = {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function AddToCartDialog({ product, open, onOpenChange }: AddToCartDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                <CheckCircle className="h-5 w-5"/>
                Added to Cart
            </div>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
            <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-md"
            />
            <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-muted-foreground">{product.price}</p>
            </div>
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
           <DialogClose asChild>
                <Link href="/cart" className="w-full">
                    <Button className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        View Cart & Checkout
                    </Button>
                </Link>
           </DialogClose>
           <DialogClose asChild>
                <Button variant="outline" className="w-full">Continue Shopping</Button>
           </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
