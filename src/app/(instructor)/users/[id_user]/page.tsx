import { UserDetailScreen } from "@/features/users/presentation/UserDetailScreen";
import { InstructorShell } from "@/shared/components/layout";

export default function UserDetailPage({
  params
}: {
  params: { id_user: string };
}) {
  return (
    <InstructorShell active="Users">
      <UserDetailScreen userId={params.id_user} />
    </InstructorShell>
  );
}
