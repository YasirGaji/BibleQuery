// lib/generateText.ts
import axios from 'axios';

const generateText = async (prompt: string, bibleText: string) => {
  try {
    
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, 
        },
      }
    );

    const answer = openaiResponse.data.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error('Error fetching answer:', error);
    throw new Error('Failed to generate text.');
  }
};

export default generateText;
