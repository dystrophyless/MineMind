import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

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

export function useDailyChallenge() {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);

  const [attemptStatus, setAttemptStatus] = useState<DailyAttemptStatus>("loading");
  const [attemptId, setAttemptId] = useState<string | null>(null);
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
    if (!user) { setAttemptStatus("none"); return; }

    const { data } = await supabase
      .from("daily_challenge_attempts")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("challenge_date", today)
      .maybeSingle();

    setAttemptStatus(data ? (data.status as DailyAttemptStatus) : "none");
    setAttemptId(data?.id ?? null);
  }, [user, today]);

  useEffect(() => {
    loadAttempt();
    loadStats();
  }, [loadAttempt, loadStats]);

  const beginAttempt = useCallback(async (): Promise<boolean> => {
    if (!user || attemptStatus !== "none") return false;

    const { data, error } = await supabase
      .from("daily_challenge_attempts")
      .insert({ user_id: user.id, challenge_date: today, status: "in_progress" })
      .select("id")
      .single();

    if (error) return false;
    setAttemptId(data.id);
    setAttemptStatus("in_progress");
    return true;
  }, [user, today, attemptStatus]);

  const completeAttempt = useCallback(async (status: "won" | "lost", timeSeconds: number) => {
    if (!attemptId) return;

    await supabase
      .from("daily_challenge_attempts")
      .update({ status, time_seconds: timeSeconds, completed_at: new Date().toISOString() })
      .eq("id", attemptId);

    setAttemptStatus(status);
    loadStats();
  }, [attemptId, loadStats]);

  return { attemptStatus, stats, beginAttempt, completeAttempt };
}
