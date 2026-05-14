import { useState } from "react";
import { FlashIcon, CrownIcon, BrainIcon } from "hugeicons-react";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { ControlPanel } from "./game/ControlPanel";
import { AICoach } from "./game/AICoach";
import { useGameLogic, Difficulty } from "./game/useGameLogic";
import { useT } from "../i18n/LocaleProvider";

type Props = {
  onNavigate: (page: "daily" | "leaderboard" | "profile" | "design") => void;
};

export function GameDashboard({ onNavigate }: Props) {
  const t = useT();
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const { board, status, time, formatTime, minesLeft, accuracy, revealCell, toggleFlag, resetGame, config } = useGameLogic(difficulty);

  const handleDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    resetGame();
  };

  const difficultyLabels: Record<Difficulty, string> = {
    beginner: t("difficultyBeginner"),
    intermediate: t("difficultyAdvanced"),
    expert: t("difficultyExpert"),
    daily: t("difficultyDaily"),
  };
  const statusLabel = status === "idle" ? t("statusReady") : status === "playing" ? t("statusLive") : status === "won" ? t("statusVictory") : t("statusGameOver");

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--mm-bg)" }}>
      <div className="flex flex-1 overflow-auto">
        <div className="flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto px-4 py-6 gap-6">
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)", minHeight: "400px" }}>
              <div className="w-full flex items-center justify-between">
                <div>
                  <p style={{ color: "var(--mm-text)", fontSize: "15px", fontWeight: 700 }}>{difficultyLabels[difficulty]} {t("mode")}</p>
                  <p style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>{config.rows} x {config.cols} · {config.mines} {t("boardMines")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: status === "playing" ? "var(--mm-green)" : status === "won" ? "var(--mm-amber)" : status === "lost" ? "var(--mm-red)" : "var(--mm-text-3)", boxShadow: status === "playing" ? "0 0 6px var(--mm-green)" : "none" }} />
                    <span style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>{statusLabel}</span>
                  </div>
                </div>
              </div>

              <div className="overflow-auto max-w-full">
                <MinesweeperBoard board={board} status={status} onReveal={revealCell} onFlag={toggleFlag} />
              </div>

              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{t("boardMouseHelp")}</p>
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
            <ControlPanel difficulty={difficulty} onDifficultyChange={handleDifficulty} time={formatTime(time)} minesLeft={minesLeft} accuracy={accuracy} status={status} onRestart={resetGame} />
          </div>
        </div>
      </div>
    </div>
  );
}
