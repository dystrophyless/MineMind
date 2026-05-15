import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|jsx?)$/.test(entry) ? [path] : [];
  });
}

test("AI Coach UI and promo copy are removed from the app", () => {
  assert.equal(existsSync(join(SRC, "app", "components", "game", "AICoach.tsx")), false);

  const appSource = sourceFiles(SRC)
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  assert.doesNotMatch(appSource, /AICoach|AI Coach|ai coach/i);
});
