import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, type File as GeminiFile } from "@google/genai";
import fs from "fs/promises";
import dotenv from "dotenv";
import { Message } from "./src/types";

dotenv.config();

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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: Date.now() });
  });

  // AI Tutor API Endpoint with Full Context & Language Switching
  app.post("/api/chat", async (req, res) => {
    try {
      const { 
        messages, 
        userPrompt, 
        language = "VN",
        simulationTitle,
        knttLesson,
        ctstLesson,
        theory,
        formulas,
        variables,
        context 
      } = req.body;

      const ai = getAIClient();
      const isEnglish = language === "ENG";

      const systemPrompt = `You are an expert AI STEM Physics Tutor for Vietnamese High School Grade 10 students, strictly specialized in the two official Vietnamese national physics curricula:
1. Kết nối tri thức với cuộc sống (KNTT) - NXB Giáo dục Việt Nam
2. Chân trời sáng tạo (CTST) - NXB Giáo dục Việt Nam

MANDATORY OUTPUT LANGUAGE:
The user interface is currently set to ${isEnglish ? "English" : "Vietnamese"}.
You MUST write your entire response in ${isEnglish ? "English" : "Vietnamese"}.
${!isEnglish ? "Sử dụng thuật ngữ Vật lí 10 chuẩn xác của Bộ Giáo dục và Đào tạo Việt Nam: vận tốc ban đầu v₀, độ dịch chuyển d, gia tốc a, động lượng p, xung lượng lực F·Δt, công cơ học A, công suất P, thế năng trọng trường Wt = mgh, động năng Wđ = ½mv², cơ năng W = const, lực hướng tâm F_ht = m·v²/r, lực ma sát trượt F_ms = μN, định luật Hooke F_dh = k|Δl|." : ""}

FULL CONTEXT OF WHAT THE STUDENT IS STUDYING:
- Current Lab/Simulation: ${simulationTitle || context || "Grade 10 Physics Lab"}
- KNTT Textbook Mapping: ${knttLesson || "Vật lí 10 - Kết nối tri thức với cuộc sống"}
- CTST Textbook Mapping: ${ctstLesson || "Vật lí 10 - Chân trời sáng tạo"}
- Core Formulas in use: ${Array.isArray(formulas) ? formulas.join("; ") : (formulas || "N/A")}
- Relevant Textbook Theory: ${theory || "Physical mechanics and phenomena"}
- Active Simulation Variables in UI: ${typeof variables === "object" ? JSON.stringify(variables) : (variables || "N/A")}

TUTORING GUIDELINES:
- Directly answer the student's question by relating it to their active simulation and the current variables.
- Explain the physical mechanism before giving formulas.
- Mention practical textbook connections (e.g. thí nghiệm cổng quang điện, máng đệm khí, hai viên bi rơi cùng lúc, con lắc đơn) to reinforce understanding.
- Format using rich Markdown with bold concepts, bullet points, and clean formula notation.
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
      res.status(200).json({ 
        text: "Không thể kết nối đến máy chủ AI vào lúc này. Vui lòng kiểm tra lại thông số trong bảng điều khiển và thử lại sau ít phút.",
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
