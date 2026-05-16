"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Panel } from "@/shared/components/ui";
import type { CreateQuestionPayload } from "../domain/IQuestionRepository.interface";
import type { DifficultyLevel, Question, QuestionOptionLabel, QuestionStatus, QuestionType } from "../domain/question.types";
import { useQuestionForm } from "../application/hooks/useQuestionForm";
import { OptionInput } from "./OptionInput";
import { QuestionEditor } from "./QuestionEditor";

const optionLabels: QuestionOptionLabel[] = ["A", "B", "C", "D", "E"];

function createInitialPayload(initialData?: Question): CreateQuestionPayload {
  return initialData
    ? {
        categoryId: initialData.categoryId,
        categoryName: initialData.categoryName,
        subcategoryId: initialData.subcategoryId,
        createdBy: initialData.createdBy,
        type: initialData.type,
        text: initialData.text,
        imageUrl: initialData.imageUrl,
        difficulty: initialData.difficulty,
        tags: initialData.tags,
        explanation: initialData.explanation,
        explanationImageUrl: initialData.explanationImageUrl,
        options: initialData.options,
        status: initialData.status
      }
    : {
        categoryId: "twk",
        categoryName: "TWK",
        subcategoryId: "pancasila",
        createdBy: "backend",
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
        status: "DRAFT"
      };
}

export function QuestionForm({ initialData }: { initialData?: Question }) {
  const router = useRouter();
  const { error, isSaving, saveQuestion } = useQuestionForm(initialData);
  const [payload, setPayload] = useState<CreateQuestionPayload>(() => createInitialPayload(initialData));

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

  async function save(status: QuestionStatus) {
    await saveQuestion({ ...payload, status });
    router.push("/questions");
  }

  return (
    <div className="stack">
      <Panel title="Metadata">
        <div className="form-grid">
          <label>
            Jenis Soal
            <select
              className="select"
              onChange={(event) =>
                setPayload((current) => ({
                  ...current,
                  type: event.target.value as QuestionType,
                  options: (() => {
                    if (event.target.value === "PGK") return current.options;
                    const selectedIndex = Math.max(0, current.options.findIndex((item) => item.isCorrect));
                    return current.options.map((option, index) => ({ ...option, isCorrect: index === selectedIndex }));
                  })()
                }))
              }
              value={payload.type}
            >
              <option value="PG">Pilihan Ganda</option>
              <option value="PGK">Pilihan Ganda Kompleks</option>
              <option value="BERGAMBAR">Bergambar</option>
            </select>
          </label>
          <label>
            Kategori
            <select
              className="select"
              onChange={(event) => setPayload((current) => ({ ...current, categoryId: event.target.value, categoryName: event.target.selectedOptions[0].text }))}
              value={payload.categoryId}
            >
              <option value="twk">TWK</option>
              <option value="tiu">TIU</option>
              <option value="tkp">TKP</option>
            </select>
          </label>
          <label>
            Subkategori
            <select
              className="select"
              onChange={(event) => setPayload((current) => ({ ...current, subcategoryId: event.target.value }))}
              value={payload.subcategoryId ?? ""}
            >
              <option value="pancasila">Pancasila</option>
              <option value="nasionalisme">Nasionalisme</option>
              <option value="aritmetika">Aritmetika</option>
            </select>
          </label>
          <label>
            Tags
            <input
              aria-label="Tags"
              className="field"
              onChange={(event) => setPayload((current) => ({ ...current, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) }))}
              value={payload.tags.join(", ")}
            />
          </label>
          <label>
            Tingkat Kesulitan
            <select
              className="select"
              onChange={(event) => setPayload((current) => ({ ...current, difficulty: event.target.value as DifficultyLevel }))}
              value={payload.difficulty}
            >
              <option value="MUDAH">MUDAH</option>
              <option value="SEDANG">SEDANG</option>
              <option value="SULIT">SULIT</option>
            </select>
          </label>
        </div>
      </Panel>

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
                  options:
                    current.type === "PGK"
                      ? current.options.map((item) =>
                          item.id === option.id
                            ? { ...item, isCorrect: !item.isCorrect, scoreValue: item.isCorrect ? 0 : Math.max(item.scoreValue, 1) }
                            : item
                        )
                      : current.options.map((item) => ({ ...item, isCorrect: item.id === option.id, scoreValue: item.id === option.id ? 1 : 0 }))
                }))
              }
              onTextChange={(value) =>
                setPayload((current) => ({
                  ...current,
                  options: current.options.map((item, itemIndex) => (itemIndex === index ? { ...item, text: value } : item))
                }))
              }
              type={payload.type === "PGK" ? "checkbox" : "radio"}
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
        <Button disabled={isSaving} onClick={() => void save("DRAFT")} type="button">
          Simpan Draft
        </Button>
        <Button disabled={isSaving} onClick={() => void save("PUBLISHED")} type="button" variant="primary">
          Simpan & Publish
        </Button>
      </div>
    </div>
  );
}
