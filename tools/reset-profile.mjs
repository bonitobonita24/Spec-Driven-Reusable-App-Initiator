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

if (!profile) fail("Missing profile argument. Usage: node tools/reset-profile.mjs dev|staging|prod|all");

try {
  if (profile === "all") {
    // Bring down all profiles one by one and remove volumes each time.
    // This is explicit and avoids surprises.
    run("docker compose --profile dev down -v --remove-orphans || true");
    run("docker compose --profile staging down -v --remove-orphans || true");
    run("docker compose --profile prod down -v --remove-orphans || true");
    console.log("\n✅ Reset complete for: dev + staging + prod (volumes removed).");
  } else if (["dev", "staging", "prod"].includes(profile)) {
    run(`docker compose --profile ${profile} down -v --remove-orphans || true`);
    console.log(`\n✅ Reset complete for: ${profile} (volumes removed).`);
  } else {
    fail(`Unknown profile '${profile}'. Use dev|staging|prod|all`);
  }

  console.log("\nNext:");
  console.log("  - pnpm check:spec");
  console.log("  - docker compose --profile dev up -d   (or staging/prod)");
} catch (e) {
  console.error("\n❌ Reset failed. Fix the error above and re-run.");
  process.exit(1);
}