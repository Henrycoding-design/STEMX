import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "dummy_key_for_dev") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint for container orchestrators (Render, Cloud Run, etc.)
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: Date.now() });
  });

  // AI Tutor API Endpoint with Search Grounding
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context, userPrompt } = req.body;
      const ai = getAIClient();
      
      const systemPrompt = `You are an expert, encouraging STEM tutor in the Interactive Academic STEM Simulation Engine.
      You help students grasp key physical and mathematical concepts mapped to Cambridge (IGCSE, A-Level) and AP (AP Physics, AP Chemistry, AP Calculus, AP Precalculus) standards.
      Keep your answers engaging, rigorous, and concise. Relate mathematical formulas to visual behavior in the simulation.
      Format your responses using clear Markdown formatting (e.g., **bold key terms**, \`inline formulas/code\`, bulleted lists, and structured explanations).
      Context of current simulation: ${context || "STEM Lab General"}
      `;

      if (!ai) {
        // High quality offline fallback explanation if Gemini API Key is not set in local dev
        const query = (typeof userPrompt === "string" ? userPrompt : "") || 
          (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) || 
          "STEM concepts";
        
        return res.json({
          text: `### 🧪 Offline Academic Tutor\n\nTo master **${context || "this concept"}**, observe how adjusting independent variables affects the calculated dependent metrics in the control panel.\n\n* **Formula insight:** Relate variable trends to standard Cambridge/AP physical equations.\n* **Simulation tip:** Test boundary values to observe asymptotic behavior.\n\n> *(Note: Set \`GEMINI_API_KEY\` in your environment to unlock live AI explanations and real-time Search Grounding for: "${query}")*`,
          offline: true
        });
      }

      const promptPayload = messages && messages.length > 0 ? messages : (userPrompt || "Hello");

      // Use gemini-2.5-flash with search grounding
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptPayload,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }] // Enable Google Search Grounding
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(200).json({ 
        text: "I am having trouble connecting to the live AI service right now. Please test your parameters in the simulation controls, check the formula definitions, or try again in a moment.",
        error: error?.message || "Internal error"
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
