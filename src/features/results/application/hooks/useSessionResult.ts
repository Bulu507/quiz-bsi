"use client";

import { useEffect, useState } from "react";
import type { CategoryResult } from "../../domain/result.types";
import { resultRepository } from "../../infrastructure/result.repository";
import { getSessionResultUseCase } from "../use-cases/get-session-result.use-case";

export function useSessionResult(sessionId: string) {
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadResult() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getSessionResultUseCase(resultRepository, sessionId);
        if (isMounted) setResults(result);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat hasil ujian.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadResult();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return { error, isLoading, results };
}
