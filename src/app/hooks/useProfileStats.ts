import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

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
  gamesPlayed: number;
  winRate: number;
  bestTimeSeconds: number | null;
  currentStreak: number;
  favoriteMode: string;
  globalRank: number | null;
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
      const [profileRes, attemptsRes] = await Promise.all([
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
      ]);

      const profile = profileRes.data;
      const attempts = attemptsRes.data ?? [];

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

      const badges: BadgeState[] = [
        { key: "speed", unlocked: bestTimeSeconds !== null && bestTimeSeconds < 60 },
        { key: "flawless", unlocked: false },
        { key: "streak", unlocked: streak >= 7 },
        { key: "daily", unlocked: attempts.filter(a => a.mode === "daily" && a.status === "won").length >= 10 },
        { key: "grandmaster", unlocked: false },
        { key: "scholar", unlocked: gamesPlayed >= 100 },
      ];

      if (cancelled) return;
      setData({
        username: profile?.username ?? user!.email?.split("@")[0] ?? "You",
        avatarInitial: (profile?.username?.[0] ?? "Y").toUpperCase(),
        city: profile?.city ?? null,
        memberSince: profile?.member_since ?? new Date().toISOString(),
        xp: profile?.xp ?? 0,
        gamesPlayed,
        winRate,
        bestTimeSeconds,
        currentStreak: streak,
        favoriteMode,
        globalRank: null,
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
