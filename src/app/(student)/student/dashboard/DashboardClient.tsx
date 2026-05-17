"use client";

import { ClipboardCheck } from "lucide-react";
import { useStudentPackages } from "@/features/packages/application/hooks/useStudentPackages";
import { StudentShell } from "@/shared/components/layout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Badge, Button, EmptyState, LoadingSkeleton, PageHeader } from "@/shared/components/ui";

export function StudentDashboardClient() {
  const { error, isLoading, packages } = useStudentPackages();

  return (
    <StudentShell>
      <PageHeader eyebrow="Peserta" title="Dashboard Peserta" />

      <div className="stack">
        <div className="grid-3">
          <StatCard icon={ClipboardCheck} label="Paket Tersedia" trend="Dari endpoint peserta" value={isLoading ? "..." : String(packages.length)} />
        </div>

        <section>
          <div className="panel-head" style={{ paddingLeft: 0, paddingRight: 0, borderBottom: 0 }}>
            <h2>Paket Ujian Tersedia</h2>
          </div>
          {isLoading ? <LoadingSkeleton rows={3} /> : null}
          {error ? <p className="badge red">{error}</p> : null}
          {!isLoading && !error && packages.length === 0 ? (
            <EmptyState title="Belum ada paket tersedia" description="Belum ada paket ujian yang dikembalikan endpoint peserta." />
          ) : null}
          {!isLoading && !error && packages.length > 0 ? (
            <div className="grid-3">
              {packages.map((item) => (
                <article className="card package-card" key={item.id}>
                  <Badge tone="blue">{item.hasAccess ? "Akses aktif" : "Belum ada akses"}</Badge>
                  <div className="stack" style={{ gap: 8 }}>
                    <h2>{item.title}</h2>
                    <div className="package-meta">
                      <span>{item.questionCount} soal</span>
                      <span>{item.durationMinutes} menit</span>
                      <span>Sisa: {item.maxAttempts === null ? "unlimited" : item.maxAttempts - item.attemptsUsed}</span>
                    </div>
                  </div>
                  <Button href={`/exam/${item.id}`} variant="primary">
                    Mulai Ujian
                  </Button>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </StudentShell>
  );
}
