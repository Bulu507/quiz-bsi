# Quiz-BSI

Simulator ujian SKD dan psikotes berbasis Next.js 14 App Router, TypeScript, dan CSS global yang mengikuti `prd.md`.

## Menjalankan Project

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## Route Utama

- `/login`
- `/register`
- `/dashboard`
- `/questions`
- `/questions/new`
- `/questions/import`
- `/packages/new`
- `/classes/demo`
- `/student/dashboard`
- `/student/history`
- `/join`
- `/exam/demo`
- `/exam/demo/result`

## Catatan

Project ini memakai feature-based clean architecture sesuai `prd.md` v2. Feature berada di `src/features`, komponen lintas fitur di `src/shared`, dan Zustand global store di `src/store`. Detail struktur dan aturan dependency ada di `docs/architecture.md`.
