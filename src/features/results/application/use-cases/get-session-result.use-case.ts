import type { IResultRepository } from "../../domain/IResultRepository.interface";

export function getSessionResultUseCase(repository: IResultRepository, sessionId: string) {
  return repository.getSessionResult(sessionId);
}
