import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const LANDING_PAGE = join(ROOT, "src", "app", "components", "LandingPage.tsx");
const REGISTER_PAGE = join(ROOT, "src", "app", "components", "RegisterPage.tsx");
const TRANSLATIONS = join(ROOT, "src", "app", "i18n", "translations.ts");
const LANDING_STATS_HOOK = join(ROOT, "src", "app", "hooks", "useLandingStats.ts");

test("landing uses real stats instead of marketing placeholders", () => {
  const landing = readFileSync(LANDING_PAGE, "utf8");
  const register = readFileSync(REGISTER_PAGE, "utf8");
  const translations = readFileSync(TRANSLATIONS, "utf8");
  const hook = readFileSync(LANDING_STATS_HOOK, "utf8");

  for (const source of [landing, register, translations]) {
    assert.doesNotMatch(source, /98K\+?|98,000\+?|2\.4M\+?|99\.8%/);
  }

  assert.doesNotMatch(landing, /value: "#1"/);
  assert.match(landing, /useLandingStats/);
  assert.match(landing, /useProfileStats/);
  assert.match(landing, /landingStats\?\.totalGames/);
  assert.match(landing, /profileData\?\.winRate/);
  assert.doesNotMatch(landing, /key=\{s\.value\}/);
  assert.match(landing, /key: "totalGames"/);
  assert.match(landing, /key=\{s\.key\}/);
  assert.match(landing, /landingModesTitle/);
  assert.match(landing, /landingModesDesc/);
  assert.match(translations, /landingProfileStatsSynced/);

  assert.match(hook, /from\("game_attempts"\)/);
  assert.match(hook, /from\("user_profiles"\)/);
  assert.match(hook, /count: "exact"/);
});
