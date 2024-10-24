import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const result = await generateText(prompt);
    return NextResponse.json({ text: result });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}