import express from "express";
import path from "path";
import http from "http";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const httpServer = http.createServer(app);

  // Body parsers with size limit
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API route for classification
  app.post("/api/classify", async (req, res) => {
    try {
      const { image, mimeType } = req.body;
      if (!image || !mimeType) {
        return res.status(400).json({ error: "Missing image or mimeType" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(500).json({
          error: "Gemini API key is not configured. Please set the GEMINI_API_KEY secret in Settings > Secrets."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const base64Data = image.split(",")[1] || image;

      const systemInstruction = `You are a playful waste-segregation learning assistant for parents and children.
Your goal is to classify the waste item in the image into one of three categories:
1. "Wet/Biodegradable" (organic food waste, flowers, paper towels, banana peels, apple cores, leftover food, etc.)
2. "Dry/Recyclable" (clean paper, cardboard, plastics, metals, glass, clean dry clothes, newspaper, polythene bags, containers)
3. "Hazardous" (batteries, electronic waste, chemicals, medicines, lightbulbs, medical waste)

Identify the specific item type (e.g. "newspaper", "plastic bottle", "polythene bag", "old clothes", "battery", "apple core", "banana peel", etc.).
Keep the kid_reason warm, extremely kid-friendly, encouraging, and simple (aimed at a 5-10 year old). Use encouraging language.
Keep the disposal_tip clear, practical, and action-oriented for the parent (e.g. "Flatten cardboard boxes to save space in the recycle bin!").
Output MUST be in structured JSON format matching the schema provided.`;

      // Fallback list of models in case one is overloaded. We try gemini-3.5-flash first, and fallback to gemini-3.1-flash-lite.
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
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                  }
                },
                {
                  text: "Analyze this image of a household item/waste and classify it according to the schema."
                }
              ]
            },
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "Must be exactly 'Wet/Biodegradable', 'Dry/Recyclable', or 'Hazardous'"
                  },
                  item_name: {
                    type: Type.STRING,
                    description: "The identified name of the item, e.g. 'plastic bottle' or 'banana peel'"
                  },
                  kid_reason: {
                    type: Type.STRING,
                    description: "A fun, kid-friendly sentence explaining why it belongs in this category. Include emojis!"
                  },
                  disposal_tip: {
                    type: Type.STRING,
                    description: "One clear practical disposal tip for the parent/child to execute together."
                  }
                },
                required: ["category", "item_name", "kid_reason", "disposal_tip"]
              }
            }
          });

          if (response && response.text && response.text.trim().length > 0) {
            break; // Success!
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed or overloaded:`, err.message || err);
          lastError = err;
          // Short delay before trying fallback model
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      if (!response || !response.text || response.text.trim().length === 0) {
        throw lastError || new Error("All available classification models are currently busy or returned an empty response.");
      }

      const textResult = response.text.trim();
      console.log("Raw response text from Gemini API:", textResult);

      let parsedData;
      try {
        parsedData = JSON.parse(textResult);
      } catch (parseErr) {
        console.warn("Standard JSON parse failed. Attempting to clean markdown format and extract JSON.");
        
        // Strip markdown code block wrappers if any
        let cleaned = textResult;
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```(?:json)?\s+/i, "");
          cleaned = cleaned.replace(/\s+```$/, "");
          cleaned = cleaned.trim();
        }

        try {
          parsedData = JSON.parse(cleaned);
        } catch (secondParseErr) {
          // Try extracting the first matching JSON object using regex
          const jsonRegex = /\{[\s\S]*\}/;
          const match = cleaned.match(jsonRegex);
          if (match) {
            try {
              parsedData = JSON.parse(match[0]);
            } catch (regexErr) {
              console.error("Regex extracted JSON parsing failed:", regexErr);
              throw new Error(`Failed to parse response: ${textResult}`);
            }
          } else {
            throw new Error(`Invalid JSON format in model response: ${textResult}`);
          }
        }
      }

      return res.json(parsedData);
    } catch (error: any) {
      console.error("Error in /api/classify:", error);
      return res.status(500).json({ error: error.message || "An error occurred during classification." });
    }
  });

  // API route for manual fallback or sandbox if the user doesn't have an API key or wants demo items
  app.get("/api/demo-items", (req, res) => {
    res.json([
      {
        category: "Dry/Recyclable",
        item_name: "newspaper",
        kid_reason: "Newspapers can be made into fresh new notebooks! 📚 So they love to go into the blue Dry waste bin!",
        disposal_tip: "Bundle them neatly or fold them flat before putting them away."
      },
      {
        category: "Wet/Biodegradable",
        item_name: "banana peel",
        kid_reason: "This banana skin turns into super rich food for worms and soil! 🍌 Worms go nom nom nom in the green Wet waste bin!",
        disposal_tip: "Compost it at home or toss it in your organic waste bin."
      },
      {
        category: "Hazardous",
        item_name: "battery",
        kid_reason: "Whoa! Batteries have special power juice inside that can be dangerous if it leaks ⚡! They need special care in the red Hazardous bin!",
        disposal_tip: "Put tape on the metal ends and drop them at an e-waste recycling box at the store."
      },
      {
        category: "Dry/Recyclable",
        item_name: "polythene bag",
        kid_reason: "Plastic bags can float away like ghosts! 👻 We must collect them dry so they can be recycled into cool plastic boards!",
        disposal_tip: "Stuff all small bags inside one larger bag to keep them contained."
      },
      {
        category: "Dry/Recyclable",
        item_name: "old clothes",
        kid_reason: "These clothes are dry and can be shared or made into neat rags! 👕 They stay clean in dry sorting!",
        disposal_tip: "Don't throw them in regular trash! Drop them at a clothes donation point if they are still wearable."
      },
      {
        category: "Wet/Biodegradable",
        item_name: "apple core",
        kid_reason: "Plants love when apple leftovers turn back into beautiful dirt! 🍎 Happy plants grow from wet compost!",
        disposal_tip: "Keep food waste free from plastic bags or tags."
      }
    ]);
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          server: httpServer
        }
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
