"use client";

import { useEffect, useState } from "react";
import type { ManagedUser } from "../../domain/user.types";
import { userRepository } from "../../infrastructure/user.repository";
import { getUserByIdUseCase } from "../use-cases/get-user-by-id.use-case";

export function useUserDetail(id: string) {
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getUserByIdUseCase(userRepository, id);
        if (isMounted) setUser(result);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat detail user.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { error, isLoading, user };
}
