import { UserManagementScreen } from "@/features/users/presentation/UserManagementScreen";
import { InstructorShell } from "@/shared/components/layout";

export default function UsersPage() {
  return (
    <InstructorShell active="Users">
      <UserManagementScreen />
    </InstructorShell>
  );
}
