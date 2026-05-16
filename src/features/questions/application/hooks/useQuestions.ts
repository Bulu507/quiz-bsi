"use client";

import { useEffect, useMemo, useState } from "react";
import type { PaginatedResponse } from "@/shared/types/common.types";
import type { Question, QuestionFilters } from "../../domain/question.types";
import { questionRepository } from "../../infrastructure/question.repository";
import { deleteQuestionUseCase } from "../use-cases/delete-question.use-case";
import { getQuestionsUseCase } from "../use-cases/get-questions.use-case";

export function useQuestions(initialFilters: QuestionFilters = { page: 1, limit: 10 }) {
  const [filters, setFilters] = useState<QuestionFilters>(initialFilters);
  const [result, setResult] = useState<PaginatedResponse<Question> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const stableFilters = useMemo(() => filters, [filters]);

  async function loadQuestions() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getQuestionsUseCase(questionRepository, stableFilters);
      setResult(response);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat soal.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadMountedQuestions() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getQuestionsUseCase(questionRepository, stableFilters);
        if (isMounted) setResult(response);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat soal.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadMountedQuestions();

    return () => {
      isMounted = false;
    };
  }, [stableFilters]);

  async function deleteQuestion(id: string) {
    setDeletingId(id);
    setError(null);

    try {
      await deleteQuestionUseCase(questionRepository, id);
      await loadQuestions();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menghapus soal.");
    } finally {
      setDeletingId(null);
    }
  }

  return { deletingId, deleteQuestion, error, filters, isLoading, questions: result?.data ?? [], meta: result?.meta, setFilters };
}
