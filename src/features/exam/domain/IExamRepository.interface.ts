import type { ExamSession } from "./exam.types";

export interface IExamRepository {
  start(packageId: string): Promise<ExamSession>;
  syncAnswers(sessionId: string, answers: Record<string, string>): Promise<void>;
  submit(sessionId: string): Promise<void>;
}
