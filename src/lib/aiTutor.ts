/**
 * AI Tutor Client Service
 * Bridges user queries to /api/chat with search grounding and context injection.
 */

export interface AskTutorParams {
  prompt: string;
  context?: string;
  simulationId?: string;
}

export interface AITutorResponse {
  text: string;
  offline?: boolean;
}

export async function askAITutor({ prompt, context, simulationId }: AskTutorParams): Promise<AITutorResponse> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPrompt: prompt,
        context: `${context || "General STEM"} [Simulation: ${simulationId || "General"}]`,
        messages: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      text: data.text || "No response received.",
      offline: data.offline
    };
  } catch (err: any) {
    console.warn("AI Tutor call failed, falling back", err);
    return {
      text: `Academic Hint: Remember to correlate physical formulas with the visual axes. For ${context || "this concept"}, testing extreme minimum and maximum values helps reveal non-linear behaviors!`,
      offline: true
    };
  }
}
