"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PaginatedResponse } from "@/shared/types/common.types";
import type { Kategori, KategoriFilters } from "../../domain/kategori.types";
import { kategoriRepository } from "../../infrastructure/kategori.repository";
import { createKategoriUseCase } from "../use-cases/create-kategori.use-case";
import { deleteKategoriUseCase } from "../use-cases/delete-kategori.use-case";
import { getAllKategoriUseCase } from "../use-cases/get-all-kategori.use-case";
import { updateKategoriUseCase } from "../use-cases/update-kategori.use-case";

export function useKategoriList(initialFilters: KategoriFilters = { start: 0, length: 20, search: "" }) {
  const [filters, setFilters] = useState<KategoriFilters>(initialFilters);
  const [result, setResult] = useState<PaginatedResponse<Kategori> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const stableFilters = useMemo(() => filters, [filters]);

  const loadKategori = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setResult(await getAllKategoriUseCase(kategoriRepository, stableFilters));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat kategori.");
    } finally {
      setIsLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    void loadKategori();
  }, [loadKategori]);

  async function createKategori(nama: string) {
    setMutatingId("new");
    setError(null);

    try {
      await createKategoriUseCase(kategoriRepository, { nama });
      await loadKategori();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal membuat kategori.");
      throw cause;
    } finally {
      setMutatingId(null);
    }
  }

  async function updateKategori(id: string, nama: string) {
    setMutatingId(id);
    setError(null);

    try {
      await updateKategoriUseCase(kategoriRepository, id, { nama });
      await loadKategori();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal mengubah kategori.");
      throw cause;
    } finally {
      setMutatingId(null);
    }
  }

  async function deleteKategori(id: string) {
    setMutatingId(id);
    setError(null);

    try {
      await deleteKategoriUseCase(kategoriRepository, id);
      await loadKategori();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menghapus kategori.");
      throw cause;
    } finally {
      setMutatingId(null);
    }
  }

  return {
    createKategori,
    deleteKategori,
    error,
    filters,
    isLoading,
    loadKategori,
    meta: result?.meta,
    mutatingId,
    setFilters,
    updateKategori,
    kategori: result?.data ?? []
  };
}
