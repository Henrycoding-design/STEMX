import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { simulationsData } from "../../data/mockData";
import { Play, CheckCircle2, BookOpen, Layers } from "lucide-react";
import { motion } from "motion/react";
import { useAppProgress } from "../../context/AppContext";

export default function SimulationHub() {
  const { progress, t, language } = useAppProgress();
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const navigate = useNavigate();

  const categories = [
    { id: "All", labelVn: "Tất cả bài học", labelEn: "All Labs" },
    { id: "Motion", labelVn: "Chuyển động & Lực Newton", labelEn: "Motion & Dynamics" },
    { id: "Energy", labelVn: "Năng lượng & Động lượng", labelEn: "Energy & Momentum" },
    { id: "CircularHooke", labelVn: "Chuyển động tròn & Lò xo", labelEn: "Circular & Elasticity" },
    { id: "FieldWave", labelVn: "Điện & Sóng cơ", labelEn: "Electricity & Waves" }
  ];

  const filteredSims = simulationsData.filter(sim => {
    if (selectedTopic === "All") return true;
    if (selectedTopic === "Motion") return sim.id === "projectile-motion" || sim.id === "newton-dynamics";
    if (selectedTopic === "Energy") return sim.id === "energy-conservation" || sim.id === "momentum-collision";
    if (selectedTopic === "CircularHooke") return sim.id === "circular-motion" || sim.id === "hooke-elasticity";
    if (selectedTopic === "FieldWave") return sim.id === "electric-circuit" || sim.id === "wave-interference";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vật lí 10 • KNTT &amp; CTST</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{t("simulation_library")}</h1>
        <p className="text-slate-400">{t("sim_lib_desc")}</p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedTopic(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedTopic === cat.id 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {language === "VN" ? cat.labelVn : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Simulation Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSims.map((sim, i) => {
          const isCompleted = progress.completedSimulations.includes(sim.id);
          const title = language === "VN" ? sim.title : sim.titleEn;
          const desc = language === "VN" ? sim.description : sim.descriptionEn;
          const difficulty = language === "VN" ? sim.difficulty : sim.difficultyEn;

          return (
            <motion.div
              key={sim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all rounded-2xl overflow-hidden flex flex-col h-full group shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Vật lí 10
                  </span>
                  
                  {isCompleted ? (
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {t("completed")}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {difficulty}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {desc}
                </p>
                
                {/* Textbook Alignment Badges */}
                <div className="space-y-2 mb-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold flex items-center">
                    <Layers className="w-3 h-3 mr-1 text-slate-400" />
                    <span>{language === "VN" ? "Chuẩn SGK Đối chiếu:" : "Curriculum Mapping:"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] bg-slate-950 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded">
                      {sim.knttRef.split("(")[0]}
                    </span>
                    <span className="text-[11px] bg-slate-950 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded">
                      {sim.ctstRef.split("(")[0]}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-950/60 border-t border-slate-800">
                <button 
                  onClick={() => navigate(`/simulations/${sim.id}`)}
                  className="w-full bg-slate-800 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center transition-colors group-hover:bg-indigo-600 cursor-pointer shadow-sm"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
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
