# Spec-Driven Reusable App Initiator

Bootstraps and manages a spec-driven app foundation where `inputs.yml` is the single source of truth.

This repository currently provides:
- input schema validation
- environment URL rendering from templates
- profile-based bootstrap/down/reset helpers for Docker Compose

## What you edit

- Edit only `inputs.yml` for app/domain/environment values.
- Validate with `inputs.schema.json`.
- Generate resolved environment files (`.env.generated.*`) from `inputs.yml`.

## Repository structure

```text
.
├── AI_prompt.md
├── How to use this.md
├── inputs.schema.json
└── tools/
    ├── bootstrap-dev.mjs
    ├── bootstrap-profile.mjs
    ├── down-profile.mjs
    ├── render-inputs.mjs
    ├── reset-dev.mjs
    ├── reset-profile.mjs
    ├── sync-env.mjs
    └── validate-inputs.mjs
```

## Prerequisites

- Node.js 20+
- `pnpm`
- Docker + Docker Compose

> Some helper scripts call `pnpm` commands like `pnpm check:spec` and `pnpm lint:hydration`. Ensure your workspace includes the matching `package.json` scripts.

## Quick start

1. Install dependencies:

```bash
pnpm install
```

2. Validate inputs:

```bash
node tools/validate-inputs.mjs
```

3. Render generated env files:

```bash
node tools/render-inputs.mjs
```

4. (Optional) Sync generated env into web app:

```bash
node tools/sync-env.mjs dev
# or: node tools/sync-env.mjs staging
# or: node tools/sync-env.mjs prod
```

## Common workflows

### Validate + render

```bash
node tools/validate-inputs.mjs
node tools/render-inputs.mjs
```

### Bootstrap infrastructure by profile

```bash
node tools/bootstrap-profile.mjs dev
node tools/bootstrap-profile.mjs staging
node tools/bootstrap-profile.mjs prod
```

### Bring infrastructure down

```bash
node tools/down-profile.mjs dev
node tools/down-profile.mjs all
```

### Reset infrastructure (removes volumes)

```bash
node tools/reset-profile.mjs dev
node tools/reset-profile.mjs all
```

### Dev shortcuts

```bash
node tools/bootstrap-dev.mjs
node tools/reset-dev.mjs
```

## Generated files

`tools/render-inputs.mjs` creates:
- `.env.generated.dev`
- `.env.generated.staging`
- `.env.generated.prod`

These are intentionally ignored by git (`.gitignore`).

## Notes

- `tools/sync-env.mjs` copies one generated file into `apps/web/.env.local`.
- If `apps/web` does not exist yet, create the app workspace first or run this in the generated monorepo.