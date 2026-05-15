import type { CategoryResult } from "./result.types";

export interface IResultRepository {
  getSessionResult(sessionId: string): Promise<CategoryResult[]>;
}
