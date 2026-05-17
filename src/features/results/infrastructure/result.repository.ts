import type { IResultRepository } from "../domain/IResultRepository.interface";
import { getStudentAttemptResultApi } from "./result.api";

export const resultRepository: IResultRepository = {
  async getSessionResult(sessionId) {
    return getStudentAttemptResultApi(sessionId);
  }
};
