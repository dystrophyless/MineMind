import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { FlashIcon, CrownIcon, BrainIcon } from "hugeicons-react";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { ControlPanel } from "./game/ControlPanel";
import { AICoach } from "./game/AICoach";
import { useGameLogic, Difficulty } from "./game/useGameLogic";
import { applyTimedBoardClear, countCorrectFlags, TIMED_MODE_INITIAL_SECONDS } from "./game/gameRules.mjs";
import { useT } from "../i18n/LocaleProvider";

type GameMode = "classic" | "noFlags" | "timed" | "daily";

type Props = {
  onNavigate: (page: "daily" | "leaderboard" | "profile" | "design") => void;
};

export function GameDashboard({ onNavigate }: Props) {
  const t = useT();
  const { user } = useAuth();
  const savedRef = useRef(false);
  const [mode, setMode] = useState<GameMode>("classic");
  const [timedSecondsLeft, setTimedSecondsLeft] = useState(TIMED_MODE_INITIAL_SECONDS);
  const [timedMinesFound, setTimedMinesFound] = useState(0);
  const [timedBest, setTimedBest] = useState(64);
  const gameDifficulty: Difficulty = mode === "daily" ? "daily" : "beginner";
  const { board, status, time, formatTime, minesLeft, revealCell, toggleFlag, resetGame, endGame, config } = useGameLogic(gameDifficulty, {
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
  const statusLabel = status === "idle" ? t("statusReady") : status === "playing" ? t("statusLive") : status === "won" ? t("statusVictory") : t("statusGameOver");

  useEffect(() => {
    if (mode !== "timed" || status !== "playing") return;

    const interval = window.setInterval(() => {
      setTimedSecondsLeft(seconds => {
        if (seconds <= 1) {
          endGame();
          setTimedBest(best => Math.max(best, timedMinesFound));
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
    setTimedBest(best => Math.max(best, nextRun.minesFound));
    resetGame();
  }, [board, mode, resetGame, status, timedMinesFound, timedSecondsLeft]);

  useEffect(() => {
    if (mode === "timed" && status === "lost") {
      setTimedBest(best => Math.max(best, timedMinesFound));
    }
  }, [mode, status, timedMinesFound]);

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
      difficulty: "beginner",
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
                <div>
                  <p style={{ color: "var(--mm-text)", fontSize: "15px", fontWeight: 700 }}>{modeLabels[mode]} {t("mode")}</p>
                  <p style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>9 x 9 · {config.mines} {t("boardMines")}</p>
                </div>
                <div className="flex items-center gap-3">
                  {mode === "timed" && (
                    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}>
                      <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 800 }}>{t("mobileTimedScore")} {timedMinesFound} mines</span>
                    </div>
                  )}
                  <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: status === "playing" ? "var(--mm-green)" : status === "won" ? "var(--mm-amber)" : status === "lost" ? "var(--mm-red)" : "var(--mm-text-3)", boxShadow: status === "playing" ? "0 0 6px var(--mm-green)" : "none" }} />
                    <span style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>{statusLabel}</span>
                  </div>
                </div>
              </div>

              <div className="overflow-auto max-w-full">
                <MinesweeperBoard board={board} status={status} onReveal={revealCell} onFlag={toggleFlag} flagsEnabled={mode !== "noFlags"} />
              </div>

              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{mode === "noFlags" ? t("mobileNoFlagsHelp") : t("boardMouseHelp")}</p>
            </div>

            <AICoach status={status} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="rounded-xl p-4 text-left transition-all duration-200 hover:brightness-110" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }} onClick={() => onNavigate("daily")}>
                <div className="flex items-center gap-2 mb-2">
                  <FlashIcon size={14} color="var(--mm-amber)" />
                  <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 600 }}>{t("dailyTitle")}</span>
                </div>
                <p style={{ color: "var(--mm-text)", fontSize: "18px", fontWeight: 800 }}>May 13</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{t("miniDailyAttempts")}</p>
              </button>

              <button className="rounded-xl p-4 text-left transition-all duration-200 hover:brightness-110" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }} onClick={() => onNavigate("leaderboard")}>
                <div className="flex items-center gap-2 mb-2">
                  <CrownIcon size={14} color="var(--mm-purple)" />
                  <span style={{ color: "var(--mm-purple)", fontSize: "12px", fontWeight: 600 }}>{t("leaderboardTitle")}</span>
                </div>
                <p style={{ color: "var(--mm-text)", fontSize: "18px", fontWeight: 800 }}>#247</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{t("miniGlobalRank")}</p>
              </button>

              <button className="rounded-xl p-4 text-left transition-all duration-200 hover:brightness-110" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }} onClick={() => onNavigate("profile")}>
                <div className="flex items-center gap-2 mb-2">
                  <BrainIcon size={14} color="var(--mm-blue)" />
                  <span style={{ color: "var(--mm-blue)", fontSize: "12px", fontWeight: 600 }}>{t("navStats")}</span>
                </div>
                <p style={{ color: "var(--mm-text)", fontSize: "18px", fontWeight: 800 }}>82%</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{t("miniWinStreak")}</p>
              </button>
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
              timedMinesFound={timedMinesFound}
              timedBest={timedBest}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
