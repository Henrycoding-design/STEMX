import React from "react";
import { useNavigate } from "react-router-dom";
import { simulationsData } from "../../data/mockData";
import { useAppProgress } from "../../context/AppContext";
import { 
  Play, 
  ArrowRight, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Award,
  Activity,
  Gauge,
  Zap,
  FlaskConical,
  Layers,
  Compass,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress, user, t, language } = useAppProgress();

  // Find next simulation to study (first non-completed one, or projectile-motion)
  const nextSimId = simulationsData.find(s => !progress.completedSimulations.includes(s.id))?.id || simulationsData[0].id;
  const targetSim = simulationsData.find(s => s.id === nextSimId) || simulationsData[0];

  const statCards = [
    { 
      label: t("overall_progress"), 
      value: `${progress.overall}%`, 
      icon: Target, 
      color: "text-indigo-400",
      sub: `${progress.completedSimulations.length}/${simulationsData.length} ${language === "VN" ? "bài học" : "labs"}`
    },
    { 
      label: language === "VN" ? "Bài học Đã hoàn thành" : "Completed Labs", 
      value: `${progress.completedSimulations.length}`, 
      icon: CheckCircle2, 
      color: "text-emerald-400",
      sub: language === "VN" ? "Đạt chuẩn kiểm tra" : "Passed concept check"
    },
    { 
      label: language === "VN" ? "Bộ SGK Đối chiếu" : "Textbooks Aligned", 
      value: "KNTT & CTST", 
      icon: BookOpen, 
      color: "text-amber-400",
      sub: language === "VN" ? "Vật lí 10 Chuẩn QG" : "National Grade 10"
    },
    { 
      label: language === "VN" ? "Cấp độ Học tập" : "Academic Level", 
      value: "Lớp 10", 
      icon: Award, 
      color: "text-blue-400",
      sub: language === "VN" ? "THPT Việt Nam" : "High School Physics"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Welcome Hero */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 rounded-3xl p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chương trình Vật lí 10 • KNTT &amp; CTST</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              {t("welcome")}, {user.name} 👋
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {language === "VN" 
                ? "Khám phá phòng thí nghiệm ảo tương tác và củng cố toàn diện kiến thức theo hai bộ sách giáo khoa Kết nối tri thức và Chân trời sáng tạo."
                : "Explore interactive virtual physics experiments mapped to the official KNTT and CTST national high school curricula."}
            </p>
          </div>

          <button
            onClick={() => navigate(`/simulations/${targetSim.id}`)}
            className="self-start md:self-center bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-semibold transition-all inline-flex items-center shadow-lg shadow-indigo-600/20 cursor-pointer text-sm shrink-0"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            {t("continue_learning")}
          </button>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Continue Learning Featured Lab (Bottom Left) */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center">
              <FlaskConical className="w-5 h-5 mr-2 text-indigo-400" />
              {t("continue_learning")}
            </h2>
            <span className="text-xs font-mono text-slate-400 flex items-center">
              <Activity className="w-3.5 h-3.5 mr-1 text-emerald-400 animate-pulse" />
              {language === "VN" ? "Mô phỏng 60 FPS" : "60 FPS Engine"}
            </span>
          </div>

          {targetSim && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden group shadow-lg hover:border-slate-700/80 transition-all">
              <div className="relative z-10 space-y-4">
                {/* Textbook Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    {targetSim.knttRef}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                    <Layers className="w-3.5 h-3.5 mr-1.5" />
                    {targetSim.ctstRef}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    {language === "VN" ? "Mô phỏng tương tác" : "Interactive Simulation"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {language === "VN" ? targetSim.title : targetSim.titleEn}
                  </h3>
                  <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                    {language === "VN" ? targetSim.description : targetSim.descriptionEn}
                  </p>
                </div>

                {/* Rich Live Telemetry & Feature Badges inside Bottom Left Lab Container */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-800/80 bg-slate-950/60 rounded-xl px-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === "VN" ? "Véc-tơ động" : "Vectors"}</div>
                      <div className="text-xs font-bold text-slate-200">F, N, P, a, v</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === "VN" ? "Đo đạc" : "Telemetry"}</div>
                      <div className="text-xs font-bold text-slate-200">Real-time Lab</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === "VN" ? "Thông số" : "Controls"}</div>
                      <div className="text-xs font-bold text-slate-200">Slider & Drag</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">{language === "VN" ? "Luyện tập" : "Quiz Check"}</div>
                      <div className="text-xs font-bold text-slate-200">{language === "VN" ? "Có giải thích" : "Explained"}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button 
                    onClick={() => navigate(`/simulations/${targetSim.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors inline-flex items-center cursor-pointer text-sm shadow-md shadow-indigo-600/20"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    {t("launch_lab")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>

                  <button
                    onClick={() => navigate("/curriculum")}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm cursor-pointer border border-slate-700 inline-flex items-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2 text-indigo-400" />
                    {t("curriculum")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Recommended Focus Areas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center">
            <Target className="w-5 h-5 mr-2 text-rose-400" />
            {t("recommended_focus")}
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
            {progress.conceptMastery.slice(0, 4).map(c => (
              <div key={c.concept} className="flex items-center justify-between p-3 bg-slate-950/70 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                <span className="text-slate-300 font-medium text-xs truncate max-w-[170px]">{c.concept}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  c.status === "Strong" 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {c.status === "Strong" ? (language === "VN" ? "Nắm vững" : "Mastered") : (language === "VN" ? "Cần ôn tập" : "Review")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
