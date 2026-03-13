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

function parseVersion(version: string): { core: number[]; prerelease: string[] } | null {
  const trimmed = version.trim().replace(/^v/, "");
  const match = trimmed.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) {
    return null;
  }

  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] ? match[4].split(".") : [],
  };
}

function compareIdentifiers(left: string, right: string): number {
  const leftNumeric = /^\d+$/.test(left);
  const rightNumeric = /^\d+$/.test(right);

  if (leftNumeric && rightNumeric) {
    return Number(left) - Number(right);
  }
  if (leftNumeric) {
    return -1;
  }
  if (rightNumeric) {
    return 1;
  }
  return left.localeCompare(right);
}

export function compareVersions(left: string, right: string): number {
  const leftParsed = parseVersion(left);
  const rightParsed = parseVersion(right);
  if (!leftParsed || !rightParsed) {
    return left.localeCompare(right);
  }

  for (let index = 0; index < leftParsed.core.length; index += 1) {
    const difference = leftParsed.core[index] - rightParsed.core[index];
    if (difference !== 0) {
      return difference;
    }
  }

  const leftPrerelease = leftParsed.prerelease;
  const rightPrerelease = rightParsed.prerelease;
  if (leftPrerelease.length === 0 && rightPrerelease.length === 0) {
    return 0;
  }
  if (leftPrerelease.length === 0) {
    return 1;
  }
  if (rightPrerelease.length === 0) {
    return -1;
  }

  const length = Math.max(leftPrerelease.length, rightPrerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftIdentifier = leftPrerelease[index];
    const rightIdentifier = rightPrerelease[index];
    if (leftIdentifier === undefined) {
      return -1;
    }
    if (rightIdentifier === undefined) {
      return 1;
    }

    const difference = compareIdentifiers(leftIdentifier, rightIdentifier);
    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
}

function latestWaypointVersion(options: { npmBinary?: string }): string | null {
  const npmBinary = options.npmBinary ?? process.env.WAYPOINT_NPM_COMMAND ?? npmBinaryForPlatform();
  const latest = spawnSync(npmBinary, ["view", "waypoint-codex", "version"], {
    stdio: "pipe",
    encoding: "utf8",
  });
  if ((latest.status ?? 1) !== 0) {
    return null;
  }

  const version = latest.stdout?.trim();
  return version ? version : null;
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

export function maybeUpgradeWaypointBeforeInit(options: {
  currentVersion: string;
  cliEntry: string;
  initArgs: string[];
  nodeBinary?: string;
  npmBinary?: string;
  stdio?: "inherit" | "pipe";
}): number | null {
  const nodeBinary = options.nodeBinary ?? process.execPath;
  const npmBinary = options.npmBinary ?? process.env.WAYPOINT_NPM_COMMAND ?? npmBinaryForPlatform();
  const stdio = options.stdio ?? "inherit";
  const latestVersion = latestWaypointVersion({ npmBinary });

  if (!latestVersion || compareVersions(latestVersion, options.currentVersion) <= 0) {
    return null;
  }

  console.log(
    `Waypoint CLI ${options.currentVersion} is older than latest ${latestVersion}. Updating before init...`
  );

  const update = spawnSync(npmBinary, ["install", "-g", "waypoint-codex@latest"], {
    stdio,
  });
  if ((update.status ?? 1) !== 0) {
    return update.status ?? 1;
  }

  const reexecArgs = options.initArgs.includes("--skip-cli-update")
    ? options.initArgs
    : [...options.initArgs, "--skip-cli-update"];
  const init = spawnSync(nodeBinary, [options.cliEntry, "init", ...reexecArgs], {
    stdio,
  });
  return init.status ?? 1;
}
