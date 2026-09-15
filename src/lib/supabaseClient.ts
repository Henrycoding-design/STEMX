/**
 * Local Data Persistence Adapter
 * 
 * Provides smooth, zero-latency local caching for student activities,
 * completed lessons/simulations, and curriculum progress.
 */

import { UserProgress } from "../types";
import { initialProgress } from "../data/mockData";

const STORAGE_KEY = "stem_engine_physics_progress";
const AUTH_KEY = "stem_engine_active_user";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  grade: string;
  curriculumTrack: string;
}

class StorageAdapter {
  // User Profile State
  public getCurrentUser(): AppUser {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading stored user", e);
    }

    return {
      id: "u_default",
      email: "hocsinh@vatli10.edu.vn",
      name: "Học sinh Vật lí 10",
      grade: "Lớp 10 / Grade 10",
      curriculumTrack: "KNTT & CTST",
    };
  }

  public saveUser(user: AppUser): void {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn("Error saving user", e);
    }
  }

  // User Progress Persistence
  public loadProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.overall === "number") {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error loading progress from storage", e);
    }
    return initialProgress;
  }

  public saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn("Error saving progress to storage", e);
    }
  }

  public resetProgress(): UserProgress {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Error clearing progress", e);
    }
    return initialProgress;
  }
}

export const storageAdapter = new StorageAdapter();

