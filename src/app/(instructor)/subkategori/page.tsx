import { SubkategoriScreen } from "@/features/subkategori/presentation/SubkategoriScreen";
import { InstructorShell } from "@/shared/components/layout";

export default function SubkategoriPage() {
  return (
    <InstructorShell active="Subkategori">
      <SubkategoriScreen />
    </InstructorShell>
  );
}
