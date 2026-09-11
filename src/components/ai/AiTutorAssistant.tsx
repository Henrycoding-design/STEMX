import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, CornerDownLeft } from "lucide-react";
import { askAITutor } from "../../lib/aiTutor";
import { useLocation } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AiTutorAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am your Cambridge & AP STEM Tutor. Ask me any formula breakdown, curriculum standard question, or simulation observation!"
    }
  ]);

  // Extract current simulation or page context
  const path = location.pathname;
  const currentSim = path.includes("/simulations/") ? path.split("/simulations/")[1] : "General STEM";

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const res = await askAITutor({
      prompt: textToSend,
      context: `Curriculum: Cambridge & AP. Lab Context: ${currentSim}`,
      simulationId: currentSim
    });

    setMessages(prev => [...prev, { role: "assistant", text: res.text }]);
    setIsLoading(false);
  };

  const sampleQuestions = [
    "Why is 45° the optimal angle for maximum projectile range in vacuum?",
    "How does adding a catalyst lower activation energy in Arrhenius kinetics?",
    "Explain the relationship between velocity zero-crossings and position extrema."
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 border border-indigo-400/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Open AI STEM Tutor"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">AI STEM Tutor</span>
      </button>

      {/* Tutor Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-end sm:justify-end p-0 sm:p-6">
          <div className="w-full sm:w-[420px] h-[580px] bg-slate-900 border border-slate-800 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center">
                    AI STEM Tutor
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      Cambridge / AP
                    </span>
                  </h3>
                  <div className="text-[11px] text-slate-400">Context: {currentSim}</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
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
                    className={`p-3 rounded-xl text-xs leading-relaxed max-w-[82%] ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span>Synthesizing curriculum explanation...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">Suggested Questions</div>
                <div className="space-y-1">
                  {sampleQuestions.slice(0, 2).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="w-full text-left text-[11px] text-indigo-300 hover:text-indigo-200 p-1.5 rounded hover:bg-slate-800 transition-colors truncate block"
                    >
                      • {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
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
                  placeholder="Ask a question about this lab or concept..."
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
