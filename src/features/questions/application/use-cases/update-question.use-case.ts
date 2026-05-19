import type { IQuestionRepository, UpdateQuestionPayload } from "../../domain/IQuestionRepository.interface";

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function validateQuestionPayload(payload: UpdateQuestionPayload) {
  if (payload.subcategoryId !== undefined && !payload.subcategoryId) throw new Error("Subkategori soal wajib dipilih.");
  if (payload.text !== undefined && !stripHtml(payload.text)) throw new Error("Teks soal wajib diisi.");
  if (payload.explanation !== undefined && !stripHtml(payload.explanation)) throw new Error("Pembahasan wajib diisi.");

  if (payload.options) {
    if (payload.options.length < 2) throw new Error("Minimal harus ada dua pilihan jawaban.");

    const emptyOption = payload.options.find((option) => !stripHtml(option.text));
    if (emptyOption) throw new Error(`Pilihan ${emptyOption.label} wajib diisi.`);

    const correctOptions = payload.options.filter((option) => option.isCorrect);
    if (correctOptions.length === 0) throw new Error("Minimal satu opsi wajib memiliki poin lebih dari 0.");
    const outOfRangeOption = payload.options.find((option) => option.scoreValue < -5 || option.scoreValue > 5);
    if (outOfRangeOption) throw new Error(`Poin pilihan ${outOfRangeOption.label} harus berada di rentang -5 sampai 5.`);
  }
}

export function updateQuestionUseCase(repository: IQuestionRepository, id: string, payload: UpdateQuestionPayload) {
  validateQuestionPayload(payload);
  return repository.update(id, payload);
}
