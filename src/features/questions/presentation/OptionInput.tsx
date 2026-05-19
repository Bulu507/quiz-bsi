"use client";

import type { QuestionOptionLabel } from "../domain/question.types";

export function OptionInput({
  label,
  onScoreChange,
  onTextChange,
  score,
  value
}: {
  label: QuestionOptionLabel;
  onScoreChange: (value: number) => void;
  onTextChange: (value: string) => void;
  score: number;
  value: string;
}) {
  return (
    <div className="option-row">
      <span className="option-label">{label}</span>
      <input aria-label={`Pilihan ${label}`} className="field" onChange={(event) => onTextChange(event.target.value)} value={value} />
      <label className="score-field">
        Poin
        <input
          aria-label={`Poin pilihan ${label}`}
          className="field"
          max={5}
          min={-5}
          onChange={(event) => onScoreChange(Number(event.target.value))}
          type="number"
          value={score}
        />
      </label>
    </div>
  );
}
