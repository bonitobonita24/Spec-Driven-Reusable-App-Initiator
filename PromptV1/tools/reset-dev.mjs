import { execSync } from "node:child_process";

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  // Stop dev profile services
  run("docker compose --profile dev down");

  // Remove volumes used by dev profile (wipes Postgres + MinIO data)
  run("docker volume rm spec-driven-app_pgdata-dev spec-driven-app_minio-dev || true");

  console.log("\n✅ Dev reset complete (Postgres + MinIO wiped).");
  console.log("Next:");
  console.log("  - pnpm bootstrap:dev");
} catch (e) {
  console.error("\n❌ Dev reset failed. Fix the error above and re-run:");
  console.error("  pnpm reset:dev\n");
  process.exit(1);
}