"use client";

import { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import type { PaginatedResponse } from "@/shared/types/common.types";
import type { ManagedUser, UserFilters } from "../../domain/user.types";
import { userRepository } from "../../infrastructure/user.repository";
import { deleteUserUseCase } from "../use-cases/delete-user.use-case";
import { getAllUsersUseCase } from "../use-cases/get-all-users.use-case";
import { verifyUserUseCase } from "../use-cases/verify-user.use-case";

export function useUserList(initialFilters: UserFilters = { start: 0, length: 20, showMode: "verified", role: "" }) {
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [result, setResult] = useState<PaginatedResponse<ManagedUser> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const stableFilters = useMemo(() => filters, [filters]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setResult(await getAllUsersUseCase(userRepository, stableFilters));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat user.");
    } finally {
      setIsLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function verifyUser(id: string) {
    setMutatingId(id);
    setError(null);

    try {
      await verifyUserUseCase(userRepository, id);
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memverifikasi user.");
    } finally {
      setMutatingId(null);
    }
  }

  async function deleteUser(id: string) {
    setMutatingId(id);
    setError(null);

    try {
      await deleteUserUseCase(userRepository, id);
      await loadUsers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menghapus user.");
    } finally {
      setMutatingId(null);
    }
  }

  return { deleteUser, error, filters, isLoading, meta: result?.meta, mutatingId, setFilters, users: result?.data ?? [], verifyUser };
}
