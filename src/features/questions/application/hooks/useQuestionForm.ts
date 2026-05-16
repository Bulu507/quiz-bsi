"use client";

import { useState } from "react";
import type { CreateQuestionPayload } from "../../domain/IQuestionRepository.interface";
import type { Question } from "../../domain/question.types";
import { questionRepository } from "../../infrastructure/question.repository";
import { createQuestionUseCase } from "../use-cases/create-question.use-case";
import { updateQuestionUseCase } from "../use-cases/update-question.use-case";

export function useQuestionForm(initialData?: Question) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function saveQuestion(payload: CreateQuestionPayload) {
    setError(null);
    setIsSaving(true);

    try {
      return initialData
        ? updateQuestionUseCase(questionRepository, initialData.id, payload)
        : createQuestionUseCase(questionRepository, payload);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Gagal menyimpan soal.";
      setError(message);
      throw cause;
    } finally {
      setIsSaving(false);
    }
  }

  return { error, isSaving, saveQuestion };
}
