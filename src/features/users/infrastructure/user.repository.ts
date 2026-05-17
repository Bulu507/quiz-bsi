import type { IUserRepository } from "../domain/IUserRepository.interface";
import { deleteUserApi, getUserByIdApi, getUsersApi, verifyUserApi } from "./user.api";

export const userRepository: IUserRepository = {
  async getAll(filters) {
    return getUsersApi(filters);
  },
  async getById(id) {
    return getUserByIdApi(id);
  },
  async verify(id) {
    return verifyUserApi(id);
  },
  async delete(id) {
    return deleteUserApi(id);
  }
};
