
"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { getSuggestedPrompt } from "@/app/actions";
import { FormState } from "@/lib/definitions";
import { Wand2, Copy } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";


const vibeTags = ["Witty", "Deep", "Flirty", "Funny", "Casual"];

type AiPromptPopoverProps = {
  previousInteractions: string;
  children: React.ReactNode;
  onSuggestion: (suggestion: string) => void;
  isDisabled?: boolean;
};

export function AIPromptPopover({ previousInteractions, children, onSuggestion, isDisabled }: AiPromptPopoverProps) {
  const [open, setOpen] = useState(false);
  const initialState: FormState = { message: "" };
  const getSuggestedPromptWithPrevInteractions = getSuggestedPrompt.bind(null, { previousInteractions });
  const [state, formAction] = useFormState(getSuggestedPromptWithPrevInteractions, initialState);
  const { toast } = useToast();
  
  const handleSuggestion = () => {
    if (state.suggestedPrompt) {
      onSuggestion(state.suggestedPrompt);
      setOpen(false);
      toast({
        title: "Suggestion Inserted!",
        description: "The AI prompt has been added to your message.",
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
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={isDisabled}>
            {children}
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">AI Prompt Helper</h4>
                    <p className="text-sm text-muted-foreground">
                        Select some vibes to generate a conversation starter.
                    </p>
                </div>
                <div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                    {vibeTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                        <Checkbox id={`popover-${tag}`} name="vibeTags" value={tag} />
                        <Label htmlFor={`popover-${tag}`} className="text-sm font-normal">
                            {tag}
                        </Label>
                        </div>
                    ))}
                    </div>
                    {state.errors?.vibeTags && (
                        <p className="text-sm font-medium text-destructive mt-2">{state.errors.vibeTags}</p>
                    )}
                </div>

                <Button type="submit" className="w-full">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Suggest a Prompt
                </Button>

                {state.suggestedPrompt && (
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="font-semibold">Suggestion:</p>
                        <p className="text-muted-foreground italic my-2">"{state.suggestedPrompt}"</p>
                         <Button type="button" onClick={handleSuggestion} className="w-full">Insert Suggestion</Button>
                    </div>
                )}
            </form>
        </PopoverContent>
    </Popover>
  );
}

    