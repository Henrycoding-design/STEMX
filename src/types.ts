export type Language = "VN" | "ENG";
export type CurriculumType = "KNTT" | "CTST";
export type Subject = "Physics";

export interface TopicMapping {
  id: string;
  topicName: string;
  topicNameEn: string;
  knttChapter: string;
  knttLesson: string;
  knttLessonNum: string;
  knttPage?: number | string;
  ctstChapter: string;
  ctstLesson: string;
  ctstLessonNum: string;
  ctstPage?: number | string;
  keyConcept: string;
  keyConceptEn: string;
  formulas: string[];
  simulationId: string;
  textbookFigures: string;
}

export interface SimulationInfo {
  id: string;
  title: string;
  titleEn: string;
  subject: Subject;
  topic: string;
  topicEn: string;
  difficulty: "Cơ bản" | "Trung bình" | "Nâng cao";
  difficultyEn: "Beginner" | "Intermediate" | "Advanced";
  knttRef: string;
  ctstRef: string;
  curriculumCompatibility: string[];
  description: string;
  descriptionEn: string;
  formula: string[];
  theory: string;
  theoryEn: string;
}

export interface QuizQuestion {
  id: string;
  simulationId: string;
  question: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correctIndex: number;
  explanation: string;
  explanationEn: string;
  conceptTested: string;
  textbookRef: string;
}

export interface AnalyticsEvent {
  id: string;
  type: "simulation_started" | "simulation_completed" | "quiz_completed" | "topic_reviewed";
  simulationId?: string;
  topic?: string;
  score?: number;
  timestamp: number;
}

export interface ConceptMastery {
  concept: string;
  score: number; // 0 to 100
  status: "Strong" | "Developing" | "Needs Review";
}

export interface UserProgress {
  overall: number; // 0 to 100%
  completedSimulations: string[];
  conceptMastery: ConceptMastery[];
  recentActivity: AnalyticsEvent[];
}

export interface MockUser {
  id: string;
  name: string;
  grade: string;
}

