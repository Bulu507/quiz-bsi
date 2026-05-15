import { getQuestionsUseCase } from "@/features/questions/application/use-cases/get-questions.use-case";
import { questionRepository } from "@/features/questions/infrastructure/question.repository";
import { InstructorShell } from "@/shared/components/layout";
import { Badge, Button, PageHeader, Panel } from "@/shared/components/ui";

export default async function NewPackagePage() {
  const questions = await getQuestionsUseCase(questionRepository);

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
              <input className="field" defaultValue="Tryout SKD Sesi 3" />
            </label>
            <label>
              Deskripsi
              <textarea className="textarea" defaultValue="Simulasi SKD lengkap dengan TWK, TIU, dan TKP." />
            </label>
            <div className="form-grid">
              <label>
                Durasi
                <input className="field" defaultValue="100" />
              </label>
              <label>
                Passing grade
                <input className="field" defaultValue="300" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Benar
                <input className="field" defaultValue="+5" />
              </label>
              <label>
                Salah
                <input className="field" defaultValue="0" />
              </label>
            </div>
          </div>
        </Panel>

        <Panel title="Pilih Soal" action={<Badge tone="blue">2 soal terpilih</Badge>}>
          <div className="stack">
            <input className="field" defaultValue="Pancasila" aria-label="Cari soal" />
            {questions.data.map((question) => (
              <label className="card" key={question.text}>
                <span className="meta-line">
                  <input type="checkbox" defaultChecked />
                  <Badge tone="blue">{question.categoryName}</Badge>
                  <Badge>{question.difficulty}</Badge>
                </span>
                <span className="muted">{question.text}</span>
              </label>
            ))}
            <div className="meta-line">
              <Badge tone="blue">TWK: 30</Badge>
              <Badge tone="blue">TIU: 35</Badge>
              <Badge tone="blue">TKP: 45</Badge>
            </div>
          </div>
        </Panel>
      </div>
    </InstructorShell>
  );
}
