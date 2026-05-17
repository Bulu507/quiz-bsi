import { KategoriDetailScreen } from "@/features/kategori/presentation/KategoriDetailScreen";
import { InstructorShell } from "@/shared/components/layout";

export default function KategoriDetailPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <InstructorShell active="Kategori">
      <KategoriDetailScreen kategoriId={params.id} />
    </InstructorShell>
  );
}
