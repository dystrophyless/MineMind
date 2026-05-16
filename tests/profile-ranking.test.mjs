import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const PROFILE_HOOK = join(ROOT, "src", "app", "hooks", "useProfileStats.ts");

test("profile ranks come from classic leaderboard wins instead of XP", () => {
  const hook = readFileSync(PROFILE_HOOK, "utf8");

  assert.match(hook, /getPlayerClassicRanks/);
  assert.match(hook, /\.eq\("mode", "classic"\)/);
  assert.match(hook, /\.eq\("status", "won"\)/);
  assert.doesNotMatch(hook, /\.gt\("xp", xp\)/);
});
