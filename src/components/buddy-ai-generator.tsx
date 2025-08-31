"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { getSuggestedPrompt } from "@/app/actions";
import { FormState } from "@/lib/definitions";
import { Wand2, Copy } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const vibeTags = ["Witty", "Deep", "Flirty", "Funny", "Casual"];

type BuddyAiGeneratorProps = {
  previousInteractions: string;
};

export default function BuddyAiGenerator({ previousInteractions }: BuddyAiGeneratorProps) {
  const initialState: FormState = { message: "" };
  const getSuggestedPromptWithPrevInteractions = getSuggestedPrompt.bind(null, { previousInteractions });
  const [state, formAction] = useFormState(getSuggestedPromptWithPrevInteractions, initialState);
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    if (state.suggestedPrompt) {
      navigator.clipboard.writeText(state.suggestedPrompt);
      toast({
        title: "Copied to clipboard!",
        description: "The suggested prompt is now ready to be pasted.",
      });
    }
  };

  useEffect(() => {
    if (state.message && state.message !== "Suggestion generated successfully." && state.message !== "") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label className="font-semibold">Select Vibe Tags:</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {vibeTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox id={tag} name="vibeTags" value={tag} />
              <Label htmlFor={tag} className="text-sm font-normal">
                {tag}
              </Label>
            </div>
          ))}
        </div>
        {state.errors?.vibeTags && (
            <p className="text-sm font-medium text-destructive mt-2">{state.errors.vibeTags}</p>
        )}
      </div>

      <Button type="submit">
        <Wand2 className="mr-2 h-4 w-4" />
        Suggest a Prompt
      </Button>

      {state.suggestedPrompt && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold">Suggestion:</p>
          <div className="flex items-center justify-between mt-2 gap-4">
            <p className="text-muted-foreground italic">"{state.suggestedPrompt}"</p>
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
