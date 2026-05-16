import { InstructorShell } from "@/shared/components/layout";
import { Button, EmptyState, PageHeader } from "@/shared/components/ui";

export default function ClassesPage() {
  return (
    <InstructorShell active="Kelas">
      <PageHeader eyebrow="Kelas" title="Daftar Kelas" actions={<Button disabled>Buat Kelas</Button>} />
      <EmptyState title="Belum ada data kelas" description="Endpoint kelas belum tersedia di collection API." />
    </InstructorShell>
  );
}
