"use client";

import { useEffect, useState } from "react";
import type { PackageWithAccess } from "../../domain/package.types";
import { packageRepository } from "../../infrastructure/package.repository";
import { getAvailablePackagesUseCase } from "../use-cases/get-available-packages.use-case";

export function useStudentPackages() {
  const [packages, setPackages] = useState<PackageWithAccess[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPackages() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAvailablePackagesUseCase(packageRepository);
        if (isMounted) setPackages(result);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat paket ujian.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  return { error, isLoading, packages };
}
