import { Copy, QrCode } from "lucide-react";
import { getClassMembersUseCase } from "@/features/classes/application/use-cases/get-class-members.use-case";
import { classRepository } from "@/features/classes/infrastructure/class.repository";
import { InstructorShell } from "@/shared/components/layout";
import { Badge, Button, PageHeader, Panel } from "@/shared/components/ui";

export default async function ClassDetailPage() {
  const members = await getClassMembersUseCase(classRepository, "class-1");

  return (
    <InstructorShell active="Kelas">
      <PageHeader
        eyebrow="Kelas"
        title="Kelas CPNS Pagi"
        actions={
          <>
            <Button>
              <Copy size={16} />
              ABC123
            </Button>
            <Button>
              <QrCode size={16} />
              QR Code
            </Button>
          </>
        }
      />

      <Panel title="Murid" action={<Button>Export Nilai ke Excel</Button>}>
        {members.map((student) => (
          <div className="row" key={student.name}>
            <div className="identity">
              <span className="avatar">{student.initials}</span>
              <div>
                <h3>{student.name}</h3>
                <p className="muted">{student.className}</p>
              </div>
            </div>
            <Badge tone="blue">{student.status === "AKTIF" ? "Aktif" : "Belum ujian"}</Badge>
          </div>
        ))}
      </Panel>
    </InstructorShell>
  );
}
