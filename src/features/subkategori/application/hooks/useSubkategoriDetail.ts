"use client";

import { useEffect, useState } from "react";
import type { Subkategori } from "../../domain/subkategori.types";
import { subkategoriRepository } from "../../infrastructure/subkategori.repository";
import { getSubkategoriByIdUseCase } from "../use-cases/get-subkategori-by-id.use-case";

export function useSubkategoriDetail(id: string) {
  const [subkategori, setSubkategori] = useState<Subkategori | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSubkategori() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getSubkategoriByIdUseCase(subkategoriRepository, id);
        if (isMounted) setSubkategori(result);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat detail subkategori.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadSubkategori();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { error, isLoading, subkategori };
}
