"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Badge, Button, Panel } from "@/shared/components/ui";
import { uploadQuestionsExcelUseCase } from "../application/use-cases/import-questions.use-case";
import { questionRepository } from "../infrastructure/question.repository";
import { useQuestionMetadata } from "../application/hooks/useQuestionMetadata";

type PreviewCell = string | number | boolean | null;
type ExcelPreview = {
  headerRows: string[][];
  rows: PreviewCell[][];
  sheetName: string;
  totalRows: number;
};

function isHiddenColumn(column?: { hidden?: boolean; wch?: number; wpx?: number }) {
  return column?.hidden === true || column?.wch === 0 || column?.wpx === 0;
}

function isHiddenRow(row?: { hidden?: boolean; hpt?: number; hpx?: number }) {
  return row?.hidden === true || row?.hpt === 0 || row?.hpx === 0;
}

function isEmptyCell(value: PreviewCell | undefined) {
  return value === undefined || value === null || String(value).trim() === "";
}

function isEmptyRow(row: PreviewCell[]) {
  return row.every(isEmptyCell);
}
type StatusDialog = {
  actionHref?: string;
  actionLabel?: string;
  message: string;
  title: string;
  type: "success" | "error";
};

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getErrorMessage(cause: unknown, fallback: string) {
  if (cause && typeof cause === "object" && "response" in cause) {
    const response = (cause as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }

  return cause instanceof Error ? cause.message : fallback;
}

export function QuestionImportScreen() {
  const { error: metadataError, isLoading: isMetadataLoading, subcategories } = useQuestionMetadata();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const selectedSubcategory = subcategories.find((subcategory) => subcategory.id === selectedSubcategoryId);
  const [excelPreview, setExcelPreview] = useState<ExcelPreview | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState<StatusDialog | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function readExcelFile(file: File) {
    setIsReadingFile(true);
    setStatusDialog(null);

    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { cellStyles: true, type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("File Excel tidak memiliki sheet.");

      const sheet = workbook.Sheets[sheetName];
      if (!sheet["!ref"]) throw new Error("File Excel kosong.");

      const range = XLSX.utils.decode_range(sheet["!ref"]);
      const visibleColumnIndexes = Array.from({ length: range.e.c - range.s.c + 1 }, (_, index) => range.s.c + index).filter(
        (columnIndex) => !isHiddenColumn(sheet["!cols"]?.[columnIndex])
      );

      if (visibleColumnIndexes.length === 0) throw new Error("Tidak ada kolom Excel yang bisa ditampilkan.");

      const readCell = (rowIndex: number, columnIndex: number): PreviewCell => {
        const directCell = sheet[XLSX.utils.encode_cell({ c: columnIndex, r: rowIndex })];
        if (!isEmptyCell(directCell?.v as PreviewCell | undefined)) return directCell.v as PreviewCell;

        const mergedRange = sheet["!merges"]?.find(
          (merge) => rowIndex >= merge.s.r && rowIndex <= merge.e.r && columnIndex >= merge.s.c && columnIndex <= merge.e.c
        );
        if (!mergedRange) return "";

        const mergedCell = sheet[XLSX.utils.encode_cell({ c: mergedRange.s.c, r: mergedRange.s.r })];
        return (mergedCell?.v as PreviewCell | undefined) ?? "";
      };

      const headerRows = [0, 1]
        .filter((rowIndex) => rowIndex >= range.s.r && rowIndex <= range.e.r && !isHiddenRow(sheet["!rows"]?.[rowIndex]))
        .map((rowIndex) => visibleColumnIndexes.map((columnIndex) => String(readCell(rowIndex, columnIndex) ?? "")));

      if (headerRows.length === 0) throw new Error("Header Excel tidak ditemukan.");

      const visibleRows: PreviewCell[][] = [];
      for (let rowIndex = 4; rowIndex <= range.e.r; rowIndex += 1) {
        if (isHiddenRow(sheet["!rows"]?.[rowIndex])) continue;

        const row = visibleColumnIndexes.map((columnIndex) => readCell(rowIndex, columnIndex));
        if (isEmptyRow(row)) break;
        visibleRows.push(row);
      }

      setPendingFile(file);
      setExcelPreview({
        headerRows,
        rows: visibleRows.slice(0, 20),
        sheetName,
        totalRows: visibleRows.length
      });
      setIsPreviewOpen(true);
    } catch (cause) {
      setPendingFile(null);
      setExcelPreview(null);
      setStatusDialog({
        message: getErrorMessage(cause, "Gagal membaca file Excel."),
        title: "File Tidak Valid",
        type: "error"
      });
    } finally {
      setIsReadingFile(false);
    }
  }

  async function uploadFile(file: File) {
    setIsUploading(true);
    setStatusDialog(null);

    try {
      const response = await uploadQuestionsExcelUseCase(questionRepository, file, selectedSubcategoryId);
      const importedCount = response.data?.imported ?? response.data?.inserted ?? response.data?.total;
      setPendingFile(null);
      setExcelPreview(null);
      setIsPreviewOpen(false);
      setStatusDialog({
        actionHref: `/questions${selectedSubcategoryId ? `?subcategoryId=${selectedSubcategoryId}` : ""}`,
        actionLabel: "Kembali ke Bank Soal",
        message: `${response.message || "File Excel berhasil diproses."}${importedCount ? ` (${importedCount} soal)` : ""}`,
        title: "Import Berhasil",
        type: "success"
      });
    } catch (cause) {
      setIsPreviewOpen(false);
      setStatusDialog({
        message: getErrorMessage(cause, "Gagal import soal."),
        title: "Import Gagal",
        type: "error"
      });
    } finally {
      setIsUploading(false);
    }
  }

  function approveImport() {
    if (!pendingFile) return;
    void uploadFile(pendingFile);
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
              <p className="muted">
                {selectedSubcategoryId
                  ? `File akan diimport ke ${selectedSubcategory?.name ?? "subkategori terpilih"} setelah kamu approve preview.`
                  : "Pilih subkategori tujuan terlebih dahulu agar tombol file aktif."}
              </p>
              <Button
                disabled={!selectedSubcategoryId || isReadingFile || isUploading}
                onClick={() => fileInputRef.current?.click()}
                type="button"
                variant="primary"
              >
                {isReadingFile ? "Membaca File..." : "Pilih File"}
              </Button>
              <input
                accept=".xlsx"
                aria-label="File import soal"
                disabled={!selectedSubcategoryId || isReadingFile || isUploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void readExcelFile(file);
                  event.target.value = "";
                }}
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
              />
            </div>
          </div>
        </div>
      </Panel>

      {metadataError ? <p className="badge red">{metadataError}</p> : null}

      {isPreviewOpen && excelPreview && pendingFile ? (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <section className="modal">
            <div className="modal-head">
              <div>
                <p className="eyebrow">Preview Excel</p>
                <h2>{pendingFile.name}</h2>
              </div>
              <Button disabled={isUploading} onClick={() => setIsPreviewOpen(false)} type="button">
                Tutup
              </Button>
            </div>
            <div className="modal-body stack">
              <div className="meta-line">
                <Badge tone="blue">{excelPreview.sheetName}</Badge>
                <Badge>{formatFileSize(pendingFile.size)}</Badge>
                <Badge tone="green">{excelPreview.totalRows} baris data</Badge>
                <Badge tone="yellow">Tujuan: {selectedSubcategory?.name ?? selectedSubcategoryId}</Badge>
              </div>
              <div className="notice">
                <strong>Validasi sebelum import</strong>
                <p>Pastikan kolom, isi soal, dan subkategori tujuan sudah benar. Data belum dikirim ke backend sampai kamu klik Konfirmasi Import.</p>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    {excelPreview.headerRows.map((headerRow, rowIndex) => (
                      <tr key={rowIndex}>
                        {headerRow.map((column, columnIndex) => (
                          <th key={`${rowIndex}-${columnIndex}`}>{column}</th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {excelPreview.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {excelPreview.headerRows[0].map((_, columnIndex) => (
                          <td key={columnIndex}>{String(row[columnIndex] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {excelPreview.totalRows > excelPreview.rows.length ? (
                <p className="muted">Preview menampilkan 20 baris pertama dari {excelPreview.totalRows} baris data.</p>
              ) : null}
            </div>
            <div className="modal-foot">
              <Button disabled={isUploading} onClick={() => setIsPreviewOpen(false)} type="button">
                Batal
              </Button>
              <Button disabled={isUploading} onClick={approveImport} type="button" variant="primary">
                {isUploading ? "Mengimport..." : "Konfirmasi Import"}
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      {statusDialog ? (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <section className="modal status-modal">
            <div className="modal-head">
              <div>
                <p className="eyebrow">{statusDialog.type === "success" ? "Selesai" : "Perlu Dicek"}</p>
                <h2>{statusDialog.title}</h2>
              </div>
            </div>
            <div className="modal-body">
              <div className={`status-box ${statusDialog.type}`}>
                <strong>{statusDialog.title}</strong>
                <p>{statusDialog.message}</p>
              </div>
            </div>
            <div className="modal-foot">
              {statusDialog.type === "error" ? (
                <Button onClick={() => setStatusDialog(null)} type="button">
                  Tutup
                </Button>
              ) : (
                <>
                  <Button onClick={() => setStatusDialog(null)} type="button">
                    Import Lagi
                  </Button>
                  <Button href={statusDialog.actionHref ?? "/questions"} variant="primary">
                    {statusDialog.actionLabel ?? "Kembali ke Bank Soal"}
                  </Button>
                </>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
