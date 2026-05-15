import type { IResultRepository } from "../domain/IResultRepository.interface";

export const resultRepository: IResultRepository = {
  async getSessionResult() {
    return [
      { category: "TWK", score: "65 / 150", progress: 43, status: "Lulus" },
      { category: "TIU", score: "100 / 175", progress: 57, status: "Lulus" },
      { category: "TKP", score: "220 / 225", progress: 98, status: "Lulus" }
    ];
  }
};
