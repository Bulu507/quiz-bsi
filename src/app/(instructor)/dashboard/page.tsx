import { BookOpen, Boxes, CalendarCheck, UsersRound } from "lucide-react";
import { getClassMembersUseCase } from "@/features/classes/application/use-cases/get-class-members.use-case";
import { classRepository } from "@/features/classes/infrastructure/class.repository";
import { getPackagesUseCase } from "@/features/packages/application/use-cases/get-packages.use-case";
import { packageRepository } from "@/features/packages/infrastructure/package.repository";
import { InstructorShell } from "@/shared/components/layout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Badge, Button, PageHeader, Panel } from "@/shared/components/ui";

const statIcons = [UsersRound, BookOpen, Boxes, CalendarCheck];

export default async function DashboardPage() {
  const studentsWithoutExam = await getClassMembersUseCase(classRepository, "class-1");
  const latestPackages = await getPackagesUseCase(packageRepository);
  const stats = [
    { label: "Total Murid", value: "87", trend: "+5 bulan ini" },
    { label: "Total Soal", value: "1.248", trend: "132 published" },
    { label: "Total Paket", value: "18", trend: "4 aktif" },
    { label: "Ujian Bulan Ini", value: "312", trend: "+18%" }
  ];

  return (
    <InstructorShell active="Dashboard">
      <PageHeader
        eyebrow="Pengajar"
        title="Dashboard"
        actions={
          <>
            <Button>Unduh Rekap</Button>
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

        <div className="two-col">
          <Panel title="Murid yang Belum Pernah Ujian" action={<Button variant="ghost">Lihat Semua</Button>}>
            {studentsWithoutExam.map((student) => (
              <div className="row" key={student.name}>
                <div className="identity">
                  <span className="avatar">{student.initials}</span>
                  <div>
                    <h3>{student.name}</h3>
                    <p className="muted">{student.className}</p>
                  </div>
                </div>
                <Badge>{student.status === "BELUM_UJIAN" ? "Belum ujian" : "Aktif"}</Badge>
              </div>
            ))}
          </Panel>

          <Panel title="Paket Ujian Terbaru" action={<Button variant="ghost">Lihat Semua</Button>}>
            {latestPackages.map((item) => (
              <div className="row" key={item.title}>
                <div>
                  <h3>{item.title}</h3>
                  <p className="muted">
                    {item.questionCount} soal - {item.durationMinutes} menit
                  </p>
                </div>
                <Badge tone={item.status === "PUBLISHED" ? "green" : "yellow"}>{item.status}</Badge>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </InstructorShell>
  );
}
