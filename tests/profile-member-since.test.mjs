import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const PROFILE_STATS = join(ROOT, "src", "app", "components", "ProfileStats.tsx");

test("profile member-since text excludes city and uses Russian genitive month names", () => {
  const profileStats = readFileSync(PROFILE_STATS, "utf8");
  const memberSinceBlock = profileStats.match(/const memberSinceText = \(\(\) => \{[\s\S]*?\n  \}\)\(\);/)?.[0] ?? "";

  assert.ok(memberSinceBlock, "memberSinceText block should exist");
  assert.doesNotMatch(memberSinceBlock, /profileData\.city/);
  assert.doesNotMatch(memberSinceBlock, /cityCode/);
  assert.match(profileStats, /RU_MEMBER_MONTHS/);
  assert.match(profileStats, /"мая"/);
  assert.match(profileStats, /RU_MEMBER_MONTHS\[date\.getMonth\(\)\]/);
});
