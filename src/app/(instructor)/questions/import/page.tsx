import { Download, UploadCloud } from "lucide-react";
import { InstructorShell } from "@/shared/components/layout";
import { Badge, Button, PageHeader, Panel } from "@/shared/components/ui";

export default function ImportQuestionsPage() {
  return (
    <InstructorShell active="Bank Soal">
      <PageHeader
        eyebrow="Bank Soal"
        title="Import Excel"
        actions={
          <Button>
            <Download size={16} />
            Download Template
          </Button>
        }
      />

      <div className="stack">
        <Panel title="1. Upload File">
          <div className="card" style={{ display: "grid", minHeight: 220, placeItems: "center", textAlign: "center" }}>
            <div className="stack" style={{ justifyItems: "center" }}>
              <UploadCloud size={44} color="#2563eb" />
              <h2>Drop file Excel di sini</h2>
              <p className="muted">Format .xlsx, maksimal 5MB</p>
              <Button variant="primary">Pilih File</Button>
            </div>
          </div>
        </Panel>

        <Panel title="2. Preview & Validasi" action={<Badge tone="green">45 soal valid</Badge>}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kategori</th>
                <th>Teks Soal</th>
                <th>Jawaban</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>TWK</td>
                <td>Nilai dasar negara...</td>
                <td>B</td>
                <td>
                  <Badge tone="green">Valid</Badge>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>TIU</td>
                <td>Deret angka...</td>
                <td>-</td>
                <td>
                  <Badge tone="red">Error</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </div>
    </InstructorShell>
  );
}
