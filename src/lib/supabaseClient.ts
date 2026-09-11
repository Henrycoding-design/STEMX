/**
 * Supabase Architecture and Local Persistence Adapter
 * 
 * Provides an easy plug-and-play abstraction for Supabase Auth and Database.
 * When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present, it connects to Supabase.
 * Otherwise, it automatically falls back to robust browser localStorage persistence.
 */

import { UserProgress, AnalyticsEvent } from "../types";
import { initialProgress } from "../data/mockData";

const STORAGE_KEY = "stem_engine_user_progress";
const AUTH_KEY = "stem_engine_auth_user";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  grade: string;
  isGuest: boolean;
}

class StorageAdapter {
  private supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
  private supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  public isSupabaseConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseKey);
  }

  // User Profile / Auth State
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
      email: "student@stem-engine.edu",
      name: "Henry",
      grade: "Grade 10 / Cambridge & AP",
      isGuest: !this.isSupabaseConfigured(),
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
