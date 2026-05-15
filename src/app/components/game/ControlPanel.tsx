import type { ReactNode } from "react";
import { StopWatchIcon, BombIcon, FireIcon, ChartUpIcon, ArrowReloadHorizontalIcon, FlashIcon, CrownIcon, DiamondIcon, StarIcon } from "hugeicons-react";
import { GameStatus } from "./useGameLogic";
import { useT } from "../../i18n/LocaleProvider";

type GameMode = "classic" | "noFlags" | "timed" | "daily";

type Props = {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  time: string;
  minesLeft: number;
  status: GameStatus;
  onRestart: () => void;
  currentStreak: number;
  timedMinesFound?: number;
  globalRank: number | null;
  cityRank: number | null;
  city: string | null;
  onLeaderboardClick: () => void;
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

export function ControlPanel({ mode, onModeChange, time, minesLeft, status, onRestart, currentStreak = 0, timedMinesFound = 0, globalRank, cityRank, city, onLeaderboardClick }: Props) {
  const t = useT();
  const modes: { key: GameMode; label: string }[] = [
    { key: "classic", label: t("mobileModeClassic") },
    { key: "noFlags", label: t("mobileModeNoFlags") },
    { key: "timed", label: t("mobileModeTimed") },
    { key: "daily", label: t("mobileModeDaily") },
  ];
  const statusText = status === "won" ? t("controlsYouWon") : status === "lost" ? t("controlsMineHit") : t("controlsPlaying");
  const scoreIcon = mode === "timed" ? <ChartUpIcon size={13} color="var(--mm-amber)" /> : <FireIcon size={13} color="var(--mm-amber)" />;
  const selectMode = (nextMode: GameMode) => {
    onModeChange(nextMode);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-1 grid grid-cols-2 gap-1" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
        {modes.map(d => (
          <button key={d.key} onClick={() => selectMode(d.key)} className="rounded-lg py-2 px-3 transition-all duration-200" style={{ background: mode === d.key ? "var(--mm-selected-bg)" : "transparent", color: mode === d.key ? "var(--mm-selected-fg)" : "var(--mm-text-3)", fontSize: "12px", fontWeight: mode === d.key ? 700 : 500, fontFamily: "var(--font-mabry)", border: mode === d.key ? "1px solid var(--mm-selected-border)" : "1px solid transparent" }}>
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
        <StatBlock icon={scoreIcon} label={mode === "timed" ? t("mobileTimedScore") : t("controlsStreak")} value={mode === "timed" ? timedMinesFound : currentStreak} color="var(--mm-amber)" />
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

      <button onClick={onLeaderboardClick} className="w-full rounded-xl p-4 text-left transition-all duration-200 hover:brightness-110 active:scale-[0.99]" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border-2)" }}>
        <div className="flex items-center gap-2 mb-2">
          <CrownIcon size={14} color="var(--mm-purple)" />
          <span style={{ color: "var(--mm-purple)", fontSize: "12px", fontWeight: 700 }}>{t("leaderboardTitle")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            <p style={{ color: "var(--mm-text-3)", fontSize: "10px", textTransform: "uppercase", fontWeight: 700 }}>{t("leaderboardGlobal")}</p>
            <p style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800, lineHeight: 1.1, marginTop: "6px" }}>
              {globalRank ? `#${globalRank}` : "—"}
            </p>
          </div>
          <div className="rounded-lg p-2" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            <p style={{ color: "var(--mm-text-3)", fontSize: "10px", textTransform: "uppercase", fontWeight: 700 }}>{city ?? t("leaderboardCity")}</p>
            <p style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800, lineHeight: 1.1, marginTop: "6px" }}>
              {cityRank ? `#${cityRank}` : "—"}
            </p>
          </div>
        </div>
      </button>

      <div className="rounded-xl p-4" style={{ background: "var(--mm-pro-bg)", border: "1px solid rgba(155,114,239,0.25)" }}>
        <div className="flex items-center gap-2 mb-2">
          <DiamondIcon size={16} color="var(--mm-purple)" />
          <span style={{ color: "var(--mm-purple)", fontSize: "12px", fontWeight: 700 }}>{t("controlsUpgrade")}</span>
        </div>
        <p style={{ color: "var(--mm-text-3)", fontSize: "11px", lineHeight: 1.5, marginBottom: "10px" }}>{t("controlsUpgradeDesc")}</p>
        <button className="w-full rounded-lg py-2 inline-flex items-center justify-center gap-1.5 transition-all duration-200 hover:brightness-110" style={{ background: "var(--mm-purple)", color: "#fff", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
          <StarIcon size={12} color="#fff" aria-hidden="true" />
          {t("controlsGoPro")}
        </button>
      </div>
    </div>
  );
}
