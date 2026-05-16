import { InstructorShell } from "@/shared/components/layout";
import { Button, EmptyState, PageHeader, Panel } from "@/shared/components/ui";

export default function NewPackagePage() {
  return (
    <InstructorShell active="Paket Ujian">
      <PageHeader
        eyebrow="Paket Ujian"
        title="Buat Paket Ujian"
        actions={
          <>
            <Button>Simpan Draft</Button>
            <Button variant="primary">Publish Paket</Button>
          </>
        }
      />

      <div className="two-col">
        <Panel title="Konfigurasi Paket">
          <div className="stack">
            <label>
              Nama paket
              <input className="field" />
            </label>
            <label>
              Deskripsi
              <textarea className="textarea" />
            </label>
            <div className="form-grid">
              <label>
                Durasi
                <input className="field" />
              </label>
              <label>
                Passing grade
                <input className="field" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Benar
                <input className="field" />
              </label>
              <label>
                Salah
                <input className="field" />
              </label>
            </div>
          </div>
        </Panel>

        <Panel title="Pilih Soal">
          <div className="stack">
            <input className="field" aria-label="Cari soal" />
            <EmptyState title="Belum ada soal dipilih" description="Integrasi pemilihan soal akan memakai endpoint /adm/soal pada fase package." />
          </div>
        </Panel>
      </div>
    </InstructorShell>
  );
}
