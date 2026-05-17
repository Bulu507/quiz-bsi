"use client";

import { Button, EmptyState, LoadingSkeleton, PageHeader, Panel } from "@/shared/components/ui";
import { useSubkategoriDetail } from "../application/hooks/useSubkategoriDetail";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString("id-ID") : "-";
}

export function SubkategoriDetailScreen({ subkategoriId }: { subkategoriId: string }) {
  const { error, isLoading, subkategori } = useSubkategoriDetail(subkategoriId);

  return (
    <>
      <PageHeader eyebrow="Subkategori" title="Detail Subkategori" actions={<Button href="/subkategori">Kembali</Button>} />

      {isLoading ? <LoadingSkeleton rows={2} /> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {!isLoading && !error && !subkategori ? (
        <EmptyState title="Subkategori tidak ditemukan" description="Endpoint detail subkategori tidak mengembalikan data." />
      ) : null}
      {!isLoading && !error && subkategori ? (
        <div className="stack">
          <Panel title={subkategori.nama}>
            <table>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{subkategori.id}</td>
                </tr>
                <tr>
                  <th>Kategori</th>
                  <td>{subkategori.namaKategori}</td>
                </tr>
                <tr>
                  <th>Jumlah Soal</th>
                  <td>{subkategori.jumlahSoal}</td>
                </tr>
                <tr>
                  <th>Dibuat</th>
                  <td>{formatDate(subkategori.createdAt)}</td>
                </tr>
                <tr>
                  <th>Diperbarui</th>
                  <td>{formatDate(subkategori.updatedAt)}</td>
                </tr>
              </tbody>
            </table>
          </Panel>

          <div className="actions">
            <Button href={`/questions?subcategoryId=${subkategori.id}`} variant="primary">
              Lihat Soal
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
