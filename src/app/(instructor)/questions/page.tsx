import { QuestionsList } from "@/features/questions/presentation/QuestionsList";
import { InstructorShell } from "@/shared/components/layout";

export default function QuestionsPage() {
  return (
    <InstructorShell active="Bank Soal">
      <QuestionsList />
    </InstructorShell>
  );
}
