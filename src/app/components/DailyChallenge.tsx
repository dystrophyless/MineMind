import { useState } from "react";
import { FlashIcon, StopWatchIcon, CrownIcon, StarIcon, MedalFirstPlaceIcon, BombIcon, ArrowRightBigIcon } from "hugeicons-react";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { useGameLogic } from "./game/useGameLogic";
import { useT } from "../i18n/LocaleProvider";

const TOP_PLAYERS = [
  { rank: 1, name: "NovakD", city: "Belgrade", time: "0:47" },
  { rank: 2, name: "AliyaM", city: "Almaty", time: "0:52" },
  { rank: 3, name: "KimJH", city: "Seoul", time: "0:58" },
  { rank: 4, name: "MariaG", city: "Madrid", time: "1:02" },
  { rank: 5, name: "AhmedK", city: "Cairo", time: "1:08" },
];

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <MedalFirstPlaceIcon size={16} color="#F5C060" />;
  if (rank === 2) return <StarIcon size={16} color="#A8A4B8" />;
  if (rank === 3) return <StarIcon size={16} color="#C07010" />;
  return <span style={{ color: "var(--mm-text-3)", fontSize: "13px", fontWeight: 700, width: "16px", textAlign: "center" }}>#{rank}</span>;
}

export function DailyChallenge() {
  const t = useT();
  const { board, status, revealCell, toggleFlag, time, formatTime, minesLeft } = useGameLogic("daily");
  const [attempted, setAttempted] = useState(false);
  const rules = [t("dailyRuleSame"), t("dailyRuleAttempts"), t("dailyRuleTimer"), t("dailyRuleNoAi")];

  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-[1180px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FlashIcon size={16} color="var(--mm-amber)" />
              <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>{t("dailyTitle")}</span>
            </div>
            <h1 style={{ color: "var(--mm-text)", fontSize: "28px", fontWeight: 800, lineHeight: 1.1 }}>{t("dailyDate")}</h1>
            <p style={{ color: "var(--mm-text-2)", fontSize: "13px", marginTop: "6px" }}>{t("dailySeed")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
            {[["4,218", t("dailyAttempts"), "var(--mm-amber)"], ["3", t("dailyAttemptsLeft"), "var(--mm-green)"], ["0:47", t("dailyBestToday"), "var(--mm-blue)"]].map(([value, label, color]) => (
              <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)", minWidth: "84px" }}>
                <p style={{ color, fontSize: "22px", fontWeight: 800, lineHeight: 1 }}>{value}</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px", marginTop: "6px" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[auto_360px] gap-4 items-start justify-center xl:justify-between">
          <div className="min-w-0">
            <div className="rounded-2xl p-4 sm:p-5 w-fit max-w-full mx-auto" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              {!attempted ? (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="opacity-30 pointer-events-none select-none">
                      <MinesweeperBoard board={board} status="idle" onReveal={() => {}} onFlag={() => {}} />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ backdropFilter: "blur(3px)" }}>
                      <div className="rounded-2xl p-6 text-center" style={{ background: "var(--mm-modal-bg)", border: "1px solid var(--mm-border-2)", maxWidth: "260px" }}>
                        <FlashIcon size={32} color="var(--mm-amber)" style={{ margin: "0 auto 12px" }} />
                        <p style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{t("dailyReadyTitle")}</p>
                        <p style={{ color: "var(--mm-text-3)", fontSize: "13px", marginBottom: "16px" }}>{t("dailyReadyDesc")}</p>
                        <button onClick={() => setAttempted(true)} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 transition-all hover:brightness-110" style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
                          <ArrowRightBigIcon size={16} color="var(--mm-action-fg)" />
                          {t("dailyBegin")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5" style={{ color: "var(--mm-amber)" }}>
                        <StopWatchIcon size={14} color="var(--mm-amber)" />
                        <span style={{ fontSize: "20px", fontWeight: 800 }}>{formatTime(time)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BombIcon size={14} color="var(--mm-red)" />
                        <span style={{ color: "var(--mm-red)", fontSize: "16px", fontWeight: 700 }}>{minesLeft}</span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "var(--mm-green-glow)", border: "1px solid rgba(76,217,123,0.2)" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--mm-green)" }} />
                      <span style={{ color: "var(--mm-green)", fontSize: "12px" }}>{t("statusLive")}</span>
                    </div>
                  </div>

                  <div className="overflow-auto max-w-full">
                    <MinesweeperBoard board={board} status={status} onReveal={revealCell} onFlag={toggleFlag} />
                  </div>

                  {status !== "idle" && status !== "playing" && (
                    <div className="w-full rounded-xl p-4 text-center" style={{ background: status === "won" ? "var(--mm-green-glow)" : "var(--mm-red-glow)", border: `1px solid ${status === "won" ? "rgba(76,217,123,0.3)" : "rgba(229,90,90,0.3)"}` }}>
                      <p style={{ color: status === "won" ? "var(--mm-green)" : "var(--mm-red)", fontSize: "16px", fontWeight: 700 }}>
                        {status === "won" ? `${t("dailySolvedPrefix")} ${formatTime(time)}!` : t("dailyMineHit")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:sticky xl:top-24 xl:max-h-[calc(100vh-132px)]">
            <div className="rounded-2xl p-4" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <CrownIcon size={16} color="var(--mm-amber)" />
                <span style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700 }}>{t("dailyTodaysTop")}</span>
              </div>
              <div className="flex flex-col gap-2">
                {TOP_PLAYERS.map(p => (
                  <div key={p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: p.rank === 1 ? "var(--mm-amber-glow)" : "var(--mm-surface-2)", border: `1px solid ${p.rank === 1 ? "var(--mm-border-amber)" : "var(--mm-border)"}` }}>
                    <RankMedal rank={p.rank} />
                    <div className="flex-1 min-w-0">
                      <p style={{ color: "var(--mm-text)", fontSize: "13px", fontWeight: 600 }}>{p.name}</p>
                      <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{p.city}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: "var(--mm-amber)", fontSize: "13px", fontWeight: 700 }}>{p.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <p style={{ color: "var(--mm-text)", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>{t("dailyRules")}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                {rules.map(r => (
                  <li key={r} className="flex items-start gap-2">
                    <span style={{ color: "var(--mm-amber)", fontSize: "12px" }}>-</span>
                    <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
