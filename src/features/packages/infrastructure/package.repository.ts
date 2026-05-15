import type { IPackageRepository } from "../domain/IPackageRepository.interface";
import type { ExamPackage } from "../domain/package.types";

export const packages: ExamPackage[] = [
  {
    id: "package-1",
    title: "Tryout SKD Sesi 3",
    description: "Simulasi SKD lengkap dengan TWK, TIU, dan TKP.",
    createdBy: "user-1",
    durationMinutes: 100,
    isShuffled: true,
    isOptionShuffled: true,
    scoringConfig: { correct: 5, wrong: 0, unanswered: 0 },
    passingConfig: { total: 300, perCategory: { TWK: 65, TIU: 80, TKP: 156 } },
    maxAttempts: null,
    showResultAfter: "IMMEDIATELY",
    status: "PUBLISHED",
    questionCount: 110,
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z"
  },
  {
    id: "package-2",
    title: "Psikotes Logika Dasar",
    description: "Latihan psikotes logika dan pola dasar.",
    createdBy: "user-1",
    durationMinutes: 45,
    isShuffled: false,
    isOptionShuffled: false,
    scoringConfig: { correct: 1, wrong: 0, unanswered: 0 },
    passingConfig: null,
    maxAttempts: 2,
    showResultAfter: "DEADLINE",
    status: "DRAFT",
    questionCount: 60,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z"
  }
];

export const packageRepository: IPackageRepository = {
  async getAll() {
    return packages;
  },
  async getAvailableForStudent() {
    return packages.map((item, index) => ({
      ...item,
      hasAccess: item.status === "PUBLISHED",
      attemptsUsed: index,
      lastAttemptScore: index === 0 ? 385 : null
    }));
  },
  async getAccess(packageId) {
    return [
      {
        id: "access-1",
        packageId,
        studentId: "student-1",
        studentName: "Andini Rahma",
        studentEmail: "andini@example.test",
        status: "GRANTED",
        grantedAt: "2026-01-12T00:00:00.000Z",
        grantedBy: "user-1",
        revokedAt: null
      }
    ];
  }
};
