import type { ExamPackage, PackageAccess, PackageWithAccess } from "./package.types";

export interface IPackageRepository {
  getAll(): Promise<ExamPackage[]>;
  getAvailableForStudent(): Promise<PackageWithAccess[]>;
  getAccess(packageId: string): Promise<PackageAccess[]>;
}
