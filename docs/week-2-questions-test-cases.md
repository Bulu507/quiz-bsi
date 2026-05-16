# Week 2 Test Cases - Questions

Scope: fitur Bank Soal sesuai PRD Minggu 2.

Target utama:
- Role admin dapat mengelola bank soal.
- Role peserta tidak dapat mengakses route admin.
- List, filter, form tambah, form edit, dan state dasar berjalan sesuai clean architecture flow.

## Environment

| Item | Nilai |
|------|-------|
| App URL | `http://localhost:3000` |
| Role admin | login biasa |
| Role peserta | login Google |
| Halaman utama | `/questions` |
| Halaman tambah | `/questions/new` |
| Halaman edit | `/questions/[id]` |

## Test Data

| Data | Nilai contoh |
|------|--------------|
| Username admin | `admin` |
| Password admin | `admin` |
| Judul/teks soal | `Jika 2 + 3 = ...` |
| Kategori | kategori pertama yang tersedia |
| Difficulty | `MUDAH` |
| Status | `DRAFT` |
| Opsi benar | `B` |
| Opsi A | `4` |
| Opsi B | `5` |
| Opsi C | `6` |
| Opsi D | `7` |
| Opsi E | `8` |

## Access Control

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-001 | Anonymous membuka bank soal | Buka `/questions` tanpa login | User diarahkan ke `/login` |
| W2-Q-002 | Peserta membuka bank soal | Login Google sebagai peserta, buka `/questions` | User diarahkan ke `/student/dashboard` |
| W2-Q-003 | Admin membuka bank soal | Login biasa sebagai admin, buka `/questions` | Halaman Bank Soal tampil |
| W2-Q-004 | Admin membuka tambah soal | Dari `/questions`, klik tambah soal atau buka `/questions/new` | Form tambah soal tampil |
| W2-Q-005 | Admin membuka edit soal | Dari kartu soal, klik edit | Halaman `/questions/[id]` tampil dengan data soal terisi |

## Questions List

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-006 | Render daftar soal | Login admin, buka `/questions` | Header Bank Soal, filter, dan daftar soal tampil |
| W2-Q-007 | Loading state | Buka `/questions` saat request berjalan | Loading skeleton tampil sebelum data selesai dimuat |
| W2-Q-008 | Empty state | Gunakan filter/search yang tidak punya hasil | Empty state tampil, tidak ada error UI |
| W2-Q-009 | Search soal | Isi search dengan keyword yang ada di teks soal | Daftar soal berubah sesuai keyword |
| W2-Q-010 | Search tanpa hasil | Isi search dengan keyword acak | Empty state tampil |
| W2-Q-011 | Filter difficulty | Pilih difficulty `MUDAH` | Daftar hanya menampilkan soal difficulty `MUDAH` |
| W2-Q-012 | Filter status | Pilih status `DRAFT` | Daftar hanya menampilkan soal status `DRAFT` |
| W2-Q-013 | Reset filter | Kosongkan search dan kembalikan filter ke semua | Daftar kembali menampilkan semua soal |
| W2-Q-014 | Pagination next | Klik tombol halaman berikutnya jika tersedia | Page bertambah dan daftar diperbarui |
| W2-Q-015 | Pagination previous | Klik tombol halaman sebelumnya | Page berkurang dan daftar diperbarui |

## Create Question

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-016 | Render form tambah | Buka `/questions/new` sebagai admin | Form metadata, editor, opsi jawaban, dan pembahasan tampil |
| W2-Q-017 | Validasi teks soal wajib | Kosongkan teks soal, klik simpan | Muncul error validasi, data tidak tersimpan |
| W2-Q-018 | Validasi kategori wajib | Kosongkan kategori, klik simpan | Muncul error validasi, data tidak tersimpan |
| W2-Q-019 | Validasi opsi wajib | Kosongkan salah satu teks opsi, klik simpan | Muncul error validasi, data tidak tersimpan |
| W2-Q-020 | Validasi jawaban benar wajib | Tidak pilih opsi benar, klik simpan | Muncul error validasi, data tidak tersimpan |
| W2-Q-021 | Simpan soal PG valid | Isi seluruh field valid, pilih satu jawaban benar, klik simpan | Request create berhasil dan user diarahkan ke `/questions` |
| W2-Q-022 | Simpan soal PGK valid | Pilih tipe `PGK`, tandai lebih dari satu opsi benar, klik simpan | Request create berhasil dan jawaban benar lebih dari satu tersimpan |
| W2-Q-023 | Simpan soal bergambar tanpa gambar | Pilih tipe `BERGAMBAR`, isi field tanpa gambar, klik simpan | Form tetap bisa diproses selama gambar belum diwajibkan backend |
| W2-Q-024 | Tags diparse benar | Isi tags `twk, nasionalisme, mudah` | Payload tags menjadi array 3 item |
| W2-Q-025 | Loading saat simpan | Klik simpan pada data valid | Tombol simpan disabled/menampilkan state menyimpan sampai request selesai |

