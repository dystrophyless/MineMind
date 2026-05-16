import type { ReactNode } from "react";
import { StopWatchIcon, FireIcon, CrownIcon, BombIcon, FlashIcon } from "hugeicons-react";
import type { TranslationKey } from "../i18n/translations";
import { supabase } from "../../lib/supabase";

export type AchievementKey =
  | "first_win"
  | "speed"
  | "lightning"
  | "no_flags_win"
  | "streak_7"
  | "daily_10"
  | "bomb_squad"
  | "centurion"
  | "mine_hunter"
  | "dedicated";

export type AchievementDef = {
  key: AchievementKey;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  icon: ReactNode;
  check: (stats: AchievementStats) => boolean;
};

type AchievementStats = {
  totalGames: number;
  totalWins: number;
  bestClassicSeconds: number | null;
  currentStreak: number;
  dailyGamesTotal: number;
  noFlagsWins: number;
  totalMinesFoundTimed: number;
  uniquePlayDays: number;
};

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    key: "first_win",
    nameKey: "achievementFirstWin" as TranslationKey,
    descKey: "achievementFirstWinDesc" as TranslationKey,
    icon: <CrownIcon size={24} color="var(--mm-amber)" />,
    check: (s) => s.totalWins >= 1,
  },
  {
    key: "speed",
    nameKey: "achievementSpeed" as TranslationKey,
    descKey: "achievementSpeedDesc" as TranslationKey,
    icon: <FlashIcon size={24} color="var(--mm-blue)" />,
    check: (s) => s.bestClassicSeconds !== null && s.bestClassicSeconds < 30,
  },
  {
    key: "lightning",
    nameKey: "achievementLightning" as TranslationKey,
    descKey: "achievementLightningDesc" as TranslationKey,
    icon: <FlashIcon size={24} color="var(--mm-amber)" />,
    check: (s) => s.bestClassicSeconds !== null && s.bestClassicSeconds < 15,
  },
  {
    key: "no_flags_win",
    nameKey: "achievementNoFlagsWin" as TranslationKey,
    descKey: "achievementNoFlagsWinDesc" as TranslationKey,
    icon: <BombIcon size={24} color="var(--mm-green)" />,
    check: (s) => s.noFlagsWins >= 1,
  },
  {
    key: "streak_7",
    nameKey: "achievementStreak7" as TranslationKey,
    descKey: "achievementStreak7Desc" as TranslationKey,
    icon: <FireIcon size={24} color="var(--mm-red)" />,
    check: (s) => s.currentStreak >= 7,
  },
  {
    key: "daily_10",
    nameKey: "achievementDaily10" as TranslationKey,
    descKey: "achievementDaily10Desc" as TranslationKey,
    icon: <StopWatchIcon size={24} color="var(--mm-amber)" />,
    check: (s) => s.dailyGamesTotal >= 10,
  },
  {
    key: "bomb_squad",
    nameKey: "achievementBombSquad" as TranslationKey,
    descKey: "achievementBombSquadDesc" as TranslationKey,
    icon: <BombIcon size={24} color="var(--mm-purple)" />,
    check: (s) => s.totalGames >= 50,
  },
  {
    key: "centurion",
    nameKey: "achievementCenturion" as TranslationKey,
    descKey: "achievementCenturionDesc" as TranslationKey,
    icon: <CrownIcon size={24} color="var(--mm-green)" />,
    check: (s) => s.totalWins >= 100,
  },
  {
    key: "mine_hunter",
    nameKey: "achievementMineHunter" as TranslationKey,
    descKey: "achievementMineHunterDesc" as TranslationKey,
    icon: <BombIcon size={24} color="var(--mm-blue)" />,
    check: (s) => s.totalMinesFoundTimed >= 100,
  },
  {
    key: "dedicated",
    nameKey: "achievementDedicated" as TranslationKey,
    descKey: "achievementDedicatedDesc" as TranslationKey,
    icon: <FireIcon size={24} color="var(--mm-purple)" />,
    check: (s) => s.uniquePlayDays >= 7,
  },
];

function computeStats(
  attempts: Array<{
    mode: string;
    status: string;
    time_seconds: number | null;
    mines_found: number | null;
    created_at: string;
  }>,
  dailyAttempts: Array<{ challenge_date: string }>
): AchievementStats {
  const wins = attempts.filter((a) => a.status === "won");

  const classicWinTimes = wins
    .filter((a) => a.mode === "classic" && a.time_seconds !== null)
    .map((a) => a.time_seconds as number);

  const bestClassicSeconds =
    classicWinTimes.length > 0 ? Math.min(...classicWinTimes) : null;

  // Compute current win streak: consecutive days from today backwards with >= 1 win
  const winDays = new Set(wins.map((a) => a.created_at.slice(0, 10)));
  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (winDays.has(dateStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  const noFlagsWins = wins.filter((a) => a.mode === "noFlags").length;

  const totalMinesFoundTimed = attempts
    .filter((a) => a.time_seconds !== null && a.mines_found !== null)
    .reduce((sum, a) => sum + (a.mines_found as number), 0);

  const gameDays = new Set(attempts.map((a) => a.created_at.slice(0, 10)));
  const dailyDays = new Set(dailyAttempts.map((a) => a.challenge_date));
  const uniquePlayDays = new Set([...gameDays, ...dailyDays]).size;

  return {
    totalGames: attempts.length,
    totalWins: wins.length,
    bestClassicSeconds,
    currentStreak,
    dailyGamesTotal: dailyAttempts.length,
    noFlagsWins,
    totalMinesFoundTimed,
    uniquePlayDays,
  };
}

export async function checkAndUnlockAchievements(
  userId: string
): Promise<AchievementKey[]> {
  const [attemptsResult, dailyResult, existingResult] = await Promise.all([
    supabase
      .from("game_attempts")
      .select("mode, status, time_seconds, mines_found, created_at")
      .eq("user_id", userId),
    supabase
      .from("daily_challenge_attempts")
      .select("challenge_date")
      .eq("user_id", userId)
      .neq("status", "in_progress"),
    supabase
      .from("user_achievements")
      .select("achievement_key")
      .eq("user_id", userId),
  ]);

  const attempts = attemptsResult.data ?? [];
  const dailyAttempts = dailyResult.data ?? [];
  const existingKeys = new Set(
    (existingResult.data ?? []).map((r) => r.achievement_key as AchievementKey)
  );

  const stats = computeStats(attempts, dailyAttempts);

  const newlyEarned = ACHIEVEMENT_DEFS.filter(
    (def) => !existingKeys.has(def.key) && def.check(stats)
  ).map((def) => def.key);

  if (newlyEarned.length > 0) {
    const rows = newlyEarned.map((key) => ({
      user_id: userId,
      achievement_key: key,
    }));
    const { error } = await supabase.from("user_achievements").insert(rows);
    if (error) {
      console.error("Failed to insert achievements:", error.message);
    }
  }

  return newlyEarned;
}
