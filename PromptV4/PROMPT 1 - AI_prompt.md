# Spec-Driven Reusable App Initiator — Master Prompt (v1)

This file defines the entire workflow and baseline structure.
It is used with GitHub Copilot Chat to generate a new project repo.

---

## Core truth
- **inputs.yml is the single source of truth** for every generated project repo.
- Humans edit: `inputs.yml` (and optionally `project.memory.md`).
- Everything else is derived and validated.

---

## Default posture (can be overridden by description)
- Tenancy default: **single**
- Deployment default: **compose**
- Capabilities default:
  - `capabilities.offline = all` (offline-first with outbox + auto-sync stubs)
  - `capabilities.realtime = all`
- OSS-first, secure-by-default, performance-seeking
- Compose-first dev/staging/prod; Kubernetes-ready artifacts scaffolded

---

## Hydration safety (non-negotiable)
To prevent “dead UI” (menus/buttons don’t work):
- `apps/web/app/layout.tsx` and `apps/web/app/**/page.tsx` are **server-only**
- Any interactive UI must be `*.client.tsx` and start with `'use client'`
- shadcn/ui imports are client-only
- Lint gate must fail if violated

---

## Minimal OpenSpec integration (no CLI required)
We use OpenSpec’s two-folder concept:
- `openspec/specs` = current truth specs
- `openspec/changes/active/<change-id>` = proposal/tasks/spec deltas
- `openspec/changes/archive` = completed changes

The generator must always create:
- `openspec/specs/00-system/source-of-truth.md`
- one `openspec/specs/modules/<module>.spec.md` per enabled module in inputs.yml
- empty changes folders:
  - `openspec/changes/active/`
  - `openspec/changes/archive/`

---

# PROMPT 1 — SPEC SYNTHESIZER
Paste into Copilot Chat in a blank repo, then paste your app description.

```text
SPEC SYNTHESIZER

You are the Spec Synthesizer.

Input: my plain-English app description (below).
Output: write ONLY ./inputs.yml (no code yet).

Defaults (unless explicitly overridden):
- inputs.app.type = GENERIC
- inputs.tenancy.mode = single
- inputs.deployment.strategy = compose
- inputs.capabilities.offline = all
- inputs.capabilities.realtime = all
- inputs.domains.root_domain = example.com
- inputs.domains.subdomains.staging = staging
- inputs.domains.subdomains.production = app
- inputs.domains.prefixes: api=api, realtime=ws, auth=auth, storage=s3

Inference rules:
- If I say "online only", "no offline", or "web only" → set capabilities.offline = none
- If I say "no realtime" → set capabilities.realtime = none
- If I mention multiple organizations/clients/tenants/white-label → tenancy.mode = multi
- Create inputs.modules.* entries with enabled:true for each module you infer
- env_urls:
  - development is fixed localhost defaults
  - staging/production MUST use ${domains.*} placeholders (humans edit only domains, not env_urls)

Security defaults:
- Keycloak admin/admin (dev defaults)
- MinIO admin/admin (dev defaults)

Output:
1) Full inputs.yml
2) Bullet list of what you inferred

Here is my app description:
<PASTE APP DESCRIPTION HERE>