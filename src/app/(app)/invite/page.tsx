
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2 } from "lucide-react";
import QRCode from "react-qr-code";

export default function InvitePage() {
    const [inviteLink, setInviteLink] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        // Ensure this runs only on the client-side
        setInviteLink(window.location.origin);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        toast({
            title: "Link Copied!",
            description: "The invite link has been copied to your clipboard.",
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join me on Bondly!',
                    text: 'Let\'s connect and play some games on Bondly.',
                    url: inviteLink,
                });
            } catch (error) {
                console.error("Error sharing:", error);
                toast({
                    variant: 'destructive',
                    title: "Sharing Failed",
                    description: "Could not open the share dialog.",
                });
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            copyToClipboard();
            toast({
                title: "Sharing not supported",
                description: "Your browser doesn't support direct sharing. The link has been copied to your clipboard instead.",
            });
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Invite a Friend</CardTitle>
                    <CardDescription>Share the link below or let them scan the QR code to join Bondly.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-white rounded-lg border">
                        {inviteLink ? (
                            <QRCode value={inviteLink} size={192} />
                        ) : (
                            <div className="w-48 h-48 bg-muted rounded-md animate-pulse" />
                        )}
                    </div>
                    <div className="w-full space-y-2">
                        <div className="relative flex items-center">
                            <Input value={inviteLink} readOnly className="pr-12 text-muted-foreground" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={copyToClipboard}
                                aria-label="Copy link"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button className="w-full" onClick={handleShare}>
                            <Share2 className="mr-2" />
                            Share Invite Link
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
