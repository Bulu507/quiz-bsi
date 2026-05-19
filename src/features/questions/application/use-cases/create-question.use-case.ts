import type { CreateQuestionPayload, IQuestionRepository } from "../../domain/IQuestionRepository.interface";

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function validateQuestionPayload(payload: CreateQuestionPayload) {
  if (!payload.subcategoryId) throw new Error("Subkategori soal wajib dipilih.");
  if (!stripHtml(payload.text)) throw new Error("Teks soal wajib diisi.");
  if (!stripHtml(payload.explanation)) throw new Error("Pembahasan wajib diisi.");
  if (payload.options.length < 2) throw new Error("Minimal harus ada dua pilihan jawaban.");

  const emptyOption = payload.options.find((option) => !stripHtml(option.text));
  if (emptyOption) throw new Error(`Pilihan ${emptyOption.label} wajib diisi.`);

  const correctOptions = payload.options.filter((option) => option.isCorrect);
  if (correctOptions.length === 0) throw new Error("Minimal satu opsi wajib memiliki poin lebih dari 0.");
  const outOfRangeOption = payload.options.find((option) => option.scoreValue < -5 || option.scoreValue > 5);
  if (outOfRangeOption) throw new Error(`Poin pilihan ${outOfRangeOption.label} harus berada di rentang -5 sampai 5.`);
}

export function createQuestionUseCase(repository: IQuestionRepository, payload: CreateQuestionPayload) {
  validateQuestionPayload(payload);
  return repository.create(payload);
}
