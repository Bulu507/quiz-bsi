import type { ExamPackage, PackageAccess, PackageWithAccess } from "./package.types";

export interface IPackageRepository {
  getAll(): Promise<ExamPackage[]>;
  getAvailableForStudent(): Promise<PackageWithAccess[]>;
  startStudentQuiz(packageId: string): Promise<{ attemptId: string }>;
  getAccess(packageId: string): Promise<PackageAccess[]>;
}
