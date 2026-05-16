import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { getPlayerClassicRanks, getXpLevelProgress } from "../components/game/gameRules.mjs";
import { ACHIEVEMENT_DEFS } from "../services/achievements";

export type RecentGame = {
  mode: string;
  timeSeconds: number | null;
  minesFound: number | null;
  status: "won" | "lost";
  createdAt: string;
};

export type ModeStatRow = {
  mode: string;
  wins: number;
  total: number;
  bestTimeSeconds: number | null;
};

export type BadgeState = {
  key: string;
  unlocked: boolean;
};

export type ProfileData = {
  username: string;
  avatarInitial: string;
  city: string | null;
  memberSince: string;
  xp: number;
  level: number;
  nextLevelXp: number;
  xpProgressXp: number;
  xpRequiredXp: number;
  gamesPlayed: number;
  gamesToday: number;
  wins: number;
  winRate: number;
  winRateChangeThisWeek: number | null;
  bestTimeSeconds: number | null;
  currentStreak: number;
  bestStreak: number;
  favoriteMode: string;
  favModePercentage: number;
  globalRank: number | null;
  cityRank: number | null;
  recentGames: RecentGame[];
  modeStats: ModeStatRow[];
  badges: BadgeState[];
};

export function useProfileStats() {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { setData(null); setIsLoading(false); return; }

    let cancelled = false;

    async function load() {
      const [profileRes, attemptsRes, classicLeaderboardRes, achievementsRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("username, city, member_since, xp")
          .eq("user_id", user!.id)
          .single(),
        supabase
          .from("game_attempts")
          .select("mode, status, time_seconds, mines_found, created_at")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("game_attempts")
          .select("user_id, mode, status, time_seconds")
          .eq("mode", "classic")
          .eq("status", "won")
          .not("time_seconds", "is", null),
        supabase
          .from("user_achievements")
          .select("achievement_key")
          .eq("user_id", user!.id),
      ]);

      const profile = profileRes.data;
      const attempts = attemptsRes.data ?? [];
      const xp = profile?.xp ?? 0;
      const classicLeaderboardAttempts = classicLeaderboardRes.data ?? [];
      const leaderboardUserIds = [...new Set(classicLeaderboardAttempts.map(a => a.user_id))];
      const { data: leaderboardProfilesData } = leaderboardUserIds.length > 0
        ? await supabase
            .from("user_profiles")
            .select("user_id, city")
            .in("user_id", leaderboardUserIds)
        : { data: [] };
      const leaderboardProfiles = (leaderboardProfilesData ?? []).map(p => ({
        playerId: p.user_id,
        city: p.city,
      }));
      if (profile && !leaderboardProfiles.some(p => p.playerId === user!.id)) {
        leaderboardProfiles.push({ playerId: user!.id, city: profile.city });
      }
      const { globalRank, cityRank } = getPlayerClassicRanks(
        classicLeaderboardAttempts.map(a => ({
          playerId: a.user_id,
          mode: a.mode,
          status: a.status,
          seconds: a.time_seconds,
        })),
        leaderboardProfiles,
        user!.id
      );

      const gamesPlayed = attempts.length;
      const wins = attempts.filter(a => a.status === "won").length;
      const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

      const classicWins = attempts.filter(a => a.mode === "classic" && a.status === "won");
      const bestTimeSeconds = classicWins.length > 0
        ? Math.min(...classicWins.map(a => a.time_seconds as number))
        : null;

      const modeCounts: Record<string, number> = {};
      for (const a of attempts) modeCounts[a.mode] = (modeCounts[a.mode] ?? 0) + 1;
      const favoriteMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "classic";

      const todayStr = new Date().toISOString().slice(0, 10);
      const gamesToday = attempts.filter(a => a.created_at.slice(0, 10) === todayStr).length;

      const nowMs = Date.now();
      const weekAgoMs = nowMs - 7 * 86400000;
      const twoWeeksAgoMs = nowMs - 14 * 86400000;
      const thisWeekAttempts = attempts.filter(a => new Date(a.created_at).getTime() >= weekAgoMs);
      const prevWeekAttempts = attempts.filter(a => {
        const ms = new Date(a.created_at).getTime();
        return ms >= twoWeeksAgoMs && ms < weekAgoMs;
      });
      const thisWeekRate = thisWeekAttempts.length > 0
        ? Math.round(thisWeekAttempts.filter(a => a.status === "won").length / thisWeekAttempts.length * 100) : null;
      const prevWeekRate = prevWeekAttempts.length > 0
        ? Math.round(prevWeekAttempts.filter(a => a.status === "won").length / prevWeekAttempts.length * 100) : null;
      const winRateChangeThisWeek = thisWeekRate !== null && prevWeekRate !== null
        ? thisWeekRate - prevWeekRate : null;

      const wonDates = attempts
        .filter(a => a.status === "won")
        .map(a => new Date(a.created_at).toISOString().slice(0, 10))
        .filter((d, i, arr) => arr.indexOf(d) === i)
        .sort()
        .reverse();
      let streak = 0;
      for (let i = 0; i < wonDates.length; i++) {
        const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        if (wonDates[i] === expected) streak++;
        else break;
      }

      const wonDatesSortedAsc = [...wonDates].reverse();
      let bestStreak = streak;
      let runLen = 0;
      for (let i = 0; i < wonDatesSortedAsc.length; i++) {
        if (i === 0) {
          runLen = 1;
        } else {
          const prev = new Date(wonDatesSortedAsc[i - 1]).getTime();
          const curr = new Date(wonDatesSortedAsc[i]).getTime();
          runLen = Math.round((curr - prev) / 86400000) === 1 ? runLen + 1 : 1;
        }
        if (runLen > bestStreak) bestStreak = runLen;
      }

      const favModePercentage = gamesPlayed > 0
        ? Math.round((modeCounts[favoriteMode] ?? 0) / gamesPlayed * 100) : 0;

      const recentGames: RecentGame[] = attempts.slice(0, 5).map(a => ({
        mode: a.mode,
        timeSeconds: a.time_seconds,
        minesFound: a.mines_found,
        status: a.status as "won" | "lost",
        createdAt: a.created_at,
      }));

      const modes = ["classic", "noFlags", "timed", "daily"] as const;
      const modeStats: ModeStatRow[] = modes.map(m => {
        const mAttempts = attempts.filter(a => a.mode === m);
        const mWins = mAttempts.filter(a => a.status === "won");
        const times = mWins.map(a => a.time_seconds).filter((t): t is number => t !== null);
        return {
          mode: m,
          wins: mWins.length,
          total: mAttempts.length,
          bestTimeSeconds: times.length > 0 ? Math.min(...times) : null,
        };
      });

      const unlockedKeys = new Set((achievementsRes.data ?? []).map(r => r.achievement_key));
      const badges: BadgeState[] = ACHIEVEMENT_DEFS.map(def => ({
        key: def.key,
        unlocked: unlockedKeys.has(def.key),
      }));

      if (cancelled) return;
      const resolvedXp = profile?.xp ?? 0;
      const xpProgress = getXpLevelProgress(resolvedXp);
      setData({
        username: profile?.username ?? user!.email?.split("@")[0] ?? "You",
        avatarInitial: (profile?.username?.[0] ?? "Y").toUpperCase(),
        city: profile?.city ?? null,
        memberSince: profile?.member_since ?? new Date().toISOString(),
        xp: resolvedXp,
        level: xpProgress.level,
        nextLevelXp: xpProgress.nextLevelXp,
        xpProgressXp: xpProgress.progressXp,
        xpRequiredXp: xpProgress.requiredXp,
        gamesPlayed,
        gamesToday,
        wins,
        winRate,
        winRateChangeThisWeek,
        bestTimeSeconds,
        currentStreak: streak,
        bestStreak,
        favoriteMode,
        favModePercentage,
        globalRank,
        cityRank,
        recentGames,
        modeStats,
        badges,
      });
      setIsLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  return { data, isLoading };
}
