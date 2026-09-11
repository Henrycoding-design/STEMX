import React from "react";
import { useNavigate } from "react-router-dom";
import { simulationsData } from "../../data/mockData";
import { useAppProgress } from "../../context/AppContext";
import { Play, ArrowRight, Activity, Target, FlaskConical, Calculator } from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress, user, t } = useAppProgress();

  const recentSim = simulationsData.find(s => s.id === "projectile-motion");

  const statCards = [
    { label: t("overall_progress"), value: `${progress.overall}%`, icon: Target, color: "text-indigo-400" },
    { label: "Physics", value: `${progress.physics}%`, icon: Activity, color: "text-emerald-400" },
    { label: "Chemistry", value: `${progress.chemistry}%`, icon: FlaskConical, color: "text-rose-400" },
    { label: "Mathematics", value: `${progress.mathematics}%`, icon: Calculator, color: "text-blue-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Welcome Hero */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800 to-indigo-950 rounded-2xl p-8 border border-indigo-500/20 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          {t("welcome")}, {user.name}.
        </h1>
        <p className="text-slate-300 text-lg">
          Continue exploring your STEM curriculum through interactive experiments.
        </p>
      </motion.section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-400">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
            <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full" 
                style={{ width: stat.value }} 
              />
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <section className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center">
            <Play className="w-5 h-5 mr-2 text-indigo-400" />
            {t("continue_learning")}
          </h2>
          {recentSim && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 text-sm font-medium text-indigo-400 mb-2">
                  <span>{recentSim.subject}</span>
                  <span>→</span>
                  <span>{recentSim.topic}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{recentSim.title}</h3>
                <p className="text-slate-400 mb-6 max-w-md">{recentSim.description}</p>
                <button 
                  onClick={() => navigate(`/simulations/${recentSim.id}`)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center cursor-pointer"
                >
                  {t("launch_lab")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Focus Areas & Activity */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-100 flex items-center mb-4">
              <Target className="w-5 h-5 mr-2 text-rose-400" />
              {t("recommended_focus")}
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              {progress.conceptMastery.filter(c => c.status === "Needs Review").map(c => (
                <div key={c.concept} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                  <span className="text-slate-300 font-medium">{c.concept}</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-rose-500/10 text-rose-400 rounded-md">{t("review")}</span>
                </div>
              ))}
              {progress.conceptMastery.filter(c => c.status === "Developing").slice(0, 2).map(c => (
                <div key={c.concept} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                  <span className="text-slate-300 font-medium">{c.concept}</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md">{t("practice")}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
