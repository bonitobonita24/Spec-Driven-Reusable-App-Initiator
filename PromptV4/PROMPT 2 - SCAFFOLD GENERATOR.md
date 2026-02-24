SCAFFOLD GENERATOR

You are the Scaffold Generator.

Rules:
1) Read ./inputs.yml and treat it as the single source of truth.
2) Generate the complete repo folder tree + file contents listed below.
3) Do NOT hardcode domains/URLs in code. Use tools/render-inputs.mjs to generate .env.generated.*.
4) Enforce hydration safety:
   - layout/page server-only
   - interactive code only in *.client.tsx with 'use client'
   - provide tools/hydration-lint.mjs and wire it into scripts + CI
5) Offline/realtime defaults are "all":
   - Provide outbox + sync CONTRACT STUBS (types + endpoints skeleton), not a full sync engine.
6) OpenSpec integration:
   - Create openspec/specs system + module specs
   - Create openspec/changes active/archive folders
7) Output all file contents fully. Do not omit files.

CREATE THIS EXACT FOLDER TREE
repo/
├─ inputs.yml
├─ inputs.schema.json
├─ project.memory.md
├─ README.md
├─ compose.yml
├─ .env.dev
├─ .env.staging
├─ .env.prod
├─ .devcontainer/
│  ├─ devcontainer.json
│  └─ Dockerfile
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
├─ tsconfig.base.json
├─ tools/
│  ├─ validate-inputs.mjs
│  ├─ render-inputs.mjs
│  ├─ sync-env.mjs
│  ├─ bootstrap-profile.mjs
│  ├─ down-profile.mjs
│  ├─ reset-profile.mjs
│  └─ hydration-lint.mjs
├─ infra/
│  ├─ keycloak/
│  │  └─ realm-app.json
│  ├─ minio/
│  │  └─ init.sh
│  └─ k8s/
│     ├─ README.md
│     └─ placeholders/
│        └─ customization.yaml
├─ openspec/
│  ├─ README.md
│  ├─ specs/
│  │  ├─ 00-system/
│  │  │  └─ source-of-truth.md
│  │  └─ modules/
│  │     ├─ tasks.spec.md
│  │     ├─ auth.spec.md
│  │     └─ uploads.spec.md
│  └─ changes/
│     ├─ active/
│     └─ archive/
├─ apps/
│  ├─ web/
│  │  ├─ package.json
│  │  ├─ next.config.mjs
│  │  ├─ tsconfig.json
│  │  ├─ app/
│  │  │  ├─ layout.tsx
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ tasks/page.tsx
│  │  │  └─ examples/page.tsx
│  │  ├─ components/
│  │  │  ├─ shell/AppShell.server.tsx
│  │  │  ├─ nav/Sidebar.client.tsx
│  │  │  ├─ nav/Topbar.client.tsx
│  │  │  └─ tasks/Tasks.client.tsx
│  │  └─ styles/globals.css
│  └─ api/
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ src/
│        ├─ main.ts
│        ├─ app.module.ts
│        ├─ health.controller.ts
│        └─ sync/
│           ├─ sync.controller.ts
│           └─ sync.types.ts
└─ packages/
   └─ shared/
      ├─ package.json
      └─ src/
         ├─ index.ts
         └─ offline/
            ├─ outbox.ts
            └─ sync-contracts.ts

NOW WRITE FILE CONTENTS:
- Use the baseline defaults from this prompt.
- Fix correctness issues:
  - NO duplicate JSON keys in package.json
  - CI must enable corepack + pnpm before pnpm install
- If inputs.yml disables a required route, you may omit that page, but keep hydration safety.

After generating everything:
1) Print exact commands to run (in order)
2) Print success URLs