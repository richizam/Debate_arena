import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const buildDir = resolve(rootDir, ".test-build");
const testsDir = resolve(rootDir, "tests");
const tscEntrypoint = resolve(rootDir, "node_modules", "typescript", "lib", "tsc.js");

function collectTestFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectTestFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".test.mjs")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function collectBuiltJavaScriptFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectBuiltJavaScriptFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

function patchRelativeImports(filePath) {
  const original = readFileSync(filePath, "utf8");
  const patched = original.replace(
    /(from\s+["'])(\.\.?(?:\/[^"'.]+)+)(["'])/g,
    (_match, prefix, specifier, suffix) => `${prefix}${specifier}.js${suffix}`
  );

  if (patched !== original) {
    writeFileSync(filePath, patched, "utf8");
  }
}

rmSync(buildDir, { recursive: true, force: true });

execFileSync(process.execPath, [tscEntrypoint, "-p", resolve(rootDir, "tsconfig.tests.json")], {
  cwd: rootDir,
  stdio: "inherit",
});

for (const filePath of collectBuiltJavaScriptFiles(buildDir)) {
  patchRelativeImports(filePath);
}

const testFiles = collectTestFiles(testsDir);

if (testFiles.length === 0) {
  throw new Error("No test files were found in the tests directory.");
}

execFileSync(
  process.execPath,
  ["--test", ...testFiles],
  {
    cwd: rootDir,
    stdio: "inherit",
  }
);
