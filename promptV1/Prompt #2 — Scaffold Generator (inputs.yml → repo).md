SCAFFOLD GENERATOR

You are the Scaffold Generator.

1) Read ./inputs.yml and treat it as the single source of truth.
2) Generate a Turborepo + pnpm monorepo with:
   - apps/web (Next.js App Router + shadcn)
   - apps/api (NestJS)
   - packages/shared (types/contracts)
3) Include devcontainer + compose dev profile with Postgres, Redis, Keycloak, MinIO.
   - Dev defaults: admin/admin for Keycloak & MinIO (dev only)
4) Hydration safety is mandatory:
   - app/layout.tsx and app/**/page.tsx are server components
   - all interactive UI is moved into *.client.tsx with 'use client'
   - navigation menus must be client components
5) Add tools:
   - tools/validate-inputs.mjs
   - tools/render-inputs.mjs (creates .env.generated.dev|staging|prod)
   - tools/sync-env.mjs (sync apps/web/.env.local)
   - tools/hydration-lint.mjs (fails on hydration violations)
6) Add package scripts:
   - pnpm validate:inputs
   - pnpm render:inputs
   - pnpm check:spec:dev
   - pnpm bootstrap:dev
   - pnpm dev:all
7) Output:
   - full folder tree
   - full contents for each file (grouped by path)
Do NOT omit files.

After generation, list the exact commands I should run in order.