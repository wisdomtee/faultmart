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

      response_format: {
        type: "json_object",
      },

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

You MUST return a JSON object.

The JSON object MUST contain exactly these fields:

{
  "suggestedTitle": "string",
  "improvedDescription": "string",
  "suggestedFaultSeverity": "MINOR | MODERATE | MAJOR | CRITICAL | null",
  "suggestions": ["string"]
}

Do not return markdown.
Do not return code fences.
Do not return explanations outside the JSON object.
Do not return safety labels outside the JSON object.
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

    console.log("AI RAW RESPONSE:", text);

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("AI returned an invalid JSON response.");
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("AI returned an invalid response structure.");
    }

    const result = parsed as Record<string, unknown>;

    if (
      typeof result.suggestedTitle !== "string" ||
      typeof result.improvedDescription !== "string" ||
      !(
        result.suggestedFaultSeverity === null ||
        typeof result.suggestedFaultSeverity === "string"
      ) ||
      !Array.isArray(result.suggestions) ||
      !result.suggestions.every(
        (suggestion) => typeof suggestion === "string"
      )
    ) {
      throw new Error("AI returned an invalid response structure.");
    }

    return {
      suggestedTitle: result.suggestedTitle,
      improvedDescription: result.improvedDescription,
      suggestedFaultSeverity: result.suggestedFaultSeverity,
      suggestions: result.suggestions,
    };
  }
}

export const aiService = new AIService();
