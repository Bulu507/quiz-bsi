"use client";

import type { ChangeEvent } from "react";
import type { DifficultyLevel, QuestionCategory, QuestionFilters as QuestionFilterValues, QuestionSubcategory } from "../domain/question.types";

export function QuestionFilters({
  categories,
  filters,
  onChange,
  subcategories
}: {
  categories: QuestionCategory[];
  filters: QuestionFilterValues;
  onChange: (filters: QuestionFilterValues) => void;
  subcategories: QuestionSubcategory[];
}) {
  const visibleSubcategories = subcategories.filter(
    (subcategory) => !filters.categoryId || !subcategory.categoryId || subcategory.categoryId === filters.categoryId
  );

  function updateFilter(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const nextFilters = { ...filters, [name]: value || undefined, page: 1 };
    if (name === "categoryId") nextFilters.subcategoryId = undefined;
    onChange(nextFilters);
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
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select className="select" aria-label="Subkategori" name="subcategoryId" onChange={updateFilter} value={filters.subcategoryId ?? ""}>
        <option value="">Semua subkategori</option>
        {visibleSubcategories.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
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
    </div>
  );
}
