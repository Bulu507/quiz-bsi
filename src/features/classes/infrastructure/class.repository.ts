import type { IClassRepository } from "../domain/IClassRepository.interface";

export const classRepository: IClassRepository = {
  async getAll() {
    return [];
  },
  async getMembers() {
    return [];
  }
};
