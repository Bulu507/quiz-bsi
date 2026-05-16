"use client";

import type { QuestionOptionLabel } from "../domain/question.types";

export function OptionInput({
  isCorrect,
  label,
  onCorrect,
  onTextChange,
  type = "radio",
  value
}: {
  isCorrect: boolean;
  label: QuestionOptionLabel;
  onCorrect: () => void;
  onTextChange: (value: string) => void;
  type?: "checkbox" | "radio";
  value: string;
}) {
  return (
    <div className="option-row">
      <input aria-label={`Jawaban benar ${label}`} checked={isCorrect} name="correct" onChange={onCorrect} type={type} />
      <span className="option-label">{label}</span>
      <input aria-label={`Pilihan ${label}`} className="field" onChange={(event) => onTextChange(event.target.value)} value={value} />
    </div>
  );
}
