import { StudentShell } from "@/shared/components/layout";
import { EmptyState, PageHeader } from "@/shared/components/ui";

export default function StudentHistoryPage() {
  return (
    <StudentShell>
      <PageHeader eyebrow="Murid" title="Riwayat Ujian" />
      <section className="panel">
        <div className="panel-body">
          <EmptyState title="Belum ada riwayat ujian" description="Endpoint peserta belum mengembalikan data riwayat untuk akun ini." />
        </div>
      </section>
    </StudentShell>
  );
}
