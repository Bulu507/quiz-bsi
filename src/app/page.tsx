import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function HomePage() {
  const token = cookies().get("quiz-bsi-token")?.value;
  const role = cookies().get("quiz-bsi-role")?.value;

  if (!token) {
    redirect("/login");
  }

  redirect(role === "PESERTA" ? "/student/dashboard" : "/dashboard");
}
