"use client";

import { useSessionResult } from "@/features/results/application/hooks/useSessionResult";
import { Button, EmptyState, Panel, ProgressBar, Badge, LoadingSkeleton } from "@/shared/components/ui";

export function ResultClient({ sessionId }: { sessionId: string }) {
  const { error, isLoading, results } = useSessionResult(sessionId);

  return (
    <main className="result-layout stack">
      {isLoading ? <LoadingSkeleton rows={3} /> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {!isLoading && !error && results.length > 0 ? (
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
              {results.map((row) => (
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
      ) : null}
      {!isLoading && !error && results.length === 0 ? (
        <EmptyState title="Hasil belum tersedia" description="Endpoint result belum mengembalikan baris nilai untuk attempt ini." />
      ) : null}

      <div className="actions">
        <Button href="/student/dashboard">Kembali ke Dashboard</Button>
      </div>
    </main>
  );
}
