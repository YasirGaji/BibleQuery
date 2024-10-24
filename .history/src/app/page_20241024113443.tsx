'use client';

import { useState, FormEvent } from 'react';
import generateText from '@/lib/generateText';
import pdfParse from 'pdf-parse';

const handler = async (prompt: string, bibleText: string) => {
  try {
    // Generate a response using OpenAI with the Bible text as context
    const responseText = await generateText(prompt, bibleText);
    return responseText;
  } catch (error) {
    console.error('Error generating text:', error);
    return 'Error occurred while generating text';
  }
};

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [bibleText, setBibleText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!bibleText) {
        setResult('Please upload a Bible PDF first.');
        return;
      }

      const response = await handler(prompt, bibleText);
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
      setResult('Error occurred while generating text');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const fileText = await extractTextFromPDF(uploadedFile);
      setBibleText(fileText);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const text = await pdfParse(Buffer.from(arrayBuffer));
    return text.text; // pdfParse returns an object with a 'text' property containing the extracted text.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black-100">
      <h1 className="text-4xl font-bold mb-8">OpenAI Bible Q&A</h1>
      
      {/* File Upload Section */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="mb-4"
      />
      
      {file && <p className="mb-4">Uploaded: {file.name}</p>}
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          className="w-full p-4 mb-4 border border-black-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Ask a question about the Bible..."
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Generate
        </button>
      </form>

      {result && (
        <div className="w-full max-w-md mt-8 p-4 bg-black rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
