Step 0 — Start a blank repo in VS Code

Open Copilot Chat.

Step 1 — Paste your idea in plain English (you never write YAML)

Example:

“Build an inventory + sales app for small shops. Needs user roles, product catalog, stock adjustments, purchase orders, sales orders, receipts PDF. Should work offline on tablets. Single tenant. Use Keycloak auth. Compose-first. MinIO for uploads.”

Step 2 — Run Prompt #1 (Spec Synthesizer)

Copilot creates/updates:

inputs.yml

validates it against inputs.schema.json

prints the resolved URLs (pnpm render:inputs later)

Step 3 — Run Prompt #2 (Scaffold Generator)

Copilot generates:

monorepo structure

compose/devcontainer

apps/web + apps/api

base modules/pages matching your features

hydration-safe layout

Step 4 — You run

pnpm bootstrap:dev

pnpm dev:all

✅ Copy-paste prompts you’ll use in Copilot (Option B)
Prompt #1 — Spec Synthesizer (Natural language → inputs.yml)

Paste this into Copilot Chat in the blank repo, along with your idea:

SPEC SYNTHESIZER (Option B)

You are the Spec Synthesizer.

Input: my plain-English app description (below).
Output: a complete ./inputs.yml using ONLY the allowed fixed options and defaults.

Rules:
1) Generate ./inputs.yml (YAML) that follows our schema philosophy:
   - domains.* block exists and is the only place I edit domains
   - env_urls staging/production MUST be templated using ${domains.*}
   - development URLs are localhost fixed defaults
2) Pick safe defaults unless I explicitly override them:
   - tenancy.mode default = single
   - capabilities.offline default = none
   - capabilities.realtime default = none
   - deployment.strategy default = compose
3) Infer required capabilities from wording:
   - if I mention offline/POS/tablet/field → offline = offline-writes
   - if I mention chat/live updates/notifications → realtime accordingly
   - if I mention multiple organizations/clients/tenants → tenancy.mode = multi
4) Produce modules as structured config under inputs.modules with enabled:true and per-module settings you infer.
5) Do NOT generate any code yet. Only generate inputs.yml.
6) After writing inputs.yml, list what you inferred (short bullet list).

Here is my app description:
<PASTE MY DESCRIPTION HERE>
Prompt #2 — Scaffold Generator (inputs.yml → repo)

Paste after Prompt #1 succeeds:

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
Prompt #3 — Feature addition later (you change description, not YAML)

When adding features/modules later, you can do either:

Describe new feature in English and let Copilot update inputs.yml

then do targeted implementation

Use this:

FEATURE UPDATE FLOW (Option B)

I will describe a new feature/module in plain English.

1) Read current inputs.yml.
2) Update inputs.yml minimally: add/adjust inputs.app.features and inputs.modules.
3) Validate that the updated inputs.yml still conforms to our schema rules (conditional tenancy, templates allowed).
4) Then implement ONLY the code necessary for the new module:
   - apps/api module/controller/service
   - apps/web route + client components
   - shared contracts
5) Do NOT regenerate the whole repo.
6) Hydration rules must remain valid.

Here is the new feature/module:
<PASTE NEW FEATURE DESCRIPTION HERE>
The one file you will always edit (in Option B)

You won’t manually edit YAML often, but you still keep it as the ground truth in the generated repo:

✅ inputs.yml is the “machine spec” that everything uses
✅ You can still tweak defaults there if you want
✅ But your preferred interface is natural language → Copilot updates it