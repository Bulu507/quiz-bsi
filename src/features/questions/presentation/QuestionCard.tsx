import { Badge, Button } from "@/shared/components/ui";
import type { Question } from "../domain/question.types";

export function QuestionCard({
  isDeleting,
  onDelete,
  question
}: {
  isDeleting?: boolean;
  onDelete?: (question: Question) => void;
  question: Question;
}) {
  return (
    <article className="card question-card">
      <div className="meta-line">
        <Badge tone="blue">{question.categoryName}</Badge>
        <Badge tone={question.difficulty === "SEDANG" ? "yellow" : "neutral"}>{question.difficulty}</Badge>
      </div>
      <div className="question-text" dangerouslySetInnerHTML={{ __html: question.text }} />
      <div className="answer-grid">
        {question.options.map((option) => (
          <span key={option.id}>
            {option.label}. {option.text}
          </span>
        ))}
      </div>
      <div className="row">
        <span className="muted">Dibuat: {new Date(question.createdAt).toLocaleDateString("id-ID")}</span>
        <div className="actions">
          <Button href={`/questions/${question.id}`}>Edit</Button>
          <Button disabled={isDeleting} onClick={() => onDelete?.(question)} type="button">
            {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>
    </article>
  );
}
