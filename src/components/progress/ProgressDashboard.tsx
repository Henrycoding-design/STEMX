import React, { useState } from "react";
import { useAppProgress } from "../../context/AppContext";
import { Target, Trophy, Clock, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { simulationsData } from "../../data/mockData";
import { Link } from "react-router-dom";

export default function ProgressDashboard() {
  const { progress, resetProgress, t, language } = useAppProgress();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const completedCount = progress.completedSimulations.length;
  const totalSims = simulationsData.length;

  return (
    <div className="page-container max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("student_progress")}</h1>
          <p className="text-slate-400">{t("progress_desc")}</p>
        </div>

        <div>
          <button
            onClick={() => setShowConfirmReset(true)}
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
            {t("reset_progress")}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              {language === "VN" ? "Đặt lại toàn bộ tiến độ?" : "Reset All Progress?"}
            </h3>
            <p className="text-slate-400 text-sm">
              {language === "VN" 
                ? "Hành động này sẽ xóa các mô phỏng đã hoàn thành và lịch sử làm bài kiểm tra. Dữ liệu sau khi xóa sẽ không thể phục hồi."
                : "This will clear all completed lessons and recent activity history. This action cannot be undone."}
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-lg text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                {language === "VN" ? "Hủy" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-lg text-sm bg-rose-600 hover:bg-rose-500 text-white font-medium cursor-pointer"
              >
                {language === "VN" ? "Xác nhận Đặt lại" : "Confirm Reset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Overall Completion Percentage Card */}
      <div className="hero-panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Target className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {t("overall_progress")}
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {progress.overall}%
            </div>
            <p className="text-sm text-slate-400">
              {language === "VN"
                ? `Đã hoàn thành ${completedCount} trên tổng số ${totalSims} bài thí nghiệm trọng tâm theo chuẩn KNTT & CTST.`
                : `Completed ${completedCount} of ${totalSims} core virtual experiments aligned with KNTT & CTST.`}
            </p>
          </div>

          <div className="sm:w-64 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t("completion_rate")}</span>
              <span className="font-bold text-slate-200">{completedCount}/{totalSims}</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${(completedCount / totalSims) * 100}%` }} 
              />
            </div>
            <div className="text-[11px] text-slate-500 text-right">
              {completedCount === totalSims 
                ? (language === "VN" ? "🎉 Xuất sắc! Bạn đã hoàn thành tất cả bài học." : "🎉 Excellent! You have completed all lessons.")
                : (language === "VN" ? "Hãy tiếp tục hoàn thành các bài học còn lại." : "Keep going to complete the remaining labs.")}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 2. Completed Simulations and Lessons */}
        <div className="surface-panel rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-amber-400" />
              {t("completed_sims")}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              {completedCount}/{totalSims}
            </span>
          </h2>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {progress.completedSimulations.length > 0 ? (
              progress.completedSimulations.map(id => {
                const sim = simulationsData.find(s => s.id === id);
                if (!sim) return null;
                return (
                  <div 
                    key={id} 
                    className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start space-x-3 min-w-0 flex-1 pr-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-100 truncate">
                          {language === "VN" ? sim.title : sim.titleEn}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {sim.knttRef} • {sim.ctstRef}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/simulations/${sim.id}`}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-medium shrink-0 transition-colors"
                    >
                      {language === "VN" ? "Mở lại" : "Review"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 px-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-400 text-sm">
                <Trophy className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-60" />
                <p>{t("no_completed")}</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Recent Activities */}
        <div className="surface-panel rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-indigo-400" />
            {t("recent_activity")}
          </h2>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {progress.recentActivity.length > 0 ? (
              progress.recentActivity.map(activity => {
                const sim = simulationsData.find(s => s.id === activity.simulationId);
                const title = sim ? (language === "VN" ? sim.title : sim.titleEn) : (activity.topic || activity.simulationId || "");
                const isQuiz = activity.type === "quiz_completed";

                return (
                  <div 
                    key={activity.id} 
                    className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isQuiz ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {isQuiz 
                            ? (language === "VN" ? "Kiểm tra" : "Quiz") 
                            : (language === "VN" ? "Mô phỏng" : "Lab")}
                        </span>
                        <span className="text-sm font-medium text-slate-200 truncate">
                          {title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {activity.score !== undefined && (
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-md shrink-0 ${
                        activity.score >= 50 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {activity.score}%
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 px-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-400 text-sm">
                <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-60" />
                <p>{t("no_activity")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
