// lib/generateText.ts
import Openai from './openai';

export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
    });

    // Safely return the text from the response
    return response.choices[0]?.text?.trim() || "No response generated";
  } catch (error) {
    console.error("Error generating text: ", error);
    return "Error occurred while generating text";
  }
}
