import { Plus, Upload } from "lucide-react";
import { getQuestionsUseCase } from "@/features/questions/application/use-cases/get-questions.use-case";
import { questionRepository } from "@/features/questions/infrastructure/question.repository";
import { InstructorShell } from "@/shared/components/layout";
import { Badge, Button, PageHeader } from "@/shared/components/ui";

export default async function QuestionsPage() {
  const questions = await getQuestionsUseCase(questionRepository, { search: "Pancasila" });

  return (
    <InstructorShell active="Bank Soal">
      <PageHeader
        eyebrow="Manajemen Konten"
        title="Bank Soal"
        actions={
          <>
            <Button href="/questions/import">
              <Upload size={16} />
              Import Excel
            </Button>
            <Button href="/questions/new" variant="primary">
              <Plus size={16} />
              Tambah Soal
            </Button>
          </>
        }
      />

      <div className="toolbar">
        <input className="field" aria-label="Cari teks soal" defaultValue="Pancasila" />
        <select className="select" aria-label="Kategori" defaultValue="TWK">
          <option>TWK</option>
          <option>TIU</option>
          <option>TKP</option>
        </select>
        <select className="select" aria-label="Kesulitan" defaultValue="SEDANG">
          <option>MUDAH</option>
          <option>SEDANG</option>
          <option>SULIT</option>
        </select>
        <select className="select" aria-label="Status" defaultValue="PUBLISHED">
          <option>PUBLISHED</option>
          <option>DRAFT</option>
        </select>
      </div>

      <div className="list">
        {questions.data.map((question) => (
          <article className="card question-card" key={question.text}>
            <div className="meta-line">
              <Badge tone="blue">{question.categoryName}</Badge>
              <Badge tone={question.difficulty === "SEDANG" ? "yellow" : "neutral"}>{question.difficulty}</Badge>
              <Badge tone="green">{question.status}</Badge>
            </div>
            <p>{question.text}</p>
            <div className="answer-grid">
              {question.options.map((option) => (
                <span key={option.id}>
                  {option.label}. {option.text}
                </span>
              ))}
            </div>
            <div className="row">
              <span className="muted">Dibuat: {question.createdAt}</span>
              <div className="actions">
                <Button>Edit</Button>
                <Button>Hapus</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="actions" style={{ marginTop: 18 }}>
        <Button>Sebelumnya</Button>
        <Button variant="primary">Berikutnya</Button>
      </div>
    </InstructorShell>
  );
}
