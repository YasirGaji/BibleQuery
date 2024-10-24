// lib/generateText.ts
// import openai from './openai';

import axios from 'axios';

const generateText = async (prompt: string) => {
  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'This is a Bible text.' },
          {
            role: 'user',
            content: `Question: ${prompt}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // This will read from your environment variable
        },
      }
    );

    const answer = openaiResponse.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching answer:', error);
  }
};

export default generateText;
