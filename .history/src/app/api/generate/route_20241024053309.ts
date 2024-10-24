// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateText } from '../../../lib/generateText';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  // Validate the prompt
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const responseText = await generateText(prompt);
    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error('Error generating text:', error);
    return res.status(500).json({ error: 'Failed to generate text' });
  }
}
