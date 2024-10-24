'use client';


import { useState, FormEvent } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.text) {
      setResult(data.text);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black-100">
      <h1 className="text-4xl font-bold mb-8">OpenAI Next.js App</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          className="w-full p-4 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Enter your prompt here..."
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Generate
        </button>
      </form>
      {result && (
        <div className="w-full max-w-md mt-8 p-4 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}