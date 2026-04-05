import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

import type { WaypointConfig } from "./types.js";

export function npmBinaryForPlatform(platform: NodeJS.Platform = process.platform): string {
  return platform === "win32" ? "npm.cmd" : "npm";
}

export function waypointBinaryForPlatform(platform: NodeJS.Platform = process.platform): string {
  return platform === "win32" ? "waypoint.cmd" : "waypoint";
}

export function buildInitArgs(projectRoot: string, config: WaypointConfig): string[] {
  const args = ["init", projectRoot];

  if (config.profile === "app-friendly") {
    args.push("--app-friendly");
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

function spawnNpmPipe(
  npmBinary: string,
  args: string[],
): { status: number; stdout: string; stderr: string } {
  const result = spawnSync(npmBinary, args, {
    stdio: "pipe",
    encoding: "utf8",
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function writePipedOutput(
  result: { stdout: string; stderr: string },
  stdio: "inherit" | "pipe",
): void {
  if (stdio !== "inherit") {
    return;
  }

  if (result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }
}

function latestWaypointVersion(options: { npmBinary?: string }): string | null {
  const npmBinary = options.npmBinary ?? process.env.WAYPOINT_NPM_COMMAND ?? npmBinaryForPlatform();
  const latest = spawnNpmPipe(npmBinary, ["view", "waypoint-codex", "version"]);
  if (latest.status !== 0) {
    return null;
  }

  const version = latest.stdout.trim();
  return version ? version : null;
}

function latestWaypointTarballUrl(options: { npmBinary: string; version: string }): string | null {
  const tarball = spawnNpmPipe(options.npmBinary, ["view", `waypoint-codex@${options.version}`, "dist.tarball"]);
  if (tarball.status !== 0) {
    return null;
  }

  const tarballUrl = tarball.stdout.trim();
  return tarballUrl.length > 0 ? tarballUrl : null;
}

function appendCacheBust(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("waypointCacheBust", `${Date.now()}`);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}waypointCacheBust=${Date.now()}`;
  }
}

function isTransientTarball404(result: { stdout: string; stderr: string }): boolean {
  const combined = `${result.stdout}\n${result.stderr}`;
  return /E404/.test(combined) && /waypoint-codex-.*\.tgz/i.test(combined);
}

function installLatestWaypointCli(options: {
  npmBinary: string;
  stdio: "inherit" | "pipe";
  knownLatestVersion?: string;
}): number {
  const primary = spawnNpmPipe(options.npmBinary, ["install", "-g", "waypoint-codex@latest"]);
  if (primary.status === 0) {
    writePipedOutput(primary, options.stdio);
    return 0;
  }

  if (!isTransientTarball404(primary)) {
    writePipedOutput(primary, options.stdio);
    return primary.status;
  }

  const latestVersion = options.knownLatestVersion ?? latestWaypointVersion({ npmBinary: options.npmBinary });
  if (!latestVersion) {
    writePipedOutput(primary, options.stdio);
    return primary.status;
  }

  const tarballUrl = latestWaypointTarballUrl({
    npmBinary: options.npmBinary,
    version: latestVersion,
  });
  if (!tarballUrl) {
    writePipedOutput(primary, options.stdio);
    return primary.status;
  }

  if (options.stdio === "inherit") {
    console.log(
      `Waypoint npm install hit a transient tarball 404 for ${latestVersion}. Retrying with cache-busted URL...`
    );
  }

  const fallback = spawnNpmPipe(options.npmBinary, ["install", "-g", appendCacheBust(tarballUrl)]);
  writePipedOutput(fallback, options.stdio);
  return fallback.status;
}

function hasWaypointConfig(projectRoot: string): boolean {
  return existsSync(path.join(projectRoot, ".waypoint/config.toml"));
}

export function upgradeWaypoint(options: {
  projectRoot: string;
  config: WaypointConfig;
  cliEntry?: string;
  nodeBinary?: string;
  npmBinary?: string;
  waypointBinary?: string;
  stdio?: "inherit" | "pipe";
  skipRepoRefresh?: boolean;
}): number {
  const npmBinary = options.npmBinary ?? process.env.WAYPOINT_NPM_COMMAND ?? npmBinaryForPlatform();
  const waypointBinary =
    options.waypointBinary ?? process.env.WAYPOINT_COMMAND ?? waypointBinaryForPlatform();
  const stdio = options.stdio ?? "inherit";

  const updateStatus = installLatestWaypointCli({
    npmBinary,
    stdio,
  });
  if (updateStatus !== 0) {
    return updateStatus;
  }

  if (options.skipRepoRefresh) {
    console.log("Waypoint CLI updated. Skipped repo refresh.");
    return 0;
  }

  if (!hasWaypointConfig(options.projectRoot)) {
    console.log("Waypoint CLI updated. No repo-local Waypoint config found, so repo refresh was skipped.");
    return 0;
  }

  const init = spawnSync(waypointBinary, buildInitArgs(options.projectRoot, options.config), {
    stdio,
  });
  if ((init.status ?? 1) !== 0) {
    return init.status ?? 1;
  }

  const doctor = spawnSync(waypointBinary, ["doctor", options.projectRoot], {
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

  const updateStatus = installLatestWaypointCli({
    npmBinary,
    stdio,
    knownLatestVersion: latestVersion,
  });
  if (updateStatus !== 0) {
    return updateStatus;
  }

  const reexecArgs = options.initArgs.includes("--skip-cli-update")
    ? options.initArgs
    : [...options.initArgs, "--skip-cli-update"];
  const init = spawnSync(nodeBinary, [options.cliEntry, "init", ...reexecArgs], {
    stdio,
  });
  return init.status ?? 1;
}
