import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useT } from "../i18n/LocaleProvider";

type RankedMode = "classic" | "timed" | "noFlags";
type Period = "allTime" | "monthly" | "weekly";
type Scope = "global" | "city";

export type LeaderboardRow = {
  playerId: string;
  player: string;
  city: string | null;
  score: number;
  scoreLabel: string;
  rank: number;
  isMe: boolean;
};

function periodStart(period: Period): string {
  if (period === "weekly") return new Date(Date.now() - 7 * 86400000).toISOString();
  if (period === "monthly") return new Date(Date.now() - 30 * 86400000).toISOString();
  return new Date(0).toISOString();
}

export function useLeaderboard(mode: RankedMode, period: Period, scope: Scope) {
  const t = useT();
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCity, setUserCity] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_profiles")
      .select("city")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setUserCity(data?.city ?? null));
  }, [user]);

  useEffect(() => {
    setIsLoading(true);

    async function load() {
      const { data } = await supabase
        .from("game_attempts")
        .select("user_id, mode, status, time_seconds, mines_found, created_at, user_profiles(username, city)")
        .eq("mode", mode)
        .eq("status", "won")
        .gte("created_at", periodStart(period));

      if (!data) { setIsLoading(false); return; }

      type Row = typeof data[0];
      const bestByPlayer = new Map<string, Row>();
      for (const row of data) {
        const current = bestByPlayer.get(row.user_id);
        const isBetter = !current ||
          (mode === "timed"
            ? (row.mines_found ?? 0) > (current.mines_found ?? 0)
            : (row.time_seconds ?? Infinity) < (current.time_seconds ?? Infinity));
        if (isBetter) bestByPlayer.set(row.user_id, row);
      }

      let entries = Array.from(bestByPlayer.values());

      if (scope === "city" && userCity) {
        entries = entries.filter(e =>
          (e.user_profiles as { city: string | null } | null)?.city === userCity
        );
      }

      entries.sort((a, b) =>
        mode === "timed"
          ? (b.mines_found ?? 0) - (a.mines_found ?? 0)
          : (a.time_seconds ?? Infinity) - (b.time_seconds ?? Infinity)
      );

      const leaderboardRows: LeaderboardRow[] = entries.map((e, i) => {
        const profile = e.user_profiles as { username: string; city: string | null } | null;
        const score = mode === "timed" ? (e.mines_found ?? 0) : (e.time_seconds ?? 0);
        return {
          playerId: e.user_id,
          player: profile?.username ?? "?",
          city: profile?.city ?? null,
          score,
          scoreLabel: mode === "timed" ? `${score} ${t("boardMines")}` : `${(score as number).toFixed(2)} ${t("unitSec")}`,
          rank: i + 1,
          isMe: e.user_id === user?.id,
        };
      });

      setRows(leaderboardRows);
      setIsLoading(false);
    }

    load();
  }, [mode, period, scope, user, userCity]);

  return { rows, isLoading };
}
