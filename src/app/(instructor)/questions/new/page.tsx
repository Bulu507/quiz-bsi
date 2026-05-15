import { Image as ImageIcon, List, ListOrdered } from "lucide-react";
import { InstructorShell } from "@/shared/components/layout";
import { Button, PageHeader, Panel } from "@/shared/components/ui";

const options = [
  "Dasar hukum tertulis negara",
  "Ideologi dan dasar negara",
  "Pedoman teknis pemerintahan daerah",
  "Sumber peraturan kementerian"
];

export default function NewQuestionPage() {
  return (
    <InstructorShell active="Bank Soal">
      <div className="form-shell">
        <PageHeader eyebrow="Bank Soal" title="Tambah Soal" />

        <div className="stack">
          <Panel title="Metadata">
            <div className="form-grid">
              <label>
                Kategori
                <select className="select" defaultValue="TWK">
                  <option>TWK</option>
                  <option>TIU</option>
                  <option>TKP</option>
                </select>
              </label>
              <label>
                Subkategori
                <select className="select" defaultValue="Pancasila">
                  <option>Pancasila</option>
                  <option>Nasionalisme</option>
                  <option>Integritas</option>
                </select>
              </label>
              <label>
                Tags
                <input className="field" defaultValue="nasionalisme, pancasila" />
              </label>
              <label>
                Tingkat Kesulitan
                <span className="radio-row">
                  <button className="radio-pill">Mudah</button>
                  <button className="radio-pill active">Sedang</button>
                  <button className="radio-pill">Sulit</button>
                </span>
              </label>
            </div>
          </Panel>

          <Panel title="Soal">
            <div className="editor-toolbar">
              <button className="tool-btn">B</button>
              <button className="tool-btn">I</button>
              <button className="tool-btn" aria-label="Ordered list">
                <ListOrdered size={16} />
              </button>
              <button className="tool-btn" aria-label="Bullet list">
                <List size={16} />
              </button>
              <button className="tool-btn" aria-label="Upload gambar">
                <ImageIcon size={16} />
              </button>
            </div>
            <div className="editor">
              Rumusan dasar negara yang disampaikan pada sidang BPUPKI menjadi bagian penting dalam lahirnya
              Pancasila sebagai...
            </div>
          </Panel>

          <Panel title="Pilihan Jawaban" action={<Button>Tambah Pilihan</Button>}>
            <div className="stack">
              {options.map((option, index) => (
                <div className="option-row" key={option}>
                  <input type="radio" name="correct" defaultChecked={index === 1} aria-label={`Jawaban ${index + 1}`} />
                  <span className="option-label">{String.fromCharCode(65 + index)}</span>
                  <input className="field" defaultValue={option} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Pembahasan">
            <div className="editor-toolbar">
              <button className="tool-btn">B</button>
              <button className="tool-btn">I</button>
              <button className="tool-btn" aria-label="Bullet list">
                <List size={16} />
              </button>
            </div>
            <div className="editor">Pancasila digunakan sebagai ideologi dan dasar negara dalam kehidupan berbangsa.</div>
          </Panel>

          <div className="actions">
            <Button>Simpan Draft</Button>
            <Button variant="primary">Simpan & Publish</Button>
          </div>
        </div>
      </div>
    </InstructorShell>
  );
}
