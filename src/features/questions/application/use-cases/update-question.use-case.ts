import type { IQuestionRepository, UpdateQuestionPayload } from "../../domain/IQuestionRepository.interface";

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function validateQuestionPayload(payload: UpdateQuestionPayload) {
  if (payload.categoryId !== undefined && !payload.categoryId) throw new Error("Kategori soal wajib dipilih.");
  if (payload.text !== undefined && !stripHtml(payload.text)) throw new Error("Teks soal wajib diisi.");
  if (payload.explanation !== undefined && !stripHtml(payload.explanation)) throw new Error("Pembahasan wajib diisi.");

  if (payload.options) {
    if (payload.options.length < 2) throw new Error("Minimal harus ada dua pilihan jawaban.");

    const emptyOption = payload.options.find((option) => !stripHtml(option.text));
    if (emptyOption) throw new Error(`Pilihan ${emptyOption.label} wajib diisi.`);

    const correctOptions = payload.options.filter((option) => option.isCorrect);
    if (correctOptions.length === 0) throw new Error("Minimal satu jawaban benar wajib dipilih.");
    if (payload.type === "PG" && correctOptions.length > 1) throw new Error("Soal PG hanya boleh memiliki satu jawaban benar.");
  }
}

export function updateQuestionUseCase(repository: IQuestionRepository, id: string, payload: UpdateQuestionPayload) {
  validateQuestionPayload(payload);
  return repository.update(id, payload);
}
