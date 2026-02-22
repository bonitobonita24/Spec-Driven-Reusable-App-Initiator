How you’ll use this day-to-day

Edit only inputs.yml

A) Ensure generated files are created before compose up

Run:

pnpm check:spec
docker compose --profile dev up -d

pnpm validate:inputs (checks correctness)

pnpm render:inputs (lets you see resolved URLs without touching files)

pnpm check:spec ( …and it will: validate inputs.yml against the schema generate the .env.generated.* files )


If later you add real “web” and “api” services to compose, you do the same:

staging: .env.staging + .env.generated.staging

prod: .env.prod + .env.generated.prod


Run it (inside devcontainer)
pnpm bootstrap:dev

That will:

install deps

validate inputs.yml + generate .env.generated.* + sync apps/web/.env.local

start infra (compose --profile dev up -d)

run hydration lint

Then you run apps:

pnpm -C apps/web dev
pnpm -C apps/api build && pnpm -C apps/api start

Usage

Stop dev infra

pnpm down:dev

Full wipe (Postgres + MinIO dev data)
pnpm reset:dev
pnpm bootstrap:dev

That’s the full “nuke and rebuild” loop.