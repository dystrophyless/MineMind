import type { ReactNode } from "react";
import { StopWatchIcon, BombIcon, TargetDollarIcon, FireIcon, ArrowReloadHorizontalIcon, ShareKnowledgeIcon, StarIcon, DiamondIcon } from "hugeicons-react";
import { Difficulty, DIFFICULTY_CONFIG, GameStatus } from "./useGameLogic";

type Props = {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  time: string;
  minesLeft: number;
  accuracy: number;
  status: GameStatus;
  onRestart: () => void;
};

const DIFFS: { key: Difficulty; label: string }[] = [
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Advanced" },
  { key: "expert", label: "Expert" },
  { key: "daily", label: "Daily" },
];

function StatBlock({ icon, label, value, color }: { icon: ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div
      className="flex-1 rounded-xl p-3 flex flex-col gap-1"
      style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      </div>
      <span style={{ color: color || "var(--mm-text)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
        {value}
      </span>
    </div>
  );
}

export function ControlPanel({ difficulty, onDifficultyChange, time, minesLeft, accuracy, status, onRestart }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Difficulty tabs */}
      <div
        className="rounded-xl p-1 grid grid-cols-2 gap-1"
        style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}
      >
        {DIFFS.map(d => (
          <button
            key={d.key}
            onClick={() => onDifficultyChange(d.key)}
            className="rounded-lg py-2 px-3 transition-all duration-200"
            style={{
              background: difficulty === d.key ? "var(--mm-amber)" : "transparent",
              color: difficulty === d.key ? "var(--mm-bg)" : "var(--mm-text-3)",
              fontSize: "12px",
              fontWeight: difficulty === d.key ? 700 : 500,
              fontFamily: "var(--font-mabry)",
              boxShadow: difficulty === d.key ? "0 2px 8px var(--mm-amber-glow-strong)" : "none",
            }}
          >
            {d.label}
            {d.key === "daily" && (
              <span className="ml-1" style={{ fontSize: "9px", verticalAlign: "super" }}>🔥</span>
            )}
          </button>
        ))}
      </div>

      {/* Stats row 1: Timer + Mines */}
      <div className="flex gap-3">
        <StatBlock
          icon={<StopWatchIcon size={13} color="var(--mm-amber)" />}
          label="Time"
          value={time}
          color="var(--mm-amber)"
        />
        <StatBlock
          icon={<BombIcon size={13} color="var(--mm-red)" />}
          label="Mines"
          value={minesLeft}
          color="var(--mm-red)"
        />
      </div>

      {/* Stats row 2: Accuracy + Streak */}
      <div className="flex gap-3">
        <StatBlock
          icon={<TargetDollarIcon size={13} color="var(--mm-blue)" />}
          label="Accuracy"
          value={`${accuracy}%`}
          color="var(--mm-blue)"
        />
        <StatBlock
          icon={<FireIcon size={13} color="var(--mm-amber)" />}
          label="Streak"
          value="7"
          color="var(--mm-amber)"
        />
      </div>

      {/* Game status badge */}
      {status !== "idle" && (
        <div
          className="rounded-xl py-2.5 px-4 text-center"
          style={{
            background: status === "won" ? "var(--mm-green-glow)" : status === "lost" ? "var(--mm-red-glow)" : "var(--mm-surface-2)",
            border: `1px solid ${status === "won" ? "rgba(76,217,123,0.3)" : status === "lost" ? "rgba(229,90,90,0.3)" : "var(--mm-border)"}`,
          }}
        >
          <p style={{
            color: status === "won" ? "var(--mm-green)" : status === "lost" ? "var(--mm-red)" : "var(--mm-text-2)",
            fontSize: "13px",
            fontWeight: 600,
          }}>
            {status === "won" ? "🎉 You won!" : status === "lost" ? "💥 Mine hit!" : "Playing..."}
          </p>
        </div>
      )}

      {/* Buttons */}
      <button
        onClick={onRestart}
        className="w-full rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-95"
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

      <button
        className="w-full rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-95"
        style={{
          background: "var(--mm-surface-2)",
          color: "var(--mm-text-2)",
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "var(--font-mabry)",
          border: "1px solid var(--mm-border-2)",
        }}
      >
        <ShareKnowledgeIcon size={16} color="var(--mm-text-2)" />
        Share Result
      </button>

      {/* Pro upgrade */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "linear-gradient(135deg, #1A1428, #120E20)",
          border: "1px solid rgba(155,114,239,0.25)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <DiamondIcon size={16} color="var(--mm-purple)" />
          <span style={{ color: "var(--mm-purple)", fontSize: "12px", fontWeight: 700 }}>Upgrade to Pro</span>
        </div>
        <p style={{ color: "var(--mm-text-3)", fontSize: "11px", lineHeight: 1.5, marginBottom: "10px" }}>
          Custom board skins, advanced AI Coach, detailed probability analysis
        </p>
        <button
          className="w-full rounded-lg py-2 transition-all duration-200 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, var(--mm-purple), #7B52EF)",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "var(--font-mabry)",
            boxShadow: "0 4px 12px rgba(155,114,239,0.35)",
          }}
        >
          <StarIcon size={12} color="#fff" style={{ display: "inline", marginRight: "6px" }} />
          Go Pro — $4.99/mo
        </button>
      </div>
    </div>
  );
}
