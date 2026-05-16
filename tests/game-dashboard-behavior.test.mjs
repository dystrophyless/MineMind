import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const GAME_DASHBOARD = join(ROOT, "src", "app", "components", "GameDashboard.tsx");
const CONTROL_PANEL = join(ROOT, "src", "app", "components", "game", "ControlPanel.tsx");
const GAME_RESULT_MODAL = join(ROOT, "src", "app", "components", "game", "GameResultModal.tsx");
const DAILY_HOOK = join(ROOT, "src", "app", "hooks", "useDailyChallenge.ts");

test("game page renders time and mine counters above the board instead of in the side panel", () => {
  const dashboard = readFileSync(GAME_DASHBOARD, "utf8");
  const controlPanel = readFileSync(CONTROL_PANEL, "utf8");

  assert.match(dashboard, /game-status-strip/);
  assert.doesNotMatch(controlPanel, /controlsTime/);
  assert.doesNotMatch(controlPanel, /controlsMines/);
});

test("game page shows an outcome modal after a finished game", () => {
  const dashboard = readFileSync(GAME_DASHBOARD, "utf8");
  const modal = readFileSync(GAME_RESULT_MODAL, "utf8");

  assert.match(dashboard, /GameResultModal/);
  assert.match(modal, /gameResultWonTitle/);
  assert.match(modal, /gameResultLostTitle/);
});

test("game page leaderboard summary follows the current mode and shows top three plus player rank", () => {
  const dashboard = readFileSync(GAME_DASHBOARD, "utf8");
  const controlPanel = readFileSync(CONTROL_PANEL, "utf8");

  assert.match(dashboard, /useGameLeaderboardSummary\(mode\)/);
  assert.match(controlPanel, /leaderboardRows\.slice\(0, 3\)/);
  assert.match(controlPanel, /playerRank/);
  assert.doesNotMatch(controlPanel, /globalRank/);
  assert.doesNotMatch(controlPanel, /cityRank/);
});

test("daily attempts load a single latest row and block duplicate starts", () => {
  const hook = readFileSync(DAILY_HOOK, "utf8");

  assert.match(hook, /\.limit\(1\)/);
  assert.match(hook, /loadAttempt\(\)/);
  assert.match(hook, /dailyAttemptAlreadyUsed/);
  assert.doesNotMatch(hook, /\.maybeSingle\(\)/);
});
