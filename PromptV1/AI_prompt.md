````text
INITIALIZE BLANK REPO — SPEC-DRIVEN MONOREPO STARTER (COPY-PASTE ONCE)

You are generating a complete, runnable, spec-driven project foundation inside an EMPTY repo.

PRIMARY GOAL
Create ALL files + folders exactly as specified below, with FULL file contents (no placeholders), so the repo can be opened in VS Code Dev Containers and run via Docker Compose. This foundation must be reusable for any future app by changing inputs.yml only.

NON-NEGOTIABLE REQUIREMENTS
- inputs.yml is the single source of truth
- project.memory.md exists and includes hydration non-negotiables
- Monorepo layout:
  - apps/web (Next.js App Router hydration-safe baseline)
  - apps/api (NestJS minimal API with /health)
  - packages/shared (shared TS types)
  - tools/hydration-lint.mjs (dead-UI prevention)
  - infra/keycloak + infra/minio + infra/k8s scaffolding
- Docker Compose includes from day 1:
  - Postgres, Redis, Keycloak, MinIO
  - Separate profiles: dev, staging, prod
  - Each environment has isolated volumes and separate env files (.env.dev/.env.staging/.env.prod)
  - Default admin credentials for Keycloak and MinIO are admin/admin in dev, staging, prod
  - Keycloak must import realm with realm "app" and create default user "admin" with password "admin"
  - MinIO must auto-create bucket "app" on startup via minio/mc init service running infra/minio/init.sh
- Devcontainer must be compose-based and always isolates the environment
- Next.js must be hydration-safe:
  - app/layout.tsx and app/**/page.tsx server-only by default (no hooks, no handlers, no shadcn/ui)
  - interactive UI ONLY in *.client.tsx starting with 'use client'
- Provide a README with exact run commands and URLs
- Provide a CI workflow that runs pnpm lint:hydration
- Do NOT rely on external scripts or docs. Everything must be in-repo.

IMPORTANT: OUTPUT FORMAT
- First output the FILE TREE
- Then output each file with:
  - a header line: "FILE: <path>"
  - the full file contents in a single code block
- Do not omit any file.
- Do not include explanations between files.

CREATE THIS EXACT FOLDER TREE
repo/
├─ inputs.yml
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
│  └─ hydration-lint.mjs
│  └─ tools/reset-dev.mjs
│  └─ tools/reset-profile.mjs
│  └─ tools/down-profile.mjs
│  └─ tools/bootstrap-profile.mjs
│  └─ tools/render-inputs.mjs
│  └─ tools/validate-inputs.mjs
│  └─ tools/sync-env.mjs
| 
├─ infra/
│  ├─ keycloak/
│  │  └─ realm-app.json
│  ├─ minio/
│  │  └─ init.sh
│  └─ k8s/
│     ├─ README.md
│     └─ placeholders/
│        └─ customization.yaml
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
│        └─ health.controller.ts
└─ packages/
   └─ shared/
      ├─ package.json
      └─ src/index.ts

NOW WRITE THESE EXACT FILE CONTENTS

