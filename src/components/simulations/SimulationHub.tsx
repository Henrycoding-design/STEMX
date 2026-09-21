import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { simulationsData } from "../../data/mockData";
import { Play, CheckCircle2, BookOpen, Layers } from "lucide-react";
import { motion } from "motion/react";
import { useAppProgress } from "../../context/AppContext";

const SIMULATION_HUB_STORAGE_KEY = "stemx:simulation-hub:ui";
const SIMULATION_CATEGORIES = [
  { id: "All", labelVn: "Tất cả bài học", labelEn: "All Labs" },
  { id: "Motion", labelVn: "Chuyển động & Lực Newton", labelEn: "Motion & Dynamics" },
  { id: "Energy", labelVn: "Năng lượng & Động lượng", labelEn: "Energy & Momentum" },
  { id: "CircularHooke", labelVn: "Chuyển động tròn & Lò xo", labelEn: "Circular & Elasticity" },
  { id: "FieldWave", labelVn: "Điện & Sóng cơ", labelEn: "Electricity & Waves" }
];

type SimulationHubStorage = {
  selectedTopic?: string;
  lastLabId?: string;
};

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readSimulationHubState(): SimulationHubStorage {
  const storage = getSessionStorage();
  if (!storage) return {};
  try {
    const raw = storage.getItem(SIMULATION_HUB_STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as SimulationHubStorage) : {};
    return SIMULATION_CATEGORIES.some((category) => category.id === stored.selectedTopic)
      ? stored
      : { ...stored, selectedTopic: undefined };
  } catch {
    return {};
  }
}

function writeSimulationHubState(value: SimulationHubStorage) {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(SIMULATION_HUB_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Keep navigation usable if sessionStorage is blocked.
  }
}

export default function SimulationHub() {
  const { progress, t, language } = useAppProgress();
  const [selectedTopic, setSelectedTopic] = useState<string>(() => readSimulationHubState().selectedTopic ?? "All");
  const [lastLabId, setLastLabId] = useState<string | undefined>(() => readSimulationHubState().lastLabId);

  const navigate = useNavigate();

  useEffect(() => {
    writeSimulationHubState({ ...readSimulationHubState(), selectedTopic, lastLabId });
  }, [lastLabId, selectedTopic]);

  const launchLab = (labId: string) => {
    setLastLabId(labId);
    writeSimulationHubState({ ...readSimulationHubState(), selectedTopic, lastLabId: labId });
    navigate(`/simulations/${labId}`);
  };

  const lastLab = simulationsData.find((sim) => sim.id === lastLabId);

  const filteredSims = simulationsData.filter(sim => {
    if (selectedTopic === "All") return true;
    if (selectedTopic === "Motion") return sim.id === "projectile-motion" || sim.id === "newton-dynamics";
    if (selectedTopic === "Energy") return sim.id === "energy-conservation" || sim.id === "momentum-collision";
    if (selectedTopic === "CircularHooke") return sim.id === "circular-motion" || sim.id === "hooke-elasticity";
    if (selectedTopic === "FieldWave") return sim.id === "electric-circuit" || sim.id === "wave-interference";
    return true;
  });

  return (
    <div className="page-container space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="eyebrow inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Vật lí 10 • KNTT &amp; CTST</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("simulation_library")}</h1>
          <p className="text-slate-400">{t("sim_lib_desc")}</p>
        </div>
        {lastLab && (
          <button
            type="button"
            onClick={() => launchLab(lastLab.id)}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
            title={language === "VN" ? `Tiếp tục: ${lastLab.title}` : `Resume: ${lastLab.titleEn}`}
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            {language === "VN" ? "Tiếp tục" : "Resume"}
          </button>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b soft-divider pb-4">
        {SIMULATION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedTopic(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedTopic === cat.id 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                : "bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
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
              className="surface-panel hover:border-indigo-500/50 transition-all rounded-2xl overflow-hidden flex flex-col h-full group"
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
              
              <div className="p-4 bg-slate-950/45 border-t border-slate-800/80">
                <button 
                  onClick={() => launchLab(sim.id)}
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
