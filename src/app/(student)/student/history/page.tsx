import { StudentShell } from "@/shared/components/layout";
import { Badge, Button, PageHeader, ProgressBar } from "@/shared/components/ui";

const histories = [
  { date: "12 Mei 2026", packageName: "Tryout SKD Sesi 2", score: 438, progress: 80 },
  { date: "8 Mei 2026", packageName: "TWK Nasionalisme", score: 385, progress: 70 }
];

export default function StudentHistoryPage() {
  return (
    <StudentShell>
      <PageHeader eyebrow="Murid" title="Riwayat Ujian" />
      <section className="panel">
        <div className="panel-body">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Paket Ujian</th>
                <th>Nilai</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((history) => (
                <tr key={history.packageName}>
                  <td>{history.date}</td>
                  <td>{history.packageName}</td>
                  <td>{history.score}</td>
                  <td>
                    <ProgressBar value={history.progress} />
                  </td>
                  <td>
                    <Badge tone="green">Selesai</Badge>
                  </td>
                  <td>
                    <Button href="/exam/demo/result">Lihat</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </StudentShell>
  );
}
