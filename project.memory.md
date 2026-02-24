# Project Memory (Cognition)

## Intent
- Spec-driven development using inputs.yml as the single source of truth
- OSS-first, secure-by-default, performance-seeking
- Docker Compose first (dev/staging/prod profiles), Kubernetes-ready artifacts scaffolded
- TypeScript end-to-end monorepo
- Web: Next.js App Router with strict hydration-safe client boundaries + shadcn/ui + shadcnstudio shell
- API: NestJS
- Auth: Keycloak (OIDC)
- Object storage: MinIO (S3-compatible)
- Data: Postgres + Redis

## Non-negotiables
- inputs.yml is the single source of truth
- No environment-specific hardcoding (URLs, domains, credentials, tenant IDs)
- Next.js hydration safety:
  - layout/page server-only by default
  - interactive UI only in *.client.tsx with 'use client'
  - shadcn/ui imports only in client components
- Compose-first: staging must not require Kubernetes
- K8s-ready: manifests exist but are not used for staging

## Known pitfalls
- Dead UI happens when:
  - 'use client' is missing
  - shadcn/ui imported into server components
  - hooks/event handlers exist in server components