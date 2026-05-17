"use client";

import { useEffect, useState } from "react";
import type { QuestionCategory, QuestionSubcategory } from "../../domain/question.types";
import { questionRepository } from "../../infrastructure/question.repository";
import { getQuestionCategoriesUseCase } from "../use-cases/get-question-categories.use-case";
import { getQuestionSubcategoriesUseCase } from "../use-cases/get-question-subcategories.use-case";

export function useQuestionMetadata() {
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [subcategories, setSubcategories] = useState<QuestionSubcategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMetadata() {
      setIsLoading(true);
      setError(null);

      try {
        const [categoryResult, subcategoryResult] = await Promise.all([
          getQuestionCategoriesUseCase(questionRepository),
          getQuestionSubcategoriesUseCase(questionRepository)
        ]);

        if (!isMounted) return;
        setCategories(categoryResult);
        setSubcategories(subcategoryResult);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat kategori soal.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, error, isLoading, subcategories };
}
