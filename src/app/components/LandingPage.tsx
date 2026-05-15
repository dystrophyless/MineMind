import { BrainIcon, FlashIcon, CrownIcon, StarIcon, ArrowRightBigIcon, ChartUpIcon } from "hugeicons-react";
import { useT } from "../i18n/LocaleProvider";
import { useThemeMode } from "../theme/ThemeProvider";

type Props = {
  onPlay: () => void;
  onDaily: () => void;
};

const LANDING_BRAIN_IMAGES = {
  black: "/images/landing-brain-dark.png",
  white: "/images/landing-brain-light.png",
};

function LandingBrainImage() {
  const { theme } = useThemeMode();

  return (
    <img
      src={LANDING_BRAIN_IMAGES[theme]}
      alt="Minesweeper brain board illustration"
      className="w-full max-w-[560px] mx-auto"
      loading="eager"
      decoding="async"
      style={{
        display: "block",
        objectFit: "contain",
        filter: "drop-shadow(0 22px 42px rgba(0,0,0,0.20))",
      }}
    />
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

          <div className="flex-1 flex flex-col items-center gap-6 w-full max-w-xl">
            <LandingBrainImage />

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

      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="rounded-3xl p-12 text-center relative overflow-hidden" style={{ background: "var(--mm-cta-bg)", border: "1px solid var(--mm-cta-border)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "transparent" }} />
          <div className="relative">
            <h2 style={{ color: "var(--mm-text)", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "12px" }}>{t("landingCtaTitle")}</h2>
            <p style={{ color: "var(--mm-text-2)", fontSize: "16px", marginBottom: "32px" }}>{t("landingCtaSubtitle")}</p>
            <button onClick={onPlay} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)", fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
              {t("landingCtaButton")}
              <ArrowRightBigIcon size={18} color="var(--mm-action-fg)" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
