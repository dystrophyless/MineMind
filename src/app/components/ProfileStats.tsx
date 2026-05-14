import { BrainIcon, StarIcon, StopWatchIcon, FireIcon, ChartUpIcon, DiamondIcon, CrownIcon, BombIcon, FlashIcon } from "hugeicons-react";
import { useT } from "../i18n/LocaleProvider";
import type { ReactNode } from "react";
import type { TranslationKey } from "../i18n/translations";

type RecentGameResult = "won" | "lost";

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--mm-surface-3)" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color, boxShadow: `0 0 8px ${color}50` }} />
    </div>
  );
}

export function ProfileStats() {
  const t = useT();
  const stats = [
    { label: t("landingWinRate"), value: "82%", icon: <ChartUpIcon size={16} color="var(--mm-green)" />, color: "var(--mm-green)", change: t("profileThisWeek") },
    { label: t("profileGamesPlayed"), value: "1,247", icon: <BrainIcon size={16} color="var(--mm-blue)" />, color: "var(--mm-blue)", change: t("profileToday") },
    { label: t("landingBestTime"), value: "1:24", icon: <StopWatchIcon size={16} color="var(--mm-amber)" />, color: "var(--mm-amber)", change: t("difficultyBeginner") },
    { label: t("profileAvgAccuracy"), value: "94%", icon: <StarIcon size={16} color="var(--mm-purple)" />, color: "var(--mm-purple)", change: t("profileTopPercent") },
    { label: t("profileCurrentStreak"), value: "7", icon: <FireIcon size={16} color="var(--mm-red)" />, color: "var(--mm-red)", change: t("profilePersonalBest") },
    { label: t("profileFavDifficulty"), value: t("difficultyAdvanced"), icon: <BombIcon size={16} color="var(--mm-text-2)" />, color: "var(--mm-text-2)", change: t("profileOfGames") },
  ];
  const badges: { name: TranslationKey; desc: TranslationKey; icon: ReactNode; unlocked: boolean }[] = [
    { name: "profileBadgeSpeed", desc: "profileBadgeSpeedDesc", icon: <FlashIcon size={24} color="var(--mm-amber)" />, unlocked: true },
    { name: "profileBadgeFlawless", desc: "profileBadgeFlawlessDesc", icon: <StarIcon size={24} color="var(--mm-amber)" />, unlocked: true },
    { name: "profileBadgeStreak", desc: "profileBadgeStreakDesc", icon: <FireIcon size={24} color="var(--mm-amber)" />, unlocked: true },
    { name: "profileBadgeDaily", desc: "profileBadgeDailyDesc", icon: <StopWatchIcon size={24} color="var(--mm-amber)" />, unlocked: false },
    { name: "profileBadgeGrandmaster", desc: "profileBadgeGrandmasterDesc", icon: <CrownIcon size={24} color="var(--mm-amber)" />, unlocked: false },
    { name: "profileBadgeScholar", desc: "profileBadgeScholarDesc", icon: <BrainIcon size={24} color="var(--mm-amber)" />, unlocked: false },
  ];
  const recentGames: { diff: string; time: string; accuracy: number; result: RecentGameResult; date: string }[] = [
    { diff: t("difficultyAdvanced"), time: "2:14", accuracy: 96, result: "won", date: t("profileDateToday") },
    { diff: t("difficultyAdvanced"), time: "1:58", accuracy: 98, result: "won", date: t("profileDateToday") },
    { diff: t("difficultyExpert"), time: "-", accuracy: 72, result: "lost", date: t("profileDateToday") },
    { diff: t("difficultyBeginner"), time: "1:24", accuracy: 100, result: "won", date: t("profileDateYesterday") },
    { diff: t("difficultyAdvanced"), time: "2:37", accuracy: 95, result: "won", date: t("profileDateYesterday") },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 relative" style={{ background: "var(--mm-action-bg)", boxShadow: "var(--mm-action-shadow)" }}>
            <span style={{ color: "var(--mm-action-fg)", fontSize: "32px", fontWeight: 800 }}>Y</span>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--mm-purple)", border: "2px solid var(--mm-bg)" }}>
              <DiamondIcon size={10} color="#fff" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 style={{ color: "var(--mm-text)", fontSize: "24px", fontWeight: 800 }}>{t("leaderboardYou")}</h1>
              <div className="px-2.5 py-1 rounded-lg flex items-center gap-1.5" style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}>
                <CrownIcon size={11} color="var(--mm-amber)" />
                <span style={{ color: "var(--mm-amber)", fontSize: "11px", fontWeight: 700 }}>#247 {t("leaderboardGlobal")}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg" style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}>
                <span style={{ color: "var(--mm-text-2)", fontSize: "11px" }}>#12 Almaty</span>
              </div>
            </div>
            <p style={{ color: "var(--mm-text-2)", fontSize: "13px", marginBottom: "12px" }}>{t("profileMemberSince")}</p>
            <div>
              <div className="flex justify-between mb-1.5">
                <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{t("profileLevel")}</span>
                <span style={{ color: "var(--mm-amber)", fontSize: "11px" }}>7,240 / 10,000 XP</span>
              </div>
              <ProgressBar value={7240} max={10000} color="var(--mm-amber)" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-5 transition-all duration-200 hover:translate-y-[-1px]" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase" }}>{s.label}</span>
              </div>
              <p style={{ color: s.color, fontSize: "26px", fontWeight: 800, marginBottom: "4px" }}>{s.value}</p>
              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl p-5" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>{t("profileWinRateByDifficulty")}</p>
            <div className="flex flex-col gap-4">
              {[
                { label: t("difficultyBeginner"), rate: 96, color: "var(--mm-green)", games: 480 },
                { label: t("difficultyAdvanced"), rate: 82, color: "var(--mm-amber)", games: 620 },
                { label: t("difficultyExpert"), rate: 41, color: "var(--mm-red)", games: 147 },
              ].map(d => (
                <div key={d.label}>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ color: "var(--mm-text-2)", fontSize: "13px" }}>{d.label}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{d.games} {t("profileGames")}</span>
                      <span style={{ color: d.color, fontSize: "13px", fontWeight: 700, width: "40px", textAlign: "right" }}>{d.rate}%</span>
                    </div>
                  </div>
                  <ProgressBar value={d.rate} max={100} color={d.color} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>{t("profileRecentGames")}</p>
            <div className="flex flex-col gap-2">
              {recentGames.map((g, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: g.result === "won" ? "var(--mm-green)" : "var(--mm-red)" }} />
                  <span style={{ color: "var(--mm-text-2)", fontSize: "12px", flex: 1 }}>{g.diff}</span>
                  <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 700 }}>{g.time}</span>
                  <span style={{ color: "var(--mm-blue)", fontSize: "12px" }}>{g.accuracy}%</span>
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{g.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700 }}>{t("profileAchievements")}</p>
            <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>{t("profileUnlocked")}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {badges.map(b => (
              <div key={b.name} className="rounded-xl p-4 text-center flex flex-col items-center gap-2" style={{ background: b.unlocked ? "var(--mm-surface-2)" : "var(--mm-surface-1)", border: `1px solid ${b.unlocked ? "var(--mm-border-2)" : "var(--mm-border)"}`, opacity: b.unlocked ? 1 : 0.4, filter: b.unlocked ? "none" : "grayscale(1)" }}>
                <span className="h-6 flex items-center justify-center">{b.icon}</span>
                <div>
                  <p style={{ color: "var(--mm-text)", fontSize: "11px", fontWeight: 600 }}>{t(b.name)}</p>
                  <p style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{t(b.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
