'use client';

import { useState, FormEvent } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [bibleText, setBibleText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!bibleText) {
      setResult('Please upload a Bible PDF first.');
      return;
    }


    try {
      const responseText = await generateText(prompt, bibleText);
      const data = await responseText.json();
      setResult(data.answer);
    } catch (error) {
      console.error('Error generating text:', error);
    }
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      // Extract text from PDF using pdf-lib
      const extractedText = await extractTextFromPDF(uploadedFile);
      setBibleText(extractedText);
    }
  };

  // Function to extract text from the uploaded PDF using pdf-lib
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    let extractedText = '';
    for (const page of pages) {
      const textContent = await page.getTextContent(); // Extract text from each page
      extractedText += textContent.items.map((item) => item.str).join(' ') + ' ';
    }

    return extractedText;
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
'use client';

import { useState, FormEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import generateText from '@/lib/generateText';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [bibleText, setBibleText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!bibleText) {
      setResult('Please upload a Bible PDF first.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, bibleText }),
      });
      const data = await response.json();
      setResult(data.answer);
    } catch (error) {
      console.error('Error:', error);
      setResult('Error occurred while generating text');
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      // Extract text from PDF using pdf-lib
      const extractedText = await extractTextFromPDF(uploadedFile);
      setBibleText(extractedText);
    }
  };

  // Function to extract text from the uploaded PDF using pdf-lib
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    let extractedText = '';
    for (const page of pages) {
      const textContent = await page.getTextContent(); // Extract text from each page
      extractedText += textContent.items.map((item) => item.str).join(' ') + ' ';
    }

    return extractedText;
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
