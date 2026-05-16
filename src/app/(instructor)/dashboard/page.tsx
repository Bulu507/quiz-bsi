import { InstructorShell } from "@/shared/components/layout";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <InstructorShell active="Dashboard">
      <DashboardClient />
    </InstructorShell>
  );
}
