import { SubkategoriDetailScreen } from "@/features/subkategori/presentation/SubkategoriDetailScreen";
import { InstructorShell } from "@/shared/components/layout";

export default function SubkategoriDetailPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <InstructorShell active="Subkategori">
      <SubkategoriDetailScreen subkategoriId={params.id} />
    </InstructorShell>
  );
}
