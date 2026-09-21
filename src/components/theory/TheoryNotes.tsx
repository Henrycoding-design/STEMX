import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  ArrowUp,
  Search,
  Hash,
} from "lucide-react";
import { physicsTheoryChapters, physicsTheoryLessons, PhysicsTheoryLesson } from "../../data/physicsTheoryData";
import { useAppProgress } from "../../context/AppContext";
import MarkdownRenderer from "../common/MarkdownRenderer";
import { Latex } from "../common/Latex";

const THEORY_NOTES_STORAGE_KEY = "stemx:theory-notes:ui";
const THEORY_QUIZ_STORAGE_KEY_PREFIX = "stemx:theory-notes:quiz:";

type ActiveTheoryPane = "notes" | "quiz";
type TheoryNotesStorage = {
  selectedLessonId?: string;
  activePane?: ActiveTheoryPane;
};
type LessonQuizStorage = {
  answers?: Record<string, number>;
  submitted?: boolean;
};

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readJsonFromSessionStorage<T>(key: string): T | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJsonToSessionStorage<T>(key: string, value: T) {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures so the lesson UI remains usable in private/limited storage contexts.
  }
}

function getStoredTheoryNotesState(): TheoryNotesStorage {
  const stored = readJsonFromSessionStorage<TheoryNotesStorage>(THEORY_NOTES_STORAGE_KEY);
  const lessonExists = physicsTheoryLessons.some((lesson) => lesson.id === stored?.selectedLessonId);
  return {
    selectedLessonId: lessonExists ? stored?.selectedLessonId : undefined,
    activePane: stored?.activePane === "quiz" ? "quiz" : stored?.activePane === "notes" ? "notes" : undefined,
  };
}

function getStoredQuizState(lesson: PhysicsTheoryLesson): Required<LessonQuizStorage> {
  const stored = readJsonFromSessionStorage<LessonQuizStorage>(`${THEORY_QUIZ_STORAGE_KEY_PREFIX}${lesson.id}`);
  const questionIds = new Set((lesson.quizQuestions ?? []).map((question) => question.id));
  const answers = Object.entries(stored?.answers ?? {}).reduce<Record<string, number>>((acc, [questionId, answer]) => {
    if (questionIds.has(questionId) && Number.isInteger(answer)) {
      acc[questionId] = answer;
    }
    return acc;
  }, {});

  return {
    answers,
    submitted: stored?.submitted === true,
  };
}

