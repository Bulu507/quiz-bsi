import { QuestionsList } from "@/features/questions/presentation/QuestionsList";
import { InstructorShell } from "@/shared/components/layout";

export default function QuestionsPage({
  searchParams
}: {
  searchParams?: { categoryId?: string; subcategoryId?: string; search?: string };
}) {
  return (
    <InstructorShell active="Bank Soal">
      <QuestionsList
        initialFilters={{
          page: 1,
          limit: 10,
          categoryId: searchParams?.categoryId,
          subcategoryId: searchParams?.subcategoryId,
          search: searchParams?.search
        }}
      />
    </InstructorShell>
  );
}
