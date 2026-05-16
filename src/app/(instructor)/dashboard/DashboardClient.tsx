"use client";

import { useEffect, useState } from "react";
import { BookOpen, Boxes, CalendarCheck, UsersRound } from "lucide-react";
import { getPackagesUseCase } from "@/features/packages/application/use-cases/get-packages.use-case";
import { packageRepository } from "@/features/packages/infrastructure/package.repository";
import type { ExamPackage } from "@/features/packages/domain/package.types";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Badge, Button, EmptyState, LoadingSkeleton, PageHeader, Panel } from "@/shared/components/ui";

const statIcons = [UsersRound, BookOpen, Boxes, CalendarCheck];

export function DashboardClient() {
  const [packages, setPackages] = useState<ExamPackage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getPackagesUseCase(packageRepository);
        if (isMounted) setPackages(result);
      } catch (cause) {
        if (isMounted) setError(cause instanceof Error ? cause.message : "Gagal memuat dashboard.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { label: "Total Murid", value: "-", trend: "Menunggu endpoint kelas" },
    { label: "Total Soal", value: "-", trend: "Lihat Bank Soal" },
    { label: "Total Paket", value: String(packages.length), trend: "Dari endpoint /adm/quiz" },
    { label: "Ujian Bulan Ini", value: "-", trend: "Menunggu endpoint analytics" }
  ];

  return (
    <>
      <PageHeader
        eyebrow="Pengajar"
        title="Dashboard"
        actions={
          <>
            <Button disabled>Unduh Rekap</Button>
            <Button href="/packages/new" variant="primary">
              Buat Paket
            </Button>
          </>
        }
      />

      <div className="stack">
        <div className="grid-4">
          {stats.map((stat, index) => (
            <StatCard
              icon={statIcons[index] ?? UsersRound}
              key={stat.label}
              label={stat.label}
              trend={stat.trend}
              value={stat.value}
            />
          ))}
        </div>

        {isLoading ? <LoadingSkeleton rows={2} /> : null}
        {error ? <p className="badge red">{error}</p> : null}

        {!isLoading && !error ? (
          <div className="two-col">
            <Panel title="Murid yang Belum Pernah Ujian" action={<Button disabled variant="ghost">Lihat Semua</Button>}>
              <EmptyState title="Belum ada data murid" description="Endpoint kelas atau anggota kelas belum tersedia di collection API." />
            </Panel>

            <Panel title="Paket Ujian Terbaru" action={<Button disabled variant="ghost">Lihat Semua</Button>}>
              {packages.length > 0 ? (
                packages.map((item) => (
                  <div className="row" key={item.id}>
                    <div>
                      <h3>{item.title}</h3>
                      <p className="muted">
                        {item.questionCount} soal - {item.durationMinutes} menit
                      </p>
                    </div>
                    <Badge tone={item.status === "PUBLISHED" ? "green" : "yellow"}>{item.status}</Badge>
                  </div>
                ))
              ) : (
                <EmptyState title="Belum ada quiz" description="Data dari endpoint /adm/quiz belum tersedia." />
              )}
            </Panel>
          </div>
        ) : null}
      </div>
    </>
  );
}