FILE: inputs.yml
```yaml
version: 1

inputs:
  app:
    type: GENERIC # GENERIC | POS
    name: "my-app"
    purpose: "One clear sentence describing the app"
    features:
      - "Dashboard"
      - "Tasks CRUD"
      - "Authentication (OIDC)"

  domains:
    root_domain: "example.com"
    subdomains:
      staging: "staging"
      production: "app"
    prefixes:
      api: "api"
      realtime: "ws"
      auth: "auth"
      storage: "s3"

  # NOTE: env_urls are allowed to use ${...} placeholders.
  # Generators must resolve them; humans only edit domains above.
  env_urls:
    development:
      web: "http://localhost:3000"
      api: "http://localhost:3001"
      realtime: "ws://localhost:3002"
      oidc_issuer: "http://localhost:8080/realms/app"
      object_storage_endpoint: "http://localhost:9000"

    staging:
      web: "https://${domains.subdomains.staging}.${domains.root_domain}"
      api: "https://${domains.prefixes.api}-${domains.subdomains.staging}.${domains.root_domain}"
      realtime: "wss://${domains.prefixes.realtime}-${domains.subdomains.staging}.${domains.root_domain}"
      oidc_issuer: "https://${domains.prefixes.auth}-${domains.subdomains.staging}.${domains.root_domain}/realms/app"
      object_storage_endpoint: "https://${domains.prefixes.storage}-${domains.subdomains.staging}.${domains.root_domain}"

    production:
      web: "https://${domains.subdomains.production}.${domains.root_domain}"
      api: "https://${domains.prefixes.api}.${domains.root_domain}"
      realtime: "wss://${domains.prefixes.realtime}.${domains.root_domain}"
      oidc_issuer: "https://${domains.prefixes.auth}.${domains.root_domain}/realms/app"
      object_storage_endpoint: "https://${domains.prefixes.storage}.${domains.root_domain}"

  deployment:
    strategy: compose # compose | compose+swarm | k8s-later

  capabilities:
    realtime: chat # none | notifications | live | chat | all
    offline: offline-writes # none | read-only | offline-writes

  tenancy:
    mode: multi # single | multi
    multi:
      strategy: shared-db # shared-db | schema-per-tenant | db-per-tenant
      resolution:
        method: jwt-claim # subdomain | header | jwt-claim
        claim_key: "tenant_id"

  data:
    sensitivity: medium # low | medium | high

  constraints:
    data_services:
      mode: local # local | external

  security:
    oidc:
      provider: keycloak
      realm: "app"
      dev_defaults:
        admin_user: "admin"
        admin_password: "admin"

  object_storage:
    provider: minio
    bucket: "app"
    dev_defaults:
      root_user: "admin"
      root_password: "admin"

  ui:
    required_routes:
      examples: true
      dashboard: true
      tasks: true
      authentication: true

    web_runtime:
      next_router: app
      hydration_policy: strict
      shadcn_client_only: true
      client_boundaries:
        client_suffix: ".client.tsx"
        server_suffix: ".server.tsx"

  governance:
    enforce_oss_first: true
    enforce_compose_first: true
    enforce_k8s_ready: true
    enforce_hydration_safe_ui: true
    enforce_no_env_hardcoding: true
````

FILE: project.memory.md

```md
# Project Memory (Cognition)

## Intent
- Spec-driven development using inputs.yml as the single source of truth
- OSS-first, secure-by-default, performance-seeking
- Docker Compose first (dev/staging/prod profiles), Kubernetes-ready artifacts scaffolded
- TypeScript end-to-end monorepo
- Web: Next.js App Router with strict hydration-safe client boundaries
- API: NestJS
- Auth: Keycloak (OIDC)
- Object storage: MinIO (S3-compatible)
- Data: Postgres + Redis

## Non-negotiables
- No environment-specific hardcoding (URLs, domains, credentials, tenant IDs)
- Server/Client boundaries must be strict in Next.js:
  - app/layout.tsx and app/**/page.tsx are server-only by default
  - interactive UI lives only in *.client.tsx and starts with 'use client'
  - shadcn/ui imports are client-only
- Compose-first: staging must not require Kubernetes
- K8s-ready: manifests exist but are not used for staging

## Known pitfalls
- Dead UI (menus/buttons do nothing) happens when:
  - 'use client' is missing
  - shadcn/ui is imported into server components
  - hooks/event handlers exist in server components
```

FILE: .env.dev

```env
ENV=dev

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_dev

KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=admin
MINIO_BUCKET=app
```

FILE: .env.staging

```env
ENV=staging

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_staging

KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=admin
MINIO_BUCKET=app
```

FILE: .env.prod

```env
ENV=prod

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_prod

KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=admin
MINIO_BUCKET=app
```

FILE: compose.yml

```yaml
name: spec-driven-app

