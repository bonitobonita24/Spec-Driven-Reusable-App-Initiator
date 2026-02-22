import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const root = process.cwd();
const inputsPath = path.join(root, "inputs.yml");

function fail(msg) {
  console.error(`\n❌ render:inputs failed:\n${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(inputsPath)) fail(`Missing ${inputsPath}`);

let doc;
try {
  doc = yaml.load(fs.readFileSync(inputsPath, "utf8"));
} catch (e) {
  fail(`YAML parse error: ${e.message}`);
}

const inputs = doc?.inputs;
if (!inputs) fail("inputs.yml missing top-level 'inputs'.");

const domains = inputs.domains;
if (!domains) fail("inputs.yml missing inputs.domains.");

const envUrls = inputs.env_urls;
if (!envUrls) fail("inputs.yml missing inputs.env_urls.");

function getByPath(obj, p) {
  const parts = p.split(".").filter(Boolean);
  let cur = obj;
  for (const part of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, part)) cur = cur[part];
    else return undefined;
  }
  return cur;
}

function resolveTemplate(str, context) {
  if (typeof str !== "string") return str;
  return str.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    const val = getByPath(context, expr.trim());
    if (val === undefined) throw new Error(`Unresolved template: \${${expr}}`);
    return String(val);
  });
}

const ctx = { domains };

function resolveEnvBlock(block) {
  const out = {};
  for (const [k, v] of Object.entries(block)) {
    out[k] = resolveTemplate(v, ctx);
  }
  return out;
}

let resolved;
try {
  resolved = {
    development: resolveEnvBlock(envUrls.development),
    staging: resolveEnvBlock(envUrls.staging),
    production: resolveEnvBlock(envUrls.production)
  };
} catch (e) {
  fail(e.message);
}

function toEnvFile(vars) {
  const lines = [
    // Generic (server-side, backend, tooling)
    `WEB_URL=${vars.web}`,
    `API_URL=${vars.api}`,
    `REALTIME_URL=${vars.realtime}`,
    `OIDC_ISSUER=${vars.oidc_issuer}`,
    `OBJECT_STORAGE_ENDPOINT=${vars.object_storage_endpoint}`,

    // Next.js (client-safe)
    `NEXT_PUBLIC_WEB_URL=${vars.web}`,
    `NEXT_PUBLIC_API_URL=${vars.api}`,
    `NEXT_PUBLIC_REALTIME_URL=${vars.realtime}`,
    `NEXT_PUBLIC_OIDC_ISSUER=${vars.oidc_issuer}`,
    `NEXT_PUBLIC_OBJECT_STORAGE_ENDPOINT=${vars.object_storage_endpoint}`
  ];
  return lines.join("\n") + "\n";
}

const outDev = path.join(root, ".env.generated.dev");
const outStaging = path.join(root, ".env.generated.staging");
const outProd = path.join(root, ".env.generated.prod");

fs.writeFileSync(outDev, toEnvFile(resolved.development), "utf8");
fs.writeFileSync(outStaging, toEnvFile(resolved.staging), "utf8");
fs.writeFileSync(outProd, toEnvFile(resolved.production), "utf8");

// Still print a helpful JSON to stdout for visibility
console.log(
  JSON.stringify(
    {
      wrote: [".env.generated.dev", ".env.generated.staging", ".env.generated.prod"],
      env_urls_resolved: resolved
    },
    null,
    2
  )
);