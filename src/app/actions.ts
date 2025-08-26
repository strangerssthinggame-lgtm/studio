// src/app/actions.ts
"use server";

import { suggestPrompt, SuggestPromptInput } from "@/ai/flows/suggest-prompt";
import { z } from "zod";

const VibeTagSchema = z.enum(["Witty", "Deep", "Flirty", "Funny", "Casual"]);
export const FormSchema = z.object({
  vibeTags: z.array(VibeTagSchema).min(1, "Please select at least one vibe tag."),
});

export type FormState = {
  message: string;
  suggestedPrompt?: string;
  errors?: {
    vibeTags?: string[];
  };
};

export async function getSuggestedPrompt(
  input: SuggestPromptInput,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    vibeTags: formData.getAll("vibeTags"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await suggestPrompt({
      previousInteractions: input.previousInteractions,
      vibeTags: validatedFields.data.vibeTags,
    });
    return {
      message: "Suggestion generated successfully.",
      suggestedPrompt: result.suggestedPrompt,
    };
  } catch (error) {
    return {
      message: "An error occurred while generating the suggestion.",
    };
  }
}
