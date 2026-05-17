"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllKategoriUseCase } from "@/features/kategori/application/use-cases/get-all-kategori.use-case";
import { kategoriRepository } from "@/features/kategori/infrastructure/kategori.repository";
import type { Kategori } from "@/features/kategori/domain/kategori.types";
import type { PaginatedResponse } from "@/shared/types/common.types";
import type { Subkategori, SubkategoriFilters } from "../../domain/subkategori.types";
import { subkategoriRepository } from "../../infrastructure/subkategori.repository";
import { createSubkategoriUseCase } from "../use-cases/create-subkategori.use-case";
import { deleteSubkategoriUseCase } from "../use-cases/delete-subkategori.use-case";
import { getAllSubkategoriUseCase } from "../use-cases/get-all-subkategori.use-case";
import { updateSubkategoriUseCase } from "../use-cases/update-subkategori.use-case";

export function useSubkategoriList(initialFilters: SubkategoriFilters = { start: 0, length: 20, search: "" }) {
  const [filters, setFilters] = useState<SubkategoriFilters>(initialFilters);
  const [result, setResult] = useState<PaginatedResponse<Subkategori> | null>(null);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const stableFilters = useMemo(() => filters, [filters]);

  const loadSubkategori = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [subkategoriResult, kategoriResult] = await Promise.all([
        getAllSubkategoriUseCase(subkategoriRepository, stableFilters),
        getAllKategoriUseCase(kategoriRepository, { start: 0, length: 100, search: "" })
      ]);
      setResult(subkategoriResult);
      setCategories(kategoriResult.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat subkategori.");
    } finally {
      setIsLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    void loadSubkategori();
  }, [loadSubkategori]);

  async function createSubkategori(idKategori: string, nama: string) {
    setMutatingId("new");
    setError(null);

    try {
      await createSubkategoriUseCase(subkategoriRepository, { idKategori, nama });
      await loadSubkategori();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal membuat subkategori.");
      throw cause;
    } finally {
      setMutatingId(null);
    }
  }

  async function updateSubkategori(id: string, idKategori: string, nama: string) {
    setMutatingId(id);
    setError(null);

    try {
      await updateSubkategoriUseCase(subkategoriRepository, id, { idKategori, nama });
      await loadSubkategori();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal mengubah subkategori.");
      throw cause;
    } finally {
      setMutatingId(null);
    }
  }

  async function deleteSubkategori(id: string) {
    setMutatingId(id);
    setError(null);

    try {
      await deleteSubkategoriUseCase(subkategoriRepository, id);
      await loadSubkategori();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menghapus subkategori.");
      throw cause;
    } finally {
      setMutatingId(null);
    }
  }

  return {
    categories,
    createSubkategori,
    deleteSubkategori,
    error,
    filters,
    isLoading,
    loadSubkategori,
    meta: result?.meta,
    mutatingId,
    setFilters,
    subkategori: result?.data ?? [],
    updateSubkategori
  };
}
