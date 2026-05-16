import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { BombIcon, StopWatchIcon } from "hugeicons-react";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { ControlPanel } from "./game/ControlPanel";
import { useGameLogic, BoardPreset } from "./game/useGameLogic";
import { applyTimedBoardClear, countCorrectFlags, getTimedTimeoutResult, TIMED_MODE_INITIAL_SECONDS } from "./game/gameRules.mjs";
import { useT } from "../i18n/LocaleProvider";
import { useProfileStats } from "../hooks/useProfileStats";
import { awardProfileXp } from "../services/profileXp";
import { checkAndUnlockAchievements } from "../services/achievements";
import { useAchievementQueue } from "./AchievementToast";
import { useGameLeaderboardSummary } from "../hooks/useGameLeaderboardSummary";
import { useDailyChallenge } from "../hooks/useDailyChallenge";
import { GameResultModal } from "./game/GameResultModal";
import { DailyAttemptModal } from "./game/DailyAttemptModal";

type GameMode = "classic" | "noFlags" | "timed" | "daily";

type Props = {
  onNavigate: (page: "daily" | "leaderboard" | "profile" | "design") => void;
  initialMode?: GameMode;
};

export function GameDashboard({ onNavigate, initialMode = "classic" }: Props) {
  const t = useT();
  const { user } = useAuth();
  const { queueAchievements } = useAchievementQueue();
  const { data: profileData } = useProfileStats();
  const dailyCompleteRef = useRef(false);
  const savedRef = useRef(false);
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [dailyAttemptModalOpen, setDailyAttemptModalOpen] = useState(false);
  const [timedSecondsLeft, setTimedSecondsLeft] = useState(TIMED_MODE_INITIAL_SECONDS);
  const [timedMinesFound, setTimedMinesFound] = useState(0);
  const [timedRunEnded, setTimedRunEnded] = useState(false);
  const leaderboardSummary = useGameLeaderboardSummary(mode);
  const { attemptStatus, attemptBlockReason, beginAttempt, completeAttempt, clearAttemptBlockReason } = useDailyChallenge();
  const gameBoardPreset: BoardPreset = mode === "daily" ? "daily" : "standard";
  const { board, status, time, formatTime, minesLeft, revealCell, toggleFlag, resetGame, endGame } = useGameLogic(gameBoardPreset, {
    allowFlags: mode !== "noFlags",
  });

  const resetTimedRun = () => {
    setTimedSecondsLeft(TIMED_MODE_INITIAL_SECONDS);
    setTimedMinesFound(0);
    setTimedRunEnded(false);
  };
  const restartGame = () => {
    setResultModalOpen(false);
    resetGame();
    resetTimedRun();
  };
  const handleMode = (nextMode: GameMode) => {
    setMode(nextMode);
    setResultModalOpen(false);
    if (nextMode === "daily" && (attemptStatus === "won" || attemptStatus === "lost")) {
      setDailyAttemptModalOpen(true);
    }
    resetGame();
    resetTimedRun();
  };
  const handleReveal = (row: number, col: number) => {
    if (mode !== "daily" || status !== "idle") {
      revealCell(row, col);
      return;
    }

    if (attemptStatus === "loading") return;
    if (attemptStatus !== "none" && attemptStatus !== "in_progress") {
      setDailyAttemptModalOpen(true);
      return;
    }
    if (attemptStatus === "in_progress") {
      revealCell(row, col);
      return;
    }

    beginAttempt().then((started) => {
      if (started) revealCell(row, col);
      else setDailyAttemptModalOpen(true);
    });
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
          const result = getTimedTimeoutResult({ board, minesFound: timedMinesFound });
          setTimedMinesFound(result.minesFound);
          setTimedRunEnded(true);
          endGame(result.status);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [board, endGame, mode, status, timedMinesFound]);

  useEffect(() => {
    if (mode !== "timed" || status !== "won" || timedRunEnded) return;

    const nextRun = applyTimedBoardClear({
      secondsLeft: timedSecondsLeft,
      minesFound: timedMinesFound,
      correctFlags: countCorrectFlags(board),
    });
    setTimedSecondsLeft(nextRun.secondsLeft);
    setTimedMinesFound(nextRun.minesFound);
    resetGame();
  }, [board, mode, resetGame, status, timedMinesFound, timedRunEnded, timedSecondsLeft]);

  useEffect(() => {
    if (mode !== "daily" || status === "idle" || status === "playing") {
      if (mode === "daily") dailyCompleteRef.current = false;
      return;
    }
    if (dailyCompleteRef.current) return;

    dailyCompleteRef.current = true;
    completeAttempt(status, time);
  }, [completeAttempt, mode, status, time]);

  useEffect(() => {
    if (status === "idle" || status === "playing") return;
    if (mode === "timed" && status === "won" && !timedRunEnded) return;
    setResultModalOpen(true);
  }, [mode, status, timedRunEnded]);

  useEffect(() => {
    if (status === "idle" || status === "playing") {
      savedRef.current = false;
      return;
    }
    if (savedRef.current || !user) return;

    // Skip saving individual boards in timed mode; save only the 60-second survival result.
    if (mode === "timed" && status === "won" && !timedRunEnded) return;
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

    supabase.from("game_attempts").insert(attempt).then(async ({ error }) => {
      if (error) { console.error("Failed to save game attempt:", error.message); return; }
      awardProfileXp({
        mode,
        status,
        timeSeconds: mode === "timed" ? null : time,
        minesFound: mode === "timed" ? timedMinesFound : null,
      });
      const newKeys = await checkAndUnlockAchievements(user!.id);
      if (newKeys.length > 0) queueAchievements(newKeys);
    });
  }, [status, mode, user, time, timedMinesFound, timedRunEnded]);

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

              <div className="game-status-strip w-full flex flex-wrap items-center justify-center gap-5" style={{ color: "var(--mm-text-2)" }}>
                <div className="flex items-center gap-1.5">
                  <StopWatchIcon size={15} color="var(--mm-amber)" />
                  <span style={{ color: "var(--mm-amber)", fontSize: "18px", fontWeight: 800 }}>{timerText}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BombIcon size={15} color="var(--mm-red)" />
                  <span style={{ color: "var(--mm-red)", fontSize: "18px", fontWeight: 800 }}>{minesLeft}</span>
                </div>
              </div>

              <div className="overflow-auto max-w-full">
                <MinesweeperBoard board={board} status={status} onReveal={handleReveal} onFlag={toggleFlag} flagsEnabled={mode !== "noFlags"} />
              </div>

              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{mode === "noFlags" ? t("mobileNoFlagsHelp") : t("boardMouseHelp")}</p>
            </div>

          </div>

          <div className="w-full lg:w-72 shrink-0">
            <ControlPanel
              mode={mode}
              onModeChange={handleMode}
              status={status}
              onRestart={restartGame}
              currentStreak={profileData?.currentStreak ?? 0}
              timedMinesFound={timedMinesFound}
              leaderboardRows={leaderboardSummary.rows}
              playerRank={leaderboardSummary.playerRank}
              leaderboardLoading={leaderboardSummary.isLoading}
              onLeaderboardClick={() => onNavigate("leaderboard")}
            />
          </div>
        </div>
      </div>
      <GameResultModal
        open={resultModalOpen}
        onOpenChange={setResultModalOpen}
        status={status === "won" ? "won" : "lost"}
        mode={mode}
        timeLabel={timerText}
        minesFound={timedMinesFound}
        onRestart={restartGame}
      />
      <DailyAttemptModal
        open={dailyAttemptModalOpen || attemptBlockReason === "dailyAttemptAlreadyUsed"}
        onOpenChange={(open) => {
          setDailyAttemptModalOpen(open);
          if (!open) clearAttemptBlockReason();
        }}
      />
    </div>
  );
}
