// src/ai/flows/suggest-prompt.ts
'use server';
/**
 * @fileOverview A flow that suggests follow-up conversation prompts based on previous interactions and selected 'vibe' tags.
 *
 * - suggestPrompt - A function that suggests a follow-up prompt.
 * - SuggestPromptInput - The input type for the suggestPrompt function.
 * - SuggestPromptOutput - The return type for the suggestPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPromptInputSchema = z.object({
  previousInteractions: z
    .string()
    .describe('The previous conversation between the users.'),
  vibeTags: z.array(z.string()).describe('The selected vibe tags for the conversation.'),
});
export type SuggestPromptInput = z.infer<typeof SuggestPromptInputSchema>;

const SuggestPromptOutputSchema = z.object({
  suggestedPrompt: z.string().describe('The suggested follow-up prompt.'),
});
export type SuggestPromptOutput = z.infer<typeof SuggestPromptOutputSchema>;

export async function suggestPrompt(input: SuggestPromptInput): Promise<SuggestPromptOutput> {
  return suggestPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptPrompt',
  input: {schema: SuggestPromptInputSchema},
  output: {schema: SuggestPromptOutputSchema},
  prompt: `You are a conversation starter expert. Based on the previous interactions and the selected vibe tags, suggest a follow-up prompt to keep the conversation flowing.\n\nPrevious Interactions: {{{previousInteractions}}}\n\nVibe Tags: {{#each vibeTags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n\nSuggested Prompt:`,
});

const suggestPromptFlow = ai.defineFlow(
  {
    name: 'suggestPromptFlow',
    inputSchema: SuggestPromptInputSchema,
    outputSchema: SuggestPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
