/**
 * AI Tutor Client Service
 * Bridges user queries to /api/chat with search grounding and context injection.
 */

export interface AskTutorParams {
  prompt: string;
  context?: string;
  simulationId?: string;
  language?: "VN" | "ENG";
  simulationTitle?: string;
  knttLesson?: string;
  ctstLesson?: string;
  theory?: string;
  formulas?: string[];
  variables?: Record<string, any>;
}

export interface AITutorResponse {
  text: string;
  offline?: boolean;
}

export async function askAITutor(params: AskTutorParams): Promise<AITutorResponse> {
  const { 
    prompt, 
    context, 
    simulationId, 
    language = "VN",
    simulationTitle,
    knttLesson,
    ctstLesson,
    theory,
    formulas,
    variables
  } = params;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPrompt: prompt,
        language,
        simulationTitle,
        knttLesson,
        ctstLesson,
        theory,
        formulas,
        variables,
        context: `${context || "Vật lí 10 (KNTT & CTST)"} [Lab: ${simulationId || "General"}]`,
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
    const isVN = language === "VN";
    return {
      text: isVN
        ? `💡 **Gợi ý học tập:** Hãy quan sát sự biến thiên của các đại lượng đo lường trên đồ thị khi điều chỉnh các biến số trong thí nghiệm **${simulationTitle || context || "bài học"}**. Lưu ý đối chiếu với bài học trong SGK **${knttLesson || "KNTT"}** và **${ctstLesson || "CTST"}**!`
        : `💡 **Study Hint:** Observe how the measured metrics on the graphs change as you adjust experimental sliders in **${simulationTitle || context || "the simulation"}**. Correlate your observations with the **${knttLesson || "KNTT"}** and **${ctstLesson || "CTST"}** curriculum standards!`,
      offline: true
    };
  }
}
