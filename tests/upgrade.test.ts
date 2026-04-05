import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chmodSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildInitArgs,
  compareVersions,
  maybeUpgradeWaypointBeforeInit,
  npmBinaryForPlatform,
  waypointBinaryForPlatform,
  upgradeWaypoint,
} from "../src/upgrade.js";

test("buildInitArgs preserves the app-friendly profile and ignores retired features", () => {
  const legacyConfig = {
    profile: "app-friendly",
    features: {
      // Old repos may still carry retired Codex integration flags.
      rules: true,
      automations: true,
    },
  } as unknown as Parameters<typeof buildInitArgs>[1];
  const args = buildInitArgs("/tmp/repo", legacyConfig);

  assert.deepEqual(args, ["init", "/tmp/repo", "--app-friendly"]);
});

test("npmBinaryForPlatform maps windows to npm.cmd", () => {
  assert.equal(npmBinaryForPlatform("win32"), "npm.cmd");
  assert.equal(npmBinaryForPlatform("darwin"), "npm");
});

test("waypointBinaryForPlatform maps windows to waypoint.cmd", () => {
  assert.equal(waypointBinaryForPlatform("win32"), "waypoint.cmd");
  assert.equal(waypointBinaryForPlatform("darwin"), "waypoint");
});

test("compareVersions handles release and prerelease ordering", () => {
  assert.equal(compareVersions("0.8.0", "0.8.0"), 0);
  assert.ok(compareVersions("0.8.1", "0.8.0") > 0);
  assert.ok(compareVersions("0.9.0", "0.8.9") > 0);
  assert.ok(compareVersions("0.8.0", "0.8.0-beta.1") > 0);
  assert.ok(compareVersions("0.8.0-beta.2", "0.8.0-beta.1") > 0);
});

test("init auto-updates and re-execs when a newer CLI is published", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-init-upgrade-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  const logFile = path.join(root, "calls.log");

  const fakeNpm = path.join(fakeBin, "fake-npm.js");
  writeFileSync(
    fakeNpm,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      "const args = process.argv.slice(2);",
      `appendFileSync(${JSON.stringify(logFile)}, 'npm ' + args.join(' ') + '\\n');`,
      "if (args[0] === 'view') {",
      "  process.stdout.write('0.8.1\\n');",
      "}",
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeNpm, 0o755);

  const fakeCli = path.join(fakeBin, "fake-cli.js");
  writeFileSync(
    fakeCli,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      `appendFileSync(${JSON.stringify(logFile)}, 'cli ' + process.argv.slice(2).join(' ') + '\\n');`,
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeCli, 0o755);

  const status = maybeUpgradeWaypointBeforeInit({
    currentVersion: "0.8.0",
    cliEntry: fakeCli,
    initArgs: [root],
    nodeBinary: process.execPath,
    npmBinary: fakeNpm,
    stdio: "pipe",
  });

  assert.equal(status, 0);
  const log = readFileSync(logFile, "utf8");
  assert.ok(log.includes("npm view waypoint-codex version"));
  assert.ok(log.includes("npm install -g waypoint-codex@latest"));
  assert.ok(log.includes(`cli init ${root} --skip-cli-update`));
});

