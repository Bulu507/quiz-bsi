"use client";

import { FormEvent, useState } from "react";
import { authRepository } from "../infrastructure/auth.repository";
import { registerUseCase } from "../application/use-cases/register.use-case";
import type { UserRole } from "../domain/auth.types";
import { Brand, Button } from "@/shared/components/ui";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("PESERTA");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await registerUseCase(authRepository, { email, fullName, password, role });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Registrasi gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="panel form-shell" style={{ width: "min(480px, 100%)" }}>
      <form className="panel-body stack" onSubmit={handleSubmit}>
        <Brand dark />
        <div>
          <p className="eyebrow">Akun baru</p>
          <h1>Daftar</h1>
        </div>
        <label>
          Nama
          <input className="field" onChange={(event) => setFullName(event.target.value)} value={fullName} />
        </label>
        <label>
          Email
          <input className="field" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </label>
        <label>
          Role
          <select className="select" onChange={(event) => setRole(event.target.value as UserRole)} value={role}>
            <option value="PESERTA">Peserta</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <label>
          Password
          <input className="field" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
        </label>
        {error ? <p className="badge red">{error}</p> : null}
        <Button disabled={isLoading} type="submit" variant="primary">
          {isLoading ? "Memproses..." : "Daftar"}
        </Button>
        <p className="muted">
          Sudah punya akun? <a href="/login">Masuk</a>
        </p>
      </form>
    </section>
  );
}
