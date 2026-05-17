export interface SubkategoriRingkas {
  id: string;
  nama: string;
  jumlahSoal?: number;
}

export interface Kategori {
  id: string;
  nama: string;
  jumlahSubkategori: number;
  subkategori: SubkategoriRingkas[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface KategoriFilters {
  start?: number;
  length?: number;
  search?: string;
}

export interface CreateKategoriPayload {
  nama: string;
}

export type UpdateKategoriPayload = CreateKategoriPayload;
