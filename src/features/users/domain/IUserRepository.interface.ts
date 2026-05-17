import type { PaginatedResponse } from "@/shared/types/common.types";
import type { ManagedUser, UserFilters } from "./user.types";

export interface IUserRepository {
  getAll(filters?: UserFilters): Promise<PaginatedResponse<ManagedUser>>;
  verify(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
