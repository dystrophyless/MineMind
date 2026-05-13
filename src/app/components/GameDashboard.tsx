import { useState } from "react";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { ControlPanel } from "./game/ControlPanel";
import { AICoach } from "./game/AICoach";
import { useGameLogic, Difficulty } from "./game/useGameLogic";
import { FlashIcon, CrownIcon, BrainIcon } from "hugeicons-react";

type Props = {
  onNavigate: (page: "daily" | "leaderboard" | "profile" | "design") => void;
};

export function GameDashboard({ onNavigate }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const { board, status, time, formatTime, minesLeft, accuracy, revealCell, toggleFlag, resetGame, config } = useGameLogic(difficulty);

  const handleDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    resetGame();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--mm-bg)" }}>
      <div className="flex flex-1 overflow-auto">
        {/* Main layout */}
        <div className="flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto px-4 py-6 gap-6">
          {/* Left: Board + AI Coach */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {/* Board area */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
              style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)", minHeight: "400px" }}
            >
              {/* Board header */}
              <div className="w-full flex items-center justify-between">
                <div>
                  <p style={{ color: "var(--mm-text)", fontSize: "15px", fontWeight: 700 }}>
                    {config.label} Mode
                  </p>
                  <p style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>
                    {config.rows}×{config.cols} · {config.mines} mines
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: status === "playing" ? "var(--mm-green)" : status === "won" ? "var(--mm-amber)" : status === "lost" ? "var(--mm-red)" : "var(--mm-text-3)",
                        boxShadow: status === "playing" ? "0 0 6px var(--mm-green)" : "none",
                      }}
                    />
                    <span style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>
                      {status === "idle" ? "Ready" : status === "playing" ? "Live" : status === "won" ? "Victory" : "Game Over"}
                    </span>
                  </div>
                </div>
              </div>

              {/* The game board */}
              <div className="overflow-auto max-w-full">
                <MinesweeperBoard
                  board={board}
                  status={status}
                  onReveal={revealCell}
                  onFlag={toggleFlag}
                />
              </div>

              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>
                Left-click to reveal · Right-click to flag
              </p>
            </div>

            {/* AI Coach */}
            <AICoach status={status} />

            {/* Bottom cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Daily Challenge mini card */}
              <button
                className="rounded-xl p-4 text-left transition-all duration-200 hover:brightness-110"
                style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}
                onClick={() => onNavigate("daily")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FlashIcon size={14} color="var(--mm-amber)" />
                  <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 600 }}>Daily Challenge</span>
                </div>
                <p style={{ color: "var(--mm-text)", fontSize: "18px", fontWeight: 800 }}>May 13</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>4,218 attempts · 3 left</p>
              </button>

              {/* Leaderboard mini card */}
              <button
                className="rounded-xl p-4 text-left transition-all duration-200 hover:brightness-110"
                style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}
                onClick={() => onNavigate("leaderboard")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CrownIcon size={14} color="var(--mm-purple)" />
                  <span style={{ color: "var(--mm-purple)", fontSize: "12px", fontWeight: 600 }}>Leaderboard</span>
                </div>
                <p style={{ color: "var(--mm-text)", fontSize: "18px", fontWeight: 800 }}>#247</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>Global rank · Almaty #12</p>
              </button>

              {/* Stats mini card */}
              <button
                className="rounded-xl p-4 text-left transition-all duration-200 hover:brightness-110"
                style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}
                onClick={() => onNavigate("profile")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BrainIcon size={14} color="var(--mm-blue)" />
                  <span style={{ color: "var(--mm-blue)", fontSize: "12px", fontWeight: 600 }}>Your Stats</span>
                </div>
                <p style={{ color: "var(--mm-text)", fontSize: "18px", fontWeight: 800 }}>82%</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>Win rate · 7 day streak</p>
              </button>
            </div>
          </div>

          {/* Right: Control panel */}
          <div className="w-full lg:w-72 shrink-0">
            <ControlPanel
              difficulty={difficulty}
              onDifficultyChange={handleDifficulty}
              time={formatTime(time)}
              minesLeft={minesLeft}
              accuracy={accuracy}
              status={status}
              onRestart={resetGame}
            />

            {/* Spacer + Pro banner */}
            <div className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
