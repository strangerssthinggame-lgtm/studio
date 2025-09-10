
"use client";

import { Button } from "@/components/ui/button";
import { suggestPrompt } from "@/ai/flows/suggest-prompt";
import { FormSchema } from "@/lib/definitions";
import { Wand2, Copy } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const vibeTags = ["Witty", "Deep", "Flirty", "Funny", "Casual"];

type BuddyAiGeneratorProps = {
  previousInteractions: string;
};

export default function BuddyAiGenerator({ previousInteractions }: BuddyAiGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    if (suggestedPrompt) {
      navigator.clipboard.writeText(suggestedPrompt);
      toast({
        title: "Copied to clipboard!",
        description: "The suggested prompt is now ready to be pasted.",
      });
    }
  };
  
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
    setSuggestedPrompt(null);
    try {
        const result = await suggestPrompt({ previousInteractions, vibeTags: selectedVibes });
        if (result.suggestedPrompt) {
            setSuggestedPrompt(result.suggestedPrompt);
        } else {
             throw new Error("AI did not return a suggestion.");
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to generate suggestion."
        });
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleCheckboxChange = (tag: string, checked: boolean) => {
      setSelectedVibes(prev => checked ? [...prev, tag] : prev.filter(v => v !== tag));
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="font-semibold">Select Vibe Tags:</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {vibeTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox 
                id={tag} 
                value={tag} 
                checked={selectedVibes.includes(tag)}
                onCheckedChange={(checked) => handleCheckboxChange(tag, !!checked)}
              />
              <Label htmlFor={tag} className="text-sm font-normal">
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isGenerating}>
        <Wand2 className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : "Suggest a Prompt"}
      </Button>

      {suggestedPrompt && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold">Suggestion:</p>
          <div className="flex items-center justify-between mt-2 gap-4">
            <p className="text-muted-foreground italic">"{suggestedPrompt}"</p>
            <Button variant="ghost" size="icon" type="button" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy prompt</span>
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
