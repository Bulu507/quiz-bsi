"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Panel } from "@/shared/components/ui";
import type { CreateQuestionPayload } from "../domain/IQuestionRepository.interface";
import type { Question, QuestionOptionLabel } from "../domain/question.types";
import { useQuestionMetadata } from "../application/hooks/useQuestionMetadata";
import { useQuestionForm } from "../application/hooks/useQuestionForm";
import { OptionInput } from "./OptionInput";
import { QuestionEditor } from "./QuestionEditor";

const optionLabels: QuestionOptionLabel[] = ["A", "B", "C", "D", "E"];

function normalizeSingleCorrectOption(options: Question["options"]) {
  const selectedIndex = Math.max(0, options.findIndex((option) => option.isCorrect));

  return options.map((option, index) => ({
    ...option,
    isCorrect: index === selectedIndex,
    scoreValue: index === selectedIndex ? Math.max(option.scoreValue, 1) : 0
  }));
}

function createInitialPayload(initialData?: Question): CreateQuestionPayload {
  return initialData
    ? {
        categoryId: initialData.categoryId,
        categoryName: initialData.categoryName,
        subcategoryId: initialData.subcategoryId,
        createdBy: initialData.createdBy,
        type: "PG",
        text: initialData.text,
        imageUrl: initialData.imageUrl,
        difficulty: initialData.difficulty,
        tags: initialData.tags,
        explanation: initialData.explanation,
        explanationImageUrl: initialData.explanationImageUrl,
        options: normalizeSingleCorrectOption(initialData.options)
      }
    : {
        categoryId: "",
        categoryName: "",
        subcategoryId: "",
        createdBy: "",
        type: "PG",
        text: "",
        imageUrl: null,
        difficulty: "SEDANG",
        tags: [],
        explanation: "",
        explanationImageUrl: null,
        options: optionLabels.slice(0, 4).map((label, index) => ({
          id: label.toLowerCase(),
          label,
          text: "",
          imageUrl: null,
          isCorrect: index === 1,
          scoreValue: index === 1 ? 1 : 0
        })),
      };
}

export function QuestionForm({ initialData }: { initialData?: Question }) {
  const router = useRouter();
  const { error, isSaving, saveQuestion } = useQuestionForm(initialData);
  const { error: metadataError, isLoading: isMetadataLoading, subcategories } = useQuestionMetadata();
  const [payload, setPayload] = useState<CreateQuestionPayload>(() => createInitialPayload(initialData));

  useEffect(() => {
    if (initialData) return;
    if (subcategories.length === 0) return;

    setPayload((current) => {
      if (current.subcategoryId) return current;
      const firstSubcategory = subcategories[0];

      return {
        ...current,
        categoryId: firstSubcategory.categoryId ?? "",
        categoryName: "",
        subcategoryId: firstSubcategory?.id ?? ""
      };
    });
  }, [initialData, subcategories]);

  function addOption() {
    setPayload((current) => {
      const label = optionLabels[current.options.length];
      if (!label) return current;

      return {
        ...current,
        options: [
          ...current.options,
          {
            id: label.toLowerCase(),
            label,
            text: "",
            imageUrl: null,
            isCorrect: false,
            scoreValue: 0
          }
        ]
      };
    });
  }

  async function save() {
    await saveQuestion(payload);
    router.push("/questions");
  }

  return (
    <div className="stack">
      <Panel title="Metadata">
        <div className="form-grid">
          <label>
            Subkategori
            <select
              className="select"
              disabled={isMetadataLoading || subcategories.length === 0}
              onChange={(event) => {
                const nextSubcategory = subcategories.find((subcategory) => subcategory.id === event.target.value);
                setPayload((current) => ({
                  ...current,
                  categoryId: nextSubcategory?.categoryId ?? "",
                  categoryName: "",
                  subcategoryId: event.target.value
                }));
              }}
              value={payload.subcategoryId ?? ""}
            >
              <option value="">Pilih subkategori</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Panel>
      {metadataError ? <p className="badge red">{metadataError}</p> : null}

      <Panel title="Soal">
        <QuestionEditor label="Teks soal" onChange={(value) => setPayload((current) => ({ ...current, text: value }))} value={payload.text} />
      </Panel>

      <Panel
        title="Pilihan Jawaban"
        action={
          <Button disabled={payload.options.length >= optionLabels.length} onClick={addOption} type="button">
            Tambah Pilihan
          </Button>
        }
      >
        <div className="stack">
          {payload.options.map((option, index) => (
            <OptionInput
              isCorrect={option.isCorrect}
              key={option.id}
              label={option.label}
              onCorrect={() =>
                setPayload((current) => ({
                  ...current,
                  options: current.options.map((item) => ({ ...item, isCorrect: item.id === option.id, scoreValue: item.id === option.id ? 1 : 0 }))
                }))
              }
              onTextChange={(value) =>
                setPayload((current) => ({
                  ...current,
                  options: current.options.map((item, itemIndex) => (itemIndex === index ? { ...item, text: value } : item))
                }))
              }
              type="radio"
              value={option.text}
            />
          ))}
        </div>
      </Panel>

      <Panel title="Pembahasan">
        <QuestionEditor
          label="Pembahasan"
          onChange={(value) => setPayload((current) => ({ ...current, explanation: value }))}
          value={payload.explanation}
        />
      </Panel>

      {error ? <p className="badge red">{error}</p> : null}
      <div className="actions">
        <Button disabled={isSaving} onClick={() => void save()} type="button" variant="primary">
          {isSaving ? "Menyimpan..." : "Simpan Soal"}
        </Button>
      </div>
    </div>
  );
}
