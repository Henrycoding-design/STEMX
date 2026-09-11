import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { simulationsData } from "../../data/mockData";
import { Play, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Subject } from "../../types";
import { useAppProgress } from "../../context/AppContext";

export default function SimulationHub() {
  const { progress, t } = useAppProgress();
  const [filter, setFilter] = useState<Subject | "All">("All");
  const navigate = useNavigate();

  const filteredSims = filter === "All" 
    ? simulationsData 
    : simulationsData.filter(s => s.subject === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t("simulation_library")}</h1>
        <p className="text-slate-400">{t("sim_lib_desc")}</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setFilter("All")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            filter === "All" 
              ? "bg-indigo-600 text-white" 
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          {t("all")}
        </button>
        {["Physics", "Chemistry", "Mathematics"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as Subject)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === f 
                ? "bg-indigo-600 text-white" 
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSims.map((sim, i) => {
          const isCompleted = progress.completedSimulations.includes(sim.id);
          return (
            <motion.div
              key={sim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors rounded-xl overflow-hidden flex flex-col h-full group"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md
                    ${sim.subject === 'Physics' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                    ${sim.subject === 'Chemistry' ? 'bg-rose-500/10 text-rose-400' : ''}
                    ${sim.subject === 'Mathematics' ? 'bg-blue-500/10 text-blue-400' : ''}
                  `}>
                    {sim.subject}
                  </span>
                  
                  {isCompleted ? (
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">{sim.difficulty}</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{sim.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{sim.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Curriculum Mapped:</div>
                  <div className="flex flex-wrap gap-2">
                    {sim.curriculumCompatibility.map(cc => (
                      <span key={cc} className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2 py-1 rounded">
                        {cc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-950/50 border-t border-slate-800">
                <button 
                  onClick={() => navigate(`/simulations/${sim.id}`)}
                  className="w-full bg-slate-800 hover:bg-indigo-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition-colors group-hover:bg-indigo-600 cursor-pointer"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t("launch_lab")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
