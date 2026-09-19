import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, type File as GeminiFile } from "@google/genai";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
const FILE_MAX_AGE_MS = 45 * 60 * 60 * 1000;
const FILE_EXPIRY_BUFFER_MS = 3 * 60 * 60 * 1000;
const TEXTBOOK_FILE_STORAGE_PATH = path.join(process.cwd(), ".cache", "gemini-textbook-files.json");
const textbookFiles = [
  { cacheKey: "ctst", displayName: "ctst.pdf", filePath: path.join(process.cwd(), "public", "files", "ctst.pdf") },
  { cacheKey: "kntt", displayName: "kntt.pdf", filePath: path.join(process.cwd(), "public", "files", "kntt.pdf") },
];
const textbookFileCache: Record<string, GeminiFile | undefined> = {};
const interactionIdsByScope = new Map<string, string>();
let textbookFileStorageLoaded = false;
let textbookFilesRefreshPromise: Promise<GeminiFile[]> | null = null;

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

async function loadTextbookFileLocalStorage(): Promise<void> {
  if (textbookFileStorageLoaded) {
    return;
  }

  textbookFileStorageLoaded = true;
  try {
    const rawStorage = await fs.readFile(TEXTBOOK_FILE_STORAGE_PATH, "utf8");
    const parsedStorage = JSON.parse(rawStorage);
    Object.assign(textbookFileCache, parsedStorage.textbookFileCache || {});
    logGeminiChat("Loaded textbook file cache from local storage", {
      path: TEXTBOOK_FILE_STORAGE_PATH,
      keys: Object.keys(textbookFileCache),
    });
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      logGeminiChat("No local textbook file cache found; uploads will be created on demand", {
        path: TEXTBOOK_FILE_STORAGE_PATH,
      });
      return;
    }
    warnGeminiChat("Could not load local textbook file cache; uploads will be recreated if needed", {
      error: error?.message || "Unknown error",
    });
  }
}

