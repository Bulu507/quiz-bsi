"use client";

import { Button, EmptyState, LoadingSkeleton, PageHeader, Panel } from "@/shared/components/ui";
import { BackButton } from "@/shared/components/ui/BackButton";
import { useKategoriDetail } from "../application/hooks/useKategoriDetail";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString("id-ID") : "-";
}

export function KategoriDetailScreen({ kategoriId }: { kategoriId: string }) {
  const { error, isLoading, kategori } = useKategoriDetail(kategoriId);

  return (
    <>
      <PageHeader eyebrow="Kategori" title="Detail Kategori" actions={<BackButton fallbackHref="/kategori" />} />

      {isLoading ? <LoadingSkeleton rows={2} /> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {!isLoading && !error && !kategori ? (
        <EmptyState title="Kategori tidak ditemukan" description="Endpoint detail kategori tidak mengembalikan data." />
      ) : null}
      {!isLoading && !error && kategori ? (
        <div className="stack">
          <Panel title={kategori.nama}>
            <table>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{kategori.id}</td>
                </tr>
                <tr>
                  <th>Jumlah Subkategori</th>
                  <td>{kategori.jumlahSubkategori}</td>
                </tr>
                <tr>
                  <th>Dibuat</th>
                  <td>{formatDate(kategori.createdAt)}</td>
                </tr>
                <tr>
                  <th>Diperbarui</th>
                  <td>{formatDate(kategori.updatedAt)}</td>
                </tr>
              </tbody>
            </table>
          </Panel>

          <Panel title="Subkategori dalam kategori ini">
            {kategori.subkategori.length === 0 ? (
              <EmptyState title="Belum ada subkategori" description="Endpoint detail kategori belum mengembalikan subkategori." />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Subkategori</th>
                    <th>Jumlah Soal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kategori.subkategori.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nama}</td>
                      <td>{item.jumlahSoal ?? 0}</td>
                      <td>
                        <Button href={`/questions?subcategoryId=${item.id}`} variant="ghost">
                          Lihat Soal
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>
      ) : null}
    </>
  );
}
