import { supabase } from "../../lib/supabase";
import { calculateXpAward } from "../components/game/gameRules.mjs";

type XpAwardInput = {
  mode: string;
  status: "won" | "lost";
  timeSeconds?: number | null;
  minesFound?: number | null;
};

export async function awardProfileXp(input: XpAwardInput) {
  const xpDelta = calculateXpAward(input);
  if (xpDelta <= 0) return;

  const { error } = await supabase.rpc("award_profile_xp", { xp_delta: xpDelta });
  if (error) {
    console.error("Failed to award profile XP:", error.message);
  }
}
