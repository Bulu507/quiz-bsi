# Frontend Specification
# Simulator Ujian SKD & Psikotes — Next.js

**Version:** 2.0  
**Role:** Frontend Developer  
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Shadcn/UI  
**Architecture:** Feature-based Clean Architecture  
**Updated:** Tambah whitelist akses quiz per murid

---

## Daftar Isi

1. [Tech Stack & Setup](#1-tech-stack--setup)
2. [Clean Architecture — Prinsip & Aturan](#2-clean-architecture--prinsip--aturan)
3. [Struktur Folder Project](#3-struktur-folder-project)
4. [Sitemap & Routing](#4-sitemap--routing)
5. [Design System](#5-design-system)
6. [Fitur: Auth](#6-fitur-auth)
7. [Fitur: Questions (Bank Soal)](#7-fitur-questions-bank-soal)
8. [Fitur: Packages (Paket Ujian) + Akses Whitelist](#8-fitur-packages-paket-ujian--akses-whitelist)
9. [Fitur: Classes (Kelas)](#9-fitur-classes-kelas)
10. [Fitur: Exam (Engine Ujian)](#10-fitur-exam-engine-ujian)
11. [Fitur: Results & Analytics](#11-fitur-results--analytics)
12. [Shared Layer](#12-shared-layer)
13. [State Management](#13-state-management)
14. [Komunikasi dengan API Backend](#14-komunikasi-dengan-api-backend)
15. [Breakdown Task per Minggu](#15-breakdown-task-per-minggu)
16. [Checklist Sebelum Handoff](#16-checklist-sebelum-handoff)

---

## 1. Tech Stack & Setup

### Dependencies Utama

```bash
# Framework & core
next@14
typescript
tailwindcss
@shadcn/ui

# State management
zustand

# Form & validasi
react-hook-form
zod

# Rich text editor
@tiptap/react
@tiptap/starter-kit
@tiptap/extension-image

# Tabel
@tanstack/react-table

# Grafik
recharts

# Upload file
react-dropzone

# HTTP client
axios

# Utilitas
date-fns
clsx
```

### Shadcn/UI — Komponen yang Di-install di Awal

```bash
npx shadcn-ui@latest add button input label card badge
npx shadcn-ui@latest add dialog sheet dropdown-menu popover
npx shadcn-ui@latest add table progress skeleton tabs
npx shadcn-ui@latest add select checkbox radio-group switch
npx shadcn-ui@latest add toast alert separator avatar
npx shadcn-ui@latest add command tooltip
```

---

## 2. Clean Architecture — Prinsip & Aturan

### 2.1 Konsep Utama

Feature-based clean architecture artinya **setiap fitur adalah unit mandiri** yang memiliki layer internalnya sendiri. Tidak ada fitur yang langsung mengakses internal fitur lain — komunikasi antar fitur hanya lewat `shared/` atau `store`.

```
Setiap fitur memiliki layer:

  presentation/   ← Komponen React, halaman, UI logic
       ↓ (boleh akses)
  application/    ← Use cases, hooks, koordinasi logic
       ↓ (boleh akses)
  domain/         ← Types, interfaces, business rules (murni TS, no React)
       ↓ (boleh akses)
  infrastructure/ ← Implementasi API call, localStorage, external service
```

### 2.2 Aturan Dependency (WAJIB DIIKUTI)

```
✅ BOLEH:
  presentation  → application
  presentation  → domain
  application   → domain
  application   → infrastructure
  infrastructure → domain

❌ DILARANG:
  domain        → siapapun (domain harus murni, zero dependency)
  infrastructure → application (infrastruktur tidak tahu use case)
  fitur A       → internal fitur B (hanya boleh lewat shared/)
  presentation  → infrastructure langsung (harus lewat application/hooks)
```

### 2.3 Contoh Nyata: Fitur `exam`

```
❌ SALAH — komponen langsung fetch API:
  ExamPage.tsx → axios.post('/api/exam/submit')

✅ BENAR — komponen pakai hook, hook pakai use case, use case pakai repository:
  ExamPage.tsx
    → useSubmitExam()          (application/hooks)
      → submitExamUseCase()    (application/use-cases)
        → examRepository.submit() (infrastructure/repositories)
          → apiClient.post(...)    (infrastructure/api)
```

### 2.4 Naming Convention

| Layer | Suffix | Contoh |
|-------|--------|--------|
| Domain types | `.types.ts` | `exam.types.ts` |
| Domain interfaces | `.interface.ts` | `IExamRepository.interface.ts` |
| Use cases | `.use-case.ts` | `submit-exam.use-case.ts` |
| Hooks | `use[Name].ts` | `useSubmitExam.ts` |
| Repository impl | `.repository.ts` | `exam.repository.ts` |
| API functions | `.api.ts` | `exam.api.ts` |
| Komponen | `PascalCase.tsx` | `ExamTimer.tsx` |
| Halaman | `page.tsx` | Next.js convention |

---

## 3. Struktur Folder Project

```
src/
│
├── app/                              # Next.js App Router (routing only)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (instructor)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── questions/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── import/page.tsx
│   │   ├── packages/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── access/page.tsx    ← BARU: kelola whitelist akses
│   │   │       └── results/page.tsx
│   │   └── classes/
│   │       ├── page.tsx
│   │       ├── new/page.tsx
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── students/[studentId]/page.tsx
│   ├── (student)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── join/page.tsx
│   │   └── history/page.tsx
│   ├── exam/
│   │   └── [sessionId]/
│   │       ├── page.tsx
│   │       └── result/page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── features/                         # ← INTI CLEAN ARCHITECTURE
│   │
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── auth.types.ts
│   │   │   └── IAuthRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   └── register.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useLogin.ts
│   │   │       └── useRegister.ts
│   │   ├── infrastructure/
│   │   │   ├── auth.api.ts
│   │   │   └── auth.repository.ts
│   │   └── presentation/
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   │
│   ├── questions/
│   │   ├── domain/
│   │   │   ├── question.types.ts
│   │   │   └── IQuestionRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-questions.use-case.ts
│   │   │   │   ├── create-question.use-case.ts
│   │   │   │   ├── update-question.use-case.ts
│   │   │   │   ├── delete-question.use-case.ts
│   │   │   │   └── import-questions.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useQuestions.ts
│   │   │       ├── useQuestionForm.ts
│   │   │       └── useImportQuestions.ts
│   │   ├── infrastructure/
│   │   │   ├── question.api.ts
│   │   │   └── question.repository.ts
│   │   └── presentation/
│   │       ├── QuestionCard.tsx
│   │       ├── QuestionForm.tsx
│   │       ├── QuestionEditor.tsx
│   │       ├── QuestionFilters.tsx
│   │       ├── OptionInput.tsx
│   │       └── ImportStepper.tsx
│   │
│   ├── packages/
│   │   ├── domain/
│   │   │   ├── package.types.ts          ← termasuk PackageAccess type
│   │   │   └── IPackageRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-packages.use-case.ts
│   │   │   │   ├── create-package.use-case.ts
│   │   │   │   ├── update-package.use-case.ts
│   │   │   │   ├── publish-package.use-case.ts
│   │   │   │   ├── get-package-access.use-case.ts    ← BARU
│   │   │   │   ├── grant-access.use-case.ts          ← BARU
│   │   │   │   └── revoke-access.use-case.ts         ← BARU
│   │   │   └── hooks/
│   │   │       ├── usePackages.ts
│   │   │       ├── usePackageForm.ts
│   │   │       └── usePackageAccess.ts               ← BARU
│   │   ├── infrastructure/
│   │   │   ├── package.api.ts
│   │   │   └── package.repository.ts
│   │   └── presentation/
│   │       ├── PackageCard.tsx
│   │       ├── PackageForm.tsx
│   │       ├── PackageConfigForm.tsx
│   │       ├── AccessManager.tsx                     ← BARU
│   │       ├── AccessStudentList.tsx                 ← BARU
│   │       └── AccessBadge.tsx                       ← BARU
│   │
│   ├── classes/
│   │   ├── domain/
│   │   │   ├── class.types.ts
│   │   │   └── IClassRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-classes.use-case.ts
│   │   │   │   ├── create-class.use-case.ts
│   │   │   │   └── get-class-members.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useClasses.ts
│   │   │       └── useClassMembers.ts
│   │   ├── infrastructure/
│   │   │   ├── class.api.ts
│   │   │   └── class.repository.ts
│   │   └── presentation/
│   │       ├── ClassCard.tsx
│   │       ├── ClassForm.tsx
│   │       ├── MemberTable.tsx
│   │       └── JoinCodeDisplay.tsx
│   │
│   ├── exam/
│   │   ├── domain/
│   │   │   ├── exam.types.ts
│   │   │   └── IExamRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── start-exam.use-case.ts
│   │   │   │   ├── sync-answers.use-case.ts
│   │   │   │   └── submit-exam.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useExamSession.ts
│   │   │       ├── useExamTimer.ts
│   │   │       └── useAutoSave.ts
│   │   ├── infrastructure/
│   │   │   ├── exam.api.ts
│   │   │   └── exam.repository.ts
│   │   └── presentation/
│   │       ├── ExamTimer.tsx
│   │       ├── QuestionNavigator.tsx
│   │       ├── QuestionDisplay.tsx
│   │       ├── AnswerOptions.tsx
│   │       ├── ExamProgress.tsx
│   │       └── SubmitConfirmDialog.tsx
│   │
│   └── results/
│       ├── domain/
│       │   ├── result.types.ts
│       │   └── IResultRepository.interface.ts
│       ├── application/
│       │   ├── use-cases/
│       │   │   ├── get-session-result.use-case.ts
│       │   │   ├── get-student-stats.use-case.ts
│       │   │   └── export-results.use-case.ts
│       │   └── hooks/
│       │       ├── useSessionResult.ts
│       │       ├── useStudentStats.ts
│       │       └── useExportResults.ts
│       ├── infrastructure/
│       │   ├── result.api.ts
│       │   └── result.repository.ts
│       └── presentation/
│           ├── ScoreSummary.tsx
│           ├── CategoryBreakdown.tsx
│           ├── QuestionReview.tsx
│           ├── TrendChart.tsx
│           └── StudentResultTable.tsx
│
├── shared/                           # Lintas fitur
│   ├── components/
│   │   ├── layout/
│   │   │   ├── InstructorSidebar.tsx
│   │   │   ├── StudentNavbar.tsx
│   │   │   └── PageHeader.tsx
│   │   └── ui/
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── FileUpload.tsx
│   │       ├── ExportButton.tsx
│   │       └── StatCard.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── lib/
│   │   ├── api-client.ts             # Axios instance
│   │   ├── format.ts                 # Format angka, tanggal, durasi
│   │   └── excel.ts                  # Generate template Excel
│   └── types/
│       └── common.types.ts           # Pagination, ApiResponse, dll
│
└── store/                            # Zustand global stores
    ├── auth.store.ts
    └── exam.store.ts
```

---

## 4. Sitemap & Routing

```
/                               → Redirect berdasarkan role / login state

AUTH
├── /login
└── /register

INSTRUCTOR
├── /dashboard
├── /questions                  → Daftar bank soal
├── /questions/new              → Form tambah soal
├── /questions/[id]             → Edit soal
├── /questions/import           → Import Excel (3 step)
├── /packages                   → Daftar paket ujian
├── /packages/new               → Buat paket ujian
├── /packages/[id]              → Detail & edit paket
├── /packages/[id]/access       → ← BARU: Kelola whitelist akses murid
├── /packages/[id]/results      → Rekap nilai semua murid
├── /classes                    → Daftar kelas
├── /classes/new                → Buat kelas
├── /classes/[id]               → Detail kelas + daftar murid
└── /classes/[id]/students/[studentId] → Performa satu murid

STUDENT
├── /student/dashboard          → Daftar paket yang bisa diakses
├── /join                       → Input kode kelas
└── /student/history            → Riwayat ujian

EXAM (no layout)
├── /exam/[sessionId]           → Halaman ujian aktif
└── /exam/[sessionId]/result    → Hasil & pembahasan
```

---

## 5. Design System

### Warna

```ts
// tailwind.config.ts
colors: {
  primary:  { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
  success:  '#22c55e',
  danger:   '#ef4444',
  warning:  '#f59e0b',
  neutral:  { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 700: '#334155', 900: '#0f172a' },
  // Untuk badge akses
  access: {
    granted:  '#dcfce7',   // hijau muda
    revoked:  '#fee2e2',   // merah muda
    pending:  '#fef9c3',   // kuning muda
  }
}
```

### Layout

- Sidebar pengajar: **240px** (collapsed: **64px**)
- Konten max-width: **1200px**
- Card padding: **24px**
- Breakpoints: Mobile 375px / Tablet 768px / Desktop 1024px

---

## 6. Fitur: Auth

### Domain Types

```ts
// features/auth/domain/auth.types.ts

export type UserRole = 'INSTRUCTOR' | 'STUDENT'

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  token: string
}
```

### Repository Interface

```ts
// features/auth/domain/IAuthRepository.interface.ts

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>
  register(payload: RegisterPayload): Promise<AuthResponse>
  logout(): Promise<void>
  getMe(): Promise<User>
}
```

### Use Case (Contoh: Login)

```ts
// features/auth/application/use-cases/login.use-case.ts

import { IAuthRepository } from '../../domain/IAuthRepository.interface'
import { LoginCredentials, AuthResponse } from '../../domain/auth.types'

export const loginUseCase = (repository: IAuthRepository) =>
  async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Business rule: validasi sebelum kirim ke server
    if (!credentials.email || !credentials.password) {
      throw new Error('Email dan password wajib diisi')
    }
    return repository.login(credentials)
  }
```

### Hook

```ts
// features/auth/application/hooks/useLogin.ts

export const useLogin = () => {
  const { setUser, setToken } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await loginUseCase(authRepository)(credentials)
      setUser(result.user)
      setToken(result.token)
      // Redirect berdasarkan role
      router.push(result.user.role === 'INSTRUCTOR' ? '/dashboard' : '/student/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
```

---

## 7. Fitur: Questions (Bank Soal)

### Domain Types

```ts
// features/questions/domain/question.types.ts

export type QuestionType = 'PG' | 'PGK' | 'BERGAMBAR'
export type DifficultyLevel = 'MUDAH' | 'SEDANG' | 'SULIT'
export type QuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface QuestionOption {
  id: string
  label: 'A' | 'B' | 'C' | 'D' | 'E'
  text: string
  imageUrl: string | null
  isCorrect: boolean
  scoreValue: number          // default 1, untuk TKP bisa 1-5
}

export interface Question {
  id: string
  categoryId: string
  subcategoryId: string | null
  createdBy: string
  type: QuestionType
  text: string                // HTML dari TipTap
  imageUrl: string | null
  difficulty: DifficultyLevel
  tags: string[]
  explanation: string
  explanationImageUrl: string | null
  options: QuestionOption[]
  status: QuestionStatus
  createdAt: string
  updatedAt: string
}

export interface QuestionFilters {
  search?: string
  categoryId?: string
  difficulty?: DifficultyLevel
  status?: QuestionStatus
  page?: number
  limit?: number
}

export interface ImportPreviewRow {
  rowNumber: number
  data: Partial<Question>
  errors: string[]            // error per baris
  isValid: boolean
}
```

### Repository Interface

```ts
// features/questions/domain/IQuestionRepository.interface.ts

export interface IQuestionRepository {
  getAll(filters: QuestionFilters): Promise<PaginatedResponse<Question>>
  getById(id: string): Promise<Question>
  create(payload: CreateQuestionPayload): Promise<Question>
  update(id: string, payload: UpdateQuestionPayload): Promise<Question>
  delete(id: string): Promise<void>
  uploadExcel(file: File): Promise<{ jobId: string; preview: ImportPreviewRow[] }>
  confirmImport(jobId: string): Promise<{ imported: number }>
  getCategories(): Promise<QuestionCategory[]>
}
```

### Komponen Utama

#### `QuestionForm.tsx`
```
Props:
  initialData?: Question    ← jika edit
  onSuccess: () => void

Sections:
  1. Metadata
     - Kategori (Select, fetch dari API)
     - Subkategori (Select, dinamis sesuai kategori)
     - Jenis Soal (Radio: PG / PGK / Bergambar)
     - Tingkat Kesulitan (Radio: Mudah / Sedang / Sulit)
     - Tags (input chips)

  2. Teks Soal
     - QuestionEditor (TipTap)
     - Upload Gambar Soal (opsional, react-dropzone)

  3. Pilihan Jawaban
     - List OptionInput (min 2, maks 5)
     - [+ Tambah Pilihan] button
     - Validasi: wajib ada minimal 1 jawaban benar

  4. Pembahasan
     - QuestionEditor

  Actions:
     [Simpan Draft]    [Simpan & Publish]

Menggunakan: useQuestionForm() hook
```

#### `ImportStepper.tsx`
```
Step 1 — Upload
  [Download Template Excel]
  FileUpload dropzone (.xlsx, maks 5MB)
  → onUpload → useImportQuestions.upload()

Step 2 — Preview & Validasi
  Summary: "48 valid · 3 error"
  Tabel preview:
    No | Kategori | Teks Soal (truncated) | Jawaban | ✅/❌
  Baris error: background merah, tooltip pesan error
  [Download Log Error]  (jika ada error)
  [← Upload Ulang]  [Konfirmasi Import (48 soal) →]

Step 3 — Selesai
  ✅ "48 soal berhasil ditambahkan ke bank soal (status: Draft)"
  [Lihat Bank Soal]   [Import Lagi]

Menggunakan: useImportQuestions() hook
```

---

## 8. Fitur: Packages (Paket Ujian) + Akses Whitelist

Ini fitur yang paling banyak berubah. Pengajar bisa mengontrol **murid mana saja** yang boleh mengakses setiap paket ujian.

### Domain Types

```ts
// features/packages/domain/package.types.ts

export type PackageStatus = 'DRAFT' | 'PUBLISHED'
export type AccessStatus = 'GRANTED' | 'REVOKED'

export interface ScoringConfig {
  correct: number             // default: 5
  wrong: number               // default: 0
  unanswered: number          // default: 0
}

export interface PassingConfig {
  total?: number
  perCategory?: Record<string, number>  // { TWK: 65, TIU: 80, TKP: 156 }
}

export interface ExamPackage {
  id: string
  title: string
  description: string
  createdBy: string
  durationMinutes: number
  isShuffled: boolean
  isOptionShuffled: boolean
  scoringConfig: ScoringConfig
  passingConfig: PassingConfig | null
  maxAttempts: number | null          // null = unlimited
  showResultAfter: 'IMMEDIATELY' | 'DEADLINE'
  status: PackageStatus
  questionCount: number               // denormalized
  createdAt: string
  updatedAt: string
}

// ─── WHITELIST ACCESS ────────────────────────────────────

export interface PackageAccess {
  id: string
  packageId: string
  studentId: string
  studentName: string
  studentEmail: string
  status: AccessStatus
  grantedAt: string
  grantedBy: string
  revokedAt: string | null
}

export interface GrantAccessPayload {
  packageId: string
  studentIds: string[]
}

export interface RevokeAccessPayload {
  packageId: string
  studentIds: string[]
}

// Yang dilihat murid di dashboard:
// package + informasi apakah dia punya akses
export interface PackageWithAccess extends ExamPackage {
  hasAccess: boolean
  attemptsUsed: number
  lastAttemptScore: number | null
}
```

### Repository Interface

```ts
// features/packages/domain/IPackageRepository.interface.ts

export interface IPackageRepository {
  getAll(): Promise<ExamPackage[]>
  getById(id: string): Promise<ExamPackage>
  create(payload: CreatePackagePayload): Promise<ExamPackage>
  update(id: string, payload: UpdatePackagePayload): Promise<ExamPackage>
  publish(id: string): Promise<ExamPackage>
  delete(id: string): Promise<void>

  // Akses whitelist
  getAccess(packageId: string): Promise<PackageAccess[]>
  grantAccess(payload: GrantAccessPayload): Promise<PackageAccess[]>
  revokeAccess(payload: RevokeAccessPayload): Promise<void>
  grantAccessToAll(packageId: string, classId: string): Promise<PackageAccess[]>

  // Untuk murid
  getAccessiblePackages(studentId: string): Promise<PackageWithAccess[]>
}
```

### Use Cases — Akses Whitelist

```ts
// features/packages/application/use-cases/grant-access.use-case.ts

export const grantAccessUseCase = (repository: IPackageRepository) =>
  async (payload: GrantAccessPayload): Promise<PackageAccess[]> => {
    if (!payload.studentIds.length) {
      throw new Error('Pilih minimal 1 murid')
    }
    return repository.grantAccess(payload)
  }

// features/packages/application/use-cases/revoke-access.use-case.ts

export const revokeAccessUseCase = (repository: IPackageRepository) =>
  async (payload: RevokeAccessPayload): Promise<void> => {
    if (!payload.studentIds.length) {
      throw new Error('Pilih minimal 1 murid')
    }
    return repository.revokeAccess(payload)
  }
```

### Hook — usePackageAccess

```ts
// features/packages/application/hooks/usePackageAccess.ts

export const usePackageAccess = (packageId: string) => {
  const [accessList, setAccessList] = useState<PackageAccess[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchAccess = async () => { ... }

  const grantAccess = async (studentIds: string[]) => {
    await grantAccessUseCase(packageRepository)({ packageId, studentIds })
    await fetchAccess()   // refresh list
    toast.success(`Akses diberikan ke ${studentIds.length} murid`)
  }

  const revokeAccess = async (studentIds: string[]) => {
    await revokeAccessUseCase(packageRepository)({ packageId, studentIds })
    await fetchAccess()
    toast.success('Akses dicabut')
  }

  const grantToAll = async (classId: string) => {
    await packageRepository.grantAccessToAll(packageId, classId)
    await fetchAccess()
    toast.success('Akses diberikan ke semua murid di kelas')
  }

  return { accessList, isLoading, grantAccess, revokeAccess, grantToAll, fetchAccess }
}
```

### Halaman: `/packages/[id]/access` — Kelola Whitelist

```
Header:
  "Kelola Akses — [Nama Paket]"
  ← Kembali ke detail paket

Action Bar:
  [Berikan Akses ke Semua Murid Kelas ▼]   [+ Tambah Murid]

  Dropdown "Berikan ke Semua":
    ● Kelas SKD Pagi (32 murid)
    ● Kelas TNI Batch 2 (28 murid)

Tab:
  [Punya Akses (45)] | [Tidak Punya Akses (12)]

─── Tab: Punya Akses ──────────────────────────────────────

  Search: [🔍 Cari nama murid...]

  Tabel:
  ┌──────┬──────────────┬──────────────┬────────────┬────────────┐
  │  ☐   │ Nama Murid   │ Kelas        │ Diberikan  │ Aksi       │
  ├──────┼──────────────┼──────────────┼────────────┼────────────┤
  │  ☐   │ Budi Santoso │ SKD Pagi     │ 12 Jan '25 │ [Cabut]    │
  │  ☐   │ Ani Rahma    │ TNI Batch 2  │ 12 Jan '25 │ [Cabut]    │
  └──────┴──────────────┴──────────────┴────────────┴────────────┘

  Jika ada yang di-check:
  [Cabut Akses (3 dipilih)]

─── Tab: Tidak Punya Akses ────────────────────────────────

  Tabel murid yang belum punya akses (dari semua kelas)
  ┌──────┬──────────────┬──────────────┬────────────────────────┐
  │  ☐   │ Nama Murid   │ Kelas        │ Aksi                   │
  ├──────┼──────────────┼──────────────┼────────────────────────┤
  │  ☐   │ Doni Kurnia  │ SKD Pagi     │ [Berikan Akses]        │
  └──────┴──────────────┴──────────────┴────────────────────────┘

  Jika ada yang di-check:
  [Berikan Akses (2 dipilih)]
```

### Komponen: `AccessManager.tsx`

```
Props:
  packageId: string

Internal:
  - usePackageAccess(packageId)
  - State: activeTab ('granted' | 'not-granted')
  - State: selectedIds: string[]
  - State: searchQuery: string

Render:
  <ActionBar />
  <Tabs>
    <GrantedTab accessList={...} />
    <NotGrantedTab students={...} />
  </Tabs>
```

### Komponen: `AccessBadge.tsx`

Badge kecil yang tampil di mana-mana untuk menunjukkan status akses:

```
Props: status: AccessStatus

Tampilan:
  GRANTED  → [✅ Punya Akses]   (hijau)
  REVOKED  → [🚫 Dicabut]       (merah)
```

### Dampak ke Dashboard Murid

Di `/student/dashboard`, paket ujian yang ditampilkan **hanya yang murid tersebut punya akses**. Paket tanpa akses tidak muncul sama sekali (difilter di backend, bukan frontend).

```ts
// Di dashboard murid, fetch hanya paket yang accessible:
const packages = await packageRepository.getAccessiblePackages(currentUser.id)

// Setiap card paket menampilkan info akses:
<PackageCard
  package={pkg}
  hasAccess={pkg.hasAccess}        // dari PackageWithAccess
  attemptsUsed={pkg.attemptsUsed}
/>
```

---

## 9. Fitur: Classes (Kelas)

### Domain Types

```ts
// features/classes/domain/class.types.ts

export interface Class {
  id: string
  name: string
  description: string
  instructorId: string
  joinCode: string
  isActive: boolean
  memberCount: number
  createdAt: string
}

export interface ClassMember {
  id: string
  classId: string
  studentId: string
  studentName: string
  studentEmail: string
  enrolledAt: string
  lastExamAt: string | null
  lastExamScore: number | null
  averageScore: number | null
  totalSessions: number
  status: 'ACTIVE' | 'INACTIVE'
}
```

### Halaman: `/classes/[id]` — Detail Kelas

```
Header:
  [Nama Kelas]
  Kode Join: [SKD-ABC12]  [📋 Copy]  [QR Code]
  [+ Assign Paket Ujian]

Tab:
  [Murid (87)] | [Paket Ujian (5)]

─── Tab Murid ─────────────────────────────────────────────

  MemberTable (kolom):
  Nama | Ujian Terakhir | Nilai Terakhir | Rata-rata | Total Sesi | Aksi
  [klik nama → /classes/[id]/students/[studentId]]
  [Export Nilai →]

─── Tab Paket Ujian ───────────────────────────────────────

  Daftar paket yang di-assign ke kelas ini
  Tiap paket:
  [Nama Paket]  [X murid punya akses]  [Kelola Akses →]
```

---

## 10. Fitur: Exam (Engine Ujian)

### Domain Types

```ts
// features/exam/domain/exam.types.ts

export type ExamStatus = 'ACTIVE' | 'SUBMITTED' | 'EXPIRED'

export interface ExamSession {
  id: string
  packageId: string
  packageTitle: string
  questions: ExamQuestion[]   // sudah dalam urutan shuffle dari server
  expiresAt: string           // ISO timestamp dari server
  status: ExamStatus
  answers: Record<string, string>   // questionId → optionId (dari server jika resume)
  flagged: string[]
}

export interface ExamQuestion {
  id: string
  number: number
  text: string
  imageUrl: string | null
  type: 'PG' | 'PGK'
  options: {
    id: string
    label: string
    text: string
    imageUrl: string | null
  }[]
  categoryCode: string        // untuk progress per kategori
}

export interface SyncPayload {
  answers: Record<string, string>
  flagged: string[]
}

export interface SubmitResult {
  sessionId: string
  totalScore: number
  isPassed: boolean
  durationSeconds: number
}
```

### Hooks

#### `useExamSession.ts`
```ts
// Orchestrator utama halaman ujian
export const useExamSession = (sessionId: string) => {
  const store = useExamStore()

  // Load session dari server saat mount
  useEffect(() => {
    examRepository.getSession(sessionId).then(store.initSession)
  }, [sessionId])

  return {
    session: store.session,
    currentQuestion: store.questions[store.currentIndex],
    currentIndex: store.currentIndex,
    answers: store.answers,
    flagged: store.flagged,
    setAnswer: store.setAnswer,
    toggleFlag: store.toggleFlag,
    goToQuestion: store.goToQuestion,
  }
}
```

#### `useExamTimer.ts`
```ts
// Timer yang dihitung dari expiresAt server, bukan durasi client
export const useExamTimer = (expiresAt: string, onExpire: () => void) => {
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    const tick = () => {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      if (diff <= 0) {
        onExpire()
        return
      }
      setSecondsLeft(diff)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return {
    secondsLeft,
    formatted: formatDuration(secondsLeft),     // "01:23:45"
    isWarning: secondsLeft < 600,               // < 10 menit
    isCritical: secondsLeft < 120,              // < 2 menit
  }
}
```

#### `useAutoSave.ts`
```ts
// Sync jawaban ke server setiap 30 detik
export const useAutoSave = (sessionId: string) => {
  const { answers, flagged } = useExamStore()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await examRepository.syncAnswers(sessionId, { answers, flagged })
      } catch {
        // Gagal sync → simpan ke localStorage sebagai backup
        localStorage.setItem(`exam_backup_${sessionId}`, JSON.stringify({ answers, flagged }))
      }
    }, 30_000)

    return () => clearInterval(interval)
  }, [sessionId, answers, flagged])
}
```

### Halaman: `/exam/[sessionId]` — Full Screen

```
Layout: TANPA sidebar/navbar. Full screen, scroll disabled.

┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Tryout SKD Sesi 3    [45/110 dijawab]  [⏱ 01:23:45]│  ← fixed header
├───────────────────────────────────────┬─────────────────────┤
│                                       │                     │
│  Soal 12 dari 110                     │  NAVIGATOR          │
│  ─────────────────────────           │                     │
│                                       │  [1][2][3][4][5]   │
│  [Gambar soal jika ada]               │  [6][7][8][9][10]  │
│                                       │  ...               │
│  Lorem ipsum teks soal...             │                     │
│                                       │  ■ Dijawab         │
│  ○ A. Pilihan A                       │  □ Belum           │
│  ● B. Pilihan B   ← dipilih           │  🚩 Ditandai       │
│  ○ C. Pilihan C                       │                     │
│  ○ D. Pilihan D                       │                     │
│  ○ E. Pilihan E                       │                     │
│                                       │                     │
├───────────────────────────────────────┴─────────────────────┤
│  [← Sebelumnya]    [🚩 Tandai Soal]    [Berikutnya →]  [✓ Kumpulkan] │  ← fixed footer
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Fitur: Results & Analytics

### Domain Types

```ts
// features/results/domain/result.types.ts

export interface SessionResult {
  sessionId: string
  packageTitle: string
  submittedAt: string
  durationSeconds: number
  totalScore: number
  maxScore: number
  isPassed: boolean
  scorePerCategory: CategoryScore[]
  answers: AnswerDetail[]
}

export interface CategoryScore {
  categoryCode: string
  categoryName: string
  score: number
  maxScore: number
  correct: number
  wrong: number
  unanswered: number
  passingGrade: number | null
  isPassed: boolean | null
}

export interface AnswerDetail {
  questionId: string
  questionNumber: number
  questionText: string
  selectedOptionId: string | null
  isCorrect: boolean
  scoreEarned: number
  explanation: string
  options: { id: string; label: string; text: string; isCorrect: boolean }[]
}

export interface StudentStats {
  averageScore: number
  bestScore: number
  totalSessions: number
  lastActiveAt: string
  trendData: { date: string; score: number; packageTitle: string }[]
  categoryAverages: { category: string; average: number }[]
}
```

### Halaman: `/exam/[sessionId]/result`

```
Section 1: ScoreSummary
  ┌─────────────────────────────────────────┐
  │          HASIL UJIAN                    │
  │                                         │
  │            385 / 550                    │
  │       ██████████░░░░  70%               │
  │                                         │
  │   ✅ LULUS  •  87 menit 23 detik        │
  └─────────────────────────────────────────┘

Section 2: CategoryBreakdown
  TWK   65/150  ████░░  43%   ✅ ≥65
  TIU  100/175  ██████  57%   ✅ ≥80
  TKP  220/225  █████████  98%   ✅ ≥156

Section 3: QuestionReview (accordion)
  Default collapsed. Klik expand per soal.
  Per soal:
    [✅ Benar] / [❌ Salah] / [— Tidak dijawab]
    Teks soal
    Pilihan A–E (highlight: dipilih user, highlight: benar)
    Pembahasan

Footer:
  [← Dashboard]    [Ulangi Ujian] (jika attempt belum habis)
```

---

## 12. Shared Layer

### `shared/lib/api-client.ts`

```ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res.data,     // unwrap response langsung
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data ?? error)
  }
)
```

### `shared/types/common.types.ts`

```ts
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type ApiError = {
  code: string
  message: string
}
```

### Komponen Shared

```
EmptyState.tsx     → Tampilan kosong dengan ikon, teks, dan optional action button
LoadingSkeleton.tsx → Placeholder loading (sesuaikan per konteks: card, tabel, dll)
ConfirmDialog.tsx  → Dialog konfirmasi generic (hapus, cabut akses, submit, dll)
FileUpload.tsx     → Dropzone untuk upload file (Excel, gambar)
ExportButton.tsx   → Tombol export dengan loading state
StatCard.tsx       → Card angka statistik (dipakai di dashboard pengajar & murid)
PageHeader.tsx     → Header halaman: title + subtitle + slot action kanan
```

---

## 13. State Management

### `store/auth.store.ts`

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/features/auth/domain/auth.types'

interface AuthStore {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

### `store/exam.store.ts`

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ExamSession, ExamQuestion } from '@/features/exam/domain/exam.types'

interface ExamStore {
  sessionId: string | null
  questions: ExamQuestion[]
  currentIndex: number
  answers: Record<string, string>
  flagged: string[]
  expiresAt: string | null
  status: 'idle' | 'active' | 'submitted'

  initSession: (session: ExamSession) => void
  setAnswer: (questionId: string, optionId: string) => void
  toggleFlag: (questionId: string) => void
  goToQuestion: (index: number) => void
  markSubmitted: () => void
  clearSession: () => void
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      sessionId: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      flagged: [],
      expiresAt: null,
      status: 'idle',

      initSession: (session) => set({
        sessionId: session.id,
        questions: session.questions,
        answers: session.answers,
        flagged: session.flagged,
        expiresAt: session.expiresAt,
        status: 'active',
        currentIndex: 0,
      }),

      setAnswer: (questionId, optionId) => set((state) => ({
        answers: {
          ...state.answers,
          // Toggle: jika klik jawaban yang sama → batal
          [questionId]: state.answers[questionId] === optionId ? undefined : optionId,
        }
      })),

      toggleFlag: (questionId) => set((state) => ({
        flagged: state.flagged.includes(questionId)
          ? state.flagged.filter(id => id !== questionId)
          : [...state.flagged, questionId]
      })),

      goToQuestion: (index) => set({ currentIndex: index }),
      markSubmitted: () => set({ status: 'submitted' }),
      clearSession: () => set({
        sessionId: null, questions: [], currentIndex: 0,
        answers: {}, flagged: [], expiresAt: null, status: 'idle'
      }),
    }),
    {
      name: 'exam-storage',
      // Hanya persist yang penting — jika browser refresh di tengah ujian
      partialize: (state) => ({
        sessionId: state.sessionId,
        answers: state.answers,
        flagged: state.flagged,
        currentIndex: state.currentIndex,
      })
    }
  )
)
```

---

## 14. Komunikasi dengan API Backend

### Yang Perlu Dikonfirmasi ke Backend Developer

| # | Pertanyaan | Impak ke Frontend |
|---|------------|-------------------|
| 1 | Format response: `{ data, message, success }` ? | Menentukan `ApiResponse` type & axios interceptor |
| 2 | Format error: `{ code, message }` ? | Error handling di semua use case |
| 3 | Auth: cookie atau Bearer header? | Setup interceptor & penyimpanan token |
| 4 | Format pagination: `{ data[], meta: { page, total } }` ? | `PaginatedResponse` type |
| 5 | Timestamp format: ISO 8601? | `date-fns` parsing |
| 6 | Upload gambar soal: endpoint backend atau pre-signed URL ke storage? | Komponen FileUpload |
| 7 | Session exam: urutan soal diacak di server atau client? | Kalau server: frontend terima array, tidak perlu shuffle sendiri |
| 8 | Akses paket: endpoint cek akses murid di mana? | `GET /packages/accessible` atau field di setiap paket? |
| 9 | Endpoint whitelist: `POST /packages/:id/access/grant` ? | Sesuaikan `package.api.ts` |
| 10 | Export Excel: backend generate file atau frontend? | Kalau backend: terima blob. Kalau frontend: pakai SheetJS |

### Endpoint API yang Diperlukan (kontrak ke backend)

```
AUTH
  POST  /auth/login
  POST  /auth/register
  POST  /auth/logout
  GET   /auth/me

QUESTIONS
  GET   /questions                  ?search&categoryId&difficulty&status&page&limit
  POST  /questions
  GET   /questions/:id
  PUT   /questions/:id
  DELETE /questions/:id
  POST  /questions/import           (multipart/form-data)
  POST  /questions/import/confirm   { jobId }
  GET   /questions/categories

PACKAGES
  GET   /packages
  POST  /packages
  GET   /packages/:id
  PUT   /packages/:id
  DELETE /packages/:id
  POST  /packages/:id/publish

PACKAGE ACCESS (WHITELIST) ← BARU
  GET   /packages/:id/access            daftar murid + status akses
  POST  /packages/:id/access/grant      { studentIds: string[] }
  POST  /packages/:id/access/revoke     { studentIds: string[] }
  POST  /packages/:id/access/grant-all  { classId: string }
  GET   /packages/accessible            paket yang bisa diakses murid ini

CLASSES
  GET   /classes
  POST  /classes
  GET   /classes/:id
  POST  /classes/join                   { joinCode: string }
  GET   /classes/:id/members
  GET   /classes/:id/members/:studentId

EXAM
  POST  /exam/start                     { packageId: string }
  GET   /exam/:sessionId
  POST  /exam/:sessionId/sync           { answers, flagged }
  POST  /exam/:sessionId/submit
  GET   /exam/:sessionId/result

ANALYTICS
  GET   /analytics/student/me           stats + trend chart data
  GET   /analytics/student/:id          (untuk pengajar lihat 1 murid)
  GET   /analytics/package/:id/results  rekap nilai semua murid di paket
  POST  /analytics/export               { packageId } → download Excel
```

### Setup MSW untuk Development

```ts
// src/mocks/handlers/package-access.handlers.ts
import { http, HttpResponse } from 'msw'

export const packageAccessHandlers = [
  http.get('/packages/:id/access', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: mockAccessList,
    })
  }),

  http.post('/packages/:id/access/grant', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      data: body.studentIds.map(id => ({ studentId: id, status: 'GRANTED' })),
      message: 'Akses berhasil diberikan'
    })
  }),
]
```

---

## 15. Breakdown Task per Minggu

### Minggu 1 — Setup & Fondasi

| Task | Jam |
|------|-----|
| Init Next.js 14 + TypeScript + Tailwind | 2 |
| Install & konfigurasi Shadcn/UI | 2 |
| Buat struktur folder feature-based | 1 |
| Setup `shared/lib/api-client.ts` (axios + interceptor) | 2 |
| Setup Zustand stores (`auth.store`, `exam.store`) | 2 |
| Setup `common.types.ts` (ApiResponse, Pagination) | 1 |
| Middleware route protection (auth guard per role) | 2 |
| Layout Instructor (sidebar + page header) | 4 |
| Layout Student (navbar) | 2 |
| Halaman Login + RegisterForm + useLogin/useRegister | 5 |
| Setup MSW (mock API dasar) | 2 |

**Total: ~25 jam**

---

### Minggu 2 — Fitur: Questions

| Task | Jam |
|------|-----|
| `question.types.ts` + `IQuestionRepository.interface.ts` | 1 |
| `question.api.ts` + `question.repository.ts` | 3 |
| Use cases: get, create, update, delete | 2 |
| `useQuestions.ts` hook (list + filter) | 3 |
| `useQuestionForm.ts` hook | 2 |
| Komponen `QuestionEditor.tsx` (TipTap setup) | 4 |
| Komponen `OptionInput.tsx` | 2 |
| Komponen `QuestionCard.tsx` | 2 |
| Komponen `QuestionFilters.tsx` | 2 |
| Halaman `/questions` (list + filter + search) | 3 |
| Halaman `/questions/new` (`QuestionForm`) | 5 |
| Halaman `/questions/[id]` (edit, reuse form) | 2 |
| Empty state + loading skeleton | 2 |

**Total: ~33 jam**

---

### Minggu 3 — Fitur: Import Excel & Packages

| Task | Jam |
|------|-----|
| `useImportQuestions.ts` hook | 2 |
| Use case: `import-questions.use-case.ts` | 2 |
| Komponen `ImportStepper.tsx` (3 step) | 6 |
| Komponen `FileUpload.tsx` (shared) | 3 |
| Tabel preview import + error highlight | 4 |
| Download template Excel | 2 |
| `package.types.ts` + interface | 1 |
| `package.api.ts` + `package.repository.ts` | 3 |
| Use cases: get, create, update, publish | 2 |
| `usePackages.ts` + `usePackageForm.ts` | 3 |
| Halaman `/packages` (list) | 2 |
| Halaman `/packages/new` (form 2 kolom: config + pilih soal) | 7 |
| Halaman `/packages/[id]` (detail + edit) | 3 |

**Total: ~40 jam**

---

### Minggu 4 — Fitur: Akses Whitelist + Classes

| Task | Jam |
|------|-----|
| `PackageAccess` types di `package.types.ts` | 1 |
| Endpoint whitelist di `package.api.ts` | 2 |
| Use cases: `grant-access`, `revoke-access` | 2 |
| `usePackageAccess.ts` hook | 3 |
| Komponen `AccessManager.tsx` (tab granted/not-granted) | 6 |
| Komponen `AccessStudentList.tsx` (tabel + checkbox bulk) | 4 |
| Komponen `AccessBadge.tsx` | 1 |
| Halaman `/packages/[id]/access` | 4 |
| Integrasi: dashboard murid hanya tampil paket accessible | 2 |
| `class.types.ts` + interface | 1 |
| `class.api.ts` + `class.repository.ts` | 2 |
| Use cases + hooks kelas | 2 |
| Halaman `/classes` + `/classes/new` | 3 |
| Halaman `/classes/[id]` (tab murid + paket) | 5 |
| Halaman `/classes/[id]/students/[id]` (detail murid) | 5 |

**Total: ~43 jam**

---

### Minggu 5 — Fitur: Exam Engine

| Task | Jam |
|------|-----|
| `exam.types.ts` + interface | 1 |
| `exam.api.ts` + `exam.repository.ts` | 3 |
| Use cases: start, sync, submit | 3 |
| `useExamSession.ts` hook | 3 |
| `useExamTimer.ts` hook (dari server timestamp) | 3 |
| `useAutoSave.ts` hook (sync tiap 30 detik) | 2 |
| Layout full-screen untuk `/exam/[sessionId]` | 2 |
| Komponen `ExamTimer.tsx` (warna berubah) | 2 |
| Komponen `QuestionNavigator.tsx` (grid warna status) | 4 |
| Komponen `QuestionDisplay.tsx` | 2 |
| Komponen `AnswerOptions.tsx` (toggle select) | 3 |
| Komponen `ExamProgress.tsx` | 1 |
| Komponen `SubmitConfirmDialog.tsx` | 2 |
| Handle back button warning (`beforeunload`) | 1 |
| Auto-submit saat timer habis | 2 |
| Integrasi semua komponen di halaman ujian | 3 |

**Total: ~37 jam**

---

### Minggu 6 — Fitur: Results, Dashboard & Polish

| Task | Jam |
|------|-----|
| `result.types.ts` + interface | 1 |
| `result.api.ts` + repository + use cases + hooks | 4 |
| Komponen `ScoreSummary.tsx` | 3 |
| Komponen `CategoryBreakdown.tsx` | 3 |
| Komponen `QuestionReview.tsx` (accordion) | 4 |
| Halaman `/exam/[sessionId]/result` | 3 |
| Komponen `TrendChart.tsx` (Recharts line chart) | 3 |
| `StudentResultTable.tsx` (rekap per paket) | 3 |
| Halaman `/packages/[id]/results` | 3 |
| Dashboard pengajar `/dashboard` (stat cards + ringkas) | 4 |
| Dashboard murid `/student/dashboard` | 3 |
| Halaman `/student/history` | 3 |
| Tombol export nilai ke Excel | 2 |
| Loading skeleton semua halaman | 3 |
| Toast notifications (success/error) | 1 |
| Responsive mobile (cek semua halaman) | 4 |
| Bug fixing & polish | 4 |

**Total: ~51 jam**

---

### Ringkasan Timeline

| Minggu | Fokus | Jam |
|--------|-------|-----|
| 1 | Setup & Fondasi | 25 |
| 2 | Fitur: Questions | 33 |
| 3 | Fitur: Import + Packages | 40 |
| 4 | Fitur: Akses Whitelist + Classes | 43 |
| 5 | Fitur: Exam Engine | 37 |
| 6 | Fitur: Results + Dashboard + Polish | 51 |
| **Total** | | **~229 jam** |

---

## 16. Checklist Sebelum Handoff

### Clean Architecture
- [ ] Tidak ada komponen yang langsung memanggil `apiClient` (harus lewat hook → use case → repository)
- [ ] Tidak ada fitur yang import dari internal fitur lain (hanya dari `shared/`)
- [ ] Domain types tidak import library apapun (murni TypeScript)
- [ ] Setiap fitur punya `domain/`, `application/`, `infrastructure/`, `presentation/`

### Akses Whitelist
- [ ] Dashboard murid hanya menampilkan paket yang accessible
- [ ] Murid tidak bisa start ujian paket yang tidak ada aksesnya (validasi di halaman + API)
- [ ] Halaman `/packages/[id]/access` berfungsi: tab granted/not-granted, grant, revoke, bulk action
- [ ] Bulk grant ke seluruh kelas berfungsi

### Exam Engine
- [ ] Timer dihitung dari `expiresAt` server, bukan durasi client
- [ ] Auto-save setiap 30 detik berjalan di background
- [ ] Fallback ke localStorage jika auto-save gagal
- [ ] Data ujian tidak hilang jika browser refresh
- [ ] Auto-submit saat timer habis
- [ ] Back button menampilkan warning

### UI/UX
- [ ] Responsive: mobile (375px), tablet (768px), desktop (1024px)
- [ ] Loading state semua aksi async
- [ ] Empty state semua halaman daftar
- [ ] Toast notifikasi aksi penting
- [ ] Konfirmasi sebelum aksi destruktif

### Teknis
- [ ] Build TypeScript tanpa error
- [ ] Tidak ada `any` type yang tidak disengaja
- [ ] Environment variables tidak hardcoded
- [ ] Tidak ada data sensitif di localStorage kecuali `exam-storage` dan `auth-storage`
- [ ] Semua endpoint sudah dikonfirmasi dengan backend developer

---

*Frontend spec ini adalah dokumen hidup. Update setiap ada perubahan kesepakatan dengan backend developer.*