test("init auto-update retries with cache-busted tarball URL after transient latest 404", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-init-upgrade-fallback-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  const logFile = path.join(root, "calls.log");
  const tarballBase = "https://registry.npmjs.org/waypoint-codex/-/waypoint-codex-1.0.17.tgz";

  const fakeNpm = path.join(fakeBin, "fake-npm.js");
  writeFileSync(
    fakeNpm,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      "const args = process.argv.slice(2);",
      "const command = args.join(' ');",
      `appendFileSync(${JSON.stringify(logFile)}, 'npm ' + command + '\\n');`,
      "if (args[0] === 'view' && args[1] === 'waypoint-codex' && args[2] === 'version') {",
      "  process.stdout.write('1.0.17\\n');",
      "  process.exit(0);",
      "}",
      "if (args[0] === 'view' && args[1] === 'waypoint-codex@1.0.17' && args[2] === 'dist.tarball') {",
      `  process.stdout.write(${JSON.stringify(tarballBase)} + '\\n');`,
      "  process.exit(0);",
      "}",
      "if (args[0] === 'install' && args[2] === 'waypoint-codex@latest') {",
      "  process.stderr.write('npm error code E404\\n');",
      `  process.stderr.write(${JSON.stringify(`npm error 404 Not Found - GET ${tarballBase} - Not found\\n`)});`,
      "  process.exit(1);",
      "}",
      "if (args[0] === 'install' && typeof args[2] === 'string' && args[2].startsWith(",
      `  ${JSON.stringify(`${tarballBase}?waypointCacheBust=`)}`,
      ")) {",
      "  process.exit(0);",
      "}",
      "process.exit(0);",
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeNpm, 0o755);

  const fakeCli = path.join(fakeBin, "fake-cli.js");
  writeFileSync(
    fakeCli,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      `appendFileSync(${JSON.stringify(logFile)}, 'cli ' + process.argv.slice(2).join(' ') + '\\n');`,
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeCli, 0o755);

  const status = maybeUpgradeWaypointBeforeInit({
    currentVersion: "1.0.16",
    cliEntry: fakeCli,
    initArgs: [root],
    nodeBinary: process.execPath,
    npmBinary: fakeNpm,
    stdio: "pipe",
  });

  assert.equal(status, 0);
  const log = readFileSync(logFile, "utf8");
  assert.ok(log.includes("npm install -g waypoint-codex@latest"));
  assert.ok(log.includes("npm view waypoint-codex@1.0.17 dist.tarball"));
  assert.ok(log.includes(`npm install -g ${tarballBase}?waypointCacheBust=`));
  assert.ok(log.includes(`cli init ${root} --skip-cli-update`));
});

test("init skips auto-update when current CLI is already latest", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-init-upgrade-none-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  const logFile = path.join(root, "calls.log");

  const fakeNpm = path.join(fakeBin, "fake-npm.js");
  writeFileSync(
    fakeNpm,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      "const args = process.argv.slice(2);",
      `appendFileSync(${JSON.stringify(logFile)}, 'npm ' + args.join(' ') + '\\n');`,
      "if (args[0] === 'view') {",
      "  process.stdout.write('0.8.0\\n');",
      "}",
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeNpm, 0o755);

  const status = maybeUpgradeWaypointBeforeInit({
    currentVersion: "0.8.0",
    cliEntry: path.join(fakeBin, "unused-cli.js"),
    initArgs: [root],
    nodeBinary: process.execPath,
    npmBinary: fakeNpm,
    stdio: "pipe",
  });

  assert.equal(status, null);
  const log = readFileSync(logFile, "utf8");
  assert.ok(log.includes("npm view waypoint-codex version"));
  assert.equal(log.includes("npm install -g waypoint-codex@latest"), false);
});

test("upgradeWaypoint updates cli then refreshes repo using existing config", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-upgrade-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  const logFile = path.join(root, "calls.log");

  mkdirSync(path.join(root, ".waypoint"), { recursive: true });
  writeFileSync(
    path.join(root, ".waypoint/config.toml"),
    "profile = \"app-friendly\"\n[features]\nrules = true\nautomations = true\n",
    "utf8"
  );

  const fakeNpm = path.join(fakeBin, "fake-npm.js");
  writeFileSync(
    fakeNpm,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      `appendFileSync(${JSON.stringify(logFile)}, 'npm ' + process.argv.slice(2).join(' ') + '\\n');`,
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeNpm, 0o755);

  const fakeCli = path.join(fakeBin, "fake-cli.js");
  writeFileSync(
    fakeCli,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      `appendFileSync(${JSON.stringify(logFile)}, 'cli ' + process.argv.slice(2).join(' ') + '\\n');`,
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeCli, 0o755);

  const status = upgradeWaypoint({
    projectRoot: root,
    config: {
      profile: "app-friendly",
      features: {
        rules: true,
        automations: true,
      },
    } as unknown as Parameters<typeof upgradeWaypoint>[0]["config"],
    waypointBinary: fakeCli,
    npmBinary: fakeNpm,
    stdio: "pipe",
  });

  assert.equal(status, 0);

  const log = readFileSync(logFile, "utf8");
  assert.ok(log.includes("npm install -g waypoint-codex@latest"));
  assert.ok(log.includes(`cli init ${root} --app-friendly`));
  assert.equal(log.includes("--with-rules"), false);
  assert.equal(log.includes("--with-automations"), false);
  assert.ok(log.includes(`cli doctor ${root}`));
});

