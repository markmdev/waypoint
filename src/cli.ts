#!/usr/bin/env node

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

import { doctorRepository, importLegacyRepo, initRepository, syncRepository } from "./core.js";
import type { Finding } from "./types.js";

const VERSION = JSON.parse(
  readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf8")
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
  init                Initialize a repository with Waypoint scaffolding
  doctor              Validate repository health and report drift
  sync                Rebuild docs index and sync optional user-home artifacts
  import-legacy       Analyze a legacy repository layout and produce a Waypoint adoption report
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
        "with-roles": { type: "boolean", default: false },
        "with-rules": { type: "boolean", default: false },
        "with-automations": { type: "boolean", default: false }
      },
      allowPositionals: true
    });
    const projectRoot = resolveRepo(positionals[0]);
    const results = initRepository(projectRoot, {
      profile: values["app-friendly"] ? "app-friendly" : "universal",
      withRoles: values["with-roles"],
      withRules: values["with-rules"],
      withAutomations: values["with-automations"]
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

  if (command === "import-legacy") {
    const { values, positionals } = parseArgs({
      args: argv.slice(1),
      options: {
        "init-target": { type: "boolean", default: false }
      },
      allowPositionals: true
    });
    if (positionals.length === 0) {
      console.error("import-legacy requires a source repository path.");
      return 2;
    }
    const sourceRepo = resolveRepo(positionals[0]);
    const targetRepo = positionals[1] ? resolveRepo(positionals[1]) : undefined;
    const result = importLegacyRepo(sourceRepo, targetRepo, {
      initTarget: values["init-target"]
    });
    for (const line of result.actions) {
      console.log(`- ${line}`);
    }
    if (!targetRepo) {
      console.log(result.report);
    }
    return 0;
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
