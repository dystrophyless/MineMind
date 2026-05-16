import assert from "node:assert/strict";
import { test } from "node:test";

import {
  applyTimedBoardClear,
  calculateXpAward,
  getBestLeaderboardRows,
  getPlayerClassicRanks,
  getXpLevelProgress,
  LEADERBOARD_PERIODS,
  RANKED_GAME_MODES,
  TIMED_MODE_INITIAL_SECONDS,
} from "../src/app/components/game/gameRules.mjs";

test("timed mode starts at 1 minute and adds 5 seconds after a cleared board", () => {
  assert.equal(TIMED_MODE_INITIAL_SECONDS, 60);

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

test("profile ranks are absent until the player has a classic win", () => {
  const attempts = [
    { playerId: "you", mode: "classic", status: "lost", seconds: 0 },
    { playerId: "you", mode: "classic", status: "lost", seconds: 0 },
    { playerId: "ada", mode: "classic", status: "won", seconds: 130 },
  ];
  const profiles = [
    { playerId: "you", city: "Almaty" },
    { playerId: "ada", city: "Almaty" },
  ];

  assert.deepEqual(
    getPlayerClassicRanks(attempts, profiles, "you"),
    { globalRank: null, cityRank: null }
  );
});

test("XP rewards participation, wins, speed, and timed mines", () => {
  assert.equal(calculateXpAward({ mode: "classic", status: "lost", timeSeconds: 8 }), 10);
  assert.equal(calculateXpAward({ mode: "classic", status: "won", timeSeconds: 130 }), 130);
  assert.equal(calculateXpAward({ mode: "noFlags", status: "won", timeSeconds: 48 }), 160);
  assert.equal(calculateXpAward({ mode: "timed", status: "lost", minesFound: 12 }), 82);
  assert.equal(calculateXpAward({ mode: "daily", status: "won", timeSeconds: 90 }), 200);
});

test("XP levels progress through 100, 250, 500, 1000, then doubling thresholds", () => {
  assert.deepEqual(getXpLevelProgress(0), {
    level: 1,
    currentLevelXp: 0,
    nextLevelXp: 100,
    progressXp: 0,
    requiredXp: 100,
  });
  assert.deepEqual(getXpLevelProgress(249), {
    level: 2,
    currentLevelXp: 100,
    nextLevelXp: 250,
    progressXp: 149,
    requiredXp: 150,
  });
  assert.deepEqual(getXpLevelProgress(1000), {
    level: 5,
    currentLevelXp: 1000,
    nextLevelXp: 2000,
    progressXp: 0,
    requiredXp: 1000,
  });
});

test("ranked leaderboard has three game modes and three periods", () => {
  assert.deepEqual(RANKED_GAME_MODES, ["classic", "timed", "noFlags"]);
  assert.deepEqual(LEADERBOARD_PERIODS, ["allTime", "monthly", "weekly"]);
});
