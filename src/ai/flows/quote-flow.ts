'use server';
/**
 * @fileOverview A Genkit flow to generate a motivational quote.
 *
 * - getMotivationalQuote - Generates a motivational quote for a student.
 * - MotivationalQuoteOutput - The return type for the getMotivationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalQuoteOutputSchema = z.object({
  quote: z.string().describe("A short, inspiring motivational quote for a student."),
});
export type MotivationalQuoteOutput = z.infer<typeof MotivationalQuoteOutputSchema>;

export async function getMotivationalQuote(): Promise<MotivationalQuoteOutput> {
  return quoteFlow();
}

const quotePrompt = ai.definePrompt({
    name: 'motivationalQuotePrompt',
    output: { schema: MotivationalQuoteOutputSchema },
    prompt: `Generate a short, inspiring motivational quote suitable for a college student who might be stressed about their attendance or studies. The quote should be encouraging and positive.`,
});


const quoteFlow = ai.defineFlow(
  {
    name: 'quoteFlow',
    outputSchema: MotivationalQuoteOutputSchema,
  },
  async () => {
    const {output} = await quotePrompt();
    return output!;
  }
);
