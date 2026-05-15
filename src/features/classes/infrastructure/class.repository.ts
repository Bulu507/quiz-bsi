import type { IClassRepository } from "../domain/IClassRepository.interface";

export const classRepository: IClassRepository = {
  async getAll() {
    return [{ id: "class-1", name: "Kelas CPNS Pagi", joinCode: "ABC123", studentCount: 87 }];
  },
  async getMembers() {
    return [
      { id: "student-1", initials: "AR", name: "Andini Rahma", email: "andini@example.test", className: "Kelas CPNS Pagi", status: "BELUM_UJIAN" },
      { id: "student-2", initials: "RF", name: "Raka Firmansyah", email: "raka@example.test", className: "Kelas CPNS Pagi", status: "BELUM_UJIAN" },
      { id: "student-3", initials: "NA", name: "Nadia Amalia", email: "nadia@example.test", className: "Kelas CPNS Pagi", status: "AKTIF" }
    ];
  }
};
