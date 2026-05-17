"use client";

import type { ChangeEvent } from "react";
import { EmptyState, LoadingSkeleton, PageHeader, Button } from "@/shared/components/ui";
import { useUserList } from "../application/hooks/useUserList";
import type { UserFilters } from "../domain/user.types";
import { UserRoleBadge, UserStatusBadge } from "./UserBadges";

export function UserManagementScreen() {
  const { deleteUser, error, filters, isLoading, meta, mutatingId, setFilters, users, verifyUser } = useUserList();
  const verifiedCounter = useUserList({ start: 0, length: 1, showMode: "verified", role: "peserta" });
  const unverifiedCounter = useUserList({ start: 0, length: 1, showMode: "unverified", role: "peserta" });
  const page = meta?.page ?? Math.floor((filters.start ?? 0) / (filters.length ?? 20)) + 1;
  const limit = meta?.limit ?? filters.length ?? 20;
  const total = meta?.total ?? users.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function updateFilter(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value, start: 0 } as UserFilters);
  }

  async function handleVerify(id: string, name: string) {
    if (!window.confirm(`Verifikasi ${name}? User akan bisa mengakses quiz.`)) return;
    await verifyUser(id);
    await Promise.all([verifiedCounter.loadUsers(), unverifiedCounter.loadUsers()]);
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus user ${name}? Aksi ini tidak bisa dibatalkan.`)) return;
    await deleteUser(id);
    await Promise.all([verifiedCounter.loadUsers(), unverifiedCounter.loadUsers()]);
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Manajemen User" />

      <div className="actions">
        <Button
          onClick={() => setFilters({ ...filters, showMode: "", start: 0 })}
          type="button"
          variant={filters.showMode === "" ? "primary" : "default"}
        >
          Semua
        </Button>
        <Button
          onClick={() => setFilters({ ...filters, showMode: "verified", start: 0 })}
          type="button"
          variant={filters.showMode === "verified" ? "primary" : "default"}
        >
          Terverifikasi ({verifiedCounter.meta?.total ?? 0})
        </Button>
        <Button
          onClick={() => setFilters({ ...filters, showMode: "unverified", start: 0 })}
          type="button"
          variant={filters.showMode === "unverified" ? "primary" : "default"}
        >
          Belum Verifikasi ({unverifiedCounter.meta?.total ?? 0})
        </Button>
      </div>

      <div className="toolbar">
        <input
          aria-label="Cari user"
          className="field"
          name="search"
          onChange={updateFilter}
          placeholder="Cari nama atau username..."
          value={filters.search ?? ""}
        />
        <select aria-label="Status verifikasi" className="select" name="showMode" onChange={updateFilter} value={filters.showMode ?? ""}>
          <option value="">Semua status</option>
          <option value="verified">Terverifikasi</option>
          <option value="unverified">Belum Verifikasi</option>
        </select>
        <select aria-label="Role user" className="select" name="role" onChange={updateFilter} value={filters.role ?? ""}>
          <option value="peserta">Peserta</option>
          <option value="admin">Admin</option>
          <option value="all">All</option>
        </select>
      </div>

      {isLoading ? <LoadingSkeleton rows={3} /> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {!isLoading && !error && users.length === 0 ? (
        <EmptyState title="Belum ada user" description="Endpoint user tidak mengembalikan data untuk filter ini." />
      ) : null}
      {!isLoading && !error && users.length > 0 ? (
        <>
          <section className="panel">
            <div className="panel-body">
              <table>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>
                        <UserRoleBadge role={user.role} />
                      </td>
                      <td>
                        <UserStatusBadge isVerified={user.isVerified} />
                      </td>
                      <td>
                        <div className="actions">
                          {!user.isVerified ? (
                            <Button disabled={mutatingId === user.id} onClick={() => void handleVerify(user.id, user.name)} type="button">
                              Verify
                            </Button>
                          ) : null}
                          <Button href={`/users/${user.id}`} variant="ghost">
                            Detail
                          </Button>
                          {user.role !== "admin" ? (
                            <Button disabled={mutatingId === user.id} onClick={() => void handleDelete(user.id, user.name)} type="button">
                              Hapus
                            </Button>
                          ) : null}
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
              Total: {total} user - Halaman {page} dari {totalPages}
            </span>
            <div className="actions">
              <Button
                disabled={page <= 1}
                onClick={() => setFilters({ ...filters, start: Math.max(0, (filters.start ?? 0) - limit) })}
                type="button"
              >
                Sebelumnya
              </Button>
              <Button
                disabled={page >= totalPages}
                onClick={() => setFilters({ ...filters, start: (filters.start ?? 0) + limit })}
                type="button"
                variant="primary"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
