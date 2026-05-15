import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const LEADERBOARD_HOOK = join(ROOT, "src", "app", "hooks", "useLeaderboard.ts");
const TRANSLATIONS = join(ROOT, "src", "app", "i18n", "translations.ts");

test("leaderboard uses real attempts and profiles without fake activity copy", () => {
  const hook = readFileSync(LEADERBOARD_HOOK, "utf8");
  const translations = readFileSync(TRANSLATIONS, "utf8");
  const leaderboardFooterLines = translations
    .split("\n")
    .filter((line) => line.includes("leaderboardFooter"))
    .join("\n");

  assert.match(hook, /from\("game_attempts"\)/);
  assert.match(hook, /from\("user_profiles"\)/);
  assert.doesNotMatch(hook, /user_profiles\(username, city\)/);
  assert.match(hook, /\.in\("user_id", userIds\)/);
  assert.match(hook, /attemptsError/);

  assert.doesNotMatch(translations, /98[, ]441|98K\+?|98,000\+?/);
  assert.doesNotMatch(leaderboardFooterLines, /active players|активн[а-яё]* игрок/i);
});
