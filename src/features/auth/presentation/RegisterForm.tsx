import { Brand, Button } from "@/shared/components/ui";

export function RegisterForm() {
  return (
    <section className="panel form-shell" style={{ width: "min(480px, 100%)" }}>
      <div className="panel-body stack">
        <Brand dark />
        <div>
          <p className="eyebrow">Akun baru</p>
          <h1>Daftar</h1>
        </div>
        <label>
          Nama
          <input className="field" defaultValue="Andini Rahma" />
        </label>
        <label>
          Email
          <input className="field" defaultValue="murid@quizbsi.test" />
        </label>
        <label>
          Role
            <select className="select" defaultValue="PESERTA">
              <option value="PESERTA">Peserta</option>
              <option value="ADMIN">Admin</option>
          </select>
        </label>
        <label>
          Password
          <input className="field" type="password" defaultValue="password" />
        </label>
        <Button href="/student/dashboard" variant="primary">
          Daftar
        </Button>
        <p className="muted">
          Sudah punya akun? <a href="/login">Masuk</a>
        </p>
      </div>
    </section>
  );
}
