
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/order-data";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrderHistory() {
  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                            className={cn(
                                order.status === 'Delivered' && 'bg-green-100 text-green-800',
                                order.status === 'Processing' && 'bg-amber-100 text-amber-800',
                                order.status === 'Shipped' && 'bg-blue-100 text-blue-800',
                            )}
                        >
                            {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                    <TableCell className="text-right">
                        <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4"/>
                            </Button>
                        </Link>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
