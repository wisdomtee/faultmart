import OpenAI from "openai";

import { env } from "../../config/env";

const openrouter = new OpenAI({
  apiKey: env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "FaultMart",
  },
});

class AIService {
  async generateListingAssistant(data: {
    title?: string;
    description?: string;
    category?: string;
    condition?: string;
    faultSeverity?: string;
    faultDescription?: string;
  }) {
    const response = await openrouter.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: `
You are FaultMart's AI Listing Assistant.

FaultMart is a marketplace for faulty, used, refurbished,
repairable and other second-life vehicles, appliances,
electronics and related products.

Your job is to help sellers create clearer and more honest
marketplace listings.

Rules:
- Never invent facts about the product.
- Never claim a technical diagnosis from limited information.
- Do not exaggerate the condition or value.
- Preserve facts supplied by the seller.
- Point out useful information that appears to be missing.
- Make descriptions clear, concise and buyer-friendly.
- If the fault severity is supplied, do not arbitrarily change it.
- If information is insufficient to determine something,
  say that more information is needed.

Return ONLY valid JSON with this exact structure:

{
  "suggestedTitle": "string",
  "improvedDescription": "string",
  "suggestedFaultSeverity": "MINOR | MODERATE | MAJOR | CRITICAL | null",
  "suggestions": ["string"]
}
          `.trim(),
        },
        {
          role: "user",
          content: JSON.stringify(data),
        },
      ],
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    try {
      return JSON.parse(text);
    } catch {
      console.error("AI RAW RESPONSE:", text);
      throw new Error("AI returned an invalid response.");
    }
  }
}

export const aiService = new AIService();
