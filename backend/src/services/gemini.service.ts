import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ScanResult } from "@zhimiry/shared";

function parseScanJson(raw: string): ScanResult {
  let text = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(text);
  if (fence) {
    text = fence[1].trim();
  }
  const parsed = JSON.parse(text) as ScanResult;
  return parsed;
}

export async function analyzeImage(imageBuffer: Buffer, mimeType: string): Promise<ScanResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this image and identify the item for recycling purposes.
    Return ONLY a valid JSON object with no markdown, no explanation:
    {
      "materialName": "specific material name and type e.g. Plastic Bottle (PET #1)",
      "description": "2-3 sentences about the material composition",
      "disposalMethod": "recycle" | "compost" | "trash" | "special",
      "disposalNotes": "specific handling or disposal instructions",
      "confidence": 0.0 to 1.0
    }
    disposalMethod must be exactly one of: recycle, compost, trash, special.
    special = hazardous waste or e-waste requiring special handling.
  `;

  const base64 = imageBuffer.toString("base64");

  const result = await model.generateContent([
    { inlineData: { data: base64, mimeType } },
    prompt,
  ]);

  const raw = result.response.text().trim();
  return parseScanJson(raw);
}
