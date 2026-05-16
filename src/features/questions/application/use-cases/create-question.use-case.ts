import type { CreateQuestionPayload, IQuestionRepository } from "../../domain/IQuestionRepository.interface";

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function validateQuestionPayload(payload: CreateQuestionPayload) {
  if (!payload.categoryId) throw new Error("Kategori soal wajib dipilih.");
  if (!stripHtml(payload.text)) throw new Error("Teks soal wajib diisi.");
  if (!stripHtml(payload.explanation)) throw new Error("Pembahasan wajib diisi.");
  if (payload.options.length < 2) throw new Error("Minimal harus ada dua pilihan jawaban.");

  const emptyOption = payload.options.find((option) => !stripHtml(option.text));
  if (emptyOption) throw new Error(`Pilihan ${emptyOption.label} wajib diisi.`);

  const correctOptions = payload.options.filter((option) => option.isCorrect);
  if (correctOptions.length === 0) throw new Error("Minimal satu jawaban benar wajib dipilih.");
  if (payload.type === "PG" && correctOptions.length > 1) throw new Error("Soal PG hanya boleh memiliki satu jawaban benar.");
}

export function createQuestionUseCase(repository: IQuestionRepository, payload: CreateQuestionPayload) {
  validateQuestionPayload(payload);
  return repository.create(payload);
}
