export type Language = "ENG" | "VN" | "FR";
export type CurriculumType = "Cambridge" | "AP";
export type Subject = "Physics" | "Chemistry" | "Mathematics";

export interface TopicMapping {
  id: string;
  subject: Subject;
  cambridgeLevel: string;
  cambridgeTopic: string;
  apLevel: string;
  apTopic: string;
  simulationId?: string;
}

export interface SimulationInfo {
  id: string;
  title: string;
  subject: Subject;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  curriculumCompatibility: string[];
  description: string;
  formula: string[];
  theory: string;
}

export interface QuizQuestion {
  id: string;
  simulationId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTested: string;
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
  overall: number;
  physics: number;
  chemistry: number;
  mathematics: number;
  completedSimulations: string[];
  conceptMastery: ConceptMastery[];
  recentActivity: AnalyticsEvent[];
}

export interface MockUser {
  id: string;
  name: string;
  grade: string;
}
