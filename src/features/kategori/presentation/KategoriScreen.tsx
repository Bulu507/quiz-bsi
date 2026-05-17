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
  const [editing, setEditing] = useState<Kategori | null>(null);
  const [editName, setEditName] = useState("");
  const page = meta?.page ?? Math.floor((filters.start ?? 0) / (filters.length ?? 20)) + 1;
  const limit = meta?.limit ?? filters.length ?? 20;
  const total = meta?.total ?? kategori.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function updateFilter(event: ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, search: event.target.value, start: 0 } as KategoriFilters);
  }

  async function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createKategori(newName);
      setNewName("");
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
      <PageHeader eyebrow="Bank Soal" title="Kategori Soal" />

      <section className="panel">
        <div className="panel-body">
          <form className="toolbar" onSubmit={submitCreate}>
            <input
              aria-label="Nama kategori baru"
              className="field"
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Nama kategori baru"
              value={newName}
            />
            <Button disabled={mutatingId === "new"} type="submit" variant="primary">
              Tambah Kategori
            </Button>
          </form>
        </div>
      </section>

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