## Edit Question

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-026 | Data edit terisi | Buka `/questions/[id]` dari daftar | Form menampilkan data soal awal |
| W2-Q-027 | Update teks soal | Ubah teks soal, klik simpan | Request update berhasil dan user kembali ke `/questions` |
| W2-Q-028 | Update difficulty | Ubah difficulty, klik simpan | Difficulty baru tersimpan |
| W2-Q-029 | Update opsi benar | Ubah opsi benar, klik simpan | Payload update membawa opsi benar baru |
| W2-Q-030 | Update tags | Ubah tags, klik simpan | Tags baru tersimpan sebagai array |
| W2-Q-031 | Batal edit | Klik kembali/batal dari form edit | User kembali ke `/questions` tanpa menyimpan perubahan |

## Delete Question

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-032 | Hapus soal dari list | Klik hapus pada kartu soal | Muncul konfirmasi atau aksi hapus berjalan sesuai UI saat ini |
| W2-Q-033 | Delete berhasil | Konfirmasi hapus | Soal hilang dari daftar dan tidak muncul setelah refresh |
| W2-Q-034 | Delete gagal | Simulasikan API error | Error ditampilkan, daftar tidak berubah |

## Error Handling

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-035 | API list gagal | Matikan jaringan/API atau pakai endpoint gagal | UI tetap menampilkan fallback/mock atau pesan error yang rapi |
| W2-Q-036 | API detail gagal | Buka `/questions/[id]` dengan id tidak valid | Halaman tidak blank; fallback/error state tampil |
| W2-Q-037 | API create gagal | Submit form valid saat API gagal | Error tampil dan user tetap di form |
| W2-Q-038 | API update gagal | Submit edit saat API gagal | Error tampil dan data form tidak hilang |
| W2-Q-039 | Token invalid | Ubah token menjadi invalid lalu buka `/questions` | User diarahkan ke login atau error auth tertangani |

## Responsive UI

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-040 | Desktop layout | Buka `/questions` pada 1024px ke atas | Sidebar dan konten tidak overlap |
| W2-Q-041 | Tablet layout | Buka `/questions` pada 768px | Filter dan kartu tetap terbaca |
| W2-Q-042 | Mobile layout | Buka `/questions` pada 375px | Teks tidak keluar container, tombol tetap bisa diklik |
| W2-Q-043 | Mobile form | Buka `/questions/new` pada 375px | Field form tersusun rapi dan tidak overlap |

## Clean Architecture Checks

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-044 | Presentation tidak akses API langsung | Cari `apiClient` di `src/features/questions/presentation` | Tidak ada import `apiClient` |
| W2-Q-045 | Presentation tidak akses repository langsung | Cari `questionRepository` di `src/features/questions/presentation` | Tidak ada import repository |
| W2-Q-046 | Domain tetap murni | Cek `src/features/questions/domain` | Tidak ada import React, Next, axios, atau store |
| W2-Q-047 | App router hanya compose page | Cek route `/questions*` | Page hanya compose layout/presentation dan tidak memuat logic API berat |

## Build And Smoke Test

| ID | Skenario | Langkah | Expected Result |
|----|----------|---------|-----------------|
| W2-Q-048 | TypeScript check | Jalankan `node_modules\\.bin\\tsc.cmd --noEmit` | Tidak ada error TypeScript |
| W2-Q-049 | Production build | Jalankan `node_modules\\.bin\\next.cmd build` | Build sukses |
| W2-Q-050 | Smoke login admin | Login admin lalu buka `/questions` | Tidak ada console error kritikal |
| W2-Q-051 | Smoke create-edit flow | Create satu soal, edit soal yang sama | Kedua aksi berhasil |

## Priority For Execution

Urutan minimal sebelum lanjut Minggu 3:

1. W2-Q-001 sampai W2-Q-005
2. W2-Q-006 sampai W2-Q-013
3. W2-Q-016 sampai W2-Q-021
4. W2-Q-026 sampai W2-Q-030
5. W2-Q-044 sampai W2-Q-049

## Notes

- `QuestionEditor` saat ini masih memakai textarea, belum TipTap penuh.
- Flow import Excel sudah punya use case dan hook dasar, tetapi UI `ImportStepper` masuk prioritas Minggu 3 sesuai PRD.
- Jika backend endpoint Questions belum stabil, repository masih dapat memakai fallback mock untuk menjaga UI tetap bisa diuji.
