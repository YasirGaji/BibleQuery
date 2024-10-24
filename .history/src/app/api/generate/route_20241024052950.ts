// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateText } from '../../../lib/generateText';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const responseText = await generateText(prompt);

  res.status(200).json({ text: responseText });
}