/* ------------------------------------------------------------------ */
/*  Formula display                                                    */
/* ------------------------------------------------------------------ */
function Formula({ value }: { value?: string }) {
  const formula = value ?? "";
  if (!formula.trim()) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-center font-mono text-sm text-indigo-200">
      <Latex content={formula} block />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quiz section                                                       */
/* ------------------------------------------------------------------ */
function LessonQuiz({ lesson }: { lesson: PhysicsTheoryLesson }) {
  const [answers, setAnswers] = useState<Record<string, number>>(() => getStoredQuizState(lesson).answers);
  const [submitted, setSubmitted] = useState(() => getStoredQuizState(lesson).submitted);
  const quizStorageKey = `${THEORY_QUIZ_STORAGE_KEY_PREFIX}${lesson.id}`;

  useEffect(() => {
    const stored = getStoredQuizState(lesson);
    setAnswers(stored.answers);
    setSubmitted(stored.submitted);
  }, [lesson.id]);

  useEffect(() => {
    writeJsonToSessionStorage<LessonQuizStorage>(quizStorageKey, { answers, submitted });
  }, [answers, quizStorageKey, submitted]);

  const questions = lesson?.quizQuestions ?? [];
  const correct = questions.filter((question) => answers[question.id] === question.correctAnswer).length;
  const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
        <Award className="mx-auto mb-3 h-10 w-10 text-slate-500" />
        <p className="text-sm text-slate-300">Bài luyện tập của bài này đang được cập nhật.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Quiz header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-100">
            <Award className="h-5 w-5 text-indigo-400" /> Luyện tập &amp; củng cố
          </h2>
          <p className="mt-1 text-xs text-slate-400">{questions.length} câu hỏi theo nội dung bài học</p>
        </div>
        <div className="flex items-center gap-3">
          {submitted && (
            <span className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              score >= 80
                ? "bg-emerald-500/10 text-emerald-300"
                : score >= 50
                ? "bg-amber-500/10 text-amber-300"
                : "bg-rose-500/10 text-rose-300"
            }`}>
              Điểm: {score}%
            </span>
          )}
        </div>
      </div>

      {/* Questions */}
      {questions.map((question, index) => {
        const selected = answers[question.id];
        return (
          <div key={question.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="mb-4 flex gap-3 text-sm font-medium leading-relaxed text-slate-100">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 font-mono text-xs font-bold text-indigo-400">
                {index + 1}
              </span>
              <div className="flex-1">
                <MarkdownRenderer content={question.question ?? "Câu hỏi đang cập nhật..."} />
              </div>
            </div>
            <div className="space-y-2 pl-9">
              {(question.options ?? []).map((option, optionIndex) => {
                const isCorrect = submitted && optionIndex === question.correctAnswer;
                const isWrong = submitted && selected === optionIndex && optionIndex !== question.correctAnswer;
                return (
                  <button
                    key={`${question.id}-${optionIndex}`}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }))}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150 ${
                      isCorrect ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/30" :
                      isWrong ? "border-rose-500/60 bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/30" :
                      selected === optionIndex ? "border-indigo-500/70 bg-indigo-500/10 text-indigo-100" :
                      "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:text-slate-100"
                    }`}
                  >
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-800/80 text-[10px] font-bold text-slate-400">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <MarkdownRenderer content={option ?? ""} />
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className="ml-9 mt-4 rounded-xl border-l-2 border-indigo-500/70 bg-indigo-500/5 px-4 py-3 text-xs leading-relaxed text-slate-300">
                <MarkdownRenderer content={question.explanation ?? "Giải thích đang cập nhật..."} />
              </div>
            )}
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        {submitted && (
          <button
            type="button"
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Làm lại
          </button>
        )}
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length === 0 || submitted}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Chấm bài
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main TheoryNotes component                                         */
/* ------------------------------------------------------------------ */
export default function TheoryNotes() {
  const { setTheoryContext } = useAppProgress();
  const [selectedLessonId, setSelectedLessonId] = useState(() => getStoredTheoryNotesState().selectedLessonId ?? "bai-1");
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    "chuong-1": true,
    "chuong-2": true,
    "chuong-3": true,
    "chuong-4": true,
    "chuong-5": true,
    "chuong-6": true,
    "chuong-7": true,
    "chuyen-de": true,
  });
  const [activePane, setActivePane] = useState<ActiveTheoryPane>(() => getStoredTheoryNotesState().activePane ?? "notes");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const currentLesson = useMemo(
    () => physicsTheoryLessons.find((lesson) => lesson.id === selectedLessonId) ?? physicsTheoryLessons[0],
    [selectedLessonId],
  );

  // Filter chapters/lessons by search term
  const filteredChapters = useMemo(() => {
    if (!sidebarSearch.trim()) return physicsTheoryChapters;
    const lower = sidebarSearch.toLowerCase();
    return physicsTheoryChapters
      .map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.filter(
          (l) => l.title.toLowerCase().includes(lower) || `bài ${l.number}`.includes(lower),
        ),
      }))
      .filter((chapter) => chapter.lessons.length > 0 || chapter.title.toLowerCase().includes(lower));
  }, [sidebarSearch]);

  // Scroll-to-top visibility
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Push theory context for AI tutor
  useEffect(() => {
    const lesson = currentLesson;
    setTheoryContext({
      lessonId: lesson?.id ?? "",
      lessonTitle: `KNTT & CTST — ${lesson?.title ?? "Bài học Vật lí 10"}`,
      theory: (lesson?.theoryContent?.sections ?? []).map((section) => `${section?.title ?? ""}: ${section?.content ?? ""}`).join("\n\n"),
      quizzes: (lesson?.quizQuestions ?? []).map((question) => `${question?.question ?? ""} | Các lựa chọn: ${(question?.options ?? []).join("; ")}`).join("\n"),
    });
  }, [currentLesson, setTheoryContext]);

  const scrollToTop = useCallback(() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }), []);

  useEffect(() => {
    writeJsonToSessionStorage<TheoryNotesStorage>(THEORY_NOTES_STORAGE_KEY, { selectedLessonId, activePane });
  }, [activePane, selectedLessonId]);

  const selectLesson = useCallback((lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActivePane("notes");
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Navigate between lessons
  const currentIndex = physicsTheoryLessons.findIndex((l) => l.id === selectedLessonId);
  const prevLesson = currentIndex > 0 ? physicsTheoryLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < physicsTheoryLessons.length - 1 ? physicsTheoryLessons[currentIndex + 1] : null;

  const sections = currentLesson?.theoryContent?.sections ?? [];

  return (
    <div className="page-container mx-auto flex h-full max-w-[1440px] flex-col gap-5 overflow-hidden">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className={`hero-panel shrink-0 rounded-2xl transition-all duration-300 ${headerCollapsed ? "p-3 sm:p-4" : "p-5 sm:p-7"}`}>
        <div className="flex items-start gap-4">
          <div className={`rounded-2xl bg-indigo-500/10 text-indigo-400 transition-all ${headerCollapsed ? "p-2" : "p-3"}`}>
            <BookOpen className={headerCollapsed ? "h-5 w-5" : "h-6 w-6"} />
          </div>
          <div className="min-w-0 flex-1">
            {!headerCollapsed && (
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">KNTT &amp; CTST • Vật lí 10</p>
            )}
            <h1 className={`${headerCollapsed ? "text-lg" : "mt-1 text-2xl sm:text-3xl"} font-extrabold tracking-tight text-white`}>
              Lý thuyết &amp; Ghi chú
            </h1>
            {!headerCollapsed && (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
                Đọc ghi chú SGK có cấu trúc, công thức trọng tâm và luyện tập theo từng bài học chuẩn GDPT 2018.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setHeaderCollapsed((value) => !value)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800/80 hover:text-slate-200"
            title={headerCollapsed ? "Mở tiêu đề" : "Thu gọn tiêu đề"}
          >
            {headerCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ─── Two-column layout ───────────────────────────────────── */}
      <div className={`grid min-h-0 flex-1 gap-5 overflow-hidden ${sidebarCollapsed ? "lg:grid-cols-[48px_minmax(0,1fr)]" : "lg:grid-cols-[300px_minmax(0,1fr)]"} transition-[grid-template-columns] duration-300`}>

        {/* ─── Sidebar ─────────────────────────────────────────── */}
        <aside className={`flex min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/70 transition-all duration-300 ${sidebarCollapsed ? "overflow-hidden p-1.5" : "p-3"}`}>
          {/* Collapse toggle (desktop only) */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="mb-1 hidden w-full items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-800/80 hover:text-slate-300 lg:flex"
            title={sidebarCollapsed ? "Mở mục lục" : "Thu gọn mục lục"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {!sidebarCollapsed && (
            <>
              {/* Search */}
              <div className="relative mb-3 px-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Tìm bài học..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                />
              </div>

              <div className="mb-2 border-b border-slate-800 px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Mục lục bài học
              </div>

              {/* Chapter list */}
              <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
                {filteredChapters.map((chapter) => {
                  const expanded = expandedChapters[chapter.id] !== false;
                  return (
                    <div key={chapter.id}>
                      <button
                        type="button"
                        onClick={() => setExpandedChapters((previous) => ({ ...previous, [chapter.id]: !expanded }))}
                        className="flex w-full items-center justify-between gap-1 rounded-lg px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-slate-200"
                      >
                        <span className="line-clamp-2">Ch.{chapter.number}: {chapter.title}</span>
                        {expanded ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
                      </button>
                      {expanded && (
                        <div className="ml-2 space-y-0.5 border-l border-slate-800/70 pl-2">
                          {chapter.lessons.map((lesson) => {
                            const isActive = lesson.id === currentLesson?.id;
                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => selectLesson(lesson.id)}
                                className={`group w-full rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                                  isActive
                                    ? "border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 shadow-sm shadow-indigo-500/5"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                                }`}
                              >
                                <span className={`font-mono text-[10px] ${isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-500"}`}>
                                  Bài {lesson.number}
                                </span>
                                <span className="mt-0.5 block leading-snug">
                                  {lesson.title.replace(/^Bài \d+:\s*/, "")}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredChapters.length === 0 && (
                  <p className="px-2 py-4 text-center text-xs text-slate-500">Không tìm thấy bài học.</p>
                )}
              </div>
            </>
          )}
        </aside>

        {/* ─── Main content ────────────────────────────────────── */}
        <section ref={contentRef} className="relative min-h-0 min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-y-auto scroll-smooth">
          {/* Scroll-to-top FAB */}
          {showScrollTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="sticky top-3 z-20 mx-auto -mb-9 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/5 text-slate-300 shadow-md backdrop-blur-sm transition-all hover:bg-slate-800/50 hover:text-white"
              title="Lên đầu trang"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
          <div className="p-5 sm:p-7 lg:p-8">
            {/* Lesson header */}
            <div className="mb-6 border-b border-slate-800 pb-5">
              {/* Breadcrumb */}
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-mono font-semibold text-indigo-300">
                  BÀI {currentLesson?.number ?? "—"}
                </span>
                <span>•</span>
                <span>{currentLesson?.chapterTitle ?? "Chương trình Vật lí 10"}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">{currentLesson?.title ?? "Bài học đang cập nhật"}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
                {currentLesson?.shortDescription ?? "Nội dung đang cập nhật..."}
              </p>

              {/* Section mini-nav (jump links) */}
              {activePane === "notes" && sections.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {sections.map((section, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        document.getElementById(`theory-section-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 text-[11px] text-slate-400 transition-colors hover:border-indigo-500/30 hover:text-indigo-300"
                    >
                      <Hash className="h-3 w-3" />
                      {section?.title ?? `Mục ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Tab switcher */}
              <div className="mt-5 flex flex-wrap gap-1.5 rounded-xl border border-slate-800 bg-slate-950/70 p-1">
                <button
                  type="button"
                  onClick={() => setActivePane("notes")}
                  className={`flex-1 min-w-[120px] rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activePane === "notes"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <BookOpen className="mr-1.5 inline h-3.5 w-3.5" />
                  Ghi chú lý thuyết
                </button>
                <button
                  type="button"
                  onClick={() => setActivePane("quiz")}
                  className={`flex-1 min-w-[120px] rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activePane === "quiz"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="mr-1.5 inline h-3.5 w-3.5" />
                  Luyện tập ({currentLesson?.quizQuestions?.length ?? 0})
                </button>
                {currentLesson?.simulationId && (
                  <Link
                    to={`/simulations/${currentLesson.simulationId}`}
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center rounded-lg px-3 py-2.5 text-xs font-semibold text-emerald-300 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors"
                    title={currentLesson.labTag ? `Mở thí nghiệm ảo: ${currentLesson.labTag}` : "Mở phòng thí nghiệm ảo tương ứng"}
                  >
                    <FlaskConical className="mr-1.5 inline h-3.5 w-3.5 text-emerald-400" />
                    Thí nghiệm ảo
                    <ExternalLink className="ml-1.5 inline h-3 w-3 opacity-70" />
                  </Link>
                )}
              </div>
            </div>

            {/* ─── Content pane ─────────────────────────────────── */}
            {activePane === "quiz" ? (
              <LessonQuiz lesson={currentLesson} />
            ) : (
              <div className="space-y-10">
                {/* Theory sections */}
                {sections.map((section, index) => (
                  <article
                    key={`${currentLesson?.id}-${index}`}
                    id={`theory-section-${index}`}
                    className="scroll-mt-4 space-y-4 border-b border-slate-800/60 pb-8 last:border-0 last:pb-0"
                  >
                    {/* Section title */}
                    <h3 className="flex items-center gap-2.5 text-base font-semibold text-slate-100 sm:text-lg">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 font-mono text-xs font-bold text-indigo-400">
                        {index + 1}
                      </span>
                      {section?.title ?? "Mục kiến thức"}
                    </h3>

                    {/* Section content */}
                    <div className="pl-0 sm:pl-9">
                      <MarkdownRenderer
                        content={section?.content ?? "Nội dung đang cập nhật..."}
                        className="text-sm leading-relaxed sm:text-[15px]"
                      />
                    </div>

                    {/* Formulas box */}
                    {(section?.formulas ?? []).length > 0 && (
                      <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-slate-950/80 to-amber-950/10 p-5 sm:ml-9">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                          <Lightbulb className="h-4 w-4" /> Công thức trọng tâm
                        </div>
                        <div className="space-y-3">
                          {(section?.formulas ?? []).map((formula, formulaIndex) => (
                            <div key={formulaIndex}>
                              <p className="mb-1.5 text-xs font-medium text-slate-400">
                                {typeof formula === "string" ? "Công thức" : formula?.name ?? "Công thức"}
                              </p>
                              <Formula value={typeof formula === "string" ? formula : formula?.latex} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key takeaway */}
                    {section?.keyTakeaway && (
                      <div className="rounded-xl border-l-[3px] border-emerald-500/70 bg-emerald-500/5 px-4 py-3 sm:ml-9">
                        <strong className="text-xs font-semibold text-emerald-400">💡 Ghi nhớ: </strong>
                        <MarkdownRenderer content={section.keyTakeaway ?? ""} className="mt-1 text-xs" />
                      </div>
                    )}

                    {/* Note */}
                    {section?.note && (
                      <div className="rounded-xl border-l-[3px] border-amber-500/70 bg-amber-500/5 px-4 py-3 sm:ml-9">
                        <strong className="text-xs font-semibold text-amber-300">⚠ Lưu ý: </strong>
                        <MarkdownRenderer content={section.note ?? ""} className="mt-1 text-xs" />
                      </div>
                    )}
                  </article>
                ))}

                {/* Global formula table */}
                {(currentLesson?.theoryContent?.formulas ?? []).length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-semibold text-slate-100 sm:text-lg">📋 Bảng công thức nhanh</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(currentLesson?.theoryContent?.formulas ?? []).map((formula, index) => (
                        <div key={index} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                          <p className="mb-2 text-xs font-medium text-slate-400">{formula?.name ?? "Công thức"}</p>
                          <Formula value={formula?.latex} />
                          {formula?.notes && <p className="mt-2 text-xs leading-relaxed text-slate-500">{formula.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prev / Next navigation */}
                <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-between">
                  {prevLesson ? (
                    <button
                      type="button"
                      onClick={() => selectLesson(prevLesson.id)}
                      className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-left text-xs transition-colors hover:border-indigo-500/30 hover:bg-slate-900"
                    >
                      <ChevronLeft className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400" />
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-500">Bài trước</span>
                        <span className="mt-0.5 block text-sm text-slate-300 group-hover:text-slate-100">{prevLesson.title}</span>
                      </div>
                    </button>
                  ) : <div />}
                  {nextLesson ? (
                    <button
                      type="button"
                      onClick={() => selectLesson(nextLesson.id)}
                      className="group flex items-center justify-end gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-right text-xs transition-colors hover:border-indigo-500/30 hover:bg-slate-900"
                    >
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-500">Bài tiếp</span>
                        <span className="mt-0.5 block text-sm text-slate-300 group-hover:text-slate-100">{nextLesson.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400" />
                    </button>
                  ) : <div />}
                </div>
              </div>
            )}
          </div>

        </section>
      </div>
    </div>
  );
}
