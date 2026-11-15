import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a creative chef assistant. When given a list of ingredients, return ONLY valid JSON — no markdown, no code fences, no explanation.

The JSON must match this exact shape:
{
  "title": string,
  "description": string (1-2 sentences, appetizing),
  "servings": number (default 2),
  "prepTime": string (e.g. "10 min"),
  "cookTime": string (e.g. "25 min"),
  "difficulty": "Easy" | "Medium" | "Hard",
  "ingredients": [
    {
      "id": string (unique, e.g. "ing-1"),
      "name": string,
      "amount": number,
      "unit": string (e.g. "g", "cup", "tbsp", "piece"),
      "swaps": string[] (2-3 alternatives, empty array if none)
    }
  ],
  "steps": [
    {
      "id": string (e.g. "step-1"),
      "instruction": string,
      "tip": string | null
    }
  ],
  "tags": string[] (2-4 descriptive tags like "quick", "vegetarian", "high-protein")
}

Rules:
- Use ALL provided ingredients if possible
- 4-8 steps
- 3-6 ingredients (add pantry staples like salt, oil, etc. as needed)
- amounts must be numbers, not strings
- swaps should be realistic substitutions`;

// Validate the parsed recipe has the expected shape
function validateRecipe(data) {
  if (!data || typeof data !== "object") throw new Error("Not an object");
  const required = ["title", "description", "servings", "ingredients", "steps"];
  for (const key of required) {
    if (!(key in data)) throw new Error(`Missing field: ${key}`);
  }
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0)
    throw new Error("ingredients must be a non-empty array");
  if (!Array.isArray(data.steps) || data.steps.length === 0)
    throw new Error("steps must be a non-empty array");

  // Validate ingredient shape
  for (const ing of data.ingredients) {
    if (!ing.id || !ing.name) throw new Error("Ingredient missing id or name");
    if (typeof ing.amount !== "number") ing.amount = parseFloat(ing.amount) || 1;
    if (!Array.isArray(ing.swaps)) ing.swaps = [];
  }

  // Validate step shape
  for (const step of data.steps) {
    if (!step.id || !step.instruction) throw new Error("Step missing id or instruction");
    if (!("tip" in step)) step.tip = null;
  }

  // Defaults for optional fields
  if (!Array.isArray(data.tags)) data.tags = [];
  if (!data.difficulty) data.difficulty = "Medium";
  if (!data.prepTime) data.prepTime = "—";
  if (!data.cookTime) data.cookTime = "—";

  return data;
}

// Try to extract JSON from a string that might have surrounding text
function extractJSON(text) {
  // Direct parse first
  try {
    return JSON.parse(text.trim());
  } catch {}

  // Try to find JSON object in the text
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }

  throw new Error("Could not extract valid JSON from model response");
}

app.post("/api/recipe", async (req, res) => {
  const { ingredients, requestId } = req.body;

  if (!ingredients || typeof ingredients !== "string" || !ingredients.trim()) {
    return res.status(400).json({ error: "ingredients field is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured on server" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Ingredients I have: ${ingredients.trim()}\n\nReturn only the JSON recipe object.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const rawContent = completion.choices?.[0]?.message?.content;
    if (!rawContent) {
      return res.status(502).json({ error: "Model returned an empty response" });
    }

    let parsed;
    try {
      parsed = extractJSON(rawContent);
    } catch (e) {
      return res.status(422).json({
        error: "Model returned malformed JSON — please try again",
        debug: rawContent.slice(0, 300),
      });
    }

    let validated;
    try {
      validated = validateRecipe(parsed);
    } catch (e) {
      return res.status(422).json({
        error: `Recipe had unexpected shape: ${e.message}. Try again.`,
      });
    }

    return res.json({ recipe: validated, requestId });
  } catch (err) {
    if (err?.status === 401) {
      return res.status(401).json({ error: "Invalid GROQ_API_KEY" });
    }
    if (err?.status === 429) {
      return res.status(429).json({ error: "Rate limit hit — wait a moment and retry" });
    }
    console.error("Groq error:", err);
    return res.status(502).json({ error: "AI request failed: " + (err.message || "unknown error") });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