services:
  dev:
    profiles: ["dev"]
    build:
      context: .
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - .:/workspaces/repo:cached
    working_dir: /workspaces/repo
    command: sleep infinity
    ports:
      - "3000:3000"
      - "3001:3001"
    env_file:
      - .env.dev
      - .env.generated.dev
    depends_on:
      - postgres-dev
      - redis-dev
      - keycloak-dev
      - minio-dev
      - minio-mc-dev

  postgres-dev:
    profiles: ["dev"]
    image: postgres:16
    env_file: .env.dev
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - pgdata-dev:/var/lib/postgresql/data

  redis-dev:
    profiles: ["dev"]
    image: redis:7
    ports:
      - "6379:6379"

  keycloak-dev:
    profiles: ["dev"]
    image: quay.io/keycloak/keycloak:25.0
    env_file: .env.dev
    environment:
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
    command: ["start-dev", "--import-realm"]
    ports:
      - "8080:8080"
    volumes:
      - ./infra/keycloak/realm-app.json:/opt/keycloak/data/import/realm-app.json:ro

  minio-dev:
    profiles: ["dev"]
    image: minio/minio:RELEASE.2024-12-18T09-56-24Z
    env_file: .env.dev
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    command: ["server", "/data", "--console-address", ":9001"]
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio-dev:/data

  minio-mc-dev:
    profiles: ["dev"]
    image: minio/mc:RELEASE.2024-12-18T12-22-46Z
    env_file: .env.dev
    depends_on:
      - minio-dev
    entrypoint: ["/bin/sh", "-c"]
    command: ["./infra/minio/init.sh"]
    volumes:
      - ./infra/minio/init.sh:/infra/minio/init.sh:ro

  postgres-staging:
    profiles: ["staging"]
    image: postgres:16
    env_file: .env.staging
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata-staging:/var/lib/postgresql/data

  redis-staging:
    profiles: ["staging"]
    image: redis:7

  keycloak-staging:
    profiles: ["staging"]
    image: quay.io/keycloak/keycloak:25.0
    env_file: .env.staging
    environment:
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
    command: ["start-dev", "--import-realm"]
    volumes:
      - ./infra/keycloak/realm-app.json:/opt/keycloak/data/import/realm-app.json:ro

  minio-staging:
    profiles: ["staging"]
    image: minio/minio:RELEASE.2024-12-18T09-56-24Z
    env_file: .env.staging
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    command: ["server", "/data", "--console-address", ":9001"]
    volumes:
      - minio-staging:/data

  minio-mc-staging:
    profiles: ["staging"]
    image: minio/mc:RELEASE.2024-12-18T12-22-46Z
    env_file: .env.staging
    depends_on:
      - minio-staging
    entrypoint: ["/bin/sh", "-c"]
    command: ["./infra/minio/init.sh"]
    volumes:
      - ./infra/minio/init.sh:/infra/minio/init.sh:ro

  postgres-prod:
    profiles: ["prod"]
    image: postgres:16
    env_file: .env.prod
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata-prod:/var/lib/postgresql/data

  redis-prod:
    profiles: ["prod"]
    image: redis:7

  keycloak-prod:
    profiles: ["prod"]
    image: quay.io/keycloak/keycloak:25.0
    env_file: .env.prod
    environment:
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
    command: ["start-dev", "--import-realm"]
    volumes:
      - ./infra/keycloak/realm-app.json:/opt/keycloak/data/import/realm-app.json:ro

  minio-prod:
    profiles: ["prod"]
    image: minio/minio:RELEASE.2024-12-18T09-56-24Z
    env_file: .env.prod
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    command: ["server", "/data", "--console-address", ":9001"]
    volumes:
      - minio-prod:/data

  minio-mc-prod:
    profiles: ["prod"]
    image: minio/mc:RELEASE.2024-12-18T12-22-46Z
    env_file: .env.prod
    depends_on:
      - minio-prod
    entrypoint: ["/bin/sh", "-c"]
    command: ["./infra/minio/init.sh"]
    volumes:
      - ./infra/minio/init.sh:/infra/minio/init.sh:ro

volumes:
  pgdata-dev:
  pgdata-staging:
  pgdata-prod:
  minio-dev:
  minio-staging:
  minio-prod:
```

FILE: infra/keycloak/realm-app.json

```json
{
  "realm": "app",
  "enabled": true,
  "displayName": "App Realm",
  "loginWithEmailAllowed": true,
  "duplicateEmailsAllowed": false,
  "users": [
    {
      "username": "admin",
      "enabled": true,
      "emailVerified": true,
      "credentials": [
        { "type": "password", "value": "admin", "temporary": false }
      ],
      "realmRoles": ["admin"]
    }
  ],
  "roles": {
    "realm": [
      { "name": "admin", "description": "Realm admin role for starter projects" },
      { "name": "user", "description": "Default user role" }
    ]
  },
  "clients": [
    {
      "clientId": "web",
      "name": "Web Client",
      "enabled": true,
      "publicClient": true,
      "standardFlowEnabled": true,
      "directAccessGrantsEnabled": true,
      "redirectUris": ["http://localhost:3000/*"],
      "webOrigins": ["http://localhost:3000"]
    }
  ]
}
```

FILE: infra/minio/init.sh

```sh
#!/bin/sh
set -e

