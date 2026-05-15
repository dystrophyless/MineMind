import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const SRC = join(ROOT, "src");
const CONTROL_PANEL = join(SRC, "app", "components", "game", "ControlPanel.tsx");
const GAME_DASHBOARD = join(SRC, "app", "components", "GameDashboard.tsx");

test("timed score displays current mines found without a denominator or demo best", () => {
  const controlPanel = readFileSync(CONTROL_PANEL, "utf8");
  const gameDashboard = readFileSync(GAME_DASHBOARD, "utf8");

  assert.match(controlPanel, /mode === "timed" \? timedMinesFound : currentStreak/);
  assert.match(controlPanel, /ChartUpIcon/);
  assert.match(controlPanel, /mode === "timed" \? <ChartUpIcon/);
  assert.match(controlPanel, /: <FireIcon/);
  assert.doesNotMatch(controlPanel, /timedMinesFound\} \/ \$\{timedBest/);
  assert.doesNotMatch(controlPanel, /timedBest\?: number/);
  assert.match(gameDashboard, /useState\(0\)/);
  assert.doesNotMatch(gameDashboard, /useState\(64\)/);
  assert.doesNotMatch(gameDashboard, /timedBest=\{timedBest\}/);
});
