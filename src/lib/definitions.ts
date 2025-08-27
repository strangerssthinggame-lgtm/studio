import { z } from "zod";

const VibeTagSchema = z.enum(["Witty", "Deep", "Flirty", "Funny", "Casual"]);
export const FormSchema = z.object({
  vibeTags: z
    .array(VibeTagSchema)
    .min(1, "Please select at least one vibe tag."),
});

export type FormState = {
  message: string;
  suggestedPrompt?: string;
  errors?: {
    vibeTags?: string[];
  };
};
