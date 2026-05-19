import { QuestionForm } from "@/features/questions/presentation/QuestionForm";
import { InstructorShell } from "@/shared/components/layout";
import { PageHeader } from "@/shared/components/ui";
import { BackButton } from "@/shared/components/ui/BackButton";

export default function NewQuestionPage() {
  return (
    <InstructorShell active="Bank Soal">
      <div className="form-shell">
        <PageHeader eyebrow="Bank Soal" title="Tambah Soal" actions={<BackButton fallbackHref="/questions" />} />
        <QuestionForm />
      </div>
    </InstructorShell>
  );
}
