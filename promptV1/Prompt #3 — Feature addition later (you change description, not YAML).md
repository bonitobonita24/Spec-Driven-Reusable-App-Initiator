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