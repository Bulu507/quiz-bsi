"use client";

import { Plus, Upload } from "lucide-react";
import { EmptyState, Button, LoadingSkeleton, PageHeader } from "@/shared/components/ui";
import { useQuestionMetadata } from "../application/hooks/useQuestionMetadata";
import { useQuestions } from "../application/hooks/useQuestions";
import { QuestionCard } from "./QuestionCard";
import { QuestionFilters } from "./QuestionFilters";

export function QuestionsList() {
  const { deletingId, deleteQuestion, error, filters, isLoading, meta, questions, setFilters } = useQuestions({ page: 1, limit: 10 });
  const { categories, error: metadataError } = useQuestionMetadata();
  const page = meta?.page ?? filters.page ?? 1;
  const limit = meta?.limit ?? filters.limit ?? 10;
  const total = meta?.total ?? questions.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function handleDelete(questionId: string) {
    const shouldDelete = window.confirm("Hapus soal ini dari bank soal?");
    if (shouldDelete) void deleteQuestion(questionId);
  }

  return (
    <>
      <PageHeader
        eyebrow="Manajemen Konten"
        title="Bank Soal"
        actions={
          <>
            <Button href="/questions/import">
              <Upload size={16} />
              Import Excel
            </Button>
            <Button href="/questions/new" variant="primary">
              <Plus size={16} />
              Tambah Soal
            </Button>
          </>
        }
      />

      <QuestionFilters categories={categories} filters={filters} onChange={setFilters} />

      {isLoading ? <LoadingSkeleton rows={3} /> : null}
      {error ? <p className="badge red">{error}</p> : null}
      {metadataError ? <p className="badge red">{metadataError}</p> : null}
      {!isLoading && !error && questions.length === 0 ? (
        <EmptyState
          title="Belum ada soal"
          description="Mulai dengan menambahkan soal pertama atau import dari Excel."
          action={<Button href="/questions/new" variant="primary">Tambah Soal</Button>}
        />
      ) : null}
      {!isLoading && !error && questions.length > 0 ? (
        <>
          <div className="list">
            {questions.map((question) => (
              <QuestionCard
                isDeleting={deletingId === question.id}
                key={question.id}
                onDelete={() => handleDelete(question.id)}
                question={question}
              />
            ))}
          </div>
          <div className="row" style={{ marginTop: 18 }}>
            <span className="muted">
              Total: {total} soal - Halaman {page} dari {totalPages}
            </span>
            <div className="actions">
              <Button disabled={page <= 1} onClick={() => setFilters({ ...filters, page: Math.max(1, page - 1) })}>
                Sebelumnya
              </Button>
              <Button disabled={page >= totalPages} onClick={() => setFilters({ ...filters, page: page + 1 })} variant="primary">
                Berikutnya
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
