export type ExamStatus = "idle" | "active" | "submitted";

export interface ExamSession {
  id: string;
  packageId: string;
  expiresAt: string;
  status: ExamStatus;
}
