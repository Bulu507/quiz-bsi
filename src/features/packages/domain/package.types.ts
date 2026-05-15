export type PackageStatus = "DRAFT" | "PUBLISHED";
export type AccessStatus = "GRANTED" | "REVOKED";
export type ShowResultAfter = "IMMEDIATELY" | "DEADLINE";

export interface ScoringConfig {
  correct: number;
  wrong: number;
  unanswered: number;
}

export interface PassingConfig {
  total?: number;
  perCategory?: Record<string, number>;
}

export interface ExamPackage {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  durationMinutes: number;
  isShuffled: boolean;
  isOptionShuffled: boolean;
  scoringConfig: ScoringConfig;
  passingConfig: PassingConfig | null;
  maxAttempts: number | null;
  showResultAfter: ShowResultAfter;
  status: PackageStatus;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageAccess {
  id: string;
  packageId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: AccessStatus;
  grantedAt: string;
  grantedBy: string;
  revokedAt: string | null;
}

export interface PackageWithAccess extends ExamPackage {
  hasAccess: boolean;
  attemptsUsed: number;
  lastAttemptScore: number | null;
}
