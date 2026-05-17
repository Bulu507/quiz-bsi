# Frontend Specification — Auth & Admin
# Simulator Ujian SKD & Psikotes

**Version:** 2.0  
**Scope:** Auth + Admin (Pengajar) — Bagian Peserta menyusul  
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Shadcn/UI  
**Architecture:** Feature-based Clean Architecture  
**API Prefix Admin:** `/adm/*` · **Auth:** `/login`, `/me`

---

## Changelog v2.0

| # | Perubahan | Dampak |
|---|-----------|--------|
| 1 | **🆕 Fitur baru: User Management** — `/adm/user` (index, show, verify, delete) | Tambah fitur, halaman, dan routing baru |
| 2 | **🆕 Flow Verifikasi Peserta** — peserta baru perlu di-approve admin sebelum bisa login/akses quiz | Mengubah asumsi "semua user langsung aktif" |
| 3 | **🆕 Firebase config tersedia** — dimasukkan sebagai env variables | `shared/lib/firebase.ts` bisa dikoding final |
| 4 | Konfirmasi: endpoint Peserta `Index Quizes` punya filter `kelulusan` & `masa` | Dicatat, berlaku saat scope peserta dikerjakan |
| 5 | Semua endpoint admin lain **tidak berubah** dari v1.0 | Tidak ada perubahan lain |

---

## Daftar Isi

