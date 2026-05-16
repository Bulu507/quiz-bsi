"use client";

import { useState } from "react";
import type { ImportPreviewRow } from "../../domain/question.types";
import { questionRepository } from "../../infrastructure/question.repository";
import { confirmQuestionsImportUseCase, uploadQuestionsExcelUseCase } from "../use-cases/import-questions.use-case";

export function useImportQuestions() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreviewRow[]>([]);

  async function upload(file: File) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadQuestionsExcelUseCase(questionRepository, file);
      setJobId(response.data.jobId);
      setPreview(response.data.preview);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal upload file.");
    } finally {
      setIsLoading(false);
    }
  }

  async function confirm() {
    if (!jobId) return null;
    setIsLoading(true);
    setError(null);

    try {
      return await confirmQuestionsImportUseCase(questionRepository, jobId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal konfirmasi import.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { confirm, error, isLoading, jobId, preview, upload };
}
