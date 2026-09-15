import React, { useState } from "react";
import { quizzes, simulationsData } from "../../data/mockData";
import { useAppProgress } from "../../context/AppContext";
import { CheckCircle2, XCircle, HelpCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizPanelProps {
  simulationId: string;
  onClose: () => void;
}

export default function QuizPanel({ simulationId, onClose }: QuizPanelProps) {
  const { recordEvent, updateMastery, language, t } = useAppProgress();
  const simQuizzes = quizzes[simulationId] || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScorePercent, setFinalScorePercent] = useState(0);

  if (simQuizzes.length === 0) return null;

  const currentQ = simQuizzes[currentIndex];
  const selectedOption = userAnswers[currentIndex] ?? null;

  const questionText = language === "VN" ? currentQ.question : (currentQ.questionEn || currentQ.question);
  const optionsList = language === "VN" ? currentQ.options : (currentQ.optionsEn || currentQ.options);
  const explanationText = language === "VN" ? currentQ.explanation : (currentQ.explanationEn || currentQ.explanation);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: index }));
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < simQuizzes.length - 1) {
      setCurrentIndex(i => i + 1);
      setIsAnswered(false);
    } else {
      let correctCount = 0;
      simQuizzes.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) {
          correctCount += 1;
        }
      });
      const calculatedScore = Math.round((correctCount / simQuizzes.length) * 100);
      setFinalScorePercent(calculatedScore);
      setIsFinished(true);
      
      const sim = simulationsData.find(s => s.id === simulationId);
      
      recordEvent({
        type: "quiz_completed",
        simulationId,
        topic: sim?.title,
        score: calculatedScore
      });

      if (calculatedScore >= 50) {
        recordEvent({
          type: "simulation_completed",
          simulationId,
          topic: sim?.title,
          score: calculatedScore
        });
      }

      if (currentQ.conceptTested) {
        updateMastery(currentQ.conceptTested, calculatedScore);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <h3 className="font-bold text-slate-100 flex items-center text-sm sm:text-base">
            <HelpCircle className="w-5 h-5 mr-2 text-indigo-400" />
            {language === "VN" ? "Kiểm tra Khái niệm SGK (KNTT & CTST)" : "Concept Check (KNTT & CTST)"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {language === "VN" 
                      ? `Câu hỏi ${currentIndex + 1} / ${simQuizzes.length}` 
                      : `Question ${currentIndex + 1} of ${simQuizzes.length}`}
                  </span>

                  {currentQ.textbookRef && (
                    <span className="inline-flex items-center text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {currentQ.textbookRef}
                    </span>
                  )}
                </div>

                <h4 className="text-lg sm:text-xl text-slate-100 font-medium leading-relaxed">
                  {questionText}
                </h4>
                
                <div className="space-y-3">
                  {optionsList.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === currentQ.correctIndex;
                    const showCorrect = isAnswered && isCorrect;
                    const showIncorrect = isAnswered && isSelected && !isCorrect;

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-sm leading-relaxed ${
                          !isAnswered ? "border-slate-800 bg-slate-950 hover:border-indigo-500 hover:bg-slate-800/80 cursor-pointer text-slate-200" : ""
                        } ${showCorrect ? "border-emerald-500 bg-emerald-500/10 text-emerald-200 font-medium" : ""} ${
                          showIncorrect ? "border-rose-500 bg-rose-500/10 text-rose-200" : ""
                        } ${isAnswered && !isSelected && !isCorrect ? "border-slate-800 bg-slate-900/50 opacity-50 text-slate-400" : ""}`}
                      >
                        <span className="pr-3">{opt}</span>
                        {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                        {showIncorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${selectedOption === currentQ.correctIndex ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}
                  >
                    <div className="font-semibold mb-1 text-sm text-slate-200">
                      {selectedOption === currentQ.correctIndex 
                        ? (language === "VN" ? "✓ Chính xác!" : "✓ Correct!") 
                        : (language === "VN" ? "✗ Chưa chính xác." : "✗ Not quite.")}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">{explanationText}</div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                  finalScorePercent >= 50 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}>
                  <span className="text-4xl font-extrabold">{finalScorePercent}%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">
                  {language === "VN" ? "Hoàn thành Bài Kiểm tra" : "Concept Check Completed"}
                </h3>
                <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
                  {finalScorePercent >= 50
                    ? (language === "VN" ? "Chúc mừng! Bạn đã đạt chuẩn kiến thức và hoàn thành bài học này." : "Great job! You achieved the mastery threshold for this lab.")
                    : (language === "VN" ? "Hãy thử xem lại lí thuyết và thực nghiệm lại trên mô phỏng để đạt điểm cao hơn nhé." : "Review the textbook theory and try adjusting variables in the lab to improve your score.")}
                </p>
                
                <button
                  onClick={onClose}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors cursor-pointer text-sm shadow-md"
                >
                  {language === "VN" ? "Quay lại Phòng Thí nghiệm" : "Return to Lab"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!isFinished && (
          <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-slate-950/50">
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                isAnswered ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md" : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {currentIndex < simQuizzes.length - 1 
                ? (language === "VN" ? "Câu tiếp theo →" : "Next Question →") 
                : (language === "VN" ? "Hoàn thành bài kiểm tra" : "Finish Quiz")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
