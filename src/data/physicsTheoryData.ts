// PhysiX is a sibling project of STEMX under the shared science_engineering directory.
import { chaptersData } from "../../../physiX/src/data/chapters";
import { quizzesData } from "../../../physiX/src/data/quizzes";

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

const unavailableLesson = (number: number, chapterId: string, chapterTitle: string): PhysicsTheoryLesson => ({
  id: `bai-${number}`,
  number,
  title: `Bài ${number}: Nội dung đang cập nhật`,
  chapterId,
  chapterTitle,
  shortDescription: "Dữ liệu bài học này chưa có trong nguồn PhysiX hiện tại.",
  theoryContent: {
    sections: [{
      title: "Nội dung bài học",
      content: "Nội dung lý thuyết của bài học đang được cập nhật. Vui lòng quay lại sau.",
      keyTakeaway: "Chưa có dữ liệu nguồn cho bài học này.",
    }],
    formulas: [],
    keyTakeaways: ["Nội dung đang được cập nhật."],
  },
  quizQuestions: [],
  available: false,
});

const sourceLessons = chaptersData
  .flatMap((chapter) => chapter.lessons.map((lesson) => ({ chapter, lesson })))
  .filter(({ lesson }) => lesson.number >= 1 && lesson.number <= 20)
  .sort((a, b) => a.lesson.number - b.lesson.number);

const normalizeLesson = ({ chapter, lesson }: (typeof sourceLessons)[number]): PhysicsTheoryLesson => {
  const sections = lesson?.theory?.sections ?? lesson?.sections ?? lesson?.theorySections ?? [];
  const formulas = lesson?.summaryFormulas ?? lesson?.theory?.formulas ?? [];
  const questions = lesson?.practice?.questions ?? quizzesData[lesson?.id ?? ""] ?? [];

  return {
    id: lesson?.id ?? `bai-${lesson?.number ?? 0}`,
    number: lesson?.number ?? 0,
    title: lesson?.title ?? "Bài học đang cập nhật",
    chapterId: chapter?.id ?? "chuong-chua-xac-dinh",
    chapterTitle: chapter?.title ?? "Chương trình Vật lí 10",
    shortDescription: lesson?.shortDesc ?? lesson?.description ?? "Nội dung đang cập nhật...",
    theoryContent: {
      sections: sections.map((section) => ({
        title: section?.title ?? "Mục kiến thức",
        content: section?.content ?? "Nội dung đang cập nhật...",
        keyTakeaway: section?.keyTakeaway,
        note: section?.note,
        formulas: section?.formulas ?? [],
      })),
      formulas: formulas.map((formula) => typeof formula === "string"
        ? { name: "Công thức", latex: formula }
        : {
            name: formula?.name ?? "Công thức trọng tâm",
            latex: formula?.latex ?? "",
            unit: formula?.unit ?? formula?.units,
            notes: formula?.notes ?? formula?.description,
          }),
      keyTakeaways: lesson?.theory?.keyTakeaways ?? sections
        .map((section) => section?.keyTakeaway)
        .filter((value): value is string => Boolean(value)),
    },
    quizQuestions: questions.map((question) => ({
      id: question?.id ?? `${lesson?.id ?? "lesson"}-question`,
      question: question?.question ?? "Câu hỏi đang cập nhật...",
      options: question?.options ?? [],
      correctAnswer: question?.correctAnswer ?? 0,
      explanation: question?.explanation ?? "Giải thích đang cập nhật...",
      difficulty: question?.difficulty,
    })),
    available: true,
  };
};

const normalizedLessons = sourceLessons.map(normalizeLesson);
const lessonByNumber = new Map(normalizedLessons.map((lesson) => [lesson.number, lesson]));

// PhysiX currently supplies Bài 1–16. Keep the requested 1–20 navigation stable
// without inventing textbook content for the four missing source lessons.
const allLessons = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return lessonByNumber.get(number) ?? unavailableLesson(
    number,
    number <= 16 ? "chuong-3" : "chuong-3-mo-rong",
    number <= 16 ? "Động lực học" : "Động lực học (Bài 17–20)",
  );
});

export const physicsTheoryChapters: PhysicsTheoryChapter[] = [
  {
    id: "chuong-1",
    number: 1,
    title: "Mở đầu",
    lessons: allLessons.filter((lesson) => lesson.number <= 3),
  },
  {
    id: "chuong-2",
    number: 2,
    title: "Động học",
    lessons: allLessons.filter((lesson) => lesson.number >= 4 && lesson.number <= 12),
  },
  {
    id: "chuong-3",
    number: 3,
    title: "Động lực học",
    lessons: allLessons.filter((lesson) => lesson.number >= 13 && lesson.number <= 16),
  },
  {
    id: "chuong-3-mo-rong",
    number: 4,
    title: "Động lực học — Bài 17–20",
    lessons: allLessons.filter((lesson) => lesson.number >= 17),
  },
];

export const physicsTheoryLessons = allLessons;
export const getPhysicsTheoryLesson = (lessonId: string) =>
  physicsTheoryLessons.find((lesson) => lesson.id === lessonId) ?? physicsTheoryLessons[0];
