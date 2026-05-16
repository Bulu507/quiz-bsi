import { getSessionResultUseCase } from "@/features/results/application/use-cases/get-session-result.use-case";
import { resultRepository } from "@/features/results/infrastructure/result.repository";
import { Button, EmptyState, Panel, ProgressBar, Badge } from "@/shared/components/ui";

export default async function ExamResultPage({
  params
}: {
  params: { sessionId: string };
}) {
  const resultRows = await getSessionResultUseCase(resultRepository, params.sessionId);

  return (
    <main className="result-layout stack">
      {resultRows.length > 0 ? (
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
                    <Badge tone={row.status === "Lulus" ? "green" : "red"}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      ) : (
        <EmptyState title="Hasil belum tersedia" description="Endpoint result peserta /pst/quiz/:id_attempt/result belum diintegrasikan." />
      )}

      <div className="actions">
        <Button href="/student/dashboard">Kembali ke Dashboard</Button>
      </div>
    </main>
  );
}
