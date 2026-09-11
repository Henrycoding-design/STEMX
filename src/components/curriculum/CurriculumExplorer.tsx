import React, { useState } from "react";
import { Link } from "react-router-dom";
import { curriculumMappings } from "../../data/mockData";
import { Book, GraduationCap, Map, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAppProgress } from "../../context/AppContext";

export default function CurriculumExplorer() {
  const { t } = useAppProgress();
  const [activeTab, setActiveTab] = useState<"Cambridge" | "AP">("Cambridge");
  const [activeSubject, setActiveSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");

  const filteredMappings = curriculumMappings.filter(m => m.subject === activeSubject);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("curriculum_explorer")}</h1>
          <p className="text-slate-400">{t("curr_exp_desc")}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side Navigation */}
        <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-4">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t("system")}</div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab("Cambridge")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${activeTab === "Cambridge" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
                >
                  <GraduationCap className="w-4 h-4 mr-2" /> {t("cambridge")}
                </button>
                <button
                  onClick={() => setActiveTab("AP")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${activeTab === "AP" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
                >
                  <Book className="w-4 h-4 mr-2" /> {t("ap")}
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t("subject")}</div>
              <div className="space-y-1">
                {["Physics", "Chemistry", "Mathematics"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubject(sub as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubject === sub ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Content - The Mapping Vis */}
        <div className="flex-1 p-6 md:p-10">
          <div className="flex items-center space-x-2 text-indigo-400 mb-8">
            <Map className="w-5 h-5" />
            <h2 className="text-xl font-semibold">{t("concept_mapping")}: {activeSubject}</h2>
          </div>

          <div className="space-y-8">
            {filteredMappings.map((mapping, i) => (
              <motion.div 
                key={mapping.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* Cambridge Node */}
                  <div className={`flex-1 p-5 rounded-xl border ${activeTab === "Cambridge" ? "bg-indigo-950/40 border-indigo-500/50" : "bg-slate-900 border-slate-800 opacity-60"}`}>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{mapping.cambridgeLevel}</div>
                    <div className="text-lg font-bold text-slate-200">{mapping.cambridgeTopic}</div>
                  </div>

                  {/* Connector */}
                  <div className="flex-shrink-0 flex items-center justify-center bg-slate-800 w-10 h-10 rounded-full border border-slate-700 z-10">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>

                  {/* AP Node */}
                  <div className={`flex-1 p-5 rounded-xl border ${activeTab === "AP" ? "bg-indigo-950/40 border-indigo-500/50" : "bg-slate-900 border-slate-800 opacity-60"}`}>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{mapping.apLevel}</div>
                    <div className="text-lg font-bold text-slate-200">{mapping.apTopic}</div>
                  </div>
                </div>
                
                {/* Linked Simulation */}
                {mapping.simulationId && (
                  <div className="mt-4 flex justify-center">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                      <span className="text-sm text-slate-400 mr-4">{t("unified_concept")}</span>
                      <Link to={`/simulations/${mapping.simulationId}`} className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                        {t("launch_lab")} →
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {filteredMappings.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No mapping data available for this selection yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
