// pages/api/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, bibleText } = req.body;

  try {
    // Combine the Bible text and user's question for context
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that answers questions based on the provided Bible text.' },
          {
            role: 'user',
            content: `Here is some Bible text:\n${bibleText}\n\nQuestion: ${prompt}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // OpenAI API key
        },
      }
    );

    const answer = openaiResponse.data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error fetching answer:', error);
    res.status(500).json({ message: 'Error generating text' });
  }
}
