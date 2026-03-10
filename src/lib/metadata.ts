import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ImageMetadata {
  title: string;
  keywords: string[];
}

export async function generatePhotoMetadata(prompt: string, apiKey: string): Promise<ImageMetadata> {
  if (!apiKey || apiKey.trim() === "" || apiKey === "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return {
      title: "Mock Title for Stock Photo",
      keywords: ["mock", "keyword", "stock", "photo", "fallback", "test"].concat(Array(44).fill("extra-kw"))
    };
  }

  const promptText = `Based on this image generation prompt: "${prompt}", 
  generate a highly descriptive, SEO-friendly English title (max 200 chars) 
  and exactly 50 relevant keywords for a stock photo website. 
  Return as JSON with formatting: { "title": "...", "keywords": ["kw1", "kw2"] }.`;

  const url = `https://generativelanguage.googleapis.com/v1alpha/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) throw new Error(`Metadata API failed: ${response.statusText}`);
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No metadata returned");

  return JSON.parse(text) as ImageMetadata;
}
