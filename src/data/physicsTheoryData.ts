import { curriculumChapters, ChapterItem, LessonItem } from "./curriculumData";

export interface TheorySectionNote {
  title: string;
  content: string;
  keyTakeaway?: string;
  note?: string;
  formulas?: Array<string | { name?: string; latex?: string; description?: string; units?: string }>;
}

export interface TheoryQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard" | "expert";
}

export interface PhysicsTheoryLesson {
  id: string;
  number: number;
  title: string;
  chapterId: string;
  chapterTitle: string;
  shortDescription: string;
  simulationId?: string;
  labTag?: string;
  theoryContent: {
    sections: TheorySectionNote[];
    formulas: Array<{ name: string; latex: string; unit?: string; notes?: string }>;
    keyTakeaways: string[];
  };
  quizQuestions: TheoryQuizQuestion[];
  available: boolean;
}

export interface PhysicsTheoryChapter {
  id: string;
  number: number;
  title: string;
  lessons: PhysicsTheoryLesson[];
}

function mapLessonToTheoryLesson(lesson: LessonItem, chapter: ChapterItem): PhysicsTheoryLesson {
  const sections: TheorySectionNote[] = (lesson.theory?.part1_points ?? []).map((point, index) => ({
    title: point.heading ?? `Mục ${point.num ?? index + 1}`,
    content: point.content ?? "",
    keyTakeaway: index === 0 ? lesson.theory?.ghiNho : undefined,
  }));

  const formulas = (lesson.theory?.part2_formulas ?? []).map((f) => ({
    name: f.quantity || f.symbol || "Công thức",
    latex: f.formula ?? "",
    unit: f.unit,
    notes: f.meaning,
  }));

  const keyTakeaways = [
    ...(lesson.theory?.ghiNho ? [lesson.theory.ghiNho] : []),
    ...(lesson.theory?.part3_applications ?? []),
  ].filter(Boolean);

  const quizQuestions: TheoryQuizQuestion[] = (lesson.quizzes ?? []).map((quiz) => ({
    id: quiz.id,
    question: quiz.question,
    options: quiz.options ?? [],
    correctAnswer: quiz.correctIndex ?? 0,
    explanation: quiz.explanation ?? "",
    difficulty: "medium",
  }));

  return {
    id: lesson.id,
    number: lesson.lessonNum,
    title: `Bài ${lesson.lessonNum}: ${lesson.title}`,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    shortDescription: lesson.subtitle || "Nội dung lý thuyết trọng tâm.",
    simulationId: lesson.simulationId,
    labTag: lesson.labTag,
    theoryContent: {
      sections,
      formulas,
      keyTakeaways,
    },
    quizQuestions,
    available: true,
  };
}

export const physicsTheoryChapters: PhysicsTheoryChapter[] = curriculumChapters.map(
  (chapter, index) => {
    const chapterNum = index + 1;
    return {
      id: chapter.id,
      number: chapterNum,
      title: chapter.title,
      lessons: chapter.lessons.map((lesson) => mapLessonToTheoryLesson(lesson, chapter)),
    };
  }
);

export const physicsTheoryLessons: PhysicsTheoryLesson[] = physicsTheoryChapters.flatMap(
  (chapter) => chapter.lessons
);

export const getPhysicsTheoryLesson = (lessonId: string): PhysicsTheoryLesson =>
  physicsTheoryLessons.find((lesson) => lesson.id === lessonId) ?? physicsTheoryLessons[0];
