import { Button, EmptyState } from "@/shared/components/ui";

export default function ExamPage() {
  return (
    <section className="exam-screen">
      <main className="result-layout">
        <EmptyState
          title="Sesi ujian belum dimuat"
          description="Engine ujian akan menggunakan endpoint peserta /pst/quiz pada fase exam."
          action={<Button href="/student/dashboard">Kembali ke Dashboard</Button>}
        />
      </main>
    </section>
  );
}