1. [Struktur Folder](#1-struktur-folder)
2. [Routing & Halaman](#2-routing--halaman)
3. [Design System](#3-design-system)
4. [Shared Layer](#4-shared-layer)
5. [Fitur: Auth](#5-fitur-auth)
6. [Fitur: User Management](#6-fitur-user-management) ← **BARU**
7. [Fitur: Kategori](#7-fitur-kategori)
8. [Fitur: Subkategori](#8-fitur-subkategori)
9. [Fitur: Bank Soal](#9-fitur-bank-soal)
10. [Fitur: Quiz & Komponen Quiz](#10-fitur-quiz--komponen-quiz)
11. [State Management](#11-state-management)
12. [API Contract Lengkap — Auth & Admin](#12-api-contract-lengkap--auth--admin)
13. [Breakdown Task per Minggu](#13-breakdown-task-per-minggu)
14. [Checklist Handoff](#14-checklist-handoff)

---

## 1. Struktur Folder

```
src/
│
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   └── (admin)/
│       ├── layout.tsx                      # Sidebar layout
│       ├── dashboard/
│       │   └── page.tsx
│       ├── users/                          # ← BARU
│       │   ├── page.tsx                    # Daftar user + filter + verify
│       │   └── [id_user]/
│       │       └── page.tsx               # Detail user + riwayat attempt
│       ├── kategori/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── subkategori/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── soal/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   ├── [id]/
│       │   │   └── page.tsx
│       │   └── import/
│       │       └── page.tsx
│       └── quiz/
│           ├── page.tsx
│           ├── new/
│           │   └── page.tsx
│           └── [id_quiz]/
│               ├── page.tsx
│               └── results/
│                   └── page.tsx
│
├── features/
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── auth.types.ts
│   │   │   └── IAuthRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   └── login-firebase.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useLogin.ts
│   │   │       └── useLoginFirebase.ts
│   │   ├── infrastructure/
│   │   │   ├── auth.api.ts
│   │   │   └── auth.repository.ts
│   │   └── presentation/
│   │       ├── LoginForm.tsx
│   │       └── LoginFirebaseButton.tsx
│   │
│   ├── users/                              # ← BARU
│   │   ├── domain/
│   │   │   ├── user.types.ts
│   │   │   └── IUserRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-all-users.use-case.ts
│   │   │   │   ├── get-user-by-id.use-case.ts
│   │   │   │   ├── verify-user.use-case.ts
│   │   │   │   └── delete-user.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useUserList.ts
│   │   │       ├── useUserDetail.ts
│   │   │       └── useUserMutation.ts
│   │   ├── infrastructure/
│   │   │   ├── user.api.ts
│   │   │   └── user.repository.ts
│   │   └── presentation/
│   │       ├── UserTable.tsx
│   │       ├── UserStatusBadge.tsx
│   │       ├── UserRoleBadge.tsx
│   │       ├── VerifyUserButton.tsx
│   │       └── UserDeleteDialog.tsx
│   │
│   ├── kategori/
│   │   ├── domain/
│   │   │   ├── kategori.types.ts
│   │   │   └── IKategoriRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-all-kategori.use-case.ts
│   │   │   │   ├── get-kategori-by-id.use-case.ts
│   │   │   │   ├── create-kategori.use-case.ts
│   │   │   │   ├── update-kategori.use-case.ts
│   │   │   │   └── delete-kategori.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useKategoriList.ts
│   │   │       ├── useKategoriDetail.ts
│   │   │       └── useKategoriMutation.ts
│   │   ├── infrastructure/
│   │   │   ├── kategori.api.ts
│   │   │   └── kategori.repository.ts
│   │   └── presentation/
│   │       ├── KategoriTable.tsx
│   │       ├── KategoriForm.tsx
│   │       └── KategoriDeleteDialog.tsx
│   │
│   ├── subkategori/
│   │   ├── domain/
│   │   │   ├── subkategori.types.ts
│   │   │   └── ISubkategoriRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-all-subkategori.use-case.ts
│   │   │   │   ├── get-subkategori-by-id.use-case.ts
│   │   │   │   ├── create-subkategori.use-case.ts
│   │   │   │   ├── update-subkategori.use-case.ts
│   │   │   │   └── delete-subkategori.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useSubkategoriList.ts
│   │   │       ├── useSubkategoriDetail.ts
│   │   │       └── useSubkategoriMutation.ts
│   │   ├── infrastructure/
│   │   │   ├── subkategori.api.ts
│   │   │   └── subkategori.repository.ts
│   │   └── presentation/
│   │       ├── SubkategoriTable.tsx
│   │       ├── SubkategoriForm.tsx
│   │       └── SubkategoriDeleteDialog.tsx
│   │
│   ├── soal/
│   │   ├── domain/
│   │   │   ├── soal.types.ts
│   │   │   └── ISoalRepository.interface.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-all-soal.use-case.ts
│   │   │   │   ├── get-soal-by-id.use-case.ts
│   │   │   │   ├── create-soal.use-case.ts
│   │   │   │   ├── update-soal.use-case.ts
│   │   │   │   ├── delete-soal.use-case.ts
│   │   │   │   └── import-soal.use-case.ts
│   │   │   └── hooks/
│   │   │       ├── useSoalList.ts
│   │   │       ├── useSoalDetail.ts
│   │   │       ├── useSoalMutation.ts
│   │   │       └── useImportSoal.ts
│   │   ├── infrastructure/
│   │   │   ├── soal.api.ts
│   │   │   └── soal.repository.ts
│   │   └── presentation/
│   │       ├── SoalCard.tsx
│   │       ├── SoalForm.tsx
│   │       ├── SoalEditor.tsx
│   │       ├── OpsiInput.tsx
│   │       ├── OpsiList.tsx
│   │       ├── SoalFilters.tsx
│   │       └── ImportSoalStepper.tsx
│   │
│   └── quiz/
│       ├── domain/
│       │   ├── quiz.types.ts
│       │   └── IQuizRepository.interface.ts
│       ├── application/
│       │   ├── use-cases/
│       │   │   ├── get-all-quiz.use-case.ts
│       │   │   ├── get-quiz-by-id.use-case.ts
│       │   │   ├── create-quiz.use-case.ts
│       │   │   ├── update-quiz.use-case.ts
│       │   │   ├── delete-quiz.use-case.ts
│       │   │   ├── append-komponen.use-case.ts
│       │   │   ├── edit-komponen.use-case.ts
│       │   │   ├── reorder-komponen.use-case.ts
│       │   │   └── delete-komponen.use-case.ts
│       │   └── hooks/
│       │       ├── useQuizList.ts
│       │       ├── useQuizDetail.ts
│       │       ├── useQuizMutation.ts
│       │       └── useKomponenMutation.ts
│       ├── infrastructure/
│       │   ├── quiz.api.ts
│       │   └── quiz.repository.ts
│       └── presentation/
│           ├── QuizCard.tsx
│           ├── QuizForm.tsx
│           ├── QuizDeleteDialog.tsx
│           ├── KomponenList.tsx
│           ├── KomponenCard.tsx
│           ├── KomponenForm.tsx
│           └── SelectorPicker.tsx
│
├── shared/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── PageHeader.tsx
│   │   └── ui/
│   │       ├── HtmlRenderer.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── FileUpload.tsx
│   │       └── StatCard.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useOffsetPagination.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── firebase.ts
│   │   └── format.ts
│   └── types/
│       └── common.types.ts
│
├── store/
│   └── auth.store.ts
│
└── middleware.ts
```

---

## 2. Routing & Halaman

```
/                         → Redirect: token ada → /dashboard, tidak ada → /login

/login                    → Halaman login (public)

/dashboard                → Dashboard admin                         [ADMIN]
/users                    → Daftar user (peserta + admin)           [ADMIN] ← BARU
/users/[id_user]          → Detail user + riwayat attempt           [ADMIN] ← BARU
/kategori                 → Daftar kategori                         [ADMIN]
/kategori/[id]            → Detail kategori + list subkategori      [ADMIN]
/subkategori              → Daftar subkategori                      [ADMIN]
/subkategori/[id]         → Detail subkategori                      [ADMIN]
/soal                     → Bank soal                               [ADMIN]
/soal/new                 → Form tambah soal                        [ADMIN]
/soal/[id]                → Form edit soal                          [ADMIN]
/soal/import              → Import soal via Excel                   [ADMIN]
/quiz                     → Daftar quiz                             [ADMIN]
/quiz/new                 → Form buat quiz                          [ADMIN]
/quiz/[id_quiz]           → Detail quiz + kelola komponen           [ADMIN]
/quiz/[id_quiz]/results   → Rekap hasil peserta per quiz            [ADMIN]
```

### Sidebar Navigation (update dengan Users)

```ts
const menuItems = [
  { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
  { label: 'Users',       href: '/users',        icon: Users },          // ← BARU
  { label: 'Kategori',    href: '/kategori',    icon: FolderOpen },
  { label: 'Subkategori', href: '/subkategori', icon: Folder },
  { label: 'Bank Soal',   href: '/soal',        icon: FileText },
  { label: 'Quiz',        href: '/quiz',         icon: ClipboardList },
]
```

---

## 3. Design System

### Warna Tambahan untuk User Management

```ts
// Tambahan di tailwind.config.ts
colors: {
  // ... warna sebelumnya tetap ada ...

  // Status verifikasi user
  verified:   { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  unverified: { bg: '#fefce8', text: '#a16207', border: '#fde047' },

  // Role badge
  role: {
    admin:   { bg: '#eff6ff', text: '#1d4ed8' },
    peserta: { bg: '#faf5ff', text: '#7e22ce' },
  }
}
```

### Badge Komponen

```
UserStatusBadge:
  verified   → [✅ Terverifikasi]  hijau
  unverified → [⏳ Belum Verifikasi]  kuning

UserRoleBadge:
  admin      → [👤 Admin]  biru
  peserta    → [🎓 Peserta]  ungu
```

---

## 4. Shared Layer

### `shared/lib/firebase.ts`

Firebase config sudah tersedia. Gunakan environment variables untuk keamanan, jangan hardcode di source code.

```ts
// .env.local (buat file ini, jangan di-commit ke git)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCffhkKXuqIDD57eeRIQqcGrwARNab2Fis
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bsi-quiz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bsi-quiz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bsi-quiz.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=827302643960
NEXT_PUBLIC_FIREBASE_APP_ID=1:827302643960:web:a50997f432fef9e447930d
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-S16ND7JC4P
NEXT_PUBLIC_API_URL=https://your-backend-url.com  ← tanyakan ke backend dev
```

```ts
// shared/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const firebaseAuth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
```

> ⚠️ **Wajib:** Tambahkan `.env.local` ke `.gitignore`. Jangan pernah commit API key ke repository.

### `shared/types/common.types.ts`

```ts
export interface OffsetPaginationParams {
  start?: number
  length?: number
  search?: string
}

// Format response pagination (konfirmasi ke backend)
export interface PaginatedApiResponse<T> {
  data: T[]
  recordsTotal: number        // total semua record
  recordsFiltered: number     // total setelah filter/search
}

export type ApiError = {
  message: string
  errors?: Record<string, string[]>
}
```

### `shared/lib/api-client.ts`

```ts
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store/auth.store'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data ?? error)
  }
)
```

### `shared/hooks/useOffsetPagination.ts`

```ts
import { useState, useCallback } from 'react'

export const useOffsetPagination = (defaultLength = 20) => {
  const [start, setStart] = useState(0)
  const length = defaultLength

  return {
    start,
    length,
    currentPage: Math.floor(start / length) + 1,
    nextPage:    useCallback(() => setStart(s => s + length), [length]),
    prevPage:    useCallback(() => setStart(s => Math.max(0, s - length)), [length]),
    goToPage:    useCallback((page: number) => setStart((page - 1) * length), [length]),
    reset:       useCallback(() => setStart(0), []),
  }
}
```

---

## 5. Fitur: Auth

### Domain Types

```ts
// features/auth/domain/auth.types.ts

export interface User {
  id: number
  username: string
  nama: string
  role: 'admin' | 'peserta'
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}
```

### Infrastructure

```ts
// features/auth/infrastructure/auth.api.ts

export const authApi = {
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiClient.post('/login', payload),

  // PENTING: Login Firebase pakai Authorization header, BUKAN body
  loginWithFirebase: (firebaseToken: string): Promise<AuthResponse> =>
    apiClient.post('/login/fb', null, {
      headers: { Authorization: `Bearer ${firebaseToken}` },
    }),

  getMe: (): Promise<User> =>
    apiClient.get('/me'),
}
```

### Use Cases

```ts
// features/auth/application/use-cases/login.use-case.ts
export const loginUseCase =
  (repo: IAuthRepository) =>
  async (payload: LoginPayload) => {
    if (!payload.username.trim()) throw new Error('Username wajib diisi')
    if (!payload.password)        throw new Error('Password wajib diisi')
    return repo.login(payload)
  }

// features/auth/application/use-cases/login-firebase.use-case.ts
import { signInWithPopup } from 'firebase/auth'
import { firebaseAuth, googleProvider } from '@/shared/lib/firebase'

export const loginFirebaseUseCase =
  (repo: IAuthRepository) =>
  async () => {
    const result       = await signInWithPopup(firebaseAuth, googleProvider)
    const firebaseToken = await result.user.getIdToken()
    return repo.loginWithFirebase(firebaseToken)
  }
```

### Hooks

```ts
// features/auth/application/hooks/useLogin.ts
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const { setUser, setToken }      = useAuthStore()
  const router                    = useRouter()

  const login = async (payload: LoginPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await loginUseCase(authRepository)(payload)
      setToken(result.token)
      setUser(result.user)
      router.push(result.user.role === 'admin' ? '/dashboard' : '/student/dashboard')
    } catch (err: any) {
      setError(err?.message ?? 'Login gagal. Periksa username dan password.')
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
```

### Halaman `/login`

```
Layout: centered card, max-width 400px, tanpa sidebar

┌─────────────────────────────────────┐
│          [Logo / Nama App]          │
│       Simulator Ujian SKD           │
│                                     │
│  Username                           │
│  [_________________________________]│
│                                     │
│  Password                           │
│  [_________________________________]│
│                                     │
│  [           Masuk           ]      │
│                                     │
│  ──────────── atau ────────────     │
│                                     │
│  [G  Masuk dengan Google       ]    │
│                                     │
│  [pesan error — alert merah]        │
└─────────────────────────────────────┘

Notes:
- Username bukan email
- Firebase login: POST /login/fb dengan header Bearer <firebase_token>
- Loading state: tombol disabled + spinner
- Enter di password field = submit
```

---

## 6. Fitur: User Management ← BARU

### Konteks Penting: Flow Verifikasi

Berdasarkan endpoint `POST /adm/user/:id/verify`, ada **flow approval** untuk peserta baru. Peserta yang baru mendaftar (via Firebase/Google) masuk dalam status **unverified**. Admin perlu verifikasi sebelum peserta bisa mengakses quiz.

```
[Peserta daftar via Firebase]
         │
         ▼
[Status: UNVERIFIED]
         │
         ▼  (admin klik Verify)
[POST /adm/user/:id/verify]
         │
         ▼
[Status: VERIFIED]
         │
         ▼
[Peserta bisa akses quiz]
```

> ⚠️ Ini mengubah asumsi sebelumnya bahwa semua user langsung aktif. Perlu konfirmasi ke backend: apakah peserta unverified bisa login tapi tidak bisa akses quiz, atau tidak bisa login sama sekali?

### Domain Types

```ts
// features/users/domain/user.types.ts

export type UserRole        = 'admin' | 'peserta'
export type VerifiedStatus  = 'verified' | 'unverified'

export interface AppUser {
  id: number
  username: string
  nama: string
  email?: string              // mungkin ada jika daftar via Firebase
  role: UserRole
  is_verified: boolean        // atau field lain — konfirmasi ke backend
  created_at: string
}

export interface UserFilters extends OffsetPaginationParams {
  show_mode?: '' | 'verified' | 'unverified'
  role?:      '' | 'admin' | 'peserta' | 'all'
}
```

### Repository Interface

```ts
// features/users/domain/IUserRepository.interface.ts

export interface IUserRepository {
  getAll(filters: UserFilters): Promise<PaginatedApiResponse<AppUser>>
  getById(id: number): Promise<AppUser>
  verify(id: number): Promise<AppUser>
  delete(id: number): Promise<void>
}
```

### Infrastructure

```ts
// features/users/infrastructure/user.api.ts

export const userApi = {
  getAll: (params: UserFilters) =>
    apiClient.get('/adm/user', { params }),

  getById: (id: number) =>
    apiClient.get(`/adm/user/${id}`),

  verify: (id: number) =>
    apiClient.post(`/adm/user/${id}/verify`),

  delete: (id: number) =>
    apiClient.delete(`/adm/user/${id}`),
}
```

### Use Cases

```ts
// features/users/application/use-cases/verify-user.use-case.ts
export const verifyUserUseCase =
  (repo: IUserRepository) =>
  async (id: number) => {
    if (!id) throw new Error('ID user tidak valid')
    return repo.verify(id)
  }

// features/users/application/use-cases/delete-user.use-case.ts
export const deleteUserUseCase =
  (repo: IUserRepository) =>
  async (id: number) => {
    // Business rule: tidak bisa hapus diri sendiri
    const currentUser = useAuthStore.getState().user
    if (currentUser?.id === id) throw new Error('Tidak bisa menghapus akun sendiri')
    return repo.delete(id)
  }
```

### Hook: `useUserList.ts`

```ts
export const useUserList = () => {
  const pagination    = useOffsetPagination(20)
  const [search, setSearch]         = useState('')
  const [showMode, setShowMode]     = useState<UserFilters['show_mode']>('verified')
  const [role, setRole]             = useState<UserFilters['role']>('peserta')
  const debouncedSearch             = useDebounce(search, 400)
  const [data, setData]             = useState<AppUser[]>([])
  const [total, setTotal]           = useState(0)
  const [isLoading, setIsLoading]   = useState(false)

  const fetch = async () => {
    setIsLoading(true)
    try {
      const res = await getAllUsersUseCase(userRepository)({
        start: pagination.start,
        length: pagination.length,
        search: debouncedSearch,
        show_mode: showMode,
        role,
      })
      setData(res.data)
      setTotal(res.recordsTotal)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetch() }, [pagination.start, debouncedSearch, showMode, role])

  return { data, total, isLoading, pagination, search, setSearch,
           showMode, setShowMode, role, setRole, refetch: fetch }
}
```

### Hook: `useUserMutation.ts`

```ts
export const useUserMutation = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false)

  const verify = async (id: number, nama: string) => {
    setIsLoading(true)
    try {
      await verifyUserUseCase(userRepository)(id)
      toast.success(`${nama} berhasil diverifikasi`)
      onSuccess?.()
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal memverifikasi user')
    } finally {
      setIsLoading(false)
    }
  }

  const remove = async (id: number, nama: string) => {
    setIsLoading(true)
    try {
      await deleteUserUseCase(userRepository)(id)
      toast.success(`User ${nama} berhasil dihapus`)
      onSuccess?.()
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal menghapus user')
    } finally {
      setIsLoading(false)
    }
  }

  return { verify, remove, isLoading }
}
```

### Presentation

#### Halaman `/users` — Daftar User

```
PageHeader:
  "Manajemen User"

Filter Bar:
  [🔍 Cari nama/username...]
  [Status: Terverifikasi ▼]       ← show_mode: verified | unverified | all
  [Role: Peserta ▼]               ← role: peserta | admin | all

Tab cepat (shortcut filter):
  [Semua] [Belum Verifikasi 🔴 5] [Terverifikasi] [Admin]

Tabel UserTable:
┌────┬──────────────┬───────────────────┬──────────────┬──────────────┬─────────────────────┐
│ ID │ Nama         │ Username          │ Role         │ Status       │ Aksi                │
├────┼──────────────┼───────────────────┼──────────────┼──────────────┼─────────────────────┤
│ 2  │ Budi Santoso │ budi_s            │ [🎓 Peserta] │ [✅ Verified]│ [Detail] [🗑 Hapus] │
│ 3  │ Ani Rahma    │ ani_r             │ [🎓 Peserta] │ [⏳ Unverif] │ [✅ Verifikasi] [🗑]│
│ 4  │ Super Admin  │ admin             │ [👤 Admin]   │ [✅ Verified]│ [Detail]            │
└────┴──────────────┴───────────────────┴──────────────┴──────────────┴─────────────────────┘

Catatan:
- Tombol [Hapus] tidak muncul untuk role admin
- Tombol [Verifikasi] hanya muncul jika status = unverified
- Klik nama atau [Detail] → navigasi ke /users/[id]

Pagination offset di bawah
```

#### Komponen: `UserStatusBadge.tsx`

```tsx
// Tampilan badge status verifikasi
// verified   → bg-green-50 text-green-700  "✅ Terverifikasi"
// unverified → bg-yellow-50 text-yellow-700 "⏳ Belum Verifikasi"
```

#### Komponen: `VerifyUserButton.tsx`

```tsx
// Tombol verify dengan confirm dialog inline
// Klik → Dialog: "Verifikasi [Nama]? User akan bisa mengakses quiz."
// Konfirmasi → POST /adm/user/:id/verify → refresh list

interface Props {
  userId: number
  userName: string
  onSuccess: () => void
}
```

#### Komponen: `UserDeleteDialog.tsx`

```tsx
// Dialog konfirmasi hapus user
// "Hapus [Nama]? Semua data attempt user ini akan ikut terhapus."
// Catatan: tidak bisa hapus role admin

interface Props {
  user: AppUser
  onConfirm: () => void
  isLoading: boolean
}
```

#### Halaman `/users/[id_user]` — Detail User

```
PageHeader:
  ← Kembali ke Users
  [Avatar inisial]  Budi Santoso
                    @budi_s  •  [🎓 Peserta]  •  [⏳ Belum Verifikasi]

Action Bar (jika unverified):
  [✅ Verifikasi User ini]

Action Bar (jika verified, role peserta):
  [🗑 Hapus User]

─── Section: Informasi User ────────────────────────────────────────

  StatCards:
  [ID User: 2]  [Bergabung: 12 Jan 2025]  [Status: Verified/Unverified]

─── Section: Riwayat Attempt ───────────────────────────────────────

  (Placeholder — menunggu endpoint riwayat attempt per user dari backend)

  Sementara tampilkan:
  EmptyState: "Riwayat attempt akan tersedia setelah endpoint backend siap"
```

---

## 7. Fitur: Kategori

### Domain Types

```ts
// features/kategori/domain/kategori.types.ts

export interface Kategori {
  id: number
  nama: string
  subkategori?: SubkategoriRingkas[]
}

export interface SubkategoriRingkas {
  id: number
  nama: string
  jumlah_soal?: number
}

export interface CreateKategoriPayload { nama: string }
export type UpdateKategoriPayload = CreateKategoriPayload
```

### Infrastructure

```ts
// features/kategori/infrastructure/kategori.api.ts

export const kategoriApi = {
  getAll:  (params: OffsetPaginationParams) => apiClient.get('/adm/kategori', { params }),
  getById: (id: number)                     => apiClient.get(`/adm/kategori/${id}`),
  create:  (payload: CreateKategoriPayload) => apiClient.post('/adm/kategori', payload),
  update:  (id: number, p: UpdateKategoriPayload) => apiClient.put(`/adm/kategori/${id}`, p),
  delete:  (id: number)                     => apiClient.delete(`/adm/kategori/${id}`),
}
```

### Halaman `/kategori`

```
PageHeader: "Kategori Soal"                [+ Tambah Kategori]

[🔍 Cari nama kategori...]

Tabel:
┌────┬───────────────────────────┬────────────────────┬──────────────┐
│ ID │ Nama Kategori             │ Jumlah Subkategori │ Aksi         │
├────┼───────────────────────────┼────────────────────┼──────────────┤
│ 1  │ TWK                       │ 4                  │ [✏] [🗑]    │
│ 2  │ TIU                       │ 3                  │ [✏] [🗑]    │
└────┴───────────────────────────┴────────────────────┴──────────────┘

Klik nama → /kategori/[id]

Modal Tambah/Edit: field Nama Kategori [required]
Dialog Hapus: ConfirmDialog variant=danger
```

### Halaman `/kategori/[id]`

```
PageHeader:
  ← Kembali
  "TWK"                              [✏ Edit Nama]

Section: Subkategori dalam kategori ini
  [+ Tambah Subkategori]

  Tabel subkategori + jumlah soal
  Klik [Lihat Soal →] → /soal?id_subkategori=X
```

---

## 8. Fitur: Subkategori

### Domain Types

```ts
// features/subkategori/domain/subkategori.types.ts

export interface Subkategori {
  id: number
  id_kategori: number
  nama: string
  jumlah_soal?: number
  kategori?: { id: number; nama: string }
}

export interface CreateSubkategoriPayload {
  id_kategori: number
  nama: string
}
export type UpdateSubkategoriPayload = CreateSubkategoriPayload
```

### Infrastructure

```ts
// features/subkategori/infrastructure/subkategori.api.ts

export const subkategoriApi = {
  getAll:  (params: OffsetPaginationParams) => apiClient.get('/adm/subkategori', { params }),
  getById: (id: number)                     => apiClient.get(`/adm/subkategori/${id}`),
  create:  (p: CreateSubkategoriPayload)    => apiClient.post('/adm/subkategori', p),
  update:  (id: number, p: UpdateSubkategoriPayload) => apiClient.put(`/adm/subkategori/${id}`, p),
  delete:  (id: number)                     => apiClient.delete(`/adm/subkategori/${id}`),
}
```

### Halaman `/subkategori`

```
PageHeader: "Subkategori Soal"             [+ Tambah Subkategori]

Filter: [Kategori: Semua ▼]  [🔍 Cari...]

Tabel:
┌────┬──────────────────────┬───────────┬─────────────┬──────────────┐
│ ID │ Nama Subkategori     │ Kategori  │ Jumlah Soal │ Aksi         │
├────┼──────────────────────┼───────────┼─────────────┼──────────────┤
│ 1  │ Pancasila            │ TWK       │ 120         │ [✏] [🗑]    │
└────┴──────────────────────┴───────────┴─────────────┴──────────────┘

Modal Tambah/Edit:
  - Kategori (Select, required)
  - Nama Subkategori (required)
```

### Halaman `/subkategori/[id]`

```
PageHeader:
  ← Kembali
  "Pancasila"  •  Kategori: TWK

StatCard: [Total Soal: 120]

Actions:
  [Lihat Soal →]   [+ Tambah Soal →]
```

---

## 9. Fitur: Bank Soal

### Domain Types

```ts
// features/soal/domain/soal.types.ts

export interface SoalOpsi {
  id: number
  content: string      // HTML — render dengan HtmlRenderer
  poin: number         // -5 s.d. 5
}

export interface Soal {
  id: number
  content: string      // HTML
  pembahasan: string   // HTML
  trik_cepat: string | null
  id_subkat: number
  subkategori?: {
    id: number
    nama: string
    kategori: { id: number; nama: string }
  }
  soal_opsi?: SoalOpsi[]
}

export interface SoalFilters extends OffsetPaginationParams {
  id_kategori?:    number
  id_subkategori?: number
  include_opsi?:   boolean
}

export interface CreateSoalPayload {
  content:    string
  pembahasan: string
  trik_cepat?: string | null
  id_subkat:  number
  options:    { content: string; poin: number }[]
}
export type UpdateSoalPayload = CreateSoalPayload
```

### Catatan Penting — Opsi Soal

Dari body Store di Postman, opsi bisa berisi HTML dengan gambar dan link:
```json
{
  "content": "<img src='...' /><p>Teks opsi</p>",
  "poin": 5
}
```
Artinya `OpsiInput` harus support TipTap editor (bukan hanya plain text input), sama seperti `SoalEditor` tapi lebih compact.

### Infrastructure

```ts
// features/soal/infrastructure/soal.api.ts

export const soalApi = {
  getAll:  (params: SoalFilters) => apiClient.get('/adm/soal', { params }),
  getById: (id: number)          => apiClient.get(`/adm/soal/${id}`),
  create:  (p: CreateSoalPayload)         => apiClient.post('/adm/soal', p),
  update:  (id: number, p: UpdateSoalPayload) => apiClient.put(`/adm/soal/${id}`, p),
  delete:  (id: number)          => apiClient.delete(`/adm/soal/${id}`),

  import: (id_subkategori: number, file: File) => {
    const form = new FormData()
    form.append('id_subkategori', String(id_subkategori))
    form.append('file', file)
    return apiClient.post('/adm/soal/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
```

### Halaman `/soal` — Bank Soal

```
PageHeader: "Bank Soal"        [Import Excel]  [+ Tambah Soal]

Filter Bar:
  [Kategori ▼]  [Subkategori ▼]  [🔍 Cari teks soal...]

Daftar SoalCard:
┌──────────────────────────────────────────────────────────────────┐
│ #1548  [Badge: TWK]  [Badge: Pancasila]                          │
│                                                                  │
│ <p>Nilai yang terkandung dalam Pancasila sila ke-3...</p>        │
│ (truncated 2 baris via HtmlRenderer)                             │
│                                                                  │
│ Opsi: [A +5] [B 0] [C -2] [D 0]                                 │
│                                          [✏ Edit]  [🗑 Hapus]   │
└──────────────────────────────────────────────────────────────────┘

Poin badge warna:
  > 0 → bg-green-50 text-green-700
    0 → bg-neutral-100 text-neutral-500
  < 0 → bg-red-50 text-red-700
```

### Halaman `/soal/new` & `/soal/[id]` — Form Soal

```
PageHeader:
  ← Kembali ke Bank Soal
  "Tambah Soal" / "Edit Soal #1548"

Layout: 1 kolom, max-width 800px

─── 1. Lokasi Soal ──────────────────────────────────────────────
  Subkategori *  (Select grouped by kategori)

─── 2. Konten Soal ──────────────────────────────────────────────
  Teks Soal *
  [SoalEditor — TipTap full]

─── 3. Opsi Jawaban ─────────────────────────────────────────────
  (min 2, maks 5)

  ┌────────────────────────────────────────────────┬──────────┐
  │ Opsi 1  [SoalEditor compact — support gambar]  │ Poin [5] │
  ├────────────────────────────────────────────────┼──────────┤
  │ Opsi 2  [SoalEditor compact]                   │ Poin [0] │
  ├────────────────────────────────────────────────┼──────────┤
  │ Opsi 3  [SoalEditor compact]                   │ Poin [-2]│
  └────────────────────────────────────────────────┴──────────┘
  [+ Tambah Opsi]

  ℹ Poin tertinggi = jawaban terbaik. Poin boleh negatif (pinalti). Range: -5 s.d. 5

─── 4. Pembahasan ───────────────────────────────────────────────
  [SoalEditor — TipTap full]

─── 5. Trik Cepat (opsional) ────────────────────────────────────
  [Textarea plain text]

Footer: [Batal]  [Simpan Soal]
```

### Halaman `/soal/import`

```
PageHeader:
  ← Kembali ke Bank Soal
  "Import Soal dari Excel"

Step 1 — Setup:
  Subkategori Tujuan *
  [Select subkategori ▼]

  Upload File:
  [FileUpload dropzone — .xlsx, maks 5MB]

  [📥 Download Template Excel]
  [Upload & Import]  (disabled jika subkategori belum dipilih)

Step 2 — Hasil:
  ✅ Sukses: "X soal berhasil diimport ke [Nama Subkategori]"
     [Lihat Soal]  [Import Lagi]

  ❌ Gagal: [pesan error dari backend]
     [Coba Lagi]

Catatan implementasi:
  - POST /adm/soal/import menggunakan multipart/form-data
  - Field: id_subkategori (text) + file (file)
  - Tidak ada preview sebelum import — langsung diproses backend
```

---

## 10. Fitur: Quiz & Komponen Quiz

### Domain Types

```ts
// features/quiz/domain/quiz.types.ts

export interface KomponenSelector {
  type: 'kategori' | 'subkategori'
  id: number
  nama?: string
}

export interface KomponenQuiz {
  id: number
  id_quiz: number
  nama: string
  no_urut: number
  jlh_soal: number
  passing_grade: number   // 0 = tanpa passing grade per komponen
  time_mins: number | null  // null = ikut timer global
  selector: KomponenSelector
}

export interface Quiz {
  id: number
  nama_tes: string
  time_mins: number
  passing_grade: number
  komponen?: KomponenQuiz[]
}

export interface CreateQuizPayload {
  nama_tes: string
  time_mins: number
  passing_grade: number
}
export type UpdateQuizPayload = CreateQuizPayload

export interface CreateKomponenPayload {
  nama: string
  jlh_soal: number
  passing_grade: number
  time_mins: number | null
  selector: KomponenSelector
}
export type UpdateKomponenPayload = CreateKomponenPayload
```

### Infrastructure

```ts
// features/quiz/infrastructure/quiz.api.ts

export const quizApi = {
  // Quiz CRUD
  getAll:  (params: OffsetPaginationParams) => apiClient.get('/adm/quiz', { params }),
  getById: (id: number)                     => apiClient.get(`/adm/quiz/${id}`),
  create:  (p: CreateQuizPayload)           => apiClient.post('/adm/quiz', p),
  update:  (id: number, p: UpdateQuizPayload) => apiClient.put(`/adm/quiz/${id}`, p),
  delete:  (id: number)                     => apiClient.delete(`/adm/quiz/${id}`),

  // Komponen
  appendKomponen: (id_quiz: number, p: CreateKomponenPayload) =>
    apiClient.post(`/adm/quiz/${id_quiz}/komponen`, p),

  editKomponen: (id_quiz: number, id_komp: number, p: UpdateKomponenPayload) =>
    apiClient.put(`/adm/quiz/${id_quiz}/komponen/${id_komp}`, p),

  reorderKomponen: (id_quiz: number, id_komp: number, no_urut_baru: number) =>
    apiClient.put(`/adm/quiz/${id_quiz}/komponen/${id_komp}/reorder`, { no_urut_baru }),

  deleteKomponen: (id_quiz: number, id_komp: number) =>
    apiClient.delete(`/adm/quiz/${id_quiz}/komponen/${id_komp}`),
}
```

### Penjelasan Reorder dari Backend

Dari dokumentasi Postman, reorder bekerja seperti ini:

```
Contoh: ID Komponen 7 dipindah dari urutan 5 → urutan 2

Sebelum:                Sesudah:
No. | ID Komp           No. | ID Komp
1   | 3                 1   | 3
2   | 4       →         2   | 7  ← dipindah ke sini
3   | 5                 3   | 4  ← bergeser +1
4   | 6                 4   | 5  ← bergeser +1
5   | 7                 5   | 6  ← bergeser +1
6   | 8                 6   | 8

Request: PUT /adm/quiz/:id/komponen/7/reorder
Body: { "no_urut_baru": 2 }
```

Frontend cukup kirim `id_komponen` yang dipindah dan `no_urut_baru`. Backend shift sisanya otomatis.

### Halaman `/quiz` — Daftar Quiz

```
PageHeader: "Quiz"                         [+ Buat Quiz]

[🔍 Cari nama quiz...]

Daftar QuizCard:
┌────────────────────────────────────────────────────────────────┐
│  Tryout SKD Sesi 1                                             │
│  100 menit  •  Passing grade: 300  •  3 komponen              │
│                             [Kelola →]  [✏ Edit]  [🗑 Hapus] │
└────────────────────────────────────────────────────────────────┘
```

### Halaman `/quiz/new` — Buat Quiz

```
PageHeader: "Buat Quiz Baru"

Form:
  Nama Quiz *   [_______________________________]
  Durasi *      [____] menit
  Passing Grade [____]  (0 = tanpa passing grade total)

  [Batal]  [Buat Quiz →]

Setelah berhasil → redirect ke /quiz/[id] untuk tambah komponen
```

### Halaman `/quiz/[id_quiz]` — Detail Quiz + Komponen

```
PageHeader:
  ← Kembali
  "Tryout SKD Sesi 1"                    [✏ Edit]  [🗑 Hapus]
  100 menit  •  Passing grade: 300

─── Komponen Quiz ───────────────────────────────────────────────

  [+ Tambah Komponen]

  Info box (jika belum ada komponen):
  ℹ Quiz belum memiliki komponen. Tambahkan komponen untuk
    menentukan soal yang dikerjakan peserta.

  KomponenList (drag & drop):
  ┌──────────────────────────────────────────────────────────┐
  │ ⠿  1  TWK — Pancasila                                    │
  │     Dari: Subkategori "Pancasila"                        │
  │     30 soal  •  25 menit  •  Passing grade: 65           │
  │                               [✏ Edit]  [🗑 Hapus]      │
  ├──────────────────────────────────────────────────────────┤
  │ ⠿  2  TIU — Verbal & Numerik                            │
  │     Dari: Kategori "TIU"                                 │
  │     35 soal  •  Ikut timer quiz  •  Tanpa passing grade  │
  │                               [✏ Edit]  [🗑 Hapus]      │
  └──────────────────────────────────────────────────────────┘

  Total soal: 65

Footer:
  [Lihat Rekap Hasil Peserta →]
```

### Modal: `KomponenForm.tsx`

```
Dialog: "Tambah Komponen" / "Edit Komponen"

1. Sumber Soal *
   (●) Subkategori   ( ) Kategori

   Jika Subkategori:
     [Pilih Kategori ▼] → [Pilih Subkategori ▼]
     → fetch GET /adm/subkategori/:id → tampilkan "Tersedia X soal"

   Jika Kategori:
     [Pilih Kategori ▼]
     → fetch GET /adm/kategori/:id → hitung total soal subkategori

2. Nama Komponen *
   [______________________________]
   (default = nama kategori/subkategori yang dipilih, bisa diubah)

3. Jumlah Soal *
   [____] soal (dipilih acak dari sumber)
   Validasi: max = soal tersedia

4. Timer
   [ ] Komponen ini punya timer sendiri
   Jika dicentang → [____] menit
   Jika tidak → "Mengikuti timer global (100 menit)"
   ⚠ NULL jika tidak pakai timer sendiri — jangan kirim 0

5. Passing Grade Komponen
   [____]  (0 = tanpa passing grade)

[Batal]  [Simpan Komponen]
```

### Komponen: `KomponenList.tsx`

```ts
// Library: @dnd-kit/core + @dnd-kit/sortable
// Install: npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

// Behavior drag:
// 1. Drag item ke posisi baru
// 2. Optimistic update: UI update langsung
// 3. Kirim: PUT /adm/quiz/:id_quiz/komponen/:id_komponen/reorder
//           body: { no_urut_baru: posisi_baru }
// 4. Gagal → rollback ke urutan semula + toast error
```

---

## 11. State Management

### `store/auth.store.ts`

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/features/auth/domain/auth.types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser:  (user: User)   => void
  setToken: (token: string) => void
  logout:   () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      setUser:  (user)  => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout:   ()      => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({
        token:           s.token,
        user:            s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
```

---

## 12. API Contract Lengkap — Auth & Admin

### Auth

| Method | Endpoint | Body / Params | Catatan |
|--------|----------|---------------|---------|
| POST | `/login` | `{ username, password }` | |
| POST | `/login/fb` | Header: `Bearer <firebase_token>` | **Bukan body!** |
| GET | `/me` | — | |

### Kategori

| Method | Endpoint | Params / Body |
|--------|----------|---------------|
| GET | `/adm/kategori` | `?start&length&search` |
| GET | `/adm/kategori/:id` | — |
| POST | `/adm/kategori` | `{ nama }` |
| PUT | `/adm/kategori/:id` | `{ nama }` |
| DELETE | `/adm/kategori/:id` | — |

### Subkategori

| Method | Endpoint | Params / Body |
|--------|----------|---------------|
| GET | `/adm/subkategori` | `?start&length&search` |
| GET | `/adm/subkategori/:id` | — (include jumlah_soal) |
| POST | `/adm/subkategori` | `{ id_kategori, nama }` |
| PUT | `/adm/subkategori/:id` | `{ id_kategori, nama }` |
| DELETE | `/adm/subkategori/:id` | — |

### Bank Soal

| Method | Endpoint | Params / Body |
|--------|----------|---------------|
| GET | `/adm/soal` | `?start&length&search&id_kategori&id_subkategori&include_opsi` |
| GET | `/adm/soal/:id` | — |
| POST | `/adm/soal` | `{ content, pembahasan, trik_cepat, id_subkat, options[] }` |
| PUT | `/adm/soal/:id` | sama dengan POST |
| DELETE | `/adm/soal/:id` | — |
| POST | `/adm/soal/import` | `multipart: { id_subkategori, file }` |

### Quiz & Komponen

| Method | Endpoint | Params / Body |
|--------|----------|---------------|
| GET | `/adm/quiz` | `?start&length&search` |
| GET | `/adm/quiz/:id_quiz` | — (include komponen[]) |
| POST | `/adm/quiz` | `{ nama_tes, time_mins, passing_grade }` |
| PUT | `/adm/quiz/:id_quiz` | `{ nama_tes, time_mins, passing_grade }` |
| DELETE | `/adm/quiz/:id_quiz` | — (hapus juga komponen) |
| POST | `/adm/quiz/:id_quiz/komponen` | `{ nama, jlh_soal, passing_grade, time_mins, selector }` |
| PUT | `/adm/quiz/:id_quiz/komponen/:id` | sama dengan POST komponen |
| PUT | `/adm/quiz/:id_quiz/komponen/:id/reorder` | `{ no_urut_baru }` |
| DELETE | `/adm/quiz/:id_quiz/komponen/:id` | — |

### User Management ← BARU

| Method | Endpoint | Params / Body | Catatan |
|--------|----------|---------------|---------|
| GET | `/adm/user` | `?start&length&search&show_mode&role` | `show_mode`: verified\|unverified; `role`: admin\|peserta\|all |
| GET | `/adm/user/:id_user` | — | |
| POST | `/adm/user/:id_user/verify` | — | Toggle verified |
| DELETE | `/adm/user/:id_user` | — | Tidak bisa hapus admin |

---

## 13. Breakdown Task per Minggu

### Minggu 1 — Setup, Auth, Layout

| Task | Jam |
|------|-----|
| Init Next.js 14 + TypeScript + Tailwind | 2 |
| Install & init Shadcn/UI | 2 |
| Struktur folder feature-based | 1 |
| `shared/lib/api-client.ts` | 2 |
| `shared/lib/firebase.ts` (dari env vars) | 1 |
| `shared/types/common.types.ts` | 1 |
| `shared/hooks/useOffsetPagination.ts` + `useDebounce.ts` | 1 |
| `shared/components/ui/` (HtmlRenderer, EmptyState, ConfirmDialog, StatCard, FileUpload) | 5 |
| `store/auth.store.ts` | 1 |
| `middleware.ts` (route guard) | 2 |
| `AdminSidebar.tsx` (dengan menu Users) + `PageHeader.tsx` | 4 |
| `app/(admin)/layout.tsx` | 1 |
| Fitur auth: domain + infra + use cases + hooks | 4 |
| Halaman `/login` + `LoginForm` + `LoginFirebaseButton` | 4 |
| Dashboard `/dashboard` (placeholder stat cards) | 2 |

**Total: ~33 jam**

---

### Minggu 2 — User Management + Kategori + Subkategori

| Task | Jam |
|------|-----|
| Fitur users: domain + infra + use cases | 3 |
| `useUserList.ts` + `useUserDetail.ts` + `useUserMutation.ts` | 4 |
| `UserTable.tsx` + `UserStatusBadge.tsx` + `UserRoleBadge.tsx` | 4 |
| `VerifyUserButton.tsx` + `UserDeleteDialog.tsx` | 3 |
| Halaman `/users` (tabel + filter + tab status) | 4 |
| Halaman `/users/[id_user]` (detail user) | 3 |
| Fitur kategori: domain + infra + use cases + hooks | 3 |
| `KategoriTable.tsx` + `KategoriForm.tsx` + `KategoriDeleteDialog.tsx` | 4 |
| Halaman `/kategori` + `/kategori/[id]` | 4 |
| Fitur subkategori: domain + infra + use cases + hooks | 3 |
| `SubkategoriTable.tsx` + `SubkategoriForm.tsx` | 3 |
| Halaman `/subkategori` + `/subkategori/[id]` | 3 |

**Total: ~41 jam**

---

### Minggu 3 — Bank Soal

| Task | Jam |
|------|-----|
| Fitur soal: domain + infra + use cases | 3 |
| `SoalEditor.tsx` (TipTap — full + compact mode) | 5 |
| `OpsiInput.tsx` (TipTap compact + poin input -5..5) | 4 |
| `OpsiList.tsx` | 2 |
| `useSoalList.ts` + `useSoalDetail.ts` + `useSoalMutation.ts` | 4 |
| `SoalCard.tsx` + `SoalFilters.tsx` | 3 |
| Halaman `/soal` | 3 |
| Halaman `/soal/new` (form lengkap) | 5 |
| Halaman `/soal/[id]` (edit — reuse form) | 2 |
| `useImportSoal.ts` + `ImportSoalStepper.tsx` | 4 |
| Halaman `/soal/import` | 3 |

**Total: ~38 jam**

---

### Minggu 4 — Quiz & Komponen

| Task | Jam |
|------|-----|
| Fitur quiz: domain + infra + use cases | 4 |
| `useQuizList.ts` + `useQuizDetail.ts` + `useQuizMutation.ts` | 4 |
| `useKomponenMutation.ts` (termasuk reorder + optimistic update) | 4 |
| `QuizCard.tsx` + `QuizForm.tsx` + `QuizDeleteDialog.tsx` | 4 |
| Halaman `/quiz` + `/quiz/new` | 4 |
| `SelectorPicker.tsx` (pilih kategori/subkategori + tampil jumlah soal) | 5 |
| `KomponenForm.tsx` (modal) | 5 |
| `KomponenCard.tsx` | 2 |
| Install @dnd-kit + `KomponenList.tsx` (drag & drop + rollback) | 7 |
| Halaman `/quiz/[id_quiz]` | 4 |

**Total: ~43 jam**

---

### Minggu 5 — Polish, Responsive, Bug Fix

| Task | Jam |
|------|-----|
| Loading skeleton semua halaman | 4 |
| Empty state semua halaman daftar | 2 |
| Error state (network error, server error) | 2 |
| Toast semua mutasi | 2 |
| Responsive mobile + tablet | 5 |
| Halaman `/quiz/[id]/results` (placeholder) | 2 |
| Firebase login end-to-end test | 3 |
| Integrasi semua API (ganti MSW dengan endpoint asli) | 4 |
| Bug fixing menyeluruh | 6 |

**Total: ~30 jam**

---

### Ringkasan

| Minggu | Fokus | Jam |
|--------|-------|-----|
| 1 | Setup + Auth + Layout | 33 |
| 2 | User Management + Kategori + Subkategori | 41 |
| 3 | Bank Soal | 38 |
| 4 | Quiz + Komponen | 43 |
| 5 | Polish + Responsive + Bug Fix | 30 |
| **Total** | | **~185 jam** |

---

## 14. Checklist Handoff

### Auth & Firebase
- [ ] Login username/password berfungsi
- [ ] Login Firebase Google berfungsi — pakai **header Authorization**, bukan body
- [ ] Firebase config di env vars, tidak hardcode
- [ ] `.env.local` masuk `.gitignore`
- [ ] Token persist di localStorage via Zustand
- [ ] Interceptor 401 → auto redirect `/login`

### User Management
- [ ] Tabel user dengan filter show_mode dan role berfungsi
- [ ] Tab "Belum Verifikasi" menampilkan badge counter
- [ ] Tombol Verify muncul hanya untuk user unverified
- [ ] Tombol Hapus tidak muncul untuk role admin
- [ ] Konfirmasi sebelum verify dan hapus
- [ ] Halaman detail user tampil dengan benar

### Clean Architecture
- [ ] Tidak ada komponen langsung call `apiClient`
- [ ] Domain types zero dependency
- [ ] Tidak ada cross-feature import (hanya dari `shared/`)

### Bank Soal
- [ ] Semua konten HTML dirender via `HtmlRenderer` (DOMPurify)
- [ ] TipTap berfungsi: full mode (soal, pembahasan) + compact mode (opsi)
- [ ] Poin opsi: warna hijau/abu/merah sesuai nilai
- [ ] `time_mins` komponen: kirim `null` jika tidak pakai timer (bukan `0`)
- [ ] Import: multipart/form-data dengan `id_subkategori` + `file`

### Quiz & Komponen
- [ ] Drag & drop reorder berfungsi
- [ ] Optimistic update reorder: UI langsung berubah, rollback jika gagal
- [ ] `passing_grade: 0` = tanpa passing grade (tampilkan "Tanpa passing grade")
- [ ] `time_mins: null` komponen = "Ikut timer global" (tampilkan dengan jelas)

### UI/UX
- [ ] Responsive di 375px, 768px, 1024px
- [ ] Loading state di semua aksi async
- [ ] Empty state di semua halaman daftar
- [ ] Toast success/error di semua mutasi

---

## Pertanyaan Terbuka ke Backend Developer

| # | Pertanyaan | Prioritas |
|---|------------|-----------|
| 1 | Format response pagination: `recordsTotal` + `recordsFiltered` + `data[]`? | 🔴 Sebelum coding |
| 2 | Format response umum: wrap `{ data, success, message }` atau langsung? | 🔴 Sebelum coding |
| 3 | Format error response: `{ message }` atau `{ errors: {} }`? | 🔴 Sebelum coding |
| 4 | `BASE_URL` backend adalah? | 🔴 Sebelum coding |
| 5 | Flow verifikasi: user unverified bisa login tapi tidak akses quiz, atau tidak bisa login sama sekali? | 🔴 Minggu 1 |
| 6 | Endpoint rekap hasil peserta per quiz untuk admin (`/quiz/[id]/results`) sudah ada? | 🟡 Minggu 5 |
| 7 | `id_jenis_tes` di start quiz peserta = langsung `id_quiz`? | 🟡 Scope peserta |

---

*Spec ini mencakup scope Auth + Admin. Spec peserta dibuat terpisah setelah endpoint peserta final.*