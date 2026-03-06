import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

import type { WaypointConfig } from "./types.js";

export function npmBinaryForPlatform(platform: NodeJS.Platform = process.platform): string {
  return platform === "win32" ? "npm.cmd" : "npm";
}

export function buildInitArgs(projectRoot: string, config: WaypointConfig): string[] {
  const args = ["init", projectRoot];

  if (config.profile === "app-friendly") {
    args.push("--app-friendly");
  }

  const featureMap = config.features ?? {};
  if (featureMap.roles) {
    args.push("--with-roles");
  }
  if (featureMap.rules) {
    args.push("--with-rules");
  }
  if (featureMap.automations) {
    args.push("--with-automations");
  }

  return args;
}

function hasWaypointConfig(projectRoot: string): boolean {
  return existsSync(path.join(projectRoot, ".waypoint/config.toml"));
}

export function upgradeWaypoint(options: {
  projectRoot: string;
  config: WaypointConfig;
  cliEntry: string;
  nodeBinary?: string;
  npmBinary?: string;
  stdio?: "inherit" | "pipe";
  skipRepoRefresh?: boolean;
}): number {
  const nodeBinary = options.nodeBinary ?? process.execPath;
  const npmBinary = options.npmBinary ?? process.env.WAYPOINT_NPM_COMMAND ?? npmBinaryForPlatform();
  const stdio = options.stdio ?? "inherit";

  const update = spawnSync(npmBinary, ["install", "-g", "waypoint-codex@latest"], {
    stdio,
  });
  if ((update.status ?? 1) !== 0) {
    return update.status ?? 1;
  }

  if (options.skipRepoRefresh) {
    console.log("Waypoint CLI updated. Skipped repo refresh.");
    return 0;
  }

  if (!hasWaypointConfig(options.projectRoot)) {
    console.log("Waypoint CLI updated. No repo-local Waypoint config found, so repo refresh was skipped.");
    return 0;
  }

  const init = spawnSync(nodeBinary, [options.cliEntry, ...buildInitArgs(options.projectRoot, options.config)], {
    stdio,
  });
  if ((init.status ?? 1) !== 0) {
    return init.status ?? 1;
  }

  const doctor = spawnSync(nodeBinary, [options.cliEntry, "doctor", options.projectRoot], {
    stdio,
  });
  return doctor.status ?? 1;
}
