import { LoginForm } from "@/features/auth/presentation/LoginForm";

export default function LoginPage() {
  return (
    <main className="student-layout" style={{ display: "grid", placeItems: "center", padding: 18 }}>
      <LoginForm />
    </main>
  );
}
