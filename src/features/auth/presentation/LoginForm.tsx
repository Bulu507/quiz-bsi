"use client";

import { FormEvent, useState } from "react";
import { Brand, Button } from "@/shared/components/ui";
import { useLogin } from "../application/hooks/useLogin";

export function LoginForm() {
  const { error, isLoading, login, loginWithGoogle } = useLogin();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void login({ username, password });
  }

  return (
    <section className="panel form-shell" style={{ width: "min(440px, 100%)" }}>
      <form className="panel-body stack" onSubmit={handleSubmit}>
        <Brand dark />
        <div>
          <p className="eyebrow">Masuk akun</p>
          <h1>Login</h1>
        </div>
        <label>
          Username
          <input className="field" onChange={(event) => setUsername(event.target.value)} value={username} />
        </label>
        <label>
          Password
          <input className="field" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
        </label>
        {error ? <p className="badge red">{error}</p> : null}
        <Button disabled={isLoading} type="submit" variant="primary">
          {isLoading ? "Memproses..." : "Masuk Admin"}
        </Button>
        <Button disabled={isLoading} onClick={() => void loginWithGoogle()} type="button">
          Masuk dengan Google
        </Button>
        <p className="muted">
          Belum punya akun? <a href="/register">Daftar</a>
        </p>
      </form>
    </section>
  );
}