if nc -z minio-dev 9000 2>/dev/null; then HOST=minio-dev; fi
if nc -z minio-staging 9000 2>/dev/null; then HOST=minio-staging; fi
if nc -z minio-prod 9000 2>/dev/null; then HOST=minio-prod; fi

: "${HOST:=minio-dev}"
: "${MINIO_BUCKET:=app}"

echo "Configuring MinIO host: $HOST"
mc alias set local "http://$HOST:9000" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

echo "Ensuring bucket exists: $MINIO_BUCKET"
mc mb -p "local/$MINIO_BUCKET" || true

echo "MinIO init done."
```

FILE: .devcontainer/Dockerfile

```dockerfile
FROM node:20-bookworm

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN apt-get update && apt-get install -y git bash curl ca-certificates netcat-traditional && rm -rf /var/lib/apt/lists/*
```

FILE: .devcontainer/devcontainer.json

```json
{
  "name": "Spec-Driven Monorepo (Compose)",
  "dockerComposeFile": ["../compose.yml"],
  "service": "dev",
  "workspaceFolder": "/workspaces/repo",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-azuretools.vscode-docker",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "postCreateCommand": "pnpm install && pnpm check:spec",
  "remoteUser": "node"
}
```

FILE: pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

FILE: turbo.json

```json
{
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"] },
    "lint": {},
    "lint:hydration": { "cache": false }
  }
}
```

FILE: tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true
  }
}
```

FILE: package.json

```json
{
  "name": "spec-driven-monorepo",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "turbo dev",
    "bootstrap:dev": "node tools/bootstrap-dev.mjs",
    "build": "turbo build",
    "lint": "turbo lint",
    "lint:hydration": "node tools/hydration-lint.mjs",
    "render:inputs": "node tools/render-inputs.mjs",
    "validate:inputs": "node tools/validate-inputs.mjs",
    "check:spec": "pnpm validate:inputs && pnpm render:inputs && node tools/sync-env.mjs",
    "lint:all": "pnpm check:spec && pnpm lint && pnpm lint:hydration",
    "down:dev": "docker compose --profile dev down",
    "reset:dev": "node tools/reset-dev.mjs",
    "down:dev": "node tools/down-profile.mjs dev",
    "down:staging": "node tools/down-profile.mjs staging",
    "down:prod": "node tools/down-profile.mjs prod",
    "down:all": "node tools/down-profile.mjs all",

    "reset:dev": "node tools/reset-profile.mjs dev",
    "reset:staging": "node tools/reset-profile.mjs staging",
    "reset:prod": "node tools/reset-profile.mjs prod",
    "reset:all": "node tools/reset-profile.mjs all",
    "bootstrap:dev": "node tools/bootstrap-profile.mjs dev",
    "bootstrap:staging": "node tools/bootstrap-profile.mjs staging",
    "bootstrap:prod": "node tools/bootstrap-profile.mjs prod",
    "check:spec:dev": "pnpm validate:inputs && pnpm render:inputs && node tools/sync-env.mjs dev",
    "check:spec:staging": "pnpm validate:inputs && pnpm render:inputs && node tools/sync-env.mjs staging",
    "check:spec:prod": "pnpm validate:inputs && pnpm render:inputs && node tools/sync-env.mjs prod",
    "check:spec": "pnpm check:spec:dev"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.5.0",
    "ajv": "^8.17.1",
    "js-yaml": "^4.1.0"
  }
}
```

FILE: tools/hydration-lint.mjs

```js
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const CANDIDATE_ROOTS = [
  path.join(ROOT, "apps", "web", "app"),
  path.join(ROOT, "apps", "web", "src", "app")
];

const HOOK_RE = /\buse(State|Effect|Reducer|Ref|Context|Memo|Callback|Transition|DeferredValue|SyncExternalStore)\b/;
const EVENT_HANDLER_RE = /\bon(Click|Submit|Change|KeyDown|KeyUp|Input|Blur|Focus|PointerDown|PointerUp|MouseDown|MouseUp)\s*=/;
const SHADCN_IMPORT_RE = /from\s+["']@\/components\/ui\/[^"']+["']/;
const USE_CLIENT_RE = /^\s*['"]use client['"]\s*;?/m;

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }
function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && (full.endsWith(".ts") || full.endsWith(".tsx"))) out.push(full);
  }
  return out;
}
function rel(p) { return path.relative(ROOT, p).replaceAll(path.sep, "/"); }
function isLayoutOrPage(file) {
  const r = rel(file);
  return r.endsWith("app/layout.tsx") || r.endsWith("/page.tsx");
}
function isClientFileName(file) {
  const r = rel(file);
  return r.endsWith(".client.tsx") || r.endsWith(".client.ts");
}

const roots = CANDIDATE_ROOTS.filter(exists);
if (!roots.length) { console.log("hydration-lint: No apps/web/app found. Skipping."); process.exit(0); }

let violations = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    const hasUseClient = USE_CLIENT_RE.test(text);
    const hasHook = HOOK_RE.test(text);
    const hasEvent = EVENT_HANDLER_RE.test(text);
    const hasShadcn = SHADCN_IMPORT_RE.test(text);
    const interactive = hasHook || hasEvent || hasShadcn;

    if (interactive && !hasUseClient) {
      violations.push({
        type: "MISSING_USE_CLIENT",
        file,
        details: [hasHook && "hooks", hasEvent && "event handlers", hasShadcn && "shadcn imports"]
          .filter(Boolean).join(", ")
      });
    }
    if (isLayoutOrPage(file) && interactive) {
      violations.push({
        type: "SERVER_FILE_INTERACTIVE",
        file,
        details: "layout/page must be server-only; move interactivity into *.client.tsx islands"
      });
    }
    if (hasShadcn && !isClientFileName(file)) {
      violations.push({
        type: "SHADCN_NOT_IN_CLIENT_FILE",
        file,
        details: "shadcn/ui imports must live in *.client.tsx"
      });
    }
  }
}

if (violations.length) {
  console.error("\n❌ Hydration lint failed (prevents dead UI):\n");
  for (const v of violations) {
    console.error(`- [${v.type}] ${rel(v.file)}\n    ${v.details}\n`);
  }
  process.exit(1);
}

console.log("✅ hydration-lint: OK (no dead-UI risks detected).");
```

FILE: infra/k8s/README.md

```md
Kubernetes-ready artifacts live here.

Policy:
- Staging uses Docker Compose (not Kubernetes)
- K8s manifests are scaffolded for future migration

When ready:
- replace placeholders with Helm/customize overlays
- add secrets management (External Secrets / SOPS / Vault)
```

FILE: infra/k8s/placeholders/customization.yaml

```yaml
apiVersion: customize.config.k8s.io/v1beta1
kind: customization
resources: []
```

FILE: apps/web/package.json

```json
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.14",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.14",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

FILE: apps/web/next.config.mjs

```js
const nextConfig = { reactStrictMode: true };
export default nextConfig;
```

FILE: apps/web/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "baseUrl": "."
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

FILE: apps/web/styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

FILE: apps/web/app/layout.tsx

```tsx
import "../styles/globals.css";
import { AppShell } from "../components/shell/AppShell.server";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

FILE: apps/web/components/shell/AppShell.server.tsx

```tsx
import { SidebarClient } from "../nav/Sidebar.client";
import { TopbarClient } from "../nav/Topbar.client";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r">
        <SidebarClient />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center px-4">
          <TopbarClient />
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
```

FILE: apps/web/components/nav/Sidebar.client.tsx

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/examples", label: "Examples" }
];

export function SidebarClient() {
  const pathname = usePathname();

  return (
    <nav className="p-3 space-y-2">
      <div className="px-2 py-2 font-semibold">Spec App</div>
      {NAV.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={`block rounded px-2 py-2 hover:bg-gray-100 ${
            pathname === i.href ? "font-semibold" : ""
          }`}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
```

FILE: apps/web/components/nav/Topbar.client.tsx

```tsx
"use client";

import { useState } from "react";

export function TopbarClient() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-between">
      <div className="text-sm opacity-70">Hydration-safe baseline</div>
      <button className="border rounded px-3 py-1" onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Open"}
      </button>
    </div>
  );
}
```

FILE: apps/web/components/tasks/Tasks.client.tsx

```tsx
"use client";

import { useState } from "react";

type Task = { id: string; title: string };

export function TasksClient() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function add() {
    if (!title.trim()) return;
    setTasks((t) => [{ id: crypto.randomUUID(), title: title.trim() }, ...t]);
    setTitle("");
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button className="border rounded px-3 py-1" onClick={add}>Add</button>
      </div>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="border rounded p-2">{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

FILE: apps/web/app/dashboard/page.tsx

```tsx
export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="opacity-70">If sidebar links and the topbar button work, hydration is healthy.</p>
    </div>
  );
}
```

FILE: apps/web/app/tasks/page.tsx

```tsx
import { TasksClient } from "../../components/tasks/Tasks.client";

export default function TasksPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Tasks</h1>
      <TasksClient />
    </div>
  );
}
```

FILE: apps/web/app/examples/page.tsx

```tsx
export default function ExamplesPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Examples</h1>
      <p className="opacity-70">This page exists as a reference scaffold for future UI patterns.</p>
    </div>
  );
}
```

FILE: apps/api/package.json

```json
{
  "name": "api",
  "private": true,
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node dist/main.js",
    "dev": "tsx watch src/main.ts"
    "lint": "node -e \"console.log('lint placeholder')\""
  },
  "dependencies": {
    "@nestjs/common": "^10.4.0",
    "@nestjs/core": "^10.4.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

FILE: apps/api/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "include": ["src/**/*.ts"]
}
```

FILE: apps/api/src/main.ts

```ts
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3001);

  // Dev-only startup logs
  if (process.env.ENV === "dev") {
    console.log("API_URL:", process.env.API_URL);
    console.log("OIDC_ISSUER:", process.env.OIDC_ISSUER);
  }

  await app.listen(3001);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
