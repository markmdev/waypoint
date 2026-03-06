import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findTemplatesRoot(): string {
  const candidates = [
    path.resolve(__dirname, "../templates"),
    path.resolve(__dirname, "../../templates"),
  ];

  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, "managed-agents-block.md"))) {
      return candidate;
    }
  }

  throw new Error("Could not locate Waypoint templates directory.");
}

const templatesRoot = findTemplatesRoot();

export const MANAGED_BLOCK_START = "<!-- waypoint:start -->";
export const MANAGED_BLOCK_END = "<!-- waypoint:end -->";

export function templatePath(relativePath: string): string {
  return path.join(templatesRoot, relativePath);
}

export function readTemplate(relativePath: string): string {
  return readFileSync(templatePath(relativePath), "utf8");
}

export function renderWaypointConfig(options: {
  profile: "universal" | "app-friendly";
  roles: boolean;
  rules: boolean;
  automations: boolean;
}): string {
  return readTemplate(".waypoint/config.toml")
    .replace("__PROFILE__", options.profile)
    .replace("__ROLES__", String(options.roles))
    .replace("__RULES__", String(options.rules))
    .replace("__AUTOMATIONS__", String(options.automations));
}
