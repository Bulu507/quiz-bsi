"use client";

import { Button, EmptyState, LoadingSkeleton, PageHeader, Panel } from "@/shared/components/ui";
import { useUserDetail } from "../application/hooks/useUserDetail";
import { UserRoleBadge, UserStatusBadge } from "./UserBadges";

export function UserDetailScreen({ userId }: { userId: string }) {
  const { error, isLoading, user } = useUserDetail(userId);

  return (
    <>
      <PageHeader eyebrow="Manajemen User" title="Detail User" actions={<Button href="/users">Kembali</Button>} />

      {isLoading ? <LoadingSkeleton rows={2} /> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {!isLoading && !error && !user ? (
        <EmptyState title="User tidak ditemukan" description="Endpoint detail user tidak mengembalikan data." />
      ) : null}
      {!isLoading && !error && user ? (
        <div className="stack">
          <Panel title={user.name}>
            <table>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <th>Username</th>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <th>Role</th>
                  <td>
                    <UserRoleBadge role={user.role} />
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <UserStatusBadge isVerified={user.isVerified} />
                  </td>
                </tr>
                <tr>
                  <th>Dibuat</th>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleString("id-ID") : "-"}</td>
                </tr>
                <tr>
                  <th>Login Terakhir</th>
                  <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("id-ID") : "-"}</td>
                </tr>
              </tbody>
            </table>
          </Panel>

          <EmptyState title="Riwayat attempt belum tersedia" description="PRD mencatat riwayat attempt per user menunggu endpoint backend." />
        </div>
      ) : null}
    </>
  );
}
