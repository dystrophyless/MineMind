import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useT } from "../i18n/LocaleProvider";

type GameMode = "classic" | "noFlags" | "timed" | "daily";

type GameAttemptRow = {
  user_id: string;
  mode: "classic" | "noFlags" | "timed";
  status: string;
  time_seconds: number | null;
  mines_found: number | null;
};

type DailyAttemptRow = {
  user_id: string;
  status: string;
  time_seconds: number | null;
};

type ProfileRow = {
  user_id: string;
  username: string | null;
  city: string | null;
};

export type GameLeaderboardSummaryRow = {
  playerId: string;
  player: string;
  city: string | null;
  rank: number;
  scoreLabel: string;
  isMe: boolean;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function useGameLeaderboardSummary(mode: GameMode) {
  const t = useT();
  const { user } = useAuth();
  const [rows, setRows] = useState<GameLeaderboardSummaryRow[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function loadProfiles(userIds: string[]) {
      if (userIds.length === 0) return new Map<string, ProfileRow>();

      const { data } = await supabase
        .from("user_profiles")
        .select("user_id, username, city")
        .in("user_id", userIds);

      return new Map(((data ?? []) as ProfileRow[]).map(profile => [profile.user_id, profile]));
    }

    async function load() {
      if (mode === "daily") {
        const { data, error } = await supabase
          .from("daily_challenge_attempts")
          .select("user_id, status, time_seconds")
          .eq("challenge_date", todayKey())
          .eq("status", "won")
          .not("time_seconds", "is", null)
          .order("time_seconds", { ascending: true });

        if (cancelled) return;
        if (error || !data) {
          setRows([]);
          setPlayerRank(null);
          setIsLoading(false);
          return;
        }

        const attempts = data as DailyAttemptRow[];
        const profilesByUserId = await loadProfiles([...new Set(attempts.map(row => row.user_id))]);
        if (cancelled) return;

        const summaryRows = attempts.map((attempt, index) => {
          const profile = profilesByUserId.get(attempt.user_id);
          return {
            playerId: attempt.user_id,
            player: profile?.username ?? "?",
            city: profile?.city ?? null,
            rank: index + 1,
            scoreLabel: `${(attempt.time_seconds ?? 0).toFixed(2)} ${t("unitSec")}`,
            isMe: attempt.user_id === user?.id,
          };
        });

        setRows(summaryRows);
        setPlayerRank(summaryRows.find(row => row.isMe)?.rank ?? null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("game_attempts")
        .select("user_id, mode, status, time_seconds, mines_found")
        .eq("mode", mode)
        .eq("status", "won");

      if (cancelled) return;
      if (error || !data) {
        setRows([]);
        setPlayerRank(null);
        setIsLoading(false);
        return;
      }

      const attempts = data as GameAttemptRow[];
      const profilesByUserId = await loadProfiles([...new Set(attempts.map(row => row.user_id))]);
      if (cancelled) return;

      const bestByUserId = new Map<string, GameAttemptRow>();
      for (const attempt of attempts) {
        const current = bestByUserId.get(attempt.user_id);
        const isBetter = !current ||
          (mode === "timed"
            ? (attempt.mines_found ?? 0) > (current.mines_found ?? 0)
            : (attempt.time_seconds ?? Infinity) < (current.time_seconds ?? Infinity));

        if (isBetter) bestByUserId.set(attempt.user_id, attempt);
      }

      const summaryRows = Array.from(bestByUserId.values())
        .sort((a, b) =>
          mode === "timed"
            ? (b.mines_found ?? 0) - (a.mines_found ?? 0)
            : (a.time_seconds ?? Infinity) - (b.time_seconds ?? Infinity)
        )
        .map((attempt, index) => {
          const profile = profilesByUserId.get(attempt.user_id);
          const score = mode === "timed" ? (attempt.mines_found ?? 0) : (attempt.time_seconds ?? 0);
          return {
            playerId: attempt.user_id,
            player: profile?.username ?? "?",
            city: profile?.city ?? null,
            rank: index + 1,
            scoreLabel: mode === "timed" ? `${score} ${t("boardMines")}` : `${score.toFixed(2)} ${t("unitSec")}`,
            isMe: attempt.user_id === user?.id,
          };
        });

      setRows(summaryRows);
      setPlayerRank(summaryRows.find(row => row.isMe)?.rank ?? null);
      setIsLoading(false);
    }

    load().catch(() => {
      if (!cancelled) {
        setRows([]);
        setPlayerRank(null);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [mode, t, user?.id]);

  return { rows, playerRank, isLoading };
}
