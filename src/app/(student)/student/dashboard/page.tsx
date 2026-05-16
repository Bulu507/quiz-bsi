import { Award, ClipboardCheck, LineChart } from "lucide-react";
import { getAvailablePackagesUseCase } from "@/features/packages/application/use-cases/get-available-packages.use-case";
import { packageRepository } from "@/features/packages/infrastructure/package.repository";
import { StudentShell } from "@/shared/components/layout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Badge, Button, EmptyState, PageHeader } from "@/shared/components/ui";

const statIcons = [ClipboardCheck, LineChart, Award];

export default async function StudentDashboardPage() {
  const availablePackages = await getAvailablePackagesUseCase(packageRepository);
  const stats = [
    { label: "Ujian Dikerjakan", value: "-", trend: "Menunggu endpoint riwayat" },
    { label: "Rata-rata Nilai", value: "-", trend: "Menunggu endpoint analytics" },
    { label: "Sesi Terbaik", value: "-", trend: "Menunggu endpoint result" }
  ];

  return (
    <StudentShell>
      <PageHeader eyebrow="Peserta" title="Dashboard Peserta" />

      <div className="stack">
        <div className="grid-3">
          {stats.map((stat, index) => (
            <StatCard
              icon={statIcons[index] ?? ClipboardCheck}
              key={stat.label}
              label={stat.label}
              trend={stat.trend}
              value={stat.value}
            />
          ))}
        </div>

        <section>
          <div className="panel-head" style={{ paddingLeft: 0, paddingRight: 0, borderBottom: 0 }}>
            <h2>Paket Ujian Tersedia</h2>
          </div>
          <div className="grid-3">
            {availablePackages.length > 0 ? (
              availablePackages.map((item) => (
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
              ))
            ) : (
              <EmptyState title="Belum ada paket tersedia" description="Endpoint daftar paket peserta belum tersedia di collection API." />
            )}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
