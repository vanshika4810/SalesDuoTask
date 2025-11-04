import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateOptimizedListing(original, asin) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an Amazon listing optimization expert.

ASIN: ${asin}

Original Product Data:
Title: ${original.title}
Bullets: ${original.bullets.join("\n")}
Description: ${original.description}

Please generate:
1. Optimized Title — keyword-rich and clear.
2. 5 concise bullet points highlighting benefits and features.
3. A persuasive product description (≤ 300 words).
4. 4–6 relevant keyword phrases for SEO.

Important guidelines:
- Do NOT use any emojis, special characters, or decorative symbols.
- Do NOT use markdown formatting (no **bold**, _italics_, or lists with asterisks).
- Output clean plain text only.
- Return ONLY valid JSON with no extra commentary, explanation, or formatting.

Return the response strictly in this format:

{
  "optimized_title": "...",
  "optimized_bullets": ["...", "...", "...", "...", "..."],
  "optimized_description": "...",
  "keywords": ["...", "...", "..."]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in model response");
    const data = JSON.parse(jsonMatch[0]);
    return data;
  } catch (err) {
    console.error("Error parsing Gemini response:", err.message);
    return { error: "Invalid AI response" };
  }
}
