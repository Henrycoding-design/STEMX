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
    const { messages, context, userPrompt, theory, formulas, language = "VN", simulationTitle, knttLesson, ctstLesson, variables } = body;
    const ai = getAIClient();
    const isEnglish = language === "ENG";

    const systemPrompt = `You are an expert, encouraging AI STEM Physics Tutor for Vietnamese High School Grade 10 students, strictly specialized in the two official Vietnamese national physics curricula (GDPT 2018):
1. Kết nối tri thức với cuộc sống (KNTT) - NXB Giáo dục Việt Nam
2. Chân trời sáng tạo (CTST) - NXB Giáo dục Việt Nam
Do not reference or map concepts to international programs such as Cambridge (IGCSE, A-Level) or AP standards.

MANDATORY OUTPUT LANGUAGE:
The user interface is currently set to ${isEnglish ? "English" : "Vietnamese"}.
You MUST write your entire response in ${isEnglish ? "English" : "Vietnamese"}.
${!isEnglish ? "Sử dụng thuật ngữ Vật lí 10 chuẩn xác của Bộ Giáo dục và Đào tạo Việt Nam: vận tốc ban đầu v₀, độ dịch chuyển d, gia tốc a, động lượng p, xung lượng lực F·Δt, cơ năng W = Wđ + Wt, lực hướng tâm F_ht = m·v²/r, lực ma sát trượt F_ms = μN, định luật Hooke F_dh = k|Δl|." : ""}

FULL CONTEXT OF WHAT THE STUDENT IS STUDYING:
- Current Lab/Simulation: ${simulationTitle || context || "Vật lí 10 Lab"}
- KNTT Textbook Mapping: ${knttLesson || "Vật lí 10 - Kết nối tri thức với cuộc sống"}
- CTST Textbook Mapping: ${ctstLesson || "Vật lí 10 - Chân trời sáng tạo"}
${theory ? `
Current lesson theory (authoritative scope):
${theory}
` : ""}
${Array.isArray(formulas) && formulas.length > 0 ? `
Current lesson quiz/formula context:
${formulas.join("\n")}
` : ""}
- Active Simulation Variables in UI: ${typeof variables === "object" ? JSON.stringify(variables) : "N/A"}

TUTORING GUIDELINES:
- Directly answer the student's question by relating it to their active simulation and the current variables.
- Explain the physical mechanism before giving formulas.
- When a current lesson scope is supplied, answer only from that scope, explain when the question is outside it, and give hints rather than revealing a quiz answer immediately.
- Format your responses using clear Markdown formatting (e.g., **bold key terms**, \`inline formulas/code\`, bulleted lists, and structured explanations).
`;

    if (!ai) {
      // Offline fallback when GEMINI_API_KEY is not configured
      const query =
        (typeof userPrompt === "string" ? userPrompt : "") ||
        (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) ||
        "Vật lí 10";

      if (isEnglish) {
        return res.status(200).json({
          text: `### 🧪 AI Physics Tutor (KNTT & CTST Grade 10)\n\nTo master **${simulationTitle || context || "this concept"}**, observe how adjusting the experimental variables in the control panel affects the measured physical metrics.\n\n* **Textbook Reference:** Aligned with **${knttLesson || "KNTT"}** and **${ctstLesson || "CTST"}** (Vietnamese Grade 10 Physics, GDPT 2018).\n* **Simulation tip:** Test boundary values (e.g. zero friction or a 45° launch angle) to observe conservation behaviors.\n\n> *(Note: Configure \`GEMINI_API_KEY\` in your environment variables to unlock live AI explanations and real-time Search Grounding for: "${query}")*`,
          offline: true,
        });
      }

      return res.status(200).json({
        text: `### 🧪 Trợ lý Gia sư Vật lí 10 (KNTT & CTST)\n\nĐể nắm vững nội dung **${simulationTitle || context || "bài học này"}**, bạn hãy quan sát đồ thị và số liệu biến đổi khi kéo các thanh trượt trong bảng điều khiển.\n\n* **Liên hệ Sách Giáo Khoa:**\n  - **KNTT:** ${knttLesson || "Kết nối tri thức với cuộc sống - Vật lí 10"}\n  - **CTST:** ${ctstLesson || "Chân trời sáng tạo - Vật lí 10"}\n* **Gợi ý thực hành:** Hãy thử thay đổi các giá trị cực trị (ví dụ: góc ném 45°, hệ số ma sát bằng 0 hoặc va chạm mềm) để kiểm chứng định luật bảo toàn.\n\n> *(Lưu ý: Thiết lập \`GEMINI_API_KEY\` trong biến môi trường để kích hoạt trí tuệ nhân tạo Gemini phản hồi chi tiết theo thời gian thực cho câu hỏi: "${query}")*`,
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
