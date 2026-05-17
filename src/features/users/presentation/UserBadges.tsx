import { Badge } from "@/shared/components/ui";
import type { ManagedUser } from "../domain/user.types";

export function UserRoleBadge({ role }: { role: ManagedUser["role"] }) {
  return <Badge tone={role === "admin" ? "blue" : "neutral"}>{role === "admin" ? "Admin" : "Peserta"}</Badge>;
}

export function UserStatusBadge({ isVerified }: { isVerified: boolean }) {
  return <Badge tone={isVerified ? "green" : "yellow"}>{isVerified ? "Terverifikasi" : "Belum Verifikasi"}</Badge>;
}
