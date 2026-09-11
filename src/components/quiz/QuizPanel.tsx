import React, { useState } from "react";
import { quizzes, simulationsData } from "../../data/mockData";
import { useAppProgress } from "../../context/AppContext";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizPanelProps {
  simulationId: string;
  onClose: () => void;
}

export default function QuizPanel({ simulationId, onClose }: QuizPanelProps) {
  const { recordEvent, updateMastery } = useAppProgress();
  const simQuizzes = quizzes[simulationId] || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScorePercent, setFinalScorePercent] = useState(0);

  if (simQuizzes.length === 0) return null;

  const currentQ = simQuizzes[currentIndex];
  const selectedOption = userAnswers[currentIndex] ?? null;

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
      // Calculate final score accurately
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
        topic: sim?.topic,
        score: calculatedScore
      });

      // If user passed the quiz (e.g. >= 50%), also record simulation completed
      if (calculatedScore >= 50) {
        recordEvent({
          type: "simulation_completed",
          simulationId,
          topic: sim?.topic,
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
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h3 className="font-bold text-slate-100 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-indigo-400" />
            Concept Check
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">&times;</button>
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
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Question {currentIndex + 1} of {simQuizzes.length}
                </div>
                <h4 className="text-xl text-slate-100 font-medium leading-relaxed">
                  {currentQ.question}
                </h4>
                
                <div className="space-y-3">
                  {currentQ.options.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === currentQ.correctIndex;
                    const showCorrect = isAnswered && isCorrect;
                    const showIncorrect = isAnswered && isSelected && !isCorrect;

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between
                          ${!isAnswered ? "border-slate-800 bg-slate-950 hover:border-indigo-500 hover:bg-slate-800 cursor-pointer" : ""}
                          ${showCorrect ? "border-emerald-500 bg-emerald-500/10" : ""}
                          ${showIncorrect ? "border-rose-500 bg-rose-500/10" : ""}
                          ${isAnswered && !isSelected && !isCorrect ? "border-slate-800 bg-slate-900 opacity-50" : ""}
                        `}
                      >
                        <span className="text-slate-200">{opt}</span>
                        {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {showIncorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${selectedOption === currentQ.correctIndex ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}
                  >
                    <div className="font-semibold mb-1 text-slate-200">
                      {selectedOption === currentQ.correctIndex ? "Correct!" : "Not quite."}
                    </div>
                    <div className="text-sm text-slate-400">{currentQ.explanation}</div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-500/20 mb-6">
                  <span className="text-4xl font-bold text-indigo-400">{finalScorePercent}%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Quiz Completed</h3>
                <p className="text-slate-400 mb-8">Your progress has been recorded to your learning profile.</p>
                
                <button
                  onClick={onClose}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Return to Lab
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
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                isAnswered ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {currentIndex < simQuizzes.length - 1 ? "Next Question" : "Finish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
