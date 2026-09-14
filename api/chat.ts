import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { messages, context, userPrompt } = body;
    const ai = getAIClient();

    const systemPrompt = `You are an expert, encouraging STEM tutor in the Interactive Academic STEM Simulation Engine.
You help students grasp key physical and mathematical concepts mapped to Cambridge (IGCSE, A-Level) and AP (AP Physics, AP Chemistry, AP Calculus, AP Precalculus) standards.
Keep your answers engaging, rigorous, and concise. Relate mathematical formulas to visual behavior in the simulation.
Context of current simulation: ${context || "STEM Lab General"}
`;

    if (!ai) {
      // Offline fallback when GEMINI_API_KEY is not configured
      const query =
        (typeof userPrompt === "string" ? userPrompt : "") ||
        (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) ||
        "STEM concepts";

      return res.status(200).json({
        text: `[Offline Academic Tutor]: To master ${
          context || "this concept"
        }, observe how changing the independent variables affects the calculated dependent metrics in the control panel. (Note: Set GEMINI_API_KEY in your Vercel Environment Variables to unlock live AI explanations and real-time Search Grounding for: "${query}").`,
        offline: true,
      });
    }

    const promptPayload = messages && messages.length > 0 ? messages : userPrompt || "Hello";

    // Use gemini-2.5-flash with search grounding
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptPayload,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return res.status(200).json({
      text: "I am having trouble connecting to the live AI service right now. Please test your parameters in the simulation controls, check the formula definitions, or try again in a moment.",
      error: error?.message || "Internal error",
    });
  }
}
