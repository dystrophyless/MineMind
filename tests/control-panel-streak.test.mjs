import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const SRC = join(ROOT, "src");
const CONTROL_PANEL = join(SRC, "app", "components", "game", "ControlPanel.tsx");
const GAME_DASHBOARD = join(SRC, "app", "components", "GameDashboard.tsx");

test("game control panel renders the real profile streak instead of a hardcoded number", () => {
  const controlPanel = readFileSync(CONTROL_PANEL, "utf8");
  const gameDashboard = readFileSync(GAME_DASHBOARD, "utf8");

  assert.match(controlPanel, /currentStreak: number/);
  assert.match(controlPanel, /currentStreak = 0/);
  assert.match(controlPanel, /mode === "timed" \? timedMinesFound : currentStreak/);
  assert.doesNotMatch(controlPanel, /: "7"/);
  assert.match(gameDashboard, /currentStreak=\{profileData\?\.currentStreak \?\? 0\}/);
});
