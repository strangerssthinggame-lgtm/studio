// src/app/actions.ts
"use server";

import { suggestPrompt, SuggestPromptInput } from "@/ai/flows/suggest-prompt";
import { FormSchema, FormState } from "@/lib/definitions";


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
