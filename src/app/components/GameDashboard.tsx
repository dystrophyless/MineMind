import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { ControlPanel } from "./game/ControlPanel";
import { useGameLogic, BoardPreset } from "./game/useGameLogic";
import { applyTimedBoardClear, countCorrectFlags, TIMED_MODE_INITIAL_SECONDS } from "./game/gameRules.mjs";
import { useT } from "../i18n/LocaleProvider";
import { useProfileStats } from "../hooks/useProfileStats";

type GameMode = "classic" | "noFlags" | "timed" | "daily";

type Props = {
  onNavigate: (page: "daily" | "leaderboard" | "profile" | "design") => void;
  initialMode?: GameMode;
};

export function GameDashboard({ onNavigate, initialMode = "classic" }: Props) {
  const t = useT();
  const { user } = useAuth();
  const { data: profileData } = useProfileStats();
  const savedRef = useRef(false);
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [timedSecondsLeft, setTimedSecondsLeft] = useState(TIMED_MODE_INITIAL_SECONDS);
  const [timedMinesFound, setTimedMinesFound] = useState(0);
  const gameBoardPreset: BoardPreset = mode === "daily" ? "daily" : "standard";
  const { board, status, time, formatTime, minesLeft, revealCell, toggleFlag, resetGame, endGame } = useGameLogic(gameBoardPreset, {
    allowFlags: mode !== "noFlags",
  });

  const resetTimedRun = () => {
    setTimedSecondsLeft(TIMED_MODE_INITIAL_SECONDS);
    setTimedMinesFound(0);
  };
  const restartGame = () => {
    resetGame();
    resetTimedRun();
  };
  const handleMode = (nextMode: GameMode) => {
    setMode(nextMode);
    resetGame();
    resetTimedRun();
  };
  const modeLabels: Record<GameMode, string> = {
    classic: t("mobileModeClassic"),
    noFlags: t("mobileModeNoFlags"),
    timed: t("mobileModeTimed"),
    daily: t("mobileModeDaily"),
  };
  const timerText = mode === "timed" ? formatTime(timedSecondsLeft) : formatTime(time);

  useEffect(() => {
    if (mode !== "timed" || status !== "playing") return;

    const interval = window.setInterval(() => {
      setTimedSecondsLeft(seconds => {
        if (seconds <= 1) {
          endGame();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [endGame, mode, status, timedMinesFound]);

  useEffect(() => {
    if (mode !== "timed" || status !== "won") return;

    const nextRun = applyTimedBoardClear({
      secondsLeft: timedSecondsLeft,
      minesFound: timedMinesFound,
      correctFlags: countCorrectFlags(board),
    });
    setTimedSecondsLeft(nextRun.secondsLeft);
    setTimedMinesFound(nextRun.minesFound);
    resetGame();
  }, [board, mode, resetGame, status, timedMinesFound, timedSecondsLeft]);

  useEffect(() => {
    if (status === "idle" || status === "playing") {
      savedRef.current = false;
      return;
    }
    if (savedRef.current || !user) return;

    // Skip saving individual boards in timed mode — only save when the run ends (status === "lost")
    if (mode === "timed" && status === "won") return;
    // Skip daily — handled separately
    if (mode === "daily") return;

    savedRef.current = true;

    const attempt = {
      user_id: user.id,
      mode,
      status,
      ...(mode === "timed"
        ? { mines_found: timedMinesFound }
        : { time_seconds: time }),
    };

    supabase.from("game_attempts").insert(attempt).then(({ error }) => {
      if (error) console.error("Failed to save game attempt:", error.message);
    });
  }, [status, mode, user, time, timedMinesFound]);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--mm-bg)" }}>
      <div className="flex flex-1 overflow-auto">
        <div className="flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto px-4 py-6 gap-6">
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)", minHeight: "400px" }}>
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p style={{ color: "var(--mm-text-3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{t("mode")}</p>
                  <p style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 800 }}>{modeLabels[mode]}</p>
                </div>
                <div className="flex items-center gap-3">
                  {mode === "timed" && (
                    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}>
                      <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 800 }}>{t("mobileTimedScore")} {timedMinesFound} mines</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-auto max-w-full">
                <MinesweeperBoard board={board} status={status} onReveal={revealCell} onFlag={toggleFlag} flagsEnabled={mode !== "noFlags"} />
              </div>

              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{mode === "noFlags" ? t("mobileNoFlagsHelp") : t("boardMouseHelp")}</p>
            </div>

          </div>

          <div className="w-full lg:w-72 shrink-0">
            <ControlPanel
              mode={mode}
              onModeChange={handleMode}
              time={timerText}
              minesLeft={minesLeft}
              status={status}
              onRestart={restartGame}
              currentStreak={profileData?.currentStreak ?? 0}
              timedMinesFound={timedMinesFound}
              globalRank={profileData?.globalRank ?? null}
              cityRank={profileData?.cityRank ?? null}
              city={profileData?.city ?? null}
              onLeaderboardClick={() => onNavigate("leaderboard")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
