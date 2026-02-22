import { execSync } from "node:child_process";

const profile = process.argv[2];

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
}

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

if (!profile) fail("Missing profile argument. Usage: node tools/bootstrap-profile.mjs dev|staging|prod");
if (!["dev", "staging", "prod"].includes(profile)) fail(`Invalid profile: ${profile}`);

try {
  run("pnpm install");
  run(`pnpm check:spec:${profile}`);
  // run(`pnpm check:spec:${profile === "prod" ? "prod" : profile}`);

  run(`docker compose --profile ${profile} up -d`);

  // Hydration lint is always relevant because web UI must remain hydration-safe
  run("pnpm lint:hydration");

  console.log(`\n✅ Bootstrap complete for: ${profile}`);
  console.log("Next steps:");
  console.log("  - Run apps:");
  console.log("      pnpm dev:all");
  console.log("  - Or individually:");
  console.log("      pnpm dev:web");
  console.log("      pnpm dev:api");
} catch (e) {
  console.error(`\n❌ Bootstrap failed for ${profile}. Fix the error above and re-run:\n  pnpm bootstrap:${profile}\n`);
  process.exit(1);
}