```

FILE: apps/api/src/app.module.ts

```ts
import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController]
})
export class AppModule {}
```

FILE: apps/api/src/health.controller.ts

```ts
import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get("health")
  health() {
    return { ok: true };
  }
}
```

FILE: packages/shared/package.json

```json
{
  "name": "@shared",
  "private": true,
  "type": "module",
  "main": "src/index.ts"
}
```

FILE: packages/shared/src/index.ts

```ts
export type Id = string;
```

FILE: .github/workflows/ci.yml

```yaml
name: CI
on:
  pull_request:
  push:
    branches: ["main"]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: corepack enable
      - run: corepack prepare pnpm@9.12.0 --activate
      - run: pnpm install --frozen-lockfile
      - run: pnpm validate:inputs
      - run: pnpm render:inputs
      - run: pnpm lint:hydration
```

FILE: README.md

````md
# Spec-Driven Monorepo Starter

This repo is a reusable, governed foundation for spec-driven development.

## Open in Devcontainer (VS Code)
1. Open the repo in VS Code
2. Command Palette → **Dev Containers: Reopen in Container**
3. Dependencies install automatically (`pnpm install`)

## Start Dev Infra (Docker Compose dev profile)
Inside the devcontainer terminal:

```bash
pnpm install
pnpm check:spec
docker compose --profile dev up -d
pnpm -C apps/web dev
pnpm -C apps/api build && pnpm -C apps/api start
````

