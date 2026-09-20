import { GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs/promises";
import { Message } from "@/src/types";

let aiClient: GoogleGenAI | null = null;

const textbookFiles = [
  {
    cacheKey: "ctst",
    displayName: "ctst.pdf",
    filePath: path.join(process.cwd(), "public", "files", "ctst.pdf"),
  },
  {
    cacheKey: "kntt",
    displayName: "kntt.pdf",
    filePath: path.join(process.cwd(), "public", "files", "kntt.pdf"),
  },
];

type InlinePdfPart = {
  inlineData: {
    mimeType: "application/pdf";
    data: string;
  };
};

let textbookInlinePartsPromise: Promise<InlinePdfPart[]> | null = null;

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

function logGeminiChat(message: string, metadata?: Record<string, unknown>): void {
  console.info(`[Gemini Chat] ${message}`, metadata || "");
}

function warnGeminiChat(message: string, metadata?: Record<string, unknown>): void {
  console.warn(`[Gemini Chat] ${message}`, metadata || "");
}

/**
 * Read the textbook PDFs locally and convert them to base64 once.
 *
 * The PDFs are NOT uploaded through the Gemini Files API.
 * Their base64 data is inserted directly into every generateContent request.
 */
async function getTextbookInlineParts(): Promise<InlinePdfPart[]> {
  if (!textbookInlinePartsPromise) {
    textbookInlinePartsPromise = (async () => {
      logGeminiChat("Loading textbook PDFs for inline base64 requests");

      const parts = await Promise.all(
        textbookFiles.map(async (textbookFile) => {
          const pdfBuffer = await fs.readFile(textbookFile.filePath);
          const base64 = pdfBuffer.toString("base64");

          logGeminiChat("Loaded textbook PDF as inline base64", {
            displayName: textbookFile.displayName,
            bytes: pdfBuffer.length,
            base64Length: base64.length,
          });

          return {
            inlineData: {
              mimeType: "application/pdf" as const,
              data: base64,
            },
          };
        })
      );

      logGeminiChat("All textbook PDFs loaded for inline requests", {
        count: parts.length,
      });

      return parts;
    })().catch((error) => {
      textbookInlinePartsPromise = null;
      throw error;
    });
  }

  return textbookInlinePartsPromise;
}

function getPromptText(
  messages: Message[],
  userPrompt?: string
): string {
  // If an explicit userPrompt is provided, use it directly.
  if (typeof userPrompt === "string" && userPrompt.trim()) {
    return userPrompt;
  }

  // Convert the conversation history into a readable prompt.
  if (Array.isArray(messages) && messages.length > 0) {
    return messages
      .filter((message) => typeof message?.text === "string" && message.text.trim())
      .map((message) => {
        const role = message.role === "assistant" ? "Assistant" : "Student";
        return `${role}: ${message.text}`;
      })
      .join("\n\n");
  }

  return "Hello";
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
      // Prefer the most recent student question for the offline fallback context.
      const lastUserMessage = Array.isArray(messages)
        ? messages
            .filter(
              (message: Message) =>
                message?.role === "user" &&
                typeof message?.text === "string" &&
                message.text.trim()
            )
            .pop()
        : undefined;

      const query =
        lastUserMessage?.text ||
        (typeof userPrompt === "string" ? userPrompt : "") ||
        "Vật lí 10";

      if (isEnglish) {
        return res.json({
          text: `### 🧪 AI Physics Tutor (KNTT & CTST Grade 10)

To understand **${simulationTitle || context || "this concept"}**, analyze how changing experimental variables in the control panel modifies the measured physical metrics.

* **Textbook Reference:** Aligned with **${knttLesson || "KNTT"}** and **${ctstLesson || "CTST"}**.
* **Key Formulas:** ${Array.isArray(formulas) ? formulas.slice(0, 2).join("; ") : "Physical laws apply."}
* **Active Variables:** ${typeof variables === "object" ? JSON.stringify(variables) : "Adjust sliders in the panel."}
* **Simulation Tip:** Try boundary values (e.g. zero friction or 45° launch angle) to witness asymptotic conservation behaviors!

> *(Note: Configure \`GEMINI_API_KEY\` to activate real-time AI explanations with live Search Grounding for: "${query}")*`,
            offline: true
          });
      } else {
        return res.json({
          text: `### 🧪 Trợ lý Gia sư Vật lí 10 (KNTT & CTST)

  Để nắm vững nội dung **${simulationTitle || context || "bài học này"}**, bạn hãy quan sát đồ thị và số liệu biến đổi khi kéo các thanh trượt trong bảng điều khiển.

  * **Liên hệ Sách Giáo Khoa:**
    - **KNTT:** ${knttLesson || "Kết nối tri thức với cuộc sống - Vật lí 10"}
    - **CTST:** ${ctstLesson || "Chân trời sáng tạo - Vật lí 10"}
  * **Công thức trọng tâm:** ${Array.isArray(formulas) ? formulas.slice(0, 2).join(" ; ") : "Xem bảng công thức bên cạnh"}
  * **Thông số hiện tại:** ${typeof variables === "object" ? Object.entries(variables).map(([k, v]) => `${k} = ${v}`).join(", ") : "Theo bảng điều khiển"}
  * **Gợi ý thực hành:** Hãy thử thay đổi các giá trị cực trị (ví dụ: góc ném 45°, hệ số ma sát bằng 0 hoặc va chạm mềm) để kiểm chứng định luật bảo toàn.

  > *(Lưu ý: Thiết lập \`GEMINI_API_KEY\` trong cài đặt môi trường để kích hoạt trí tuệ nhân tạo Gemini phản hồi chi tiết theo thời gian thực cho câu hỏi: "${query}")*`,
              offline: true
        });
      }
    }

    const promptPayload = getPromptText(messages, userPrompt);
    const textbookInlineParts = await getTextbookInlineParts();

    logGeminiChat("Preparing Gemini generateContent request", {
      promptLength: promptPayload.length,
      textbookCount: textbookInlineParts.length,
      textbookPayloadIncluded: true,
    });

    /*
      * Every turn sends both textbook PDFs inline.
      *
      * No Gemini Files API:
      *   - no ai.files.upload()
      *   - no ai.files.get()
      *   - no ai.files.delete()
      *
      * No Interactions API:
      *   - no ai.interactions.create()
      *   - no previous_interaction_id
      *   - no interaction ID storage
      *
      * generateContent receives the PDFs and the current user message
      * directly in the request.
      */
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...textbookInlineParts,
        {
          text: promptPayload,
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text || "";

    logGeminiChat("Gemini generateContent completed", {
      outputLength: responseText.length,
    });

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return res.status(200).json({
      text: "I am having trouble connecting to the live AI service right now. Please test your parameters in the simulation controls, check the formula definitions, or try again in a moment.",
      error: error?.message || "Internal error",
    });
  }
}
