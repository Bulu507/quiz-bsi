"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { startStudentQuizUseCase } from "@/features/packages/application/use-cases/start-student-quiz.use-case";
import { packageRepository } from "@/features/packages/infrastructure/package.repository";
import { Button, EmptyState } from "@/shared/components/ui";

export function ExamClient({ packageId }: { packageId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  async function startQuiz() {
    setIsStarting(true);
    setError(null);

    try {
      const result = await startStudentQuizUseCase(packageRepository, packageId);
      router.push(`/exam/${result.attemptId}/result`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memulai ujian.");
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <section className="exam-screen">
      <main className="result-layout">
        <EmptyState
          title="Mulai sesi ujian"
          description="Sesi attempt akan dibuat melalui endpoint peserta saat tombol mulai ditekan."
          action={
            <div className="actions">
              <Button disabled={isStarting} onClick={() => void startQuiz()} variant="primary">
                {isStarting ? "Memulai..." : "Mulai Ujian"}
              </Button>
              <Button href="/student/dashboard">Kembali ke Dashboard</Button>
            </div>
          }
        />
        {error ? <p className="badge red">{error}</p> : null}
      </main>
    </section>
  );
}
