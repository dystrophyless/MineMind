import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const PROFILE_STATS = join(ROOT, "src", "app", "components", "ProfileStats.tsx");
const PROFILE_HOOK = join(ROOT, "src", "app", "hooks", "useProfileStats.ts");
const TRANSLATIONS = join(ROOT, "src", "app", "i18n", "translations.ts");

test("profile win-rate card falls back to real wins and games instead of a dash", () => {
  const profileStats = readFileSync(PROFILE_STATS, "utf8");
  const hook = readFileSync(PROFILE_HOOK, "utf8");
  const translations = readFileSync(TRANSLATIONS, "utf8");

  assert.match(hook, /wins: number/);
  assert.match(hook, /wins,/);
  assert.match(profileStats, /winRateDetailText/);
  assert.match(profileStats, /profileData\.wins\.toLocaleString\(\)/);
  assert.match(profileStats, /profileWins/);
  assert.doesNotMatch(profileStats, /const winRateDetailText = winRateChange !== null[\s\S]*: "—";/);
  assert.match(translations, /profileWins/);
});
