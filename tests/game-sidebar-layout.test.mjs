import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const DASHBOARD = join(ROOT, "src", "app", "components", "GameDashboard.tsx");
const CONTROL_PANEL = join(ROOT, "src", "app", "components", "game", "ControlPanel.tsx");
const TRANSLATIONS = join(ROOT, "src", "app", "i18n", "translations.ts");

test("game dashboard removes daily and stats cards and moves rating into the side panel", () => {
  const dashboard = readFileSync(DASHBOARD, "utf8");
  const panel = readFileSync(CONTROL_PANEL, "utf8");
  const translations = readFileSync(TRANSLATIONS, "utf8");

  assert.doesNotMatch(dashboard, /onNavigate\("daily"\)/);
  assert.doesNotMatch(dashboard, /onNavigate\("profile"\)/);
  assert.match(dashboard, /onLeaderboardClick=\{\(\) => onNavigate\("leaderboard"\)\}/);

  assert.doesNotMatch(panel, /ShareKnowledgeIcon/);
  assert.doesNotMatch(panel, /controlsShareResult/);
  assert.match(panel, /onLeaderboardClick/);
  assert.match(panel, /leaderboardTitle/);
  assert.doesNotMatch(panel, /const rankSubtitle/);
  assert.match(panel, /leaderboardRows\.slice\(0, 3\)/);
  assert.match(panel, /playerRank \? `#\$\{playerRank\}` : "—"/);
  assert.match(panel, /leaderboardYourRank/);
  assert.doesNotMatch(panel, /globalRank/);
  assert.doesNotMatch(panel, /cityRank/);
  assert.match(panel, /controlsUpgrade/);
  assert.match(panel, /controlsGoPro/);
  assert.match(translations, /leaderboardGlobal: "Глобально"/);
  assert.doesNotMatch(translations, /leaderboardGlobal: "Мир"/);
});
