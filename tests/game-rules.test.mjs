import assert from "node:assert/strict";
import { test } from "node:test";

import {
  applyTimedBoardClear,
  getBestLeaderboardRows,
  LEADERBOARD_PERIODS,
  RANKED_GAME_MODES,
  TIMED_MODE_INITIAL_SECONDS,
} from "../src/app/components/game/gameRules.mjs";

test("timed mode starts at 3 minutes and adds 5 seconds after a cleared board", () => {
  assert.equal(TIMED_MODE_INITIAL_SECONDS, 180);

  assert.deepEqual(
    applyTimedBoardClear({ secondsLeft: 37, minesFound: 23, correctFlags: 4 }),
    { secondsLeft: 42, minesFound: 27 }
  );
});

test("leaderboard keeps each player's best attempt for the selected mode and period", () => {
  const attempts = [
    { playerId: "you", player: "You", mode: "timed", period: "weekly", mines: 23 },
    { playerId: "you", player: "You", mode: "timed", period: "weekly", mines: 41 },
    { playerId: "you", player: "You", mode: "timed", period: "weekly", mines: 38 },
    { playerId: "you", player: "You", mode: "timed", period: "weekly", mines: 64 },
    { playerId: "you", player: "You", mode: "timed", period: "weekly", mines: 52 },
    { playerId: "ada", player: "Ada", mode: "timed", period: "weekly", mines: 57 },
    { playerId: "max", player: "Max", mode: "classic", period: "weekly", seconds: 38.21 },
  ];

  const rows = getBestLeaderboardRows(attempts, "timed", "weekly");

  assert.equal(rows[0].player, "You");
  assert.equal(rows[0].score, 64);
  assert.equal(rows[0].scoreLabel, "64 mines");
  assert.equal(rows[1].scoreLabel, "57 mines");
});

test("classic and no-flags leaderboards rank lower best time first", () => {
  const attempts = [
    { playerId: "max", player: "Max", mode: "classic", period: "allTime", seconds: 41.09 },
    { playerId: "ivy", player: "Ivy", mode: "classic", period: "allTime", seconds: 43.77 },
    { playerId: "max", player: "Max", mode: "classic", period: "allTime", seconds: 38.21 },
    { playerId: "noa", player: "Noa", mode: "noFlags", period: "allTime", seconds: 52.44 },
  ];

  const rows = getBestLeaderboardRows(attempts, "classic", "allTime");

  assert.deepEqual(
    rows.map(row => row.scoreLabel),
    ["38.21 sec", "43.77 sec"]
  );
});

test("ranked leaderboard has three game modes and three periods", () => {
  assert.deepEqual(RANKED_GAME_MODES, ["classic", "timed", "noFlags"]);
  assert.deepEqual(LEADERBOARD_PERIODS, ["allTime", "monthly", "weekly"]);
});
