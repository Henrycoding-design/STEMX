import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User } from "lucide-react";
import { askAITutor } from "../../lib/aiTutor";
import { useLocation } from "react-router-dom";
import { useAppProgress } from "../../context/AppContext";
import { simulationsData } from "../../data/mockData";
import { curriculumTopics } from "../../data/curriculumData";
import MarkdownRenderer from "../common/MarkdownRenderer";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AiTutorAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { language } = useAppProgress();
  const isVN = language === "VN";

  // Extract current simulation or page context
  const path = location.pathname;
  const currentSimId = path.includes("/simulations/") ? path.split("/simulations/")[1] : "";
  const currentSimInfo = currentSimId ? simulationsData.find(s => s.id === currentSimId) : null;
  const currentTopic = currentSimId 
    ? curriculumTopics.find(t => t.simulationId === currentSimId || t.id === currentSimId)
    : curriculumTopics[0];

  const defaultWelcomeMessage: Message = {
    role: "assistant",
    text: isVN
      ? "Xin chào! Tôi là Trợ lý Gia sư Vật lí 10 theo chương trình GDPT 2018 (SGK Kết nối tri thức & Chân trời sáng tạo). Hãy hỏi tôi bất kì thắc mắc nào về hiện tượng, công thức, đồ thị hoặc bài tập thực hành!"
      : "Hello! I am your Grade 10 Physics Tutor aligned with KNTT & CTST curricula. Ask me any questions regarding formulas, experimental graphs, or theoretical physics concepts!"
  };

  const [messages, setMessages] = useState<Message[]>([defaultWelcomeMessage]);

  // Update welcome message if language changes and no messages exchanged yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([defaultWelcomeMessage]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const res = await askAITutor({
      prompt: textToSend,
      language: language,
      simulationId: currentSimId || "general-physics",
      simulationTitle: currentTopic ? (isVN ? currentTopic.title : currentTopic.titleEn) : (currentSimInfo?.title || "Vật lí 10"),
      knttLesson: currentTopic?.knttRef || currentSimInfo?.knttRef || "Vật lí 10 Kết nối tri thức",
      ctstLesson: currentTopic?.ctstRef || currentSimInfo?.ctstRef || "Vật lí 10 Chân trời sáng tạo",
      theory: currentTopic ? `${currentTopic.theory.ghiNho}. ` + currentTopic.theory.part1_points.map(p => `${p.heading}: ${p.content}`).join("; ") : undefined,
      formulas: currentTopic?.theory.part2_formulas.map(f => `${f.symbol} = ${f.formula} (${f.meaning})`),
      context: `Vật lí 10 (${isVN ? "Kết nối tri thức & Chân trời sáng tạo" : "KNTT & CTST"}) - ${currentTopic ? currentTopic.title : "Tổng quan"}`
    });

    setMessages(prev => [...prev, { role: "assistant", text: res.text }]);
    setIsLoading(false);
  };

  const sampleQuestions = isVN
    ? [
        "Ý nghĩa của hệ số góc (độ dốc) trên đồ thị độ dịch chuyển - thời gian d-t?",
        "Vì sao trong chân không góc ném 45° cho tầm ném xa lớn nhất?",
        "Lực ma sát nghỉ đóng vai trò lực hướng tâm như thế nào khi xe vào cua?"
      ]
    : [
        "What is the physical meaning of the slope on a displacement-time (d-t) graph?",
        "Why is 45° the optimal launch angle for maximum projectile range in vacuum?",
        "How does static friction act as centripetal force when a car rounds a curve?"
      ];

  const displayContextName = currentTopic
    ? (isVN ? currentTopic.title : currentTopic.titleEn)
    : (currentSimInfo ? (isVN ? currentSimInfo.title : currentSimInfo.titleEn) : (isVN ? "Vật lí 10" : "Grade 10 Physics"));

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 border border-indigo-400/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        title={isVN ? "Mở Gia sư AI Vật lí 10" : "Open AI Physics Tutor"}
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">
          {isVN ? "Gia sư AI Vật lí" : "AI Physics Tutor"}
        </span>
      </button>

      {/* Tutor Drawer Modal */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end justify-end p-0 sm:p-6"
        >
          <div className="w-full sm:w-[480px] h-[85dvh] sm:h-[620px] max-h-[85dvh] sm:max-h-[calc(100dvh-3rem)] bg-slate-900 border border-slate-800 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center">
                    {isVN ? "Gia sư AI Vật lí 10" : "AI Physics Tutor"}
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      KNTT &amp; CTST
                    </span>
                  </h3>
                  <div className="text-[11px] text-slate-400 truncate max-w-[280px]">
                    {isVN ? "Chủ đề:" : "Context:"} {displayContextName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message body */}
            <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start space-x-2.5 ${m.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400 border border-slate-700"
                    }`}
                  >
                    {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none whitespace-pre-line"
                        : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <MarkdownRenderer content={m.text} />
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span>{isVN ? "Đang tra cứu và phân tích theo SGK KNTT & CTST..." : "Synthesizing curriculum explanation..."}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                  {isVN ? "Câu hỏi gợi ý" : "Suggested Questions"}
                </div>
                <div className="space-y-1">
                  {sampleQuestions.slice(0, 2).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="w-full text-left text-[11px] text-indigo-300 hover:text-indigo-200 p-1.5 rounded hover:bg-slate-800 transition-colors truncate block cursor-pointer"
                    >
                      • {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isVN ? "Đặt câu hỏi về bài học hoặc thí nghiệm này..." : "Ask a question about this lab or concept..."}
                  className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
