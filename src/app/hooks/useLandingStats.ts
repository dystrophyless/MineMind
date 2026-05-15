import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export type LandingStats = {
  totalGames: number;
  activePlayers: number;
  totalWins: number;
  winRate: number;
};

const EMPTY_STATS: LandingStats = {
  totalGames: 0,
  activePlayers: 0,
  totalWins: 0,
  winRate: 0,
};

export function useLandingStats() {
  const [data, setData] = useState<LandingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      const [gamesRes, playersRes, winsRes] = await Promise.all([
        supabase.from("game_attempts").select("*", { count: "exact", head: true }),
        supabase.from("user_profiles").select("*", { count: "exact", head: true }),
        supabase.from("game_attempts").select("*", { count: "exact", head: true }).eq("status", "won"),
      ]);

      if (cancelled) return;

      const totalGames = gamesRes.count ?? EMPTY_STATS.totalGames;
      const totalWins = winsRes.count ?? EMPTY_STATS.totalWins;
      setData({
        totalGames,
        activePlayers: playersRes.count ?? EMPTY_STATS.activePlayers,
        totalWins,
        winRate: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
      });
      setIsLoading(false);
    }

    load().catch(() => {
      if (!cancelled) {
        setData(EMPTY_STATS);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading };
}
