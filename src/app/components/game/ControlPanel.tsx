import type { ReactNode } from "react";
import { StopWatchIcon, BombIcon, TargetDollarIcon, FireIcon, ArrowReloadHorizontalIcon, ShareKnowledgeIcon, StarIcon, DiamondIcon, FlashIcon } from "hugeicons-react";
import { Difficulty, GameStatus } from "./useGameLogic";
import { useT } from "../../i18n/LocaleProvider";

type Props = {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  time: string;
  minesLeft: number;
  accuracy: number;
  status: GameStatus;
  onRestart: () => void;
};

function StatBlock({ icon, label, value, color }: { icon: ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div className="flex-1 rounded-xl p-3 flex flex-col gap-1" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase" }}>{label}</span>
      </div>
      <span style={{ color: color || "var(--mm-text)", fontSize: "22px", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export function ControlPanel({ difficulty, onDifficultyChange, time, minesLeft, accuracy, status, onRestart }: Props) {
  const t = useT();
  const diffs: { key: Difficulty; label: string }[] = [
    { key: "beginner", label: t("difficultyBeginner") },
    { key: "intermediate", label: t("difficultyAdvanced") },
    { key: "expert", label: t("difficultyExpert") },
    { key: "daily", label: t("difficultyDaily") },
  ];
  const statusText = status === "won" ? t("controlsYouWon") : status === "lost" ? t("controlsMineHit") : t("controlsPlaying");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-1 grid grid-cols-2 gap-1" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
        {diffs.map(d => (
          <button key={d.key} onClick={() => onDifficultyChange(d.key)} className="rounded-lg py-2 px-3 transition-all duration-200" style={{ background: difficulty === d.key ? "var(--mm-selected-bg)" : "transparent", color: difficulty === d.key ? "var(--mm-selected-fg)" : "var(--mm-text-3)", fontSize: "12px", fontWeight: difficulty === d.key ? 700 : 500, fontFamily: "var(--font-mabry)", border: difficulty === d.key ? "1px solid var(--mm-selected-border)" : "1px solid transparent" }}>
            {d.label}
            {d.key === "daily" && <FlashIcon size={10} color="currentColor" style={{ display: "inline", marginLeft: "4px", verticalAlign: "-1px" }} />}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <StatBlock icon={<StopWatchIcon size={13} color="var(--mm-amber)" />} label={t("controlsTime")} value={time} color="var(--mm-amber)" />
        <StatBlock icon={<BombIcon size={13} color="var(--mm-red)" />} label={t("controlsMines")} value={minesLeft} color="var(--mm-red)" />
      </div>

      <div className="flex gap-3">
        <StatBlock icon={<TargetDollarIcon size={13} color="var(--mm-blue)" />} label={t("controlsAccuracy")} value={`${accuracy}%`} color="var(--mm-blue)" />
        <StatBlock icon={<FireIcon size={13} color="var(--mm-amber)" />} label={t("controlsStreak")} value="7" color="var(--mm-amber)" />
      </div>

      {status !== "idle" && (
        <div className="rounded-xl py-2.5 px-4 text-center" style={{ background: status === "won" ? "var(--mm-green-glow)" : status === "lost" ? "var(--mm-red-glow)" : "var(--mm-surface-2)", border: `1px solid ${status === "won" ? "rgba(76,217,123,0.3)" : status === "lost" ? "rgba(229,90,90,0.3)" : "var(--mm-border)"}` }}>
          <p style={{ color: status === "won" ? "var(--mm-green)" : status === "lost" ? "var(--mm-red)" : "var(--mm-text-2)", fontSize: "13px", fontWeight: 600 }}>{statusText}</p>
        </div>
      )}

      <button onClick={onRestart} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
        <ArrowReloadHorizontalIcon size={16} color="var(--mm-action-fg)" />
        {t("controlsNewGame")}
      </button>

      <button className="w-full rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: "var(--mm-surface-2)", color: "var(--mm-text-2)", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border-2)" }}>
        <ShareKnowledgeIcon size={16} color="var(--mm-text-2)" />
        {t("controlsShareResult")}
      </button>

      <div className="rounded-xl p-4" style={{ background: "var(--mm-pro-bg)", border: "1px solid rgba(155,114,239,0.25)" }}>
        <div className="flex items-center gap-2 mb-2">
          <DiamondIcon size={16} color="var(--mm-purple)" />
          <span style={{ color: "var(--mm-purple)", fontSize: "12px", fontWeight: 700 }}>{t("controlsUpgrade")}</span>
        </div>
        <p style={{ color: "var(--mm-text-3)", fontSize: "11px", lineHeight: 1.5, marginBottom: "10px" }}>{t("controlsUpgradeDesc")}</p>
        <button className="w-full rounded-lg py-2 transition-all duration-200 hover:brightness-110" style={{ background: "var(--mm-purple)", color: "#fff", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
          <StarIcon size={12} color="#fff" style={{ display: "inline", marginRight: "6px" }} />
          {t("controlsGoPro")}
        </button>
      </div>
    </div>
  );
}
