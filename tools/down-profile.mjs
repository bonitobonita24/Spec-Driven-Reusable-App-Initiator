import { execSync } from "node:child_process";

const profile = process.argv[2]; // dev | staging | prod | all

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
}

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

if (!profile) fail("Missing profile argument. Usage: node tools/down-profile.mjs dev|staging|prod|all");

try {
  if (profile === "all") {
    run("docker compose --profile dev down --remove-orphans || true");
    run("docker compose --profile staging down --remove-orphans || true");
    run("docker compose --profile prod down --remove-orphans || true");
    console.log("\n✅ Down complete for: dev + staging + prod");
  } else if (["dev", "staging", "prod"].includes(profile)) {
    run(`docker compose --profile ${profile} down --remove-orphans || true`);
    console.log(`\n✅ Down complete for: ${profile}`);
  } else {
    fail(`Unknown profile '${profile}'. Use dev|staging|prod|all`);
  }
} catch (e) {
  console.error("\n❌ Down failed. Fix the error above and re-run.");
  process.exit(1);
}