"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, EmptyState, LoadingSkeleton, PageHeader } from "@/shared/components/ui";
import { useSubkategoriList } from "../application/hooks/useSubkategoriList";
import type { Subkategori, SubkategoriFilters } from "../domain/subkategori.types";

export function SubkategoriScreen() {
  const {
    categories,
    createSubkategori,
    deleteSubkategori,
    error,
    filters,
    isLoading,
    meta,
    mutatingId,
    setFilters,
    subkategori,
    updateSubkategori
  } = useSubkategoriList();
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<Subkategori | null>(null);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editName, setEditName] = useState("");
  const page = meta?.page ?? Math.floor((filters.start ?? 0) / (filters.length ?? 20)) + 1;
  const limit = meta?.limit ?? filters.length ?? 20;
  const total = meta?.total ?? subkategori.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (!newCategoryId && categories[0]) setNewCategoryId(categories[0].id);
  }, [categories, newCategoryId]);

  function updateFilter(event: ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, search: event.target.value, start: 0 } as SubkategoriFilters);
  }

  async function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createSubkategori(newCategoryId, newName);
      setNewName("");
    } catch {
      // Error text is surfaced by useSubkategoriList.
    }
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    try {
      await updateSubkategori(editing.id, editCategoryId, editName);
      setEditing(null);
      setEditName("");
      setEditCategoryId("");
    } catch {
      // Error text is surfaced by useSubkategoriList.
    }
  }

  function startEdit(item: Subkategori) {
    setEditing(item);
    setEditName(item.nama);
    setEditCategoryId(item.idKategori);
  }

  function removeSubkategori(item: Subkategori) {
    if (window.confirm(`Hapus subkategori ${item.nama}?`)) void deleteSubkategori(item.id);
  }

  return (
    <>
      <PageHeader eyebrow="Bank Soal" title="Subkategori Soal" />

      <section className="panel">
        <div className="panel-body">
          <form className="toolbar" onSubmit={submitCreate}>
            <select
              aria-label="Kategori subkategori baru"
              className="select"
              disabled={categories.length === 0}
              onChange={(event) => setNewCategoryId(event.target.value)}
              value={newCategoryId}
            >
              {categories.length === 0 ? <option value="">Kategori belum tersedia</option> : null}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama}
                </option>
              ))}
            </select>
            <input
              aria-label="Nama subkategori baru"
              className="field"
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Nama subkategori baru"
              value={newName}
            />
            <Button disabled={mutatingId === "new" || categories.length === 0} type="submit" variant="primary">
              Tambah Subkategori
            </Button>
          </form>
        </div>
      </section>

      <div className="toolbar">
        <input
          aria-label="Cari subkategori"
          className="field"
          onChange={updateFilter}
          placeholder="Cari nama subkategori..."
          value={filters.search ?? ""}
        />
      </div>

      {editing ? (
        <section className="panel">
          <div className="panel-body">
            <form className="toolbar" onSubmit={submitEdit}>
              <select aria-label="Edit kategori subkategori" className="select" onChange={(event) => setEditCategoryId(event.target.value)} value={editCategoryId}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama}
                  </option>
                ))}
              </select>
              <input aria-label="Edit nama subkategori" className="field" onChange={(event) => setEditName(event.target.value)} value={editName} />
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
      {!isLoading && !error && subkategori.length === 0 ? (
        <EmptyState title="Belum ada subkategori" description="Endpoint subkategori tidak mengembalikan data untuk filter ini." />
      ) : null}
      {!isLoading && !error && subkategori.length > 0 ? (
        <>
          <section className="panel">
            <div className="panel-body">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Subkategori</th>
                    <th>Kategori</th>
                    <th>Jumlah Soal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {subkategori.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <Link href={`/subkategori/${item.id}`}>{item.nama}</Link>
                      </td>
                      <td>{item.namaKategori}</td>
                      <td>{item.jumlahSoal}</td>
                      <td>
                        <div className="actions">
                          <Button href={`/subkategori/${item.id}`} variant="ghost">
                            Detail
                          </Button>
                          <Button disabled={mutatingId === item.id} onClick={() => startEdit(item)} type="button">
                            Edit
                          </Button>
                          <Button disabled={mutatingId === item.id} onClick={() => removeSubkategori(item)} type="button">
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
              Total: {total} subkategori - Halaman {page} dari {totalPages}
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
