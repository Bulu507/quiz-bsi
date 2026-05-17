export interface Subkategori {
  id: string;
  idKategori: string;
  nama: string;
  namaKategori: string;
  jumlahSoal: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SubkategoriFilters {
  start?: number;
  length?: number;
  search?: string;
}

export interface CreateSubkategoriPayload {
  idKategori: string;
  nama: string;
}

export type UpdateSubkategoriPayload = CreateSubkategoriPayload;
