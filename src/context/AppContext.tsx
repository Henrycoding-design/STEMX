import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProgress, AnalyticsEvent, ConceptMastery, Language } from "../types";
import { translations } from "../i18n";
import { storageAdapter, AppUser } from "../lib/supabaseClient";
import { simulationsData } from "../data/mockData";

interface AppContextType {
  progress: UserProgress;
  user: AppUser;
  recordEvent: (event: Omit<AnalyticsEvent, "id" | "timestamp">) => void;
  updateMastery: (concept: string, scoreIncrement: number) => void;
  resetProgress: () => void;
  updateUser: (user: Partial<AppUser>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function calculateCompletionPercentage(completedSims: string[], masteryList: ConceptMastery[]): number {
  const totalSims = simulationsData.length || 8;
  const simCompletionPct = (completedSims.length / totalSims) * 100;
  
  const masteredConcepts = masteryList.filter(m => m.score > 0);
  const masteryAvg = masteredConcepts.length > 0 
    ? masteredConcepts.reduce((sum, item) => sum + item.score, 0) / masteredConcepts.length 
    : 0;

  // 60% weight on completed labs, 40% weight on quiz mastery score
  const overall = Math.min(100, Math.round(0.6 * simCompletionPct + 0.4 * masteryAvg));
  return overall;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => storageAdapter.loadProgress());
  const [user, setUser] = useState<AppUser>(() => storageAdapter.getCurrentUser());
  const [language, setLanguage] = useState<Language>("VN"); // Vietnamese by default!

  // Save to local storage on progress updates
  useEffect(() => {
    storageAdapter.saveProgress(progress);
  }, [progress]);

  const t = (key: string) => translations[language]?.[key] || translations["VN"]?.[key] || key;

  const recordEvent = (eventData: Omit<AnalyticsEvent, "id" | "timestamp">) => {
    const newEvent: AnalyticsEvent = {
      ...eventData,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
    };

    setProgress((prev) => {
      const isNewSim = eventData.type === "simulation_completed" && eventData.simulationId 
        && !prev.completedSimulations.includes(eventData.simulationId);
      
      const nextCompleted = isNewSim ? [...prev.completedSimulations, eventData.simulationId!] : prev.completedSimulations;
      const overall = calculateCompletionPercentage(nextCompleted, prev.conceptMastery);

      return {
        ...prev,
        overall,
        completedSimulations: nextCompleted,
        recentActivity: [newEvent, ...prev.recentActivity].slice(0, 20),
      };
    });
  };

  const updateMastery = (concept: string, newScore: number) => {
    setProgress((prev) => {
      const existing = prev.conceptMastery.find(c => c.concept.toLowerCase() === concept.toLowerCase());
      let newMastery = [...prev.conceptMastery];
      
      if (existing) {
        const updatedScore = Math.min(100, Math.round(existing.score * 0.3 + newScore * 0.7));
        newMastery = newMastery.map(c => 
          c.concept.toLowerCase() === concept.toLowerCase()
            ? { ...c, score: updatedScore, status: updatedScore >= 80 ? "Strong" : updatedScore >= 50 ? "Developing" : "Needs Review" } 
            : c
        );
      } else {
        newMastery.push({
          concept,
          score: newScore,
          status: newScore >= 80 ? "Strong" : newScore >= 50 ? "Developing" : "Needs Review"
        });
      }

      const overall = calculateCompletionPercentage(prev.completedSimulations, newMastery);

      return {
        ...prev,
        overall,
        conceptMastery: newMastery
      };
    });
  };

  const resetProgress = () => {
    const initial = storageAdapter.resetProgress();
    setProgress(initial);
  };

  const updateUser = (fields: Partial<AppUser>) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      storageAdapter.saveUser(updated);
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{ 
      progress, 
      user, 
      recordEvent, 
      updateMastery, 
      resetProgress, 
      updateUser, 
      language, 
      setLanguage, 
      t 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppProgress = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppProgress must be used within an AppProvider");
  }
  return context;
};
