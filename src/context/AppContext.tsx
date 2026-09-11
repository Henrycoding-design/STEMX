import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProgress, AnalyticsEvent, ConceptMastery, Language } from "../types";
import { translations } from "../i18n";
import { storageAdapter, AppUser } from "../lib/supabaseClient";

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

const PHYSICS_SIMS = ["projectile-motion", "wave-interference", "electric-circuit", "orbital-mechanics"];
const CHEMISTRY_SIMS = ["chemical-equilibrium", "reaction-kinetics"];
const MATH_SIMS = ["function-explorer", "calculus-motion"];

function isPhysicsConcept(c: string): boolean {
  const s = c.toLowerCase();
  return s.includes("kinematic") || s.includes("projectile") || s.includes("gravity") || 
         s.includes("wave") || s.includes("interference") || s.includes("superposition") || 
         s.includes("circuit") || s.includes("ohm") || s.includes("resistance") || 
         s.includes("orbit") || s.includes("kepler") || s.includes("escape") || s.includes("vector");
}

function isChemistryConcept(c: string): boolean {
  const s = c.toLowerCase();
  return s.includes("equilibrium") || s.includes("le chatelier") || s.includes("kinetic") || 
         s.includes("catalyst") || s.includes("collision") || s.includes("temp") || s.includes("pressure");
}

function isMathConcept(c: string): boolean {
  const s = c.toLowerCase();
  return s.includes("quadratic") || s.includes("function") || s.includes("differentiat") || 
         s.includes("derivative") || s.includes("integrat") || s.includes("calculus") || s.includes("periodic");
}

function calculateDynamicMetrics(completedSims: string[], masteryList: ConceptMastery[]) {
  // Completion percentages
  const physCompleted = completedSims.filter(id => PHYSICS_SIMS.includes(id)).length;
  const chemCompleted = completedSims.filter(id => CHEMISTRY_SIMS.includes(id)).length;
  const mathCompleted = completedSims.filter(id => MATH_SIMS.includes(id)).length;

  const physSimPct = (physCompleted / PHYSICS_SIMS.length) * 100;
  const chemSimPct = (chemCompleted / CHEMISTRY_SIMS.length) * 100;
  const mathSimPct = (mathCompleted / MATH_SIMS.length) * 100;

  // Concept masteries
  const physMasteries = masteryList.filter(m => isPhysicsConcept(m.concept));
  const chemMasteries = masteryList.filter(m => isChemistryConcept(m.concept));
  const mathMasteries = masteryList.filter(m => isMathConcept(m.concept));

  const avg = (items: ConceptMastery[], fallback: number) => 
    items.length > 0 ? items.reduce((acc, curr) => acc + curr.score, 0) / items.length : fallback;

  const physMasteryAvg = avg(physMasteries, 70);
  const chemMasteryAvg = avg(chemMasteries, 60);
  const mathMasteryAvg = avg(mathMasteries, 75);

  const physics = Math.min(100, Math.round(0.4 * physSimPct + 0.6 * physMasteryAvg));
  const chemistry = Math.min(100, Math.round(0.4 * chemSimPct + 0.6 * chemMasteryAvg));
  const mathematics = Math.min(100, Math.round(0.4 * mathSimPct + 0.6 * mathMasteryAvg));
  const overall = Math.round((physics + chemistry + mathematics) / 3);

  return { physics, chemistry, mathematics, overall };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => storageAdapter.loadProgress());
  const [user, setUser] = useState<AppUser>(() => storageAdapter.getCurrentUser());
  const [language, setLanguage] = useState<Language>("ENG");

  // Automatically save to local storage on progress updates
  useEffect(() => {
    storageAdapter.saveProgress(progress);
  }, [progress]);

  const t = (key: string) => translations[language]?.[key] || key;

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
      const metrics = calculateDynamicMetrics(nextCompleted, prev.conceptMastery);

      return {
        ...prev,
        ...metrics,
        completedSimulations: nextCompleted,
        recentActivity: [newEvent, ...prev.recentActivity].slice(0, 15), // Keep last 15
      };
    });
  };

  const updateMastery = (concept: string, newScore: number) => {
    setProgress((prev) => {
      const existing = prev.conceptMastery.find(c => c.concept.toLowerCase() === concept.toLowerCase());
      let newMastery = [...prev.conceptMastery];
      
      if (existing) {
        // Average previous score and latest score with weighting
        const updatedScore = Math.min(100, Math.round(existing.score * 0.4 + newScore * 0.6));
        newMastery = newMastery.map(c => 
          c.concept.toLowerCase() === concept.toLowerCase()
            ? { ...c, score: updatedScore, status: updatedScore >= 80 ? "Strong" : updatedScore >= 60 ? "Developing" : "Needs Review" } 
            : c
        );
      } else {
        newMastery.push({
          concept,
          score: newScore,
          status: newScore >= 80 ? "Strong" : newScore >= 60 ? "Developing" : "Needs Review"
        });
      }

      const metrics = calculateDynamicMetrics(prev.completedSimulations, newMastery);

      return {
        ...prev,
        ...metrics,
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
