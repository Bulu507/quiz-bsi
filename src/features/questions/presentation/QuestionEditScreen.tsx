"use client";

import { useEffect, useState } from "react";
import { getQuestionDetailUseCase } from "../application/use-cases/get-question-detail.use-case";
import type { Question } from "../domain/question.types";
import { questionRepository } from "../infrastructure/question.repository";
import { EmptyState, LoadingSkeleton } from "@/shared/components/ui";
import { QuestionForm } from "./QuestionForm";

export function QuestionEditScreen({ questionId }: { questionId: string }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadQuestion() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getQuestionDetailUseCase(questionRepository, questionId);
        if (isMounted) setQuestion(result);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat soal.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadQuestion();

    return () => {
      isMounted = false;
    };
  }, [questionId]);

  if (isLoading) return <LoadingSkeleton rows={3} />;

  if (error || !question) {
    return <EmptyState title="Soal tidak dapat dimuat" description={error ?? "Data soal tidak tersedia."} />;
  }

  return <QuestionForm initialData={question} />;
}
