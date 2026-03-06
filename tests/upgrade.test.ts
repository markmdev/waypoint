import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chmodSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { test } from "node:test";

import { buildInitArgs, npmBinaryForPlatform, upgradeWaypoint } from "../src/upgrade.js";

test("buildInitArgs preserves config feature flags", () => {
  const args = buildInitArgs("/tmp/repo", {
    profile: "app-friendly",
    features: {
      roles: true,
      rules: true,
      automations: true,
    },
  });

  assert.deepEqual(args, [
    "init",
    "/tmp/repo",
    "--app-friendly",
    "--with-roles",
    "--with-rules",
    "--with-automations",
  ]);
});

test("npmBinaryForPlatform maps windows to npm.cmd", () => {
  assert.equal(npmBinaryForPlatform("win32"), "npm.cmd");
  assert.equal(npmBinaryForPlatform("darwin"), "npm");
});

test("upgradeWaypoint updates cli then refreshes repo using existing config", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-upgrade-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  const logFile = path.join(root, "calls.log");

  mkdirSync(path.join(root, ".waypoint"), { recursive: true });
  writeFileSync(path.join(root, ".waypoint/config.toml"), "profile = \"app-friendly\"\n[features]\nroles = true\nautomations = true\n", "utf8");

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
        roles: true,
        automations: true,
      },
    },
    cliEntry: fakeCli,
    nodeBinary: process.execPath,
    npmBinary: fakeNpm,
    stdio: "pipe",
  });

  assert.equal(status, 0);

  const log = readFileSync(logFile, "utf8");
  assert.ok(log.includes("npm install -g waypoint-codex@latest"));
  assert.ok(log.includes(`cli init ${root} --app-friendly --with-roles --with-automations`));
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
