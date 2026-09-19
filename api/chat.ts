import { GoogleGenAI, type File as GeminiFile } from "@google/genai";
import fs from "fs/promises";
import path from "path";

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

    const promptPayload = getPromptText(messages, userPrompt);
    const conversationScope = getConversationScope(body);
    const previousInteractionId = getPreviousInteractionId(body, conversationScope);
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
      tools: [{ type: "google_search" }],
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
    return res.status(200).json({ text: getInteractionText(interaction), interactionId: interaction.id });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return res.status(200).json({
      text: "I am having trouble connecting to the live AI service right now. Please test your parameters in the simulation controls, check the formula definitions, or try again in a moment.",
      error: error?.message || "Internal error",
    });
  }
}
