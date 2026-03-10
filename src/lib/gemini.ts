import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

export interface ImagePrompt {
  prompt_id: string;
  refined_prompt: string;
  suggested_style: string;
}

export async function expandPrompt(keyword: string, apiKey: string): Promise<ImagePrompt[]> {
  // If the user hasn't provided an API key in the vault, we might fall back or throw
  if (!apiKey || apiKey.trim() === "" || apiKey === "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    console.warn("No valid Gemini API key found. Using mock fallback prompts.");
    return Array.from({ length: 1 }).map((_, i) => ({
      prompt_id: `mock-${i + 1}`,
      refined_prompt: `Cinematic photorealistic shot of ${keyword}, variation ${i + 1}, dramatic lighting, 8k resolution, highly detailed`,
      suggested_style: "cinematic"
    }));
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Using strict structured output for Gemini
    const schema: Schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          prompt_id: { type: SchemaType.STRING },
          refined_prompt: { type: SchemaType.STRING },
          suggested_style: { type: SchemaType.STRING }
        },
        required: ["prompt_id", "refined_prompt", "suggested_style"]
      },
      description: "An array of 10 highly detailed, cinematic image generation prompts based on the core concept."
    };

    const promptText = `You are an expert AI stock photography prompt engineer. Take the following keyword/concept and expand it into 10 unique, highly detailed, photorealistic, and cinematic prompts suitable for an image generator like Imagen or Midjourney. Make sure to describe lighting, camera angle, subject, and atmosphere. Keyword: "${keyword}"`;

    const url = `https://generativelanguage.googleapis.com/v1alpha/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Prompt API failed: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No text returned from Gemini Prompt API");
    
    const prompts = JSON.parse(text) as ImagePrompt[];
    return prompts;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if the real API fails (e.g. invalid key or network issue)
    return Array.from({ length: 10 }).map((_, i) => ({
      prompt_id: `fallback-${i + 1}`,
      refined_prompt: `${keyword} - fallback variation ${i + 1}`,
      suggested_style: "photorealistic"
    }));
  }
}

export async function generateImageGemini(prompt: string, modelUsed: string, apiKey: string): Promise<string> {
  console.log(`DISPATCH: Generating image with Gemini (${modelUsed}) for prompt: "${prompt.slice(0, 30)}..."`);

  if (!apiKey || apiKey.trim() === "" || apiKey === "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    const seed = encodeURIComponent(prompt.trim().replace(/\s+/g, '-')).slice(0, 30) + Math.random().toString(36).substring(7);
    return `https://picsum.photos/seed/${seed}/1024/576`;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1alpha/models/${modelUsed}:predict?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { 
          sampleCount: 1, 
          aspectRatio: "16:9",
          outputOptions: { mimeType: "image/jpeg" } 
        }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini Imagen Error Output:", text);
      throw new Error(`Gemini Imagen API failed: ${response.statusText}`);
    }

    const data = await response.json();
    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (b64) {
      return `data:image/jpeg;base64,${b64}`;
    } else {
      console.error("No image returned from Gemini Imagen format:", data);
      throw new Error("No image data returned from Gemini Imagen API.");
    }
  } catch (err) {
    console.error("Gemini Imagen Error:", err);
    console.log("Falling back to placeholder image...");
    const seed = encodeURIComponent(prompt.trim().replace(/\s+/g, '-')).slice(0, 30) + Math.random().toString(36).substring(7);
    return `https://picsum.photos/seed/${seed}/1024/576`;
  }
}
