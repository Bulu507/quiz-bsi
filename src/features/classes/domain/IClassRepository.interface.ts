import type { ClassMember, ClassRoom } from "./class.types";

export interface IClassRepository {
  getAll(): Promise<ClassRoom[]>;
  getMembers(classId: string): Promise<ClassMember[]>;
}
