import { Award, ClipboardCheck, LineChart } from "lucide-react";
import { getAvailablePackagesUseCase } from "@/features/packages/application/use-cases/get-available-packages.use-case";
import { packageRepository } from "@/features/packages/infrastructure/package.repository";
import { StudentShell } from "@/shared/components/layout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Badge, Button, PageHeader } from "@/shared/components/ui";

const statIcons = [ClipboardCheck, LineChart, Award];

export default async function StudentDashboardPage() {
  const availablePackages = await getAvailablePackagesUseCase(packageRepository);
  const stats = [
    { label: "Ujian Dikerjakan", value: "12", trend: "3 bulan terakhir" },
    { label: "Rata-rata Nilai", value: "382", trend: "Dari maksimal 550" },
    { label: "Sesi Terbaik", value: "438", trend: "Tryout SKD Sesi 2" }
  ];

  return (
    <StudentShell>
      <PageHeader eyebrow="Target: SKD CPNS" title="Halo, Andini Rahma" />

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
            {availablePackages.map((item) => (
              <article className="card package-card" key={item.title}>
                <Badge tone="blue">{item.hasAccess ? "Akses aktif" : "Belum ada akses"}</Badge>
                <div className="stack" style={{ gap: 8 }}>
                  <h2>{item.title}</h2>
                  <div className="package-meta">
                    <span>{item.questionCount} soal</span>
                    <span>{item.durationMinutes} menit</span>
                    <span>Sisa: {item.maxAttempts === null ? "unlimited" : item.maxAttempts - item.attemptsUsed}</span>
                  </div>
                </div>
                <Button href="/exam/demo" variant="primary">
                  Mulai Ujian
                </Button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
