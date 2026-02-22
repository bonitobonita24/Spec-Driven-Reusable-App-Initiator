import { execSync } from "node:child_process";

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  run("pnpm install");
  run("pnpm check:spec");
  run("docker compose --profile dev up -d");
  run("pnpm lint:hydration");

  console.log("\n✅ Dev bootstrap complete.");
  console.log("Next steps:");
  console.log("  - Web: pnpm -C apps/web dev");
  console.log("  - API: pnpm -C apps/api build && pnpm -C apps/api start");
} catch (e) {
  console.error("\n❌ Dev bootstrap failed. Fix the error above and re-run:");
  console.error("  pnpm bootstrap:dev\n");
  process.exit(1);
}