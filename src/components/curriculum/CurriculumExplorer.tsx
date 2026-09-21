import React, { useState } from "react";
import { Link } from "react-router-dom";
import { curriculumMappings } from "../../data/mockData";
import { BookOpen, Map, ArrowRight, Play, BookCheck, FlaskConical, Search, X, Sparkles, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useAppProgress } from "../../context/AppContext";
import { CurriculumType } from "../../types";

export default function CurriculumExplorer() {
  const { t, language } = useAppProgress();
  const [activeCurriculum, setActiveCurriculum] = useState<CurriculumType>("KNTT");
  const [searchQuery, setSearchQuery] = useState("");
  const isVN = language === "VN";

  const quickFilters = isVN
    ? ["Tất cả", "Chuyển động thẳng", "Mặt phẳng nghiêng", "Ném ngang", "Va chạm & Động lượng", "Định luật Hooke", "Tròn đều", "Mạch điện"]
    : ["All", "Linear Motion", "Inclined Plane", "Projectile", "Collision & Momentum", "Hooke's Law", "Circular Motion", "Circuits"];

  const filteredMappings = curriculumMappings.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || q === "tất cả" || q === "all") return true;
    const name = (isVN ? m.topicName : m.topicNameEn).toLowerCase();
    const kntt = `${m.knttChapter} ${m.knttLesson} ${m.knttLessonNum}`.toLowerCase();
    const ctst = `${m.ctstChapter} ${m.ctstLesson} ${m.ctstLessonNum}`.toLowerCase();
    const concept = (isVN ? m.keyConcept : m.keyConceptEn).toLowerCase();
    return name.includes(q) || kntt.includes(q) || ctst.includes(q) || concept.includes(q);
  });

  return (
    <div className="page-container space-y-8 pb-12">
      {/* Header & Beautiful Search Section */}
      <div className="hero-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="eyebrow inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isVN ? "Khung chương trình GDPT 2018" : "National Standard Curriculum 2018"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("curriculum_explorer")}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t("curr_exp_desc")}
            </p>
          </div>

          {/* Formatted Search Box */}
          <div className="w-full lg:w-96 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center">
                <Search className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                {isVN ? "Tra cứu bài học & thí nghiệm" : "Search topics & labs"}
              </span>
              {searchQuery && (
                <span className="text-[11px] text-indigo-400 font-mono">
                  {filteredMappings.length} {isVN ? "kết quả" : "results"}
                </span>
              )}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isVN ? "Nhập tên bài, số bài hoặc từ khóa (vd: Newton, bảo toàn, Hooke...)" : "Search by topic, lesson number, or keyword..."}
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {isVN ? "Gợi ý nhanh:" : "Quick tags:"}
          </span>
          {quickFilters.map((filter) => {
            const isSelected = searchQuery.toLowerCase() === filter.toLowerCase() || (filter === "Tất cả" && !searchQuery) || (filter === "All" && !searchQuery);
            return (
              <button
                key={filter}
                onClick={() => setSearchQuery(filter === "Tất cả" || filter === "All" ? "" : filter)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum System Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveCurriculum("KNTT")}
              className={`surface-panel p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-4 ${
            activeCurriculum === "KNTT"
              ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40"
              : "bg-slate-900/90 border-slate-800 hover:border-slate-700 opacity-80"
          }`}
        >
          <div className={`p-3 rounded-xl ${activeCurriculum === "KNTT" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">SGK Trọng tâm 1</span>
              <span className="text-[11px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">Vật lí 10</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{t("kntt_name")}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === "VN" 
                ? "NXB Giáo dục Việt Nam • Tổng Chủ biên: Vũ Văn Hùng • Bám sát mạch năng lượng & thực tiễn." 
                : "Vietnam Education Publishing House • Integrated experimental and physical phenomena approach."}
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveCurriculum("CTST")}
              className={`surface-panel p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-4 ${
            activeCurriculum === "CTST"
              ? "bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40"
              : "bg-slate-900/90 border-slate-800 hover:border-slate-700 opacity-80"
          }`}
        >
          <div className={`p-3 rounded-xl ${activeCurriculum === "CTST" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            <BookCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">SGK Trọng tâm 2</span>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">Vật lí 10</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{t("ctst_name")}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === "VN" 
                ? "NXB Giáo dục Việt Nam • Tổng Chủ biên: Phạm Nguyễn Thành Vinh • Định hướng khám phá mô hình vật lí." 
                : "Vietnam Education Publishing House • Modeling and inquiry-based virtual experiments."}
            </p>
          </div>
        </button>
      </div>

      {/* Cross-Curriculum Mapping List */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Map className="w-5 h-5" />
          <h2 className="text-xl font-semibold text-slate-100">
            {language === "VN" ? "Đối chiếu Song song: KNTT ⟷ CTST & Phòng Thí nghiệm" : "Parallel Mapping: KNTT ⟷ CTST & Virtual Labs"}
          </h2>
        </div>

        <div className="space-y-6">
          {filteredMappings.map((mapping, i) => {
            const isKnttActive = activeCurriculum === "KNTT";
            return (
              <motion.div
                key={mapping.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="surface-panel rounded-2xl p-6 transition-colors"
              >
                {/* Topic Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {language === "VN" ? mapping.topicName : mapping.topicNameEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === "VN" ? mapping.keyConcept : mapping.keyConceptEn}
                    </p>
                  </div>

                  <Link
                    to={`/simulations/${mapping.simulationId}`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    {t("launch_lab")}
                  </Link>
                </div>

                {/* Parallel Cards */}
                <div className="grid md:grid-cols-2 gap-4 relative">
                  {/* KNTT Card */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    isKnttActive 
                      ? "bg-indigo-950/20 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/20" 
                      : "bg-slate-950/50 border-slate-800/80"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                        {t("kntt_short")}
                      </span>
                      {mapping.knttPage && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {t("page")} {mapping.knttPage}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-400">{mapping.knttChapter}</div>
                    <div className="text-sm font-bold text-slate-100 mt-1">
                      {mapping.knttLessonNum}: {mapping.knttLesson}
                    </div>
                  </div>

                  {/* CTST Card */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    !isKnttActive 
                      ? "bg-emerald-950/20 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20" 
                      : "bg-slate-950/50 border-slate-800/80"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        {t("ctst_short")}
                      </span>
                      {mapping.ctstPage && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {t("page")} {mapping.ctstPage}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-400">{mapping.ctstChapter}</div>
                    <div className="text-sm font-bold text-slate-100 mt-1">
                      {mapping.ctstLessonNum}: {mapping.ctstLesson}
                    </div>
                  </div>
                </div>

                {/* Footer: Figures and Core Formulas */}
                <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <FlaskConical className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-slate-300 font-semibold">{t("experiment_sgk")}:</strong> {mapping.textbookFigures}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {mapping.formulas.slice(0, 2).map((formula, fIdx) => (
                      <span key={fIdx} className="font-mono text-[11px] bg-slate-950 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded">
                        {formula}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredMappings.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
              {language === "VN" ? "Không tìm thấy bài học phù hợp với từ khóa." : "No curriculum mappings matched your search query."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
