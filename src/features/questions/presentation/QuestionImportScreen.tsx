"use client";

import { useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Badge, Button, EmptyState, Panel } from "@/shared/components/ui";
import { uploadQuestionsExcelUseCase } from "../application/use-cases/import-questions.use-case";
import type { ImportPreviewRow, ImportQuestionsResult } from "../domain/question.types";
import { questionRepository } from "../infrastructure/question.repository";
import { useQuestionMetadata } from "../application/hooks/useQuestionMetadata";

export function QuestionImportScreen() {
  const { error: metadataError, isLoading: isMetadataLoading, subcategories } = useQuestionMetadata();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
  const [importResult, setImportResult] = useState<ImportQuestionsResult | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const validRows = useMemo(() => previewRows.filter((row) => row.isValid).length, [previewRows]);
  const importedCount = importResult?.imported ?? importResult?.inserted ?? importResult?.total ?? validRows;

  async function uploadFile(file: File) {
    setIsUploading(true);
    setError(null);
    setPreviewRows([]);
    setImportResult(null);
    setSuccessMessage(null);

    try {
      const response = await uploadQuestionsExcelUseCase(questionRepository, file, selectedSubcategoryId);
      setPreviewRows(response.data?.preview ?? []);
      setImportResult(response.data ?? {});
      setSuccessMessage(response.message || "File Excel berhasil diproses.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal import soal.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="stack">
      <Panel title="1. Upload File">
        <div className="stack">
          <label>
            Subkategori
            <select
              className="select"
              disabled={isMetadataLoading}
              onChange={(event) => setSelectedSubcategoryId(event.target.value)}
              value={selectedSubcategoryId}
            >
              <option value="">Pilih subkategori</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>
          <div className="card" style={{ display: "grid", minHeight: 220, placeItems: "center", textAlign: "center" }}>
            <div className="stack" style={{ justifyItems: "center" }}>
              <UploadCloud size={44} color="#2563eb" />
              <h2>Upload file Excel</h2>
              <p className="muted">Format .xlsx, maksimal 5MB</p>
              <label className={`btn primary ${!selectedSubcategoryId || isUploading ? "disabled" : ""}`}>
                Pilih File
                <input
                  accept=".xlsx"
                  aria-label="File import soal"
                  disabled={!selectedSubcategoryId || isUploading}
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadFile(file);
                  }}
                  type="file"
                />
              </label>
            </div>
          </div>
        </div>
      </Panel>

      {metadataError ? <p className="badge red">{metadataError}</p> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {successMessage ? (
        <p className="badge green">
          {successMessage}
          {importedCount > 0 ? ` (${importedCount} soal)` : ""}
        </p>
      ) : null}

      <Panel title="2. Preview & Validasi" action={previewRows.length > 0 ? <Badge tone="green">{validRows} soal valid</Badge> : null}>
        {previewRows.length === 0 ? (
          successMessage ? (
            <EmptyState title="Import berhasil" description="Endpoint import tidak mengirim preview, tetapi request upload sudah berhasil diproses." />
          ) : (
            <EmptyState title="Belum ada preview" description="Upload file Excel untuk melihat hasil validasi dari endpoint import." />
          )
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Teks Soal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row) => (
                <tr key={row.rowNumber}>
                  <td>{row.rowNumber}</td>
                  <td>{row.data.text ?? "-"}</td>
                  <td>
                    <Badge tone={row.isValid ? "green" : "red"}>{row.isValid ? "Valid" : row.errors.join(", ")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {previewRows.length > 0 || successMessage ? (
        <div className="actions">
          <Button href="/questions" variant="primary">
            Kembali ke Bank Soal
          </Button>
        </div>
      ) : null}
    </div>
  );
}
