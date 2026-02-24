FEATURE/MODULE UPDATE

I will describe a new feature/module in plain English.

1) Read inputs.yml (single source of truth).
2) Update inputs.yml minimally (modules/features/capabilities only).
3) Create a new OpenSpec change folder:
   openspec/changes/active/<yyyy-mm-dd>-<short-name>/
     - proposal.md
     - tasks.md
     - spec-delta.md
4) Update the relevant module spec(s) in openspec/specs/modules/*.spec.md.
5) Implement ONLY the necessary code changes.
6) Do NOT regenerate the whole repo.
7) Hydration rules must remain valid (no hooks/events/shadcn in server files).

Output:
- updated inputs.yml (if changed)
- new openspec change folder contents
- updated spec files
- code diffs/new files
- commands to run:
  pnpm check:spec:dev
  pnpm lint:hydration
  pnpm dev:all

Here is the change:
<PASTE CHANGE DESCRIPTION HERE>