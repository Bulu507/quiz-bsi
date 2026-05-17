"use client";

import { FormEvent, useState } from "react";
import { StudentShell } from "@/shared/components/layout";
import { Button, PageHeader, Panel } from "@/shared/components/ui";

export function JoinClassClient() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submitJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("Endpoint gabung kelas peserta belum ada di dokumentasi API yang tersedia.");
  }

  return (
    <StudentShell>
      <div className="form-shell">
        <PageHeader eyebrow="Kelas" title="Masukkan Kode Kelas" />
        <Panel title="Kode Join">
          <form className="stack" onSubmit={submitJoin}>
            <input className="field" aria-label="Kode kelas" onChange={(event) => setJoinCode(event.target.value)} value={joinCode} />
            {error ? <p className="badge red">{error}</p> : null}
            <Button disabled={!joinCode} type="submit" variant="primary">
              Gabung Kelas
            </Button>
          </form>
        </Panel>
      </div>
    </StudentShell>
  );
}
