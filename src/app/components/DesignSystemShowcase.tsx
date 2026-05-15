import type { ReactNode } from "react";
import { BombIcon, RacingFlagIcon, FlashIcon, HexagonIcon } from "hugeicons-react";
import { useT } from "../i18n/LocaleProvider";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10">
      <p style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px" }}>{title}</p>
      {children}
    </div>
  );
}

function CellDemo({ type }: { type: "closed" | "empty" | "one" | "two" | "three" | "flagged" | "mine" | "safe" | "danger" }) {
  const size = "w-10 h-10 rounded-lg flex items-center justify-center";
  const styles: Record<typeof type, React.CSSProperties> = {
    closed: { background: "var(--mm-cell-closed-bg)", boxShadow: "var(--cell-closed-shadow)", border: "1px solid var(--mm-border)" },
    empty: { background: "var(--mm-cell-empty-bg)", boxShadow: "var(--cell-open-shadow)", border: "1px solid var(--mm-border)" },
    one: { background: "var(--mm-cell-open-bg)", color: "var(--mm-blue)", fontSize: "14px", fontWeight: 800 },
    two: { background: "var(--mm-cell-open-bg)", color: "var(--mm-green)", fontSize: "14px", fontWeight: 800 },
    three: { background: "var(--mm-cell-open-bg)", color: "var(--mm-red)", fontSize: "14px", fontWeight: 800 },
    flagged: { background: "var(--mm-cell-flag-bg)", boxShadow: "var(--cell-closed-shadow), 0 0 8px var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" },
    mine: { background: "var(--mm-cell-mine-bg)", border: "1px solid rgba(229,90,90,0.3)", boxShadow: "0 0 8px rgba(229,90,90,0.4)" },
    safe: { background: "var(--mm-cell-safe-bg)", boxShadow: "var(--cell-closed-shadow), 0 0 10px var(--mm-green-glow)", border: "1px solid rgba(76,217,123,0.25)" },
    danger: { background: "var(--mm-cell-danger-bg)", boxShadow: "var(--cell-closed-shadow), 0 0 10px var(--mm-red-glow)", border: "1px solid rgba(229,90,90,0.25)" },
  };
  const content: Record<typeof type, ReactNode> = {
    closed: null,
    empty: null,
    one: "1",
    two: "2",
    three: "3",
    flagged: <RacingFlagIcon size={15} color="var(--mm-amber)" />,
    mine: <BombIcon size={15} color="var(--mm-red)" />,
    safe: null,
    danger: null,
  };
  return <div className={size} style={styles[type]}>{content[type]}</div>;
}

