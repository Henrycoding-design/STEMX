import React, { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { physicsTheoryChapters, physicsTheoryLessons, PhysicsTheoryLesson } from "../../data/physicsTheoryData";
import { useAppProgress } from "../../context/AppContext";
import MarkdownRenderer from "../common/MarkdownRenderer";
import { Latex } from "../common/Latex";

function Formula({ value }: { value?: string }) {
  const formula = value ?? "";
  if (!formula.trim()) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-center font-mono text-sm text-indigo-200">
      <Latex content={formula} block />
    </div>
  );
}

function LessonQuiz({ lesson }: { lesson: PhysicsTheoryLesson }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [lesson.id]);

  const questions = lesson?.quizQuestions ?? [];
  const correct = questions.filter((question) => answers[question.id] === question.correctAnswer).length;
  const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
        <Award className="mx-auto mb-3 h-8 w-8 text-slate-500" />
        <p className="text-sm text-slate-300">Bài luyện tập của bài này đang được cập nhật.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-100"><Award className="h-5 w-5 text-indigo-400" /> Luyện tập &amp; củng cố</h2>
          <p className="mt-1 text-xs text-slate-400">{questions.length} câu hỏi theo nội dung bài học</p>
        </div>
        {submitted && <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-300">Điểm: {score}%</span>}
      </div>

      {questions.map((question, index) => {
        const selected = answers[question.id];
        return (
          <div key={question.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex gap-3 text-sm font-medium leading-relaxed text-slate-100">
              <span className="font-mono text-xs text-indigo-400">{index + 1}.</span>
              <MarkdownRenderer content={question.question ?? "Câu hỏi đang cập nhật..."} />
            </div>
            <div className="space-y-2">
              {(question.options ?? []).map((option, optionIndex) => {
                const isCorrect = submitted && optionIndex === question.correctAnswer;
                const isWrong = submitted && selected === optionIndex && optionIndex !== question.correctAnswer;
                return (
                  <button
                    key={`${question.id}-${optionIndex}`}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }))}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      isCorrect ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200" :
                      isWrong ? "border-rose-500/60 bg-rose-500/10 text-rose-200" :
                      selected === optionIndex ? "border-indigo-500/70 bg-indigo-500/10 text-indigo-100" :
                      "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-indigo-500/50 hover:text-slate-100"
                    }`}
                  >
                    <MarkdownRenderer content={option ?? ""} />
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-4 border-l-2 border-indigo-500/70 bg-indigo-500/5 px-3 py-2 text-xs leading-relaxed text-slate-300">
                <MarkdownRenderer content={question.explanation ?? "Giải thích đang cập nhật..."} />
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap justify-end gap-2">
        {submitted && <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"><RotateCcw className="h-3.5 w-3.5" /> Làm lại</button>}
        <button type="button" onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length === 0 || submitted} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40">Chấm bài</button>
      </div>
    </div>
  );
}

export default function TheoryNotes() {
  const { setTheoryContext } = useAppProgress();
  const [selectedLessonId, setSelectedLessonId] = useState("bai-1");
  const [activeCurriculum, setActiveCurriculum] = useState<"KNTT" | "CTST">("KNTT");
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    "chuong-1": true,
    "chuong-2": true,
    "chuong-3": true,
    "chuong-3-mo-rong": false,
  });
  const [activePane, setActivePane] = useState<"notes" | "quiz">("notes");
  const currentLesson = useMemo(() => physicsTheoryLessons.find((lesson) => lesson.id === selectedLessonId) ?? physicsTheoryLessons[0], [selectedLessonId]);

  useEffect(() => {
    const lesson = currentLesson;
    setTheoryContext({
      lessonId: lesson?.id ?? "",
      lessonTitle: `${activeCurriculum} — ${lesson?.title ?? "Bài học Vật lí 10"}`,
      theory: (lesson?.theoryContent?.sections ?? []).map((section) => `${section?.title ?? ""}: ${section?.content ?? ""}`).join("\n\n"),
      quizzes: (lesson?.quizQuestions ?? []).map((question) => `${question?.question ?? ""} | Các lựa chọn: ${(question?.options ?? []).join("; ")}`).join("\n"),
    });
  }, [activeCurriculum, currentLesson, setTheoryContext]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 shadow-xl sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400"><BookOpen className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">KNTT &amp; CTST • Vật lí 10</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Lý thuyết &amp; Ghi chú</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">Đọc ghi chú SGK có cấu trúc, công thức và luyện tập theo từng bài. Nội dung được chuẩn hóa từ mô-đun Theory Notes của PhysiX.</p>
            <div className="mt-4 inline-flex rounded-xl border border-slate-800 bg-slate-950/70 p-1">
              {(["KNTT", "CTST"] as const).map((curriculum) => <button key={curriculum} type="button" onClick={() => setActiveCurriculum(curriculum)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${activeCurriculum === curriculum ? (curriculum === "KNTT" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white") : "text-slate-400 hover:bg-slate-800"}`}>{curriculum === "KNTT" ? "Kết nối tri thức" : "Chân trời sáng tạo"}</button>)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900/70 p-3 lg:sticky lg:top-24">
          <div className="mb-2 border-b border-slate-800 px-2 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mục lục bài học</div>
          <div className="max-h-[calc(100vh-11rem)] space-y-2 overflow-y-auto pr-1">
            {physicsTheoryChapters.map((chapter) => {
              const expanded = expandedChapters[chapter.id] !== false;
              return <div key={chapter.id}>
                <button type="button" onClick={() => setExpandedChapters((previous) => ({ ...previous, [chapter.id]: !expanded }))} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hover:bg-slate-800/70 hover:text-slate-200">
                  <span>Chương {chapter.number}: {chapter.title}</span>{expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
                {expanded && <div className="ml-2 space-y-0.5 border-l border-slate-800 pl-2">
                  {chapter.lessons.map((lesson) => <button key={lesson.id} type="button" onClick={() => setSelectedLessonId(lesson.id)} className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${lesson.id === currentLesson?.id ? "border border-indigo-500/30 bg-indigo-500/10 text-indigo-200" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}><span className="font-mono text-[10px] text-slate-500">Bài {lesson.number}</span><span className="mt-0.5 block leading-snug">{lesson.title.replace(/^Bài \d+:\s*/, "")}</span></button>)}
                </div>}
              </div>;
            })}
          </div>
        </aside>

        <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-7">
          <div className="mb-6 border-b border-slate-800 pb-5">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-indigo-300">BÀI {currentLesson?.number ?? "—"}</span><span>•</span><span>{currentLesson?.chapterTitle ?? "Chương trình Vật lí 10"}</span></div>
            <h2 className="text-2xl font-bold text-slate-100">{currentLesson?.title ?? "Bài học đang cập nhật"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{currentLesson?.shortDescription ?? "Nội dung đang cập nhật..."}</p>
            <div className="mt-5 flex gap-1 rounded-xl border border-slate-800 bg-slate-950/70 p-1">
              <button type="button" onClick={() => setActivePane("notes")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${activePane === "notes" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><BookOpen className="mr-1.5 inline h-3.5 w-3.5" />Ghi chú lý thuyết</button>
              <button type="button" onClick={() => setActivePane("quiz")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${activePane === "quiz" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><CheckCircle2 className="mr-1.5 inline h-3.5 w-3.5" />Luyện tập ({currentLesson?.quizQuestions?.length ?? 0})</button>
            </div>
          </div>

          {activePane === "quiz" ? <LessonQuiz lesson={currentLesson} /> : <div className="space-y-8">
            {(currentLesson?.theoryContent?.sections ?? []).map((section, index) => <article key={`${currentLesson?.id}-${index}`} className="space-y-3 border-b border-slate-800/80 pb-7 last:border-0">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-100"><span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-indigo-300">{index + 1}</span>{section?.title ?? "Mục kiến thức"}</h3>
              <MarkdownRenderer content={section?.content ?? "Nội dung đang cập nhật..."} className="text-sm sm:text-base" />
              {(section?.formulas ?? []).length > 0 && <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300"><Lightbulb className="h-3.5 w-3.5" /> Công thức trọng tâm</div>{(section?.formulas ?? []).map((formula, formulaIndex) => <div key={formulaIndex}><p className="mb-1 text-xs text-slate-400">{typeof formula === "string" ? "Công thức" : formula?.name ?? "Công thức"}</p><Formula value={typeof formula === "string" ? formula : formula?.latex} /></div>)}</div>}
              {section?.keyTakeaway && <div className="border-l-2 border-emerald-500/70 bg-emerald-500/5 px-3 py-2 text-xs leading-relaxed text-slate-300"><strong className="text-emerald-400">Ghi nhớ: </strong><MarkdownRenderer content={section.keyTakeaway ?? ""} /></div>}
              {section?.note && <div className="border-l-2 border-amber-500/70 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-slate-300"><strong className="text-amber-300">Lưu ý: </strong><MarkdownRenderer content={section.note ?? ""} /></div>}
            </article>)}
            {(currentLesson?.theoryContent?.formulas ?? []).length > 0 && <div className="space-y-3"><h3 className="text-base font-semibold text-slate-100">Bảng công thức nhanh</h3><div className="grid gap-3 md:grid-cols-2">{(currentLesson?.theoryContent?.formulas ?? []).map((formula, index) => <div key={index} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><p className="mb-2 text-xs font-medium text-slate-400">{formula?.name ?? "Công thức"}</p><Formula value={formula?.latex} />{formula?.notes && <p className="mt-2 text-xs text-slate-500">{formula.notes}</p>}</div>)}</div></div>}
          </div>}
        </section>
      </div>
    </div>
  );
}
