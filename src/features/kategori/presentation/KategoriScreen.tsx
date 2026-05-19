"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { Button, EmptyState, LoadingSkeleton, PageHeader } from "@/shared/components/ui";
import { useKategoriList } from "../application/hooks/useKategoriList";
import type { Kategori, KategoriFilters } from "../domain/kategori.types";

export function KategoriScreen() {
  const { createKategori, deleteKategori, error, filters, isLoading, kategori, meta, mutatingId, setFilters, updateKategori } = useKategoriList();
  const [newName, setNewName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateConfirmOpen, setIsCreateConfirmOpen] = useState(false);
  const [editing, setEditing] = useState<Kategori | null>(null);
  const [editName, setEditName] = useState("");
  const page = meta?.page ?? Math.floor((filters.start ?? 0) / (filters.length ?? 20)) + 1;
  const limit = meta?.limit ?? filters.length ?? 20;
  const total = meta?.total ?? kategori.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function updateFilter(event: ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, search: event.target.value, start: 0 } as KategoriFilters);
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newName.trim()) return;
    setIsCreateConfirmOpen(true);
  }

  async function confirmCreate() {
    try {
      await createKategori(newName);
      setNewName("");
      setIsCreateConfirmOpen(false);
      setIsCreateOpen(false);
    } catch {
      // Error text is surfaced by useKategoriList.
    }
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    try {
      await updateKategori(editing.id, editName);
      setEditing(null);
      setEditName("");
    } catch {
      // Error text is surfaced by useKategoriList.
    }
  }

  function startEdit(item: Kategori) {
    setEditing(item);
    setEditName(item.nama);
  }

  function removeKategori(item: Kategori) {
    if (window.confirm(`Hapus kategori ${item.nama}?`)) void deleteKategori(item.id);
  }

  return (
    <>
      <PageHeader
        eyebrow="Bank Soal"
        title="Kategori Soal"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} type="button" variant="primary">
            Tambah Kategori
          </Button>
        }
      />

      <div className="toolbar">
        <input
          aria-label="Cari kategori"
          className="field"
          onChange={updateFilter}
          placeholder="Cari nama kategori..."
          value={filters.search ?? ""}
        />
      </div>

      {editing ? (
        <section className="panel">
          <div className="panel-body">
            <form className="toolbar" onSubmit={submitEdit}>
              <input aria-label="Edit nama kategori" className="field" onChange={(event) => setEditName(event.target.value)} value={editName} />
              <Button disabled={mutatingId === editing.id} type="submit" variant="primary">
                Simpan
              </Button>
              <Button onClick={() => setEditing(null)} type="button">
                Batal
              </Button>
            </form>
          </div>
        </section>
      ) : null}

      {isCreateOpen && !isCreateConfirmOpen ? (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <section className="modal status-modal">
            <form onSubmit={submitCreate}>
              <div className="modal-head">
                <div>
                  <p className="eyebrow">Kategori</p>
                  <h2>Tambah Kategori</h2>
                </div>
              </div>
              <div className="modal-body">
                <label>
                  Nama kategori
                  <input
                    aria-label="Nama kategori baru"
                    className="field"
                    onChange={(event) => setNewName(event.target.value)}
                    placeholder="Contoh: TWK"
                    value={newName}
                  />
                </label>
              </div>
              <div className="modal-foot">
                <Button
                  disabled={mutatingId === "new"}
                  onClick={() => {
                    setIsCreateOpen(false);
                    setNewName("");
                  }}
                  type="button"
                >
                  Batal
                </Button>
                <Button disabled={mutatingId === "new" || !newName.trim()} type="submit" variant="primary">
                  Lanjutkan
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {isCreateConfirmOpen ? (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <section className="modal status-modal">
            <div className="modal-head">
              <div>
                <p className="eyebrow">Konfirmasi</p>
                <h2>Simpan kategori?</h2>
              </div>
            </div>
            <div className="modal-body">
              <div className="notice">
                <strong>{newName}</strong>
                <p>Kategori baru akan dikirim ke backend dan muncul di daftar kategori.</p>
              </div>
            </div>
            <div className="modal-foot">
              <Button disabled={mutatingId === "new"} onClick={() => setIsCreateConfirmOpen(false)} type="button">
                Batal
              </Button>
              <Button disabled={mutatingId === "new"} onClick={() => void confirmCreate()} type="button" variant="primary">
                Simpan Kategori
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      {isLoading ? <LoadingSkeleton rows={3} /> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {!isLoading && !error && kategori.length === 0 ? (
        <EmptyState title="Belum ada kategori" description="Endpoint kategori tidak mengembalikan data untuk filter ini." />
      ) : null}
      {!isLoading && !error && kategori.length > 0 ? (
        <>
          <section className="panel">
            <div className="panel-body">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Kategori</th>
                    <th>Jumlah Subkategori</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kategori.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <Link href={`/kategori/${item.id}`}>{item.nama}</Link>
                      </td>
                      <td>{item.jumlahSubkategori}</td>
                      <td>
                        <div className="actions">
                          <Button href={`/kategori/${item.id}`} variant="ghost">
                            Detail
                          </Button>
                          <Button disabled={mutatingId === item.id} onClick={() => startEdit(item)} type="button">
                            Edit
                          </Button>
                          <Button disabled={mutatingId === item.id} onClick={() => removeKategori(item)} type="button">
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <div className="row" style={{ marginTop: 18 }}>
            <span className="muted">
              Total: {total} kategori - Halaman {page} dari {totalPages}
            </span>
            <div className="actions">
              <Button disabled={page <= 1} onClick={() => setFilters({ ...filters, start: Math.max(0, (filters.start ?? 0) - limit) })} type="button">
                Sebelumnya
              </Button>
              <Button disabled={page >= totalPages} onClick={() => setFilters({ ...filters, start: (filters.start ?? 0) + limit })} type="button" variant="primary">
                Berikutnya
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
