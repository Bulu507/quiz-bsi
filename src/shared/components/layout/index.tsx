import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, BookOpen, Boxes, FolderOpen, GraduationCap, UserRound, Users } from "lucide-react";
import { LogoutButton } from "@/features/auth/presentation/LogoutButton";
import { Brand, Button } from "@/shared/components/ui";

const instructorNav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/users", label: "Users", icon: Users },
  { href: "/kategori", label: "Kategori", icon: FolderOpen },
  { href: "/subkategori", label: "Subkategori", icon: FolderOpen },
  { href: "/questions", label: "Bank Soal", icon: BookOpen },
  { href: "/packages/new", label: "Paket Ujian", icon: Boxes },
  { href: "/classes", label: "Kelas", icon: GraduationCap }
];

export function InstructorShell({
  active,
  children
}: {
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Brand />
        <nav className="nav-group">
          {instructorNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className={`nav-item ${active === item.label ? "active" : ""}`}
                href={item.href}
                key={item.href}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="nav-spacer" />
        <nav className="nav-group">
          <a className="nav-item" href="#">
            <UserRound size={18} />
            Profil
          </a>
          <LogoutButton />
        </nav>
      </aside>
      <main className="main">
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

export function StudentShell({ children }: { children: ReactNode }) {
  return (
    <div className="student-layout">
      <nav className="topbar">
        <Brand dark />
        <div className="actions">
          <Button href="/student/history">Riwayat</Button>
          <Button href="/join">Join Kelas</Button>
          <LogoutButton variant="button" />
        </div>
      </nav>
      <main className="main">
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
