import { Download } from "lucide-react";
import { InstructorShell } from "@/shared/components/layout";
import { QuestionImportScreen } from "@/features/questions/presentation/QuestionImportScreen";
import { Button, PageHeader } from "@/shared/components/ui";
import { BackButton } from "@/shared/components/ui/BackButton";

export default function ImportQuestionsPage() {
  return (
    <InstructorShell active="Bank Soal">
      <PageHeader
        eyebrow="Bank Soal"
        title="Import Excel"
        actions={
          <>
            <BackButton fallbackHref="/questions" />
            <Button>
              <Download size={16} />
              Download Template
            </Button>
          </>
        }
      />

      <QuestionImportScreen />
    </InstructorShell>
  );
}
