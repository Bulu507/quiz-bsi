import { Badge, Button } from "@/shared/components/ui";
import type { Question } from "../domain/question.types";

function getScoreClass(score: number) {
  if (score > 0) return "score-badge positive";
  if (score < 0) return "score-badge negative";
  return "score-badge neutral";
}

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
            <strong>{option.label}.</strong> <span dangerouslySetInnerHTML={{ __html: option.text }} />{" "}
            <span className={getScoreClass(option.scoreValue)}>{option.scoreValue}</span>
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
