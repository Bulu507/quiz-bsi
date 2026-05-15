# Feature-Based Clean Architecture

Struktur ini mengikuti `prd.md` v2.

```txt
src/
|-- app/       # Next.js App Router, routing only
|-- features/  # Auth, questions, packages, classes, exam, results
|-- shared/    # UI, layout, shared hooks, api client, common types
`-- store/     # Zustand global stores
```

## Dependency Rule

```txt
presentation -> application
presentation -> domain
application -> domain
application -> infrastructure
infrastructure -> domain
```

Yang dihindari:

```txt
domain -> layer lain
infrastructure -> application
feature A -> internal feature B
presentation -> infrastructure langsung
```

## Current Feature Modules

- `src/features/auth`
- `src/features/questions`
- `src/features/packages`
- `src/features/classes`
- `src/features/exam`
- `src/features/results`

## Shared Layer

- `src/shared/components/layout`
- `src/shared/components/ui`
- `src/shared/lib/api-client.ts`
- `src/shared/types/common.types.ts`

## Store

- `src/store/auth.store.ts`
- `src/store/exam.store.ts`
