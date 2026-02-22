import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import Ajv from "ajv";

const root = process.cwd();
const inputsPath = path.join(root, "inputs.yml");
const schemaPath = path.join(root, "inputs.schema.json");

function fail(msg) {
  console.error(`\n❌ inputs.yml validation failed:\n${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(inputsPath)) fail(`Missing ${inputsPath}`);
if (!fs.existsSync(schemaPath)) fail(`Missing ${schemaPath}`);

let inputsObj;
try {
  inputsObj = yaml.load(fs.readFileSync(inputsPath, "utf8"));
} catch (e) {
  fail(`YAML parse error: ${e.message}`);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

const ok = validate(inputsObj);
if (!ok) {
  const errors = (validate.errors || [])
    .map((e) => `- ${e.instancePath || "/"}: ${e.message}`)
    .join("\n");
  fail(errors);
}

console.log("✅ inputs.yml is valid against inputs.schema.json");