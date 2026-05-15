import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const SRC = join(ROOT, "src");
const GAME_DASHBOARD = join(SRC, "app", "components", "GameDashboard.tsx");
const MOBILE_GAME = join(SRC, "app", "components", "MobileGame.tsx");
const TRANSLATIONS = join(SRC, "app", "i18n", "translations.ts");

test("game attempts no longer persist obsolete difficulty business data", () => {
  const dashboard = readFileSync(GAME_DASHBOARD, "utf8");
  const mobileGame = readFileSync(MOBILE_GAME, "utf8");

  assert.doesNotMatch(dashboard, /difficulty:\s*"beginner"/);
  assert.doesNotMatch(mobileGame, /difficulty:\s*"beginner"/);
});

test("old difficulty translation keys are removed from app copy", () => {
  const translations = readFileSync(TRANSLATIONS, "utf8");

  assert.doesNotMatch(translations, /difficultyBeginner|difficultyAdvanced|difficultyExpert|difficultyDaily|designDifficultySelector/);
});
