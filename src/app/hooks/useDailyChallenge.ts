import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { awardProfileXp } from "../services/profileXp";
import { checkAndUnlockAchievements, type AchievementKey } from "../services/achievements";

export type DailyAttemptStatus = "none" | "in_progress" | "won" | "lost" | "loading";

export type DailyTopPlayer = {
  username: string;
  city: string | null;
  time_seconds: number;
  rank: number;
};

export type DailyStats = {
  totalAttempts: number;
  bestTimeToday: number | null;
  topPlayers: DailyTopPlayer[];
};

export function useDailyChallenge(onNewAchievements?: (keys: AchievementKey[]) => void) {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);

  const [attemptStatus, setAttemptStatus] = useState<DailyAttemptStatus>("loading");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptBlockReason, setAttemptBlockReason] = useState<"dailyAttemptAlreadyUsed" | null>(null);
  const [stats, setStats] = useState<DailyStats>({ totalAttempts: 0, bestTimeToday: null, topPlayers: [] });

  const loadStats = useCallback(async () => {
    const [wonRes, countRes] = await Promise.all([
      supabase
        .from("daily_challenge_attempts")
        .select("time_seconds, user_profiles(username, city)")
        .eq("challenge_date", today)
        .eq("status", "won")
        .order("time_seconds", { ascending: true })
        .limit(5),
      supabase
        .from("daily_challenge_attempts")
        .select("*", { count: "exact", head: true })
        .eq("challenge_date", today),
    ]);

    const topPlayers: DailyTopPlayer[] = (wonRes.data ?? []).map((row, i) => ({
      username: (row.user_profiles as { username: string } | null)?.username ?? "?",
      city: (row.user_profiles as { city: string | null } | null)?.city ?? null,
      time_seconds: row.time_seconds as number,
      rank: i + 1,
    }));

    setStats({
      totalAttempts: countRes.count ?? 0,
      bestTimeToday: topPlayers[0]?.time_seconds ?? null,
      topPlayers,
    });
  }, [today]);

  const loadAttempt = useCallback(async () => {
    if (!user) { setAttemptStatus("none"); setAttemptId(null); return null; }

    const { data } = await supabase
      .from("daily_challenge_attempts")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("challenge_date", today)
      .order("started_at", { ascending: false })
      .limit(1);

    const latestAttempt = data?.[0] ?? null;
    setAttemptStatus(latestAttempt ? (latestAttempt.status as DailyAttemptStatus) : "none");
    setAttemptId(latestAttempt?.id ?? null);
    return latestAttempt;
  }, [user, today]);

  useEffect(() => {
    loadAttempt();
    loadStats();
  }, [loadAttempt, loadStats]);

  const beginAttempt = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    if (attemptStatus !== "none") {
      setAttemptBlockReason("dailyAttemptAlreadyUsed");
      return false;
    }

    const existingAttempt = await loadAttempt();
    if (existingAttempt) {
      setAttemptBlockReason("dailyAttemptAlreadyUsed");
      return false;
    }

    const { data, error } = await supabase
      .from("daily_challenge_attempts")
      .insert({ user_id: user.id, challenge_date: today, status: "in_progress" })
      .select("id")
      .single();

    if (error) {
      setAttemptBlockReason("dailyAttemptAlreadyUsed");
      await loadAttempt();
      return false;
    }

    setAttemptId(data.id);
    setAttemptStatus("in_progress");
    return true;
  }, [user, today, attemptStatus, loadAttempt]);

  const completeAttempt = useCallback(async (status: "won" | "lost", timeSeconds: number) => {
    if (!attemptId) return;

    const { error } = await supabase
      .from("daily_challenge_attempts")
      .update({ status, time_seconds: timeSeconds, completed_at: new Date().toISOString() })
      .eq("id", attemptId);

    if (!error) {
      awardProfileXp({ mode: "daily", status, timeSeconds });
      if (user) {
        const newKeys = await checkAndUnlockAchievements(user.id);
        if (newKeys.length > 0) onNewAchievements?.(newKeys);
      }
    }
    setAttemptStatus(status);
    loadStats();
  }, [attemptId, loadStats, user, onNewAchievements]);

  const clearAttemptBlockReason = useCallback(() => setAttemptBlockReason(null), []);

  return { attemptStatus, attemptBlockReason, stats, beginAttempt, completeAttempt, clearAttemptBlockReason };
}
