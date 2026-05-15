import { RegisterForm } from "@/features/auth/presentation/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="student-layout" style={{ display: "grid", placeItems: "center", padding: 18 }}>
      <RegisterForm />
    </main>
  );
}