test("upgradeWaypoint can skip repo refresh", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-upgrade-skip-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  const logFile = path.join(root, "calls.log");

  const fakeNpm = path.join(fakeBin, "fake-npm.js");
  writeFileSync(
    fakeNpm,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      `appendFileSync(${JSON.stringify(logFile)}, 'npm ' + process.argv.slice(2).join(' ') + '\\n');`,
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeNpm, 0o755);

  const status = upgradeWaypoint({
    projectRoot: root,
    config: {},
    cliEntry: path.join(fakeBin, "missing-cli.js"),
    nodeBinary: process.execPath,
    npmBinary: fakeNpm,
    stdio: "pipe",
    skipRepoRefresh: true,
  });

  assert.equal(status, 0);
  const log = readFileSync(logFile, "utf8");
  assert.ok(log.includes("npm install -g waypoint-codex@latest"));
});

test("upgradeWaypoint retries with cache-busted tarball URL after transient latest 404", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-upgrade-fallback-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  const logFile = path.join(root, "calls.log");
  const tarballBase = "https://registry.npmjs.org/waypoint-codex/-/waypoint-codex-1.0.17.tgz";

  const fakeNpm = path.join(fakeBin, "fake-npm.js");
  writeFileSync(
    fakeNpm,
    [
      "#!/usr/bin/env node",
      "import { appendFileSync } from 'node:fs';",
      "const args = process.argv.slice(2);",
      "const command = args.join(' ');",
      `appendFileSync(${JSON.stringify(logFile)}, 'npm ' + command + '\\n');`,
      "if (args[0] === 'view' && args[1] === 'waypoint-codex' && args[2] === 'version') {",
      "  process.stdout.write('1.0.17\\n');",
      "  process.exit(0);",
      "}",
      "if (args[0] === 'view' && args[1] === 'waypoint-codex@1.0.17' && args[2] === 'dist.tarball') {",
      `  process.stdout.write(${JSON.stringify(tarballBase)} + '\\n');`,
      "  process.exit(0);",
      "}",
      "if (args[0] === 'install' && args[2] === 'waypoint-codex@latest') {",
      "  process.stderr.write('npm error code E404\\n');",
      `  process.stderr.write(${JSON.stringify(`npm error 404 Not Found - GET ${tarballBase} - Not found\\n`)});`,
      "  process.exit(1);",
      "}",
      "if (args[0] === 'install' && typeof args[2] === 'string' && args[2].startsWith(",
      `  ${JSON.stringify(`${tarballBase}?waypointCacheBust=`)}`,
      ")) {",
      "  process.exit(0);",
      "}",
      "process.exit(0);",
    ].join("\n"),
    "utf8"
  );
  chmodSync(fakeNpm, 0o755);

  const status = upgradeWaypoint({
    projectRoot: root,
    config: {},
    cliEntry: path.join(fakeBin, "unused-cli.js"),
    nodeBinary: process.execPath,
    npmBinary: fakeNpm,
    stdio: "pipe",
    skipRepoRefresh: true,
  });

  assert.equal(status, 0);
  const log = readFileSync(logFile, "utf8");
  assert.ok(log.includes("npm install -g waypoint-codex@latest"));
  assert.ok(log.includes("npm view waypoint-codex version"));
  assert.ok(log.includes("npm view waypoint-codex@1.0.17 dist.tarball"));
  assert.ok(log.includes(`npm install -g ${tarballBase}?waypointCacheBust=`));
});
