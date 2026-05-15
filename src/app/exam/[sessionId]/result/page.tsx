import { getSessionResultUseCase } from "@/features/results/application/use-cases/get-session-result.use-case";
import { resultRepository } from "@/features/results/infrastructure/result.repository";
import { Badge, Button, Panel, ProgressBar } from "@/shared/components/ui";

export default async function ExamResultPage({
  params
}: {
  params: { sessionId: string };
}) {
  const resultRows = await getSessionResultUseCase(resultRepository, params.sessionId);

  return (
    <main className="result-layout stack">
      <section className="panel score-hero">
        <Badge tone="green">LULUS</Badge>
        <div className="score">385 / 550</div>
        <div style={{ width: "min(520px, 100%)" }}>
          <ProgressBar value={70} />
        </div>
        <p className="muted">Waktu pengerjaan: 87 menit 23 detik</p>
      </section>

      <Panel title="Nilai per Kategori">
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Nilai</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {resultRows.map((row) => (
              <tr key={row.category}>
                <td>{row.category}</td>
                <td>{row.score}</td>
                <td>
                  <ProgressBar value={row.progress} />
                </td>
                <td>
                  <Badge tone="green">{row.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Pembahasan">
        <article className="review-item">
          <div className="meta-line">
            <strong>Soal 5</strong>
            <Badge tone="green">Benar</Badge>
          </div>
          <p className="muted">Kamu memilih B. Jawaban benar B.</p>
        </article>
        <article className="review-item">
          <div className="meta-line">
            <strong>Soal 8</strong>
            <Badge tone="red">Salah</Badge>
          </div>
          <p className="muted">Kamu memilih A. Jawaban benar C.</p>
        </article>
      </Panel>

      <div className="actions">
        <Button href="/student/dashboard">Kembali ke Dashboard</Button>
        <Button href="/exam/demo" variant="primary">
          Ulangi Ujian
        </Button>
      </div>
    </main>
  );
}
