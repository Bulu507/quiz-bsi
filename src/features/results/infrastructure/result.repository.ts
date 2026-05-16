import type { IResultRepository } from "../domain/IResultRepository.interface";

export const resultRepository: IResultRepository = {
  async getSessionResult() {
    return [];
  }
};
