
"use client";

import { Button } from "@/components/ui/button";
import { suggestPrompt } from "@/ai/flows/suggest-prompt";
import { Wand2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormSchema } from "@/lib/definitions";

const vibeTags = ["Witty", "Deep", "Flirty", "Funny", "Casual"];

type AiPromptPopoverProps = {
  previousInteractions: string;
  children: React.ReactNode;
  onSuggestion: (suggestion: string) => void;
  isDisabled?: boolean;
};

export function AIPromptPopover({ previousInteractions, children, onSuggestion, isDisabled }: AiPromptPopoverProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = FormSchema.safeParse({ vibeTags: selectedVibes });
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await suggestPrompt({ previousInteractions, vibeTags: selectedVibes });
      if (result.suggestedPrompt) {
        onSuggestion(result.suggestedPrompt);
        setOpen(false);
        toast({
          title: "Suggestion Inserted!",
          description: "The Buddy AI prompt has been added to your message.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate suggestion.",
      });
    } finally {
      setIsGenerating(false);
      setSelectedVibes([]);
    }
  };

  const handleCheckboxChange = (tag: string, checked: boolean) => {
      setSelectedVibes(prev => checked ? [...prev, tag] : prev.filter(v => v !== tag));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isDisabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Buddy AI Helper</h4>
            <p className="text-sm text-muted-foreground">
              Select some vibes to generate a conversation starter.
            </p>
          </div>
          <div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {vibeTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`popover-${tag}`}
                    value={tag}
                    checked={selectedVibes.includes(tag)}
                    onCheckedChange={(checked) => handleCheckboxChange(tag, !!checked)}
                  />
                  <Label htmlFor={`popover-${tag}`} className="text-sm font-normal">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Suggest a Prompt"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
