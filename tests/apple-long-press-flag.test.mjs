import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const MINESWEEPER_BOARD = join(ROOT, "src", "app", "components", "game", "MinesweeperBoard.tsx");

test("mine cells use explicit pointer long-press handling for mobile flags", () => {
  const board = readFileSync(MINESWEEPER_BOARD, "utf8");

  assert.match(board, /onPointerDown=\{handlePointerDown\}/);
  assert.match(board, /onPointerUp=\{cancelLongPress\}/);
  assert.match(board, /onPointerCancel=\{cancelLongPress\}/);
  assert.match(board, /didLongPressRef\.current/);
  assert.match(board, /WebkitTouchCallout/);
});
