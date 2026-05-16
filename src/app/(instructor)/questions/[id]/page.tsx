import { QuestionEditScreen } from "@/features/questions/presentation/QuestionEditScreen";
import { InstructorShell } from "@/shared/components/layout";
import { PageHeader } from "@/shared/components/ui";

export default async function EditQuestionPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <InstructorShell active="Bank Soal">
      <div className="form-shell">
        <PageHeader eyebrow="Bank Soal" title="Edit Soal" />
        <QuestionEditScreen questionId={params.id} />
      </div>
    </InstructorShell>
  );
}