export function DesignSystemShowcase() {
  const t = useT();
  const cells = [
    { type: "closed" as const, label: t("designClosed") },
    { type: "empty" as const, label: t("designEmpty") },
    { type: "one" as const, label: t("designOne") },
    { type: "two" as const, label: t("designTwo") },
    { type: "three" as const, label: t("designThree") },
    { type: "flagged" as const, label: t("designFlagged") },
    { type: "mine" as const, label: t("designMine") },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--mm-brand-mark-bg)", border: "1px solid var(--mm-brand-mark-border)", color: "var(--mm-brand-mark-color)", boxShadow: "var(--mm-brand-mark-shadow)" }}>
              <HexagonIcon size={20} color="currentColor" />
            </div>
            <div>
              <h1 style={{ color: "var(--mm-text)", fontSize: "28px", fontWeight: 800 }}>{t("designSystem")}</h1>
              <p style={{ color: "var(--mm-text-3)", fontSize: "13px" }}>{t("designSystemDesc")}</p>
            </div>
          </div>
        </div>

        <Section title={t("designColorTokens")}>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Amber", color: "var(--mm-amber)" },
              { name: "Green", color: "var(--mm-green)" },
              { name: "Red", color: "var(--mm-red)" },
              { name: "Blue", color: "var(--mm-blue)" },
              { name: "Purple", color: "var(--mm-purple)" },
              { name: "Surface", color: "var(--mm-surface-1)" },
            ].map(c => (
              <div key={c.name} className="flex flex-col gap-2">
                <div className="w-16 h-16 rounded-xl" style={{ background: c.color, border: "1px solid var(--mm-border)" }} />
                <span style={{ color: "var(--mm-text-3)", fontSize: "10px", textAlign: "center" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t("designGameCells")}>
          <div className="flex flex-wrap gap-4">
            {cells.map(c => (
              <div key={c.type} className="flex flex-col items-center gap-2">
                <CellDemo type={c.type} />
                <span style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t("designButtons")}>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 rounded-xl transition-all hover:brightness-110" style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>{t("designPrimary")}</button>
            <button className="px-6 py-3 rounded-xl transition-all hover:brightness-110" style={{ background: "var(--mm-surface-2)", color: "var(--mm-text)", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border-2)" }}>{t("designSecondary")}</button>
            <button className="px-6 py-3 rounded-xl transition-all" style={{ background: "transparent", color: "var(--mm-amber)", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border-amber)" }}>{t("designGhost")}</button>
            <button className="px-6 py-3 rounded-xl transition-all" style={{ background: "var(--mm-surface-2)", color: "var(--mm-text-3)", fontSize: "14px", fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border)", cursor: "not-allowed", opacity: 0.5 }}>{t("designDisabled")}</button>
          </div>
        </Section>

        <Section title={t("designCards")}>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl p-5 w-56" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <p style={{ color: "var(--mm-text-3)", fontSize: "11px", marginBottom: "8px" }}>{t("designDefaultCard")}</p>
              <p style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800 }}>82%</p>
              <p style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>{t("designWinRateThisWeek")}</p>
            </div>
            <div className="rounded-2xl p-5 w-56" style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}>
              <div className="flex items-center gap-2 mb-2">
                <FlashIcon size={14} color="var(--mm-amber)" />
                <p style={{ color: "var(--mm-amber)", fontSize: "11px", fontWeight: 700 }}>{t("designAmberCard")}</p>
              </div>
              <p style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800 }}>{t("leaderboardDaily")} #20260513</p>
              <p style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>{t("designTodayChallenge")}</p>
            </div>
          </div>
        </Section>

        <Section title={t("designNavigationBar")}>
          <div className="rounded-2xl flex items-center justify-between px-5 py-3" style={{ background: "var(--mm-nav-bg)", backdropFilter: "blur(20px)", border: "1px solid var(--mm-border)" }}>
            <span style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700 }}>Mine<span style={{ color: "var(--mm-brand-text-accent)" }}>Mind</span></span>
            <div className="flex gap-1">
              {[t("navDaily"), t("navLeaderboard"), t("navStats")].map((label, i) => (
                <button key={label} className="px-3 py-1.5 rounded-lg" style={{ background: i === 0 ? "var(--mm-amber-glow)" : "transparent", color: i === 0 ? "var(--mm-amber)" : "var(--mm-text-3)", fontSize: "12px", border: i === 0 ? "1px solid var(--mm-border-amber)" : "1px solid transparent" }}>{label}</button>
              ))}
            </div>
            <button className="px-4 py-2 rounded-lg" style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>{t("navPlayNow")}</button>
          </div>
        </Section>

        <Section title={t("designTypography")}>
          <div className="flex flex-col gap-3" style={{ background: "var(--mm-surface-1)", padding: "24px", borderRadius: "16px", border: "1px solid var(--mm-border)" }}>
            {[
              { size: "40px", weight: 800, text: "MineMind", label: t("designHeading1") },
              { size: "28px", weight: 700, text: "Strategic Minesweeper", label: t("designHeading2") },
              { size: "20px", weight: 700, text: t("dailyTitle"), label: t("designHeading3") },
              { size: "15px", weight: 500, text: t("boardMouseHelp"), label: t("designBody") },
              { size: "12px", weight: 400, text: t("leaderboardFooter"), label: t("designCaption") },
            ].map(item => (
              <div key={item.label}>
                <p style={{ color: "var(--mm-text)", fontSize: item.size, fontWeight: item.weight, lineHeight: 1.2 }}>{item.text}</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "10px", marginTop: "2px" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