## Run Checks

```bash
pnpm lint:hydration
```

## Run Web + API

Web:

```bash
pnpm -C apps/web dev
```

API:

```bash
pnpm -C apps/api build
pnpm -C apps/api start
```

## URLs (Dev)

* Web: [http://localhost:3000](http://localhost:3000)
* API: [http://localhost:3001/health](http://localhost:3001/health)
* Keycloak: [http://localhost:8080](http://localhost:8080) (admin/admin)
* MinIO: [http://localhost:9000](http://localhost:9000) (admin/admin)
* MinIO Console: [http://localhost:9001](http://localhost:9001)

## Staging / Prod Profiles (Compose)

```bash
docker compose --profile staging up -d
docker compose --profile prod up -d
```

Each profile uses isolated volumes and separate env files:

* `.env.dev`, `.env.staging`, `.env.prod`

## Hydration Safety

`pnpm lint:hydration` prevents “dead UI” by enforcing strict Next.js Server/Client boundaries.

```

FINAL STEP (MANDATORY)
After writing all files, provide a final section:
"RUN THESE COMMANDS"
with exact commands to:
1) pnpm install
2) docker compose --profile dev up -d
3) pnpm lint:hydration
4) pnpm -C apps/web dev
5) pnpm -C apps/api build && pnpm -C apps/api start
```

Use that single prompt once, and Copilot should output the entire repo in one go (tree + all file contents + commands).