async function saveTextbookFileLocalStorage(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(TEXTBOOK_FILE_STORAGE_PATH), { recursive: true });
    await fs.writeFile(
      TEXTBOOK_FILE_STORAGE_PATH,
      JSON.stringify(
        {
          textbookFiles,
          textbookFileCache,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
    logGeminiChat("Saved textbook file cache to local storage", {
      path: TEXTBOOK_FILE_STORAGE_PATH,
      keys: Object.keys(textbookFileCache),
    });
  } catch (error: any) {
    warnGeminiChat("Could not save local textbook file cache", {
      error: error?.message || "Unknown error",
    });
  }
}

function isExpiringSoon(file: GeminiFile): boolean {
  const createdAt = Date.parse(file.createTime || "");
  if (Number.isFinite(createdAt)) {
    return Date.now() - createdAt >= FILE_MAX_AGE_MS;
  }

  const expiresAt = Date.parse(file.expirationTime || "");
  return Number.isFinite(expiresAt) && expiresAt - Date.now() <= FILE_EXPIRY_BUFFER_MS;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForActiveFile(ai: GoogleGenAI, file: GeminiFile): Promise<GeminiFile> {
  let currentFile = file;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (!currentFile.name) {
      throw new Error(`Gemini file upload did not return a file name for ${currentFile.displayName || "textbook PDF"}`);
    }
    if (currentFile.state === "ACTIVE") {
      if (!currentFile.uri) {
        throw new Error(`Gemini file ${currentFile.name} is active but did not return a URI`);
      }
      logGeminiChat("Gemini file is active", {
        name: currentFile.name,
        displayName: currentFile.displayName,
        createTime: currentFile.createTime,
        expirationTime: currentFile.expirationTime,
      });
      return currentFile;
    }
    if (currentFile.state === "FAILED") {
      throw new Error(`Gemini file processing failed for ${currentFile.displayName || currentFile.name}`);
    }
    logGeminiChat("Waiting for Gemini file to become active", {
      name: currentFile.name,
      displayName: currentFile.displayName,
      state: currentFile.state,
      attempt: attempt + 1,
    });
    await sleep(2000);
    currentFile = await ai.files.get({ name: currentFile.name });
  }
  throw new Error(`Gemini file ${currentFile.name || currentFile.displayName || "textbook PDF"} did not become active in time`);
}

async function uploadTextbookFile(ai: GoogleGenAI, textbookFile: (typeof textbookFiles)[number]): Promise<GeminiFile> {
  logGeminiChat("Uploading textbook PDF with Files API", {
    cacheKey: textbookFile.cacheKey,
    displayName: textbookFile.displayName,
    filePath: textbookFile.filePath,
  });
  const file = await ai.files.upload({
    file: textbookFile.filePath,
    config: {
      mimeType: "application/pdf",
      displayName: textbookFile.displayName,
    },
  });
  return waitForActiveFile(ai, file);
}

async function ensureFreshTextbookFile(ai: GoogleGenAI, textbookFile: (typeof textbookFiles)[number]): Promise<GeminiFile> {
  const cachedFile = textbookFileCache[textbookFile.cacheKey];
  if (!cachedFile?.name) {
    logGeminiChat("No cached Gemini file metadata found; uploading textbook PDF", {
      cacheKey: textbookFile.cacheKey,
      displayName: textbookFile.displayName,
    });
    const uploadedFile = await uploadTextbookFile(ai, textbookFile);
    textbookFileCache[textbookFile.cacheKey] = uploadedFile;
    await saveTextbookFileLocalStorage();
    return uploadedFile;
  }

  try {
    logGeminiChat("Checking cached Gemini file metadata", {
      cacheKey: textbookFile.cacheKey,
      name: cachedFile.name,
      displayName: cachedFile.displayName || textbookFile.displayName,
    });
    const fileMetadata = await ai.files.get({ name: cachedFile.name });
    if (!isExpiringSoon(fileMetadata) && fileMetadata.state !== "FAILED") {
      const activeFile = await waitForActiveFile(ai, fileMetadata);
      textbookFileCache[textbookFile.cacheKey] = activeFile;
      await saveTextbookFileLocalStorage();
      logGeminiChat("Reusing cached Gemini textbook file", {
        cacheKey: textbookFile.cacheKey,
        name: activeFile.name,
        createTime: activeFile.createTime,
        expirationTime: activeFile.expirationTime,
      });
      return activeFile;
    }

    logGeminiChat("Cached Gemini file is expired or failed; deleting before reupload", {
      cacheKey: textbookFile.cacheKey,
      name: cachedFile.name,
      state: fileMetadata.state,
      createTime: fileMetadata.createTime,
      expirationTime: fileMetadata.expirationTime,
    });
    await ai.files.delete({ name: cachedFile.name }).catch(() => undefined);
  } catch (error: any) {
    // Missing or expired remote file: upload a fresh copy below.
    warnGeminiChat("Cached Gemini file could not be reused; uploading fresh copy", {
      cacheKey: textbookFile.cacheKey,
      name: cachedFile.name,
      error: error?.message || "Unknown error",
    });
  }

  const uploadedFile = await uploadTextbookFile(ai, textbookFile);
  textbookFileCache[textbookFile.cacheKey] = uploadedFile;
  await saveTextbookFileLocalStorage();
  return uploadedFile;
}

async function ensureFreshTextbookFiles(ai: GoogleGenAI): Promise<GeminiFile[]> {
  if (textbookFilesRefreshPromise) {
    logGeminiChat("Reusing in-flight textbook file refresh");
    return textbookFilesRefreshPromise;
  }

  textbookFilesRefreshPromise = (async () => {
    await loadTextbookFileLocalStorage();
    return Promise.all(textbookFiles.map((textbookFile) => ensureFreshTextbookFile(ai, textbookFile)));
  })();

  try {
    return await textbookFilesRefreshPromise;
  } finally {
    textbookFilesRefreshPromise = null;
  }
}

function getPromptText(messages: any, userPrompt: any): string {
  if (typeof userPrompt === "string" && userPrompt.trim()) {
    return userPrompt;
  }

  if (Array.isArray(messages) && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (typeof lastMessage === "string") {
      return lastMessage;
    }
    if (typeof lastMessage?.text === "string") {
      return lastMessage.text;
    }
    if (Array.isArray(lastMessage?.parts)) {
      const text = lastMessage.parts
        .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
        .filter(Boolean)
        .join("\n");
      if (text.trim()) {
        return text;
      }
    }
  }

  return "Hello";
}

function getConversationScope(body: any): string {
  return [
    body.conversationId || body.sessionId || body.chatId || "default",
    body.language || "VN",
    body.context || "",
    body.simulationTitle || "",
  ].join("|");
}

function getPreviousInteractionId(body: any, conversationScope: string): string | undefined {
  const id = body.previousInteractionId || body.previous_interaction_id || body.lastInteractionId || body.responseId;
  if (typeof id === "string" && id.trim()) {
    logGeminiChat("Using previous interaction id from request session storage", {
      conversationScope,
      previousInteractionId: id,
    });
    return id;
  }

  const storedInteractionId = interactionIdsByScope.get(conversationScope);
  if (storedInteractionId) {
    logGeminiChat("Using previous interaction id from server session storage", {
      conversationScope,
      previousInteractionId: storedInteractionId,
    });
  } else {
    logGeminiChat("No previous interaction id found; this turn will include textbook PDFs", {
      conversationScope,
    });
  }
  return storedInteractionId;
}

function buildInteractionInput(prompt: string, files: GeminiFile[], includeFiles: boolean): any {
  if (!includeFiles) {
    return prompt;
  }

  return [
    ...files.map((file) => ({
      type: "document",
      uri: file.uri,
      mime_type: file.mimeType || "application/pdf",
    })),
    { type: "text", text: prompt },
  ];
}

function getInteractionText(interaction: any): string {
  // 1. Check direct top-level convenience properties
  if (typeof interaction?.output_text === "string" && interaction.output_text.length > 0) {
    return interaction.output_text;
  }
  if (typeof interaction?.outputText === "string" && interaction.outputText.length > 0) {
    return interaction.outputText;
  }

  // 2. Parse `steps` array from the Interactions API
  if (Array.isArray(interaction?.steps)) {
    const textParts: string[] = [];

    for (const step of interaction.steps) {
      // Look for final model output steps
      if (step?.type === "model_output" && Array.isArray(step.content)) {
        for (const item of step.content) {
          if (item?.type === "text" && typeof item.text === "string") {
            textParts.push(item.text);
          }
        }
      }
    }

    if (textParts.length > 0) {
      return textParts.join("\n");
    }
  }

  // 3. Fallback safely to empty string (never return undefined)
  return "";
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
        const query = (typeof userPrompt === "string" ? userPrompt : "") || 
          (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) || 
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
      const conversationScope = getConversationScope(req.body);
      const previousInteractionId = getPreviousInteractionId(req.body, conversationScope);
      logGeminiChat("Preparing Gemini interaction", {
        conversationScope,
        promptLength: promptPayload.length,
        hasPreviousInteractionId: Boolean(previousInteractionId),
      });
      const files = await ensureFreshTextbookFiles(ai);

      const interaction = await ai.interactions.create({
        model: "gemini-2.5-flash",
        input: buildInteractionInput(promptPayload, files, !previousInteractionId),
        previous_interaction_id: previousInteractionId,
        system_instruction: systemPrompt,
        tools: [{ type: "google_search" }]
      } as any);

      if (interaction.id) {
        interactionIdsByScope.set(conversationScope, interaction.id);
        logGeminiChat("Saved interaction id to server session storage", {
          conversationScope,
          interactionId: interaction.id,
        });
      }

      logGeminiChat("Gemini interaction completed", {
        conversationScope,
        interactionId: interaction.id,
        outputLength: getInteractionText(interaction).length,
      });
      res.json({ text: getInteractionText(interaction), interactionId: interaction.id });
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
