"use client";

import { useEffect, useState } from "react";
import type { Kategori } from "../../domain/kategori.types";
import { kategoriRepository } from "../../infrastructure/kategori.repository";
import { getKategoriByIdUseCase } from "../use-cases/get-kategori-by-id.use-case";

export function useKategoriDetail(id: string) {
  const [kategori, setKategori] = useState<Kategori | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadKategori() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getKategoriByIdUseCase(kategoriRepository, id);
        if (isMounted) setKategori(result);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat detail kategori.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadKategori();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { error, isLoading, kategori };
}
