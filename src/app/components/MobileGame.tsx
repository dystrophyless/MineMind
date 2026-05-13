import { useState } from "react";
import { BombIcon, StopWatchIcon, ArrowReloadHorizontalIcon, SparklesIcon, RacingFlagIcon, FlashIcon, CrownIcon } from "hugeicons-react";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { useGameLogic, Difficulty } from "./game/useGameLogic";
import { AICoach } from "./game/AICoach";

type BottomSheet = "controls" | "ai" | null;

export function MobileGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [sheet, setSheet] = useState<BottomSheet>(null);
  const { board, status, time, formatTime, minesLeft, accuracy, revealCell, toggleFlag, resetGame } = useGameLogic(difficulty);

  return (
    <div
      className="flex flex-col h-full select-none"
      style={{ background: "var(--mm-bg)", maxWidth: "430px", margin: "0 auto" }}
    >
      {/* Mobile top bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "var(--mm-surface-1)", borderBottom: "1px solid var(--mm-border)" }}
      >
        <span style={{ color: "var(--mm-text)", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Mine<span style={{ color: "var(--mm-amber)" }}>Mind</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setSheet(sheet === "ai" ? null : "ai")}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: sheet === "ai" ? "var(--mm-amber-glow)" : "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}
          >
            <SparklesIcon size={15} color="var(--mm-amber)" />
          </button>
          <button
            onClick={() => setSheet(sheet === "controls" ? null : "controls")}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: sheet === "controls" ? "var(--mm-amber-glow)" : "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}
          >
            <span style={{ color: "var(--mm-text-2)", fontSize: "16px" }}>☰</span>
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="flex items-center justify-between px-4 py-2.5 gap-2"
        style={{ background: "var(--mm-surface-2)", borderBottom: "1px solid var(--mm-border)" }}
      >
        <div className="flex items-center gap-1.5">
          <StopWatchIcon size={13} color="var(--mm-amber)" />
          <span style={{ color: "var(--mm-amber)", fontSize: "16px", fontWeight: 800 }}>{formatTime(time)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BombIcon size={13} color="var(--mm-red)" />
          <span style={{ color: "var(--mm-red)", fontSize: "16px", fontWeight: 800 }}>{minesLeft}</span>
        </div>
        <div
          className="px-2.5 py-1 rounded-lg"
          style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}
        >
          <span style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>Beginner</span>
        </div>
        <button
          onClick={resetGame}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}
        >
          <ArrowReloadHorizontalIcon size={14} color="var(--mm-text-2)" />
        </button>
      </div>

      {/* Board */}
      <div
        className="flex-1 flex items-center justify-center p-4 overflow-auto"
        style={{ minHeight: "360px" }}
      >
        <MinesweeperBoard
          board={board}
          status={status}
          onReveal={revealCell}
          onFlag={toggleFlag}
          mobileCompact
        />
      </div>

      {/* Status bar */}
      {status !== "idle" && status !== "playing" && (
        <div
          className="mx-4 mb-2 rounded-xl py-3 px-4 text-center"
          style={{
            background: status === "won" ? "var(--mm-green-glow)" : "var(--mm-red-glow)",
            border: `1px solid ${status === "won" ? "rgba(76,217,123,0.3)" : "rgba(229,90,90,0.3)"}`,
          }}
        >
          <p style={{ color: status === "won" ? "var(--mm-green)" : "var(--mm-red)", fontSize: "14px", fontWeight: 700 }}>
            {status === "won" ? `🎉 Cleared in ${formatTime(time)}!` : "💥 Mine hit — try again"}
          </p>
        </div>
      )}

      {/* Bottom hint */}
      <div className="px-4 py-2 text-center">
        <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>
          Tap to reveal · Long-press to flag
        </p>
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-around py-3 px-4"
        style={{ background: "var(--mm-surface-1)", borderTop: "1px solid var(--mm-border)" }}
      >
        {[
          { icon: <FlashIcon size={18} color="var(--mm-amber)" />, label: "Daily" },
          { icon: <CrownIcon size={18} color="var(--mm-text-3)" />, label: "Ranks" },
          { icon: <span style={{ fontSize: "18px" }}>⬡</span>, label: "Play", active: true },
          { icon: <SparklesIcon size={18} color="var(--mm-text-3)" />, label: "AI" },
          { icon: <span style={{ fontSize: "18px" }}>👤</span>, label: "Profile" },
        ].map(item => (
          <button key={item.label} className="flex flex-col items-center gap-1">
            {item.icon}
            <span style={{ color: item.active ? "var(--mm-amber)" : "var(--mm-text-3)", fontSize: "10px" }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Sheet — Controls */}
      {sheet === "controls" && (
        <div
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5 z-50"
          style={{
            background: "var(--mm-surface-2)",
            border: "1px solid var(--mm-border-2)",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
            maxWidth: "430px",
            margin: "0 auto",
          }}
        >
          <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--mm-border-2)" }} />
          <p style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Game Controls</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {(["beginner", "intermediate", "expert", "daily"] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); resetGame(); setSheet(null); }}
                className="rounded-xl py-3 transition-all"
                style={{
                  background: difficulty === d ? "var(--mm-amber)" : "var(--mm-surface-3)",
                  color: difficulty === d ? "var(--mm-bg)" : "var(--mm-text-2)",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "var(--font-mabry)",
                  border: `1px solid ${difficulty === d ? "var(--mm-amber)" : "var(--mm-border)"}`,
                  boxShadow: difficulty === d ? "0 2px 12px var(--mm-amber-glow-strong)" : "none",
                  textTransform: "capitalize",
                }}
              >
                {d === "intermediate" ? "Advanced" : d}
              </button>
            ))}
          </div>

          <button
            onClick={() => { resetGame(); setSheet(null); }}
            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))",
              color: "var(--mm-bg)",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-mabry)",
              boxShadow: "0 4px 16px var(--mm-amber-glow-strong)",
            }}
          >
            <ArrowReloadHorizontalIcon size={16} color="var(--mm-bg)" />
            New Game
          </button>
        </div>
      )}

      {/* Bottom Sheet — AI Coach */}
      {sheet === "ai" && (
        <div
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5 z-50"
          style={{
            background: "var(--mm-surface-2)",
            border: "1px solid var(--mm-border-2)",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
            maxWidth: "430px",
            margin: "0 auto",
          }}
        >
          <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--mm-border-2)" }} />
          <AICoach status={status} />
          <button
            className="w-full rounded-xl py-3 mt-3"
            onClick={() => setSheet(null)}
            style={{ background: "var(--mm-surface-3)", color: "var(--mm-text-2)", fontSize: "13px", fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border)" }}
          >
            Close
          </button>
        </div>
      )}

      {/* Overlay for bottom sheets */}
      {sheet && (
        <div
          className="absolute inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSheet(null)}
        />
      )}
    </div>
  );
}
