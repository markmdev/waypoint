#!/usr/bin/env node

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

import { doctorRepository, initRepository, loadWaypointConfig, syncRepository } from "./core.js";
import type { Finding } from "./types.js";
import { maybeUpgradeWaypointBeforeInit, upgradeWaypoint } from "./upgrade.js";

const VERSION = JSON.parse(
  readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../package.json"), "utf8")
).version as string;

function resolveRepo(input?: string): string {
  return path.resolve(input ?? ".");
}

function printFindings(findings: Finding[]): void {
  if (findings.length === 0) {
    console.log("Waypoint doctor: no findings.");
    return;
  }

  for (const finding of findings) {
    console.log(`[${finding.severity.toUpperCase()}] ${finding.category}: ${finding.message}`);
    console.log(`  Fix: ${finding.remediation}`);
    for (const filePath of finding.paths ?? []) {
      console.log(`  Path: ${filePath}`);
    }
  }
}

function printHelp(): void {
  console.log(`usage: waypoint [--version] <command> [options]

Commands:
  init                Initialize a repository with Waypoint scaffolding (auto-updates CLI unless skipped)
  doctor              Validate repository health and report drift
  sync                Rebuild docs and tracker indexes
  upgrade             Update the global Waypoint CLI and refresh this repo using existing config
`);
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
    printHelp();
    return 0;
  }

  if (argv[0] === "--version") {
    console.log(VERSION);
    return 0;
  }

  const command = argv[0];

  if (command === "init") {
    const { values, positionals } = parseArgs({
      args: argv.slice(1),
      options: {
        "app-friendly": { type: "boolean", default: false },
        "skip-cli-update": { type: "boolean", default: false }
      },
      allowPositionals: true
    });
    const projectRoot = resolveRepo(positionals[0]);
    if (!values["skip-cli-update"]) {
      const status = maybeUpgradeWaypointBeforeInit({
        currentVersion: VERSION,
        cliEntry: process.argv[1] ? path.resolve(process.argv[1]) : fileURLToPath(import.meta.url),
        initArgs: argv.slice(1),
      });
      if (status !== null) {
        return status;
      }
    }
    const results = initRepository(projectRoot, {
      profile: values["app-friendly"] ? "app-friendly" : "universal",
    });
    for (const line of results) {
      console.log(`- ${line}`);
    }
    return 0;
  }

  if (command === "doctor") {
    const { values, positionals } = parseArgs({
      args: argv.slice(1),
      options: {
        json: { type: "boolean", default: false }
      },
      allowPositionals: true
    });
    const projectRoot = resolveRepo(positionals[0]);
    const findings = doctorRepository(projectRoot);
    if (values.json) {
      console.log(JSON.stringify({ findings }, null, 2));
    } else {
      printFindings(findings);
    }
    const severities = new Set(findings.map((finding) => finding.severity));
    if (severities.has("error")) {
      return 2;
    }
    if (severities.has("warn")) {
      return 1;
    }
    return 0;
  }

  if (command === "sync") {
    const { positionals } = parseArgs({
      args: argv.slice(1),
      allowPositionals: true
    });
    const projectRoot = resolveRepo(positionals[0]);
    const results = syncRepository(projectRoot);
    for (const line of results) {
      console.log(`- ${line}`);
    }
    return 0;
  }

  if (command === "upgrade") {
    const { values, positionals } = parseArgs({
      args: argv.slice(1),
      options: {
        "skip-repo-refresh": { type: "boolean", default: false }
      },
      allowPositionals: true
    });
    const projectRoot = resolveRepo(positionals[0]);
    const config = loadWaypointConfig(projectRoot);
    return upgradeWaypoint({
      projectRoot,
      config,
      cliEntry: process.argv[1] ? path.resolve(process.argv[1]) : fileURLToPath(import.meta.url),
      skipRepoRefresh: values["skip-repo-refresh"],
    });
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  return 2;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
