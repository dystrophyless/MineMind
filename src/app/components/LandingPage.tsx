import { BrainIcon, FlashIcon, CrownIcon, StarIcon, ArrowRightBigIcon, ChartUpIcon, RacingFlagIcon, BombIcon, FireIcon } from "hugeicons-react";
import { useT } from "../i18n/LocaleProvider";

type Props = {
  onPlay: () => void;
  onDaily: () => void;
};

const MINI_BOARD = [
  [0, 1, -1, 1, 0],
  [1, 2, 2, 2, 1],
  [-1, 2, -2, 2, -1],
  [1, 2, 2, 2, 1],
  [0, 1, -1, 1, 0],
];

function MiniCell({ val }: { val: number }) {
  if (val === -1) {
    return (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--mm-cell-closed-bg)", boxShadow: "var(--cell-closed-shadow)", border: "1px solid var(--mm-border-amber)" }}>
        <RacingFlagIcon size={15} color="var(--mm-amber)" />
      </div>
    );
  }
  if (val === -2) {
    return (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--mm-cell-mine-bg)", border: "1px solid rgba(229,90,90,0.3)" }}>
        <BombIcon size={15} color="var(--mm-red)" />
      </div>
    );
  }
  if (val === 0) {
    return <div className="w-10 h-10 rounded-lg" style={{ background: "var(--mm-cell-closed-bg)", boxShadow: "var(--cell-closed-shadow)", border: "1px solid var(--mm-border)" }} />;
  }
  const colors: Record<number, string> = { 1: "var(--mm-blue)", 2: "var(--mm-green)", 3: "var(--mm-red)", 4: "var(--mm-purple)" };
  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--mm-cell-open-bg)", border: "1px solid var(--mm-border)" }}>
      <span style={{ color: colors[val] || "var(--mm-text)", fontSize: "14px", fontWeight: 700 }}>{val}</span>
    </div>
  );
}

export function LandingPage({ onPlay, onDaily }: Props) {
  const t = useT();
  const features = [
    { icon: <BrainIcon size={20} color="var(--mm-amber)" />, title: t("landingAiCoachTitle"), desc: t("landingAiCoachDesc") },
    { icon: <FlashIcon size={20} color="var(--mm-blue)" />, title: t("landingDailyTitle"), desc: t("landingDailyDesc") },
    { icon: <CrownIcon size={20} color="var(--mm-purple)" />, title: t("landingLeaderboardsTitle"), desc: t("landingLeaderboardsDesc") },
    { icon: <ChartUpIcon size={20} color="var(--mm-green)" />, title: t("landingStatsTitle"), desc: t("landingStatsDesc") },
  ];
  const stats = [
    { value: "2.4M+", label: t("landingGamesPlayed") },
    { value: "98K", label: t("landingActivePlayers") },
    { value: "99.8%", label: t("landingUptime") },
    { value: "#1", label: t("landingStrategyMinesweeper") },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--mm-hero-glow)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}>
              <FlashIcon size={12} color="var(--mm-amber)" />
              <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 600 }}>{t("landingBadge")}</span>
            </div>

            <h1 className="mb-4" style={{ color: "var(--mm-text)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1 }}>
              {t("landingTitleBefore")} <span style={{ color: "var(--mm-amber)" }}>{t("landingTitleAccent")}</span>
              <br />{t("landingTitleAfter")}
            </h1>

            <p style={{ color: "var(--mm-text-2)", fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.7, maxWidth: "500px", marginBottom: "32px" }}>
              {t("landingSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button onClick={onPlay} className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)", fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
                {t("navPlayNow")}
                <ArrowRightBigIcon size={16} color="var(--mm-action-fg)" />
              </button>
              <button onClick={onDaily} className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: "var(--mm-surface-2)", color: "var(--mm-text)", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border-2)" }}>
                <FlashIcon size={16} color="var(--mm-amber)" />
                {t("landingTryDaily")}
              </button>
            </div>

            <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["var(--mm-amber)", "var(--mm-blue)", "var(--mm-green)", "var(--mm-purple)"].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2" style={{ background: c, borderColor: "var(--mm-bg)" }} />
                ))}
              </div>
              <span style={{ color: "var(--mm-text-2)", fontSize: "13px" }}>
                <strong style={{ color: "var(--mm-text)" }}>98,000+</strong> {t("landingPlayers")}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-6 w-full max-w-sm lg:max-w-none">
            <div className="relative">
              <div className="rounded-2xl p-4 inline-block" style={{ background: "var(--mm-board-bg)", border: "1px solid var(--mm-border-2)", boxShadow: "var(--mm-board-shadow)" }}>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                  {MINI_BOARD.flat().map((val, i) => <MiniCell key={i} val={val} />)}
                </div>
              </div>
              <div className="absolute -right-4 top-6 rounded-xl px-3 py-2.5 shadow-2xl" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-green-glow)", backdropFilter: "blur(10px)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--mm-green)", boxShadow: "0 0 6px var(--mm-green)" }} />
                  <span style={{ color: "var(--mm-green)", fontSize: "11px", fontWeight: 600 }}>{t("landingSafeMove")}</span>
                  <span style={{ color: "var(--mm-green)", fontSize: "13px", fontWeight: 800 }}>94%</span>
                </div>
              </div>
              <div className="absolute -left-4 bottom-6 rounded-xl px-3 py-2.5 shadow-2xl" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border-amber)", backdropFilter: "blur(10px)" }}>
                <div className="flex items-center gap-2">
                  <FireIcon size={15} color="var(--mm-amber)" />
                  <div>
                    <div style={{ color: "var(--mm-amber)", fontSize: "13px", fontWeight: 800 }}>{t("landingStreak")}</div>
                    <div style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{t("landingDaysActive")}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full rounded-2xl p-4" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: "var(--mm-text)", fontSize: "13px", fontWeight: 600 }}>{t("landingDashboard")}</span>
                <span style={{ color: "var(--mm-amber)", fontSize: "11px" }}>{t("landingRank")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[["82%", t("landingWinRate")], ["1:24", t("landingBestTime")], ["94%", t("landingAccuracy")]].map(([v, l], i) => (
                  <div key={i} className="rounded-lg p-2 text-center" style={{ background: "var(--mm-surface-2)" }}>
                    <div style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700 }}>{v}</div>
                    <div style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid var(--mm-border)", borderBottom: "1px solid var(--mm-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.value} className="text-center">
              <div style={{ color: "var(--mm-amber)", fontSize: "24px", fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 style={{ color: "var(--mm-text)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, marginBottom: "12px" }}>{t("landingSectionTitle")}</h2>
          <p style={{ color: "var(--mm-text-2)", fontSize: "16px" }}>{t("landingSectionSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)", boxShadow: "var(--mm-card-shadow)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}>
                {f.icon}
              </div>
              <h3 style={{ color: "var(--mm-text)", fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "var(--mm-text-3)", fontSize: "13px", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-6 mb-20 rounded-3xl p-12 text-center relative overflow-hidden" style={{ background: "var(--mm-cta-bg)", border: "1px solid var(--mm-cta-border)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "transparent" }} />
        <div className="relative">
          <h2 style={{ color: "var(--mm-text)", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "12px" }}>{t("landingCtaTitle")}</h2>
          <p style={{ color: "var(--mm-text-2)", fontSize: "16px", marginBottom: "32px" }}>{t("landingCtaSubtitle")}</p>
          <button onClick={onPlay} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)", fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
            {t("landingCtaButton")}
            <ArrowRightBigIcon size={18} color="var(--mm-action-fg)" />
          </button>
        </div>
      </section>
    </div>
  );
}
