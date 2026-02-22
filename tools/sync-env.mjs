import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const webDir = path.join(root, "apps", "web");

const env = process.argv[2] || "dev"; // dev | staging | prod

const map = {
  dev: ".env.generated.dev",
  staging: ".env.generated.staging",
  prod: ".env.generated.prod"
};

if (!map[env]) {
  console.error("\n❌ Invalid env. Use: dev | staging | prod\n");
  process.exit(1);
}

const src = path.join(root, map[env]);
const dest = path.join(webDir, ".env.local");

if (!fs.existsSync(src)) {
  console.error(`\n❌ Missing ${map[env]} — run pnpm render:inputs first.\n`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);

console.log(`✅ Synced apps/web/.env.local from ${map[env]}`);