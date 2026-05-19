import { QuestionEditScreen } from "@/features/questions/presentation/QuestionEditScreen";
import { InstructorShell } from "@/shared/components/layout";
import { PageHeader } from "@/shared/components/ui";
import { BackButton } from "@/shared/components/ui/BackButton";

export default async function EditQuestionPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <InstructorShell active="Bank Soal">
      <div className="form-shell">
        <PageHeader eyebrow="Bank Soal" title="Edit Soal" actions={<BackButton fallbackHref="/questions" />} />
        <QuestionEditScreen questionId={params.id} />
      </div>
    </InstructorShell>
  );
}
