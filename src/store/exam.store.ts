"use client";

import { create } from "zustand";
import type { ExamStatus } from "@/features/exam/domain/exam.types";

interface ExamStore {
  sessionId: string | null;
  currentIndex: number;
  answers: Record<string, string>;
  flagged: string[];
  expiresAt: string | null;
  status: ExamStatus;
  setAnswer: (questionId: string, optionId: string) => void;
  toggleFlag: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  clearSession: () => void;
}

export const useExamStore = create<ExamStore>((set) => ({
  sessionId: null,
  currentIndex: 0,
  answers: {},
  flagged: [],
  expiresAt: null,
  status: "idle",
  setAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: state.answers[questionId] === optionId ? "" : optionId
      }
    })),
  toggleFlag: (questionId) =>
    set((state) => ({
      flagged: state.flagged.includes(questionId)
        ? state.flagged.filter((id) => id !== questionId)
        : [...state.flagged, questionId]
    })),
  goToQuestion: (index) => set({ currentIndex: index }),
  clearSession: () =>
    set({
      sessionId: null,
      currentIndex: 0,
      answers: {},
      flagged: [],
      expiresAt: null,
      status: "idle"
    })
}));
