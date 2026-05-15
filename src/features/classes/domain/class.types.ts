export interface ClassMember {
  id: string;
  initials: string;
  name: string;
  email: string;
  className: string;
  status: "AKTIF" | "BELUM_UJIAN";
}

export interface ClassRoom {
  id: string;
  name: string;
  joinCode: string;
  studentCount: number;
}
