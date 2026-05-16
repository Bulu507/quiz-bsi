"use client";

import type { ChangeEvent } from "react";
import type { DifficultyLevel, QuestionFilters as QuestionFilterValues, QuestionStatus } from "../domain/question.types";

export function QuestionFilters({
  filters,
  onChange
}: {
  filters: QuestionFilterValues;
  onChange: (filters: QuestionFilterValues) => void;
}) {
  function updateFilter(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value || undefined, page: 1 });
  }

  return (
    <div className="toolbar">
      <input
        className="field"
        aria-label="Cari teks soal"
        name="search"
        onChange={updateFilter}
        placeholder="Search teks soal..."
        value={filters.search ?? ""}
      />
      <select className="select" aria-label="Kategori" name="categoryId" onChange={updateFilter} value={filters.categoryId ?? ""}>
        <option value="">Semua kategori</option>
        <option value="twk">TWK</option>
        <option value="tiu">TIU</option>
        <option value="tkp">TKP</option>
      </select>
      <select
        className="select"
        aria-label="Kesulitan"
        name="difficulty"
        onChange={updateFilter}
        value={filters.difficulty ?? ""}
      >
        <option value="">Semua level</option>
        {(["MUDAH", "SEDANG", "SULIT"] satisfies DifficultyLevel[]).map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <select className="select" aria-label="Status" name="status" onChange={updateFilter} value={filters.status ?? ""}>
        <option value="">Semua status</option>
        {(["DRAFT", "PUBLISHED", "ARCHIVED"] satisfies QuestionStatus[]).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
