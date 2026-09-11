import React, { useState } from "react";
import { useAppProgress } from "../../context/AppContext";
import { Target, Trophy, Clock, CheckCircle2, RotateCcw, Database, Sparkles, Activity, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { simulationsData } from "../../data/mockData";
import { Link } from "react-router-dom";

export default function ProgressDashboard() {
  const { progress, user, resetProgress, t } = useAppProgress();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("student_progress")}</h1>
          <p className="text-slate-400">{t("progress_desc")}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowConfirmReset(true)}
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
            Reset Progress
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Reset All Progress?</h3>
            <p className="text-slate-400 text-sm">
              This will clear completed simulations, reset concept masteries, and initialize default metrics. This cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-lg text-sm bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-lg text-sm bg-rose-600 hover:bg-rose-500 text-white font-medium"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Mastery Summary Bars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Readiness</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{progress.overall}%</div>
          <div className="w-full bg-slate-800 h-2 mt-3 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress.overall}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Physics (4 Labs)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{progress.physics}%</div>
          <div className="w-full bg-slate-800 h-2 mt-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress.physics}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chemistry (2 Labs)</span>
            <Sparkles className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{progress.chemistry}%</div>
          <div className="w-full bg-slate-800 h-2 mt-3 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress.chemistry}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mathematics (2 Labs)</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{progress.mathematics}%</div>
          <div className="w-full bg-slate-800 h-2 mt-3 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress.mathematics}%` }} />
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Concept Mastery Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-indigo-400" />
              {t("concept_mastery")}
            </h2>
            
            <div className="space-y-5">
              {progress.conceptMastery.map((concept) => (
                <div key={concept.concept} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-medium text-slate-200 text-sm">{concept.concept}</span>
                    <span className="text-sm font-bold text-slate-300 font-mono">{concept.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        concept.status === 'Strong' ? 'bg-emerald-500' : 
                        concept.status === 'Developing' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${concept.score}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        concept.status === 'Strong' ? 'bg-emerald-500/10 text-emerald-400' : 
                        concept.status === 'Developing' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                      {concept.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Simulations List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-amber-400" />
              {t("completed_sims")} ({progress.completedSimulations.length} of {simulationsData.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {progress.completedSimulations.length > 0 ? (
                progress.completedSimulations.map(id => {
                  const sim = simulationsData.find(s => s.id === id);
                  return sim ? (
                    <Link 
                      key={id} 
                      to={`/simulations/${sim.id}`}
                      className="flex items-center p-3.5 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors group"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition-colors truncate block">
                          {sim.title}
                        </span>
                        <span className="text-xs text-slate-500">{sim.subject}</span>
                      </div>
                    </Link>
                  ) : null;
                })
              ) : (
                <div className="col-span-2 text-slate-500 text-sm p-4 bg-slate-950 rounded-lg border border-slate-800/60">
                  No simulations completed yet. Complete a quiz with ≥50% score to verify mastery.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-6">
          {/* Storage & Persistence Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-4">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Storage &amp; Cloud Adapter</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Active Profile</span>
                <span className="text-slate-200 font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Curriculum Track</span>
                <span className="text-indigo-300 font-mono">{user.curriculumTrack}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Backend Adapter</span>
                <span className="text-emerald-400 font-semibold">Ready (Supabase/Local)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              All progress, quiz attempts, and mastery scores are automatically cached and synchronized locally with zero lag.
            </p>
          </div>

          {/* Activity Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              {t("recent_activity")}
            </h2>
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {progress.recentActivity.map(activity => (
                <div key={activity.id} className="relative pl-6 border-l-2 border-slate-800 pb-4 last:pb-0">
                  <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1 border-2 border-slate-900"></div>
                  <div className="text-sm font-medium text-slate-200">
                    {activity.type === 'quiz_completed' ? `Quiz: ${activity.topic || activity.simulationId}` : `Lab: ${activity.simulationId}`}
                  </div>
                  {activity.score !== undefined && (
                    <div className="text-xs text-emerald-400 font-semibold mt-1">Score: {activity.score}%</div>
                  )}
                  <div className="text-[11px] text-slate-500 mt-1">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {progress.recentActivity.length === 0 && (
                <div className="text-slate-500 text-sm">No recent activity recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
