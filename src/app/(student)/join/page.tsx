import { StudentShell } from "@/shared/components/layout";
import { Button, PageHeader, Panel } from "@/shared/components/ui";

export default function JoinClassPage() {
  return (
    <StudentShell>
      <div className="form-shell">
        <PageHeader eyebrow="Kelas" title="Masukkan Kode Kelas" />
        <Panel title="Kode Join">
          <div className="stack">
            <input className="field" defaultValue="ABC123" aria-label="Kode kelas" />
            <Button href="/student/dashboard" variant="primary">
              Gabung Kelas
            </Button>
          </div>
        </Panel>
      </div>
    </StudentShell>
  );
}
