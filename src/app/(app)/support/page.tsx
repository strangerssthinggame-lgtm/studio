
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LifeBuoy, Mail, Send, HelpCircle } from "lucide-react";
import React from "react";

const faqs = [
  {
    question: "How do I start a game?",
    answer: "You can start a game from the chat screen with a user by clicking the 'Start Game' button. From there, you can choose the game type, deck, and level you'd like to play."
  },
  {
    question: "How do I edit my profile?",
    answer: "Navigate to your profile from the user menu in the top-right corner, then click the 'Edit Profile' button. You can update your photos, bio, interests, and more."
  },
  {
    question: "How does the 'Vibe Check' work?",
    answer: "The Vibe Check is a quick game to see if you and a new match are on the same wavelength. You'll both answer a few questions, and we'll show you how many of your answers match up!"
  },
  {
    question: "Can I use this app to find friends?",
    answer: "Absolutely! The 'Friends' deck in the game selection is specifically designed for platonic connections. You can also filter for 'Friends' in the discovery feed."
  }
];

export default function SupportPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Thanks for reaching out. Our support team will get back to you shortly.",
        });
        e.currentTarget.reset();
    };


  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Support & FAQ
          </h1>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><HelpCircle /> Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Mail /> Contact Us</CardTitle>
          <CardDescription>
            Have a question that's not in the FAQ? Send us a message and we'll be happy to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Trouble logging in" required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Please describe your issue in detail..." rows={6} required/>
            </div>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
