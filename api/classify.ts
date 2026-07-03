import { GoogleGenAI, Type } from "@google/genai";

// Vercel serverless function config — allow up to 15mb body (for base64 images)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "15mb",
    },
  },
};

const systemInstruction = `You are a playful waste-segregation learning assistant for parents and children.
Your goal is to classify the waste item in the image into one of three categories:
1. "Wet/Biodegradable" (organic food waste, flowers, paper towels, banana peels, apple cores, leftover food, etc.)
2. "Dry/Recyclable" (clean paper, cardboard, plastics, metals, glass, clean dry clothes, newspaper, polythene bags, containers)
3. "Hazardous" (batteries, electronic waste, chemicals, medicines, lightbulbs, medical waste)

Identify the specific item type (e.g. "newspaper", "plastic bottle", "polythene bag", "old clothes", "battery", "apple core", "banana peel", etc.).
Keep the kid_reason warm, extremely kid-friendly, encouraging, and simple (aimed at a 5-10 year old). Use encouraging language.
Keep the disposal_tip clear, practical, and action-oriented for the parent (e.g. "Flatten cardboard boxes to save space in the recycle bin!").
Output MUST be in structured JSON format matching the schema provided.`;

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, mimeType } = req.body;
    if (!image || !mimeType) {
      return res.status(400).json({ error: "Missing image or mimeType" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(500).json({
        error:
          "Gemini API key is not configured. Please set GEMINI_API_KEY in your Vercel environment variables.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
      },
    });

    const base64Data = image.split(",")[1] || image;

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let response = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting classification with model: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType } },
              {
                text: "Analyze this image of a household item/waste and classify it according to the schema.",
              },
            ],
          },
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description:
                    "Must be exactly 'Wet/Biodegradable', 'Dry/Recyclable', or 'Hazardous'",
                },
                item_name: {
                  type: Type.STRING,
                  description:
                    "The identified name of the item, e.g. 'plastic bottle' or 'banana peel'",
                },
                kid_reason: {
                  type: Type.STRING,
                  description:
                    "A fun, kid-friendly sentence explaining why it belongs in this category. Include emojis!",
                },
                disposal_tip: {
                  type: Type.STRING,
                  description:
                    "One clear practical disposal tip for the parent/child to execute together.",
                },
              },
              required: ["category", "item_name", "kid_reason", "disposal_tip"],
            },
          },
        });

        if (response && response.text && response.text.trim().length > 0) {
          break; // Success!
        }
      } catch (err: any) {
        console.warn(
          `Model ${modelName} failed or overloaded:`,
          err.message || err
        );
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    if (!response || !response.text || response.text.trim().length === 0) {
      throw (
        lastError ||
        new Error(
          "All available classification models are currently busy or returned an empty response."
        )
      );
    }

    const textResult = response.text.trim();

    let parsedData;
    try {
      parsedData = JSON.parse(textResult);
    } catch {
      // Strip markdown code block wrappers if any
      let cleaned = textResult;
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s+/i, "");
        cleaned = cleaned.replace(/\s+```$/, "");
        cleaned = cleaned.trim();
      }
      try {
        parsedData = JSON.parse(cleaned);
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          parsedData = JSON.parse(match[0]);
        } else {
          throw new Error(`Invalid JSON format in model response: ${textResult}`);
        }
      }
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/classify:", error);
    return res
      .status(500)
      .json({ error: error.message || "An error occurred during classification." });
  }
}
