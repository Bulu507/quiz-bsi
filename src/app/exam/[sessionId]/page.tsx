import { Flag, Send } from "lucide-react";
import { Badge, Button, ProgressBar } from "@/shared/components/ui";

const answers = [
  "Pancasila hanya menjadi simbol dalam acara kenegaraan.",
  "Pancasila menjadi dasar nilai bagi peraturan dan tindakan pemerintah.",
  "Pancasila digunakan untuk mengganti seluruh aturan tertulis.",
  "Pancasila berlaku hanya pada kegiatan pendidikan formal.",
  "Pancasila menjadi aturan teknis dalam seleksi aparatur."
];

export default function ExamPage() {
  return (
    <section className="exam-screen">
      <header className="exam-head">
        <div className="brand dark">
          <span className="brand-mark">Q</span>
          Tryout SKD Sesi 3
        </div>
        <div className="progress-line">
          <div className="progress-meta">
            <span>Dijawab 45/110</span>
            <span>Ditandai 3</span>
            <span>Belum 62</span>
          </div>
          <ProgressBar value={41} />
        </div>
        <div className="timer">01:23:45</div>
      </header>

      <div className="exam-main">
        <article className="question-area">
          <div className="meta-line">
            <Badge tone="blue">Soal 12 dari 110</Badge>
            <Badge tone="yellow">Ditandai ragu</Badge>
          </div>
          <p className="question-text">
            Dalam konteks penyelenggaraan negara, nilai Pancasila berfungsi sebagai pedoman dasar dalam
            pembentukan hukum dan kebijakan publik. Pernyataan yang paling tepat menggambarkan fungsi tersebut
            adalah...
          </p>
          <div className="answer-options">
            {answers.map((answer, index) => (
              <div className={`answer-option ${index === 1 ? "selected" : ""}`} key={answer}>
                <span className="option-label">{String.fromCharCode(65 + index)}</span>
                <span>{answer}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="navigator">
          <h2>Navigasi Soal</h2>
          <div className="number-grid">
            {Array.from({ length: 20 }, (_, index) => {
              const number = index + 1;
              const state = number === 12 ? "current" : [1, 2, 5, 7, 11, 16].includes(number) ? "answered" : [4, 9].includes(number) ? "flagged" : "";
              return (
                <span className={`num ${state}`} key={number}>
                  {number}
                </span>
              );
            })}
          </div>
          <div className="list">
            <Badge tone="blue">Biru: dijawab</Badge>
            <Badge tone="yellow">Kuning: ditandai</Badge>
            <Badge tone="green">Hijau: aktif</Badge>
          </div>
        </aside>
      </div>

      <footer className="exam-foot">
        <Button>Soal Sebelumnya</Button>
        <div className="actions">
          <Button>
            <Flag size={16} />
            Tandai Soal
          </Button>
          <Button>Soal Berikutnya</Button>
          <Button href="/exam/demo/result" variant="primary">
            <Send size={16} />
            Kumpulkan
          </Button>
        </div>
      </footer>
    </section>
  );
}
