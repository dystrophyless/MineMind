import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const DASHBOARD = join(ROOT, "src", "app", "components", "GameDashboard.tsx");
const MOBILE_GAME = join(ROOT, "src", "app", "components", "MobileGame.tsx");
const DAILY_HOOK = join(ROOT, "src", "app", "hooks", "useDailyChallenge.ts");
const XP_SERVICE = join(ROOT, "src", "app", "services", "profileXp.ts");
const MIGRATION = join(ROOT, "supabase", "migrations", "202605160004_award_profile_xp.sql");

test("completed game surfaces award profile XP after saved attempts", () => {
  const dashboard = readFileSync(DASHBOARD, "utf8");
  const mobileGame = readFileSync(MOBILE_GAME, "utf8");
  const dailyHook = readFileSync(DAILY_HOOK, "utf8");

  for (const source of [dashboard, mobileGame, dailyHook]) {
    assert.match(source, /awardProfileXp/);
  }
});

test("profile XP is awarded through an atomic Supabase RPC", () => {
  assert.ok(existsSync(XP_SERVICE), "profile XP service should exist");
  assert.ok(existsSync(MIGRATION), "XP RPC migration should exist");

  const service = readFileSync(XP_SERVICE, "utf8");
  const migration = readFileSync(MIGRATION, "utf8");

  assert.match(service, /calculateXpAward/);
  assert.match(service, /\.rpc\("award_profile_xp"/);
  assert.match(migration, /create or replace function public\.award_profile_xp/);
  assert.match(migration, /set xp = xp \+ bounded_delta/);
});
