import { KategoriScreen } from "@/features/kategori/presentation/KategoriScreen";
import { InstructorShell } from "@/shared/components/layout";

export default function KategoriPage() {
  return (
    <InstructorShell active="Kategori">
      <KategoriScreen />
    </InstructorShell>
  );
}
