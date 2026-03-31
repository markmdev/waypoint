import * as TOML from "@iarna/toml";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import type { WaypointConfig } from "./types.js";

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

export function defaultWaypointConfig(options: {
  profile: "universal" | "app-friendly";
}): WaypointConfig {
  return {
    version: 1,
    profile: options.profile,
    coding_agent: "codex",
    workspace_file: ".waypoint/WORKSPACE.md",
    docs_dirs: [".waypoint/docs"],
    docs_index_file: ".waypoint/DOCS_INDEX.md",
  };
}

export function renderWaypointConfig(config: WaypointConfig): string {
  const renderedConfig: WaypointConfig = {
    version: config.version,
    profile: config.profile,
    coding_agent: config.coding_agent,
    workspace_file: config.workspace_file,
    docs_dirs: config.docs_dirs,
    docs_index_file: config.docs_index_file,
  };

  return TOML.stringify(renderedConfig as unknown as TOML.JsonMap);
}
