import { useState } from "react";
import { CrownIcon, MedalFirstPlaceIcon, MedalSecondPlaceIcon, MedalThirdPlaceIcon } from "hugeicons-react";
import { LEADERBOARD_PERIODS, RANKED_GAME_MODES } from "./game/gameRules.mjs";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useT } from "../i18n/LocaleProvider";

type RankedMode = "classic" | "timed" | "noFlags";
type LeaderboardPeriod = "allTime" | "monthly" | "weekly";
type LeaderboardScope = "global" | "city";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <MedalFirstPlaceIcon size={18} color="#F5C060" />;
  if (rank === 2) return <MedalSecondPlaceIcon size={18} color="#A8A4B8" />;
  if (rank === 3) return <MedalThirdPlaceIcon size={18} color="#C07010" />;
  return <span style={{ color: "var(--mm-text-3)", fontSize: "13px", fontWeight: 700, width: "18px", textAlign: "center", display: "inline-block" }}>#{rank}</span>;
}

export function Leaderboard() {
  const t = useT();
  const [scope, setScope] = useState<LeaderboardScope>("global");
  const [tab, setTab] = useState<RankedMode>("classic");
  const [period, setPeriod] = useState<LeaderboardPeriod>("allTime");
  const [hoveredScope, setHoveredScope] = useState<LeaderboardScope | null>(null);
  const [hoveredTab, setHoveredTab] = useState<RankedMode | null>(null);
  const [hoveredPeriod, setHoveredPeriod] = useState<LeaderboardPeriod | null>(null);
  const { rows, isLoading: leaderboardLoading } = useLeaderboard(tab, period, scope);
  const scopeLabels: Record<LeaderboardScope, string> = {
    global: t("leaderboardGlobal"),
    city: t("leaderboardCity"),
  };
  const modeLabels: Record<RankedMode, string> = {
    classic: t("leaderboardModeClassic"),
    timed: t("leaderboardModeTimed"),
    noFlags: t("leaderboardModeNoFlags"),
  };
  const periodLabels: Record<LeaderboardPeriod, string> = {
    allTime: t("leaderboardPeriodAllTime"),
    monthly: t("leaderboardPeriodMonthly"),
    weekly: t("leaderboardPeriodWeekly"),
  };
  const scoreHeader = tab === "timed" ? t("leaderboardMines") : t("tableBest");
  const filterGroups = [
    {
      label: t("leaderboardGlobal"),
      value: scope,
      hovered: hoveredScope,
      options: (["global", "city"] as LeaderboardScope[]).map(item => ({ key: item, label: scopeLabels[item] })),
      onSelect: (item: string) => setScope(item as LeaderboardScope),
      onHover: (item: string | null) => setHoveredScope(item as LeaderboardScope | null),
    },
    {
      label: t("mode"),
      value: tab,
      hovered: hoveredTab,
      options: (RANKED_GAME_MODES as RankedMode[]).map(item => ({ key: item, label: modeLabels[item] })),
      onSelect: (item: string) => setTab(item as RankedMode),
      onHover: (item: string | null) => setHoveredTab(item as RankedMode | null),
    },
    {
      label: t("leaderboardPeriodAllTime"),
      value: period,
      hovered: hoveredPeriod,
      options: (LEADERBOARD_PERIODS as LeaderboardPeriod[]).map(item => ({ key: item, label: periodLabels[item] })),
      onSelect: (item: string) => setPeriod(item as LeaderboardPeriod),
      onHover: (item: string | null) => setHoveredPeriod(item as LeaderboardPeriod | null),
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <CrownIcon size={24} color="var(--mm-amber)" />
          <h1 style={{ color: "var(--mm-text)", fontSize: "32px", fontWeight: 800 }}>{t("leaderboardTitle")}</h1>
        </div>
        <p style={{ color: "var(--mm-text-2)", fontSize: "14px", marginBottom: "24px" }}>{t("leaderboardSubtitle")}</p>

        <div className="rounded-2xl p-2 mb-6" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[auto_auto_auto]">
            {filterGroups.map(group => (
              <div
                key={group.label}
                role="group"
                aria-label={group.label}
                className="flex min-w-0 flex-wrap gap-1 rounded-xl p-1"
                style={{ background: "var(--mm-bg)", border: "1px solid var(--mm-border)" }}
              >
                {group.options.map(item => {
                  const isActive = group.value === item.key;
                  const isHovered = group.hovered === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => group.onSelect(item.key)}
                      onMouseEnter={() => group.onHover(item.key)}
                      onMouseLeave={() => group.onHover(null)}
                      className="rounded-lg px-3 py-2 transition-all duration-200"
                      style={{
                        background: isActive ? "var(--mm-selected-bg)" : isHovered ? "var(--mm-nav-hover-bg)" : "transparent",
                        color: isActive ? "var(--mm-selected-fg)" : isHovered ? "var(--mm-nav-hover-fg)" : "var(--mm-text-2)",
                        fontSize: "12px",
                        fontWeight: isActive ? 700 : 600,
                        fontFamily: "var(--font-mabry)",
                        border: isActive ? "1px solid var(--mm-selected-border)" : isHovered ? "1px solid var(--mm-nav-hover-border)" : "1px solid transparent",
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--mm-border)" }}>
          <div className="grid px-4 py-3" style={{ gridTemplateColumns: "60px 1fr 120px", background: "var(--mm-surface-2)", borderBottom: "1px solid var(--mm-border)" }}>
            {[t("tableRank"), t("tablePlayer"), scoreHeader].map(h => (
              <span key={h} style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {leaderboardLoading ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--mm-text-3)" }}>Loading…</div>
          ) : rows.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--mm-text-3)" }}>No results yet</div>
          ) : (
            rows.map((row, i) => (
              <div
                key={`${row.playerId}-${row.rank}`}
                className="grid px-4 py-3.5 items-center"
                style={{
                  gridTemplateColumns: "60px 1fr 120px",
                  background: row.isMe ? "var(--mm-amber-glow)" : i % 2 === 0 ? "var(--mm-surface-1)" : "var(--mm-bg)",
                  borderBottom: "1px solid var(--mm-border)",
                  borderLeft: row.isMe ? "3px solid var(--mm-amber)" : "3px solid transparent",
                }}
              >
                <div className="flex items-center"><RankIcon rank={row.rank} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: row.isMe ? "var(--mm-action-bg)" : "var(--mm-surface-3)", border: `1px solid ${row.isMe ? "var(--mm-amber)" : "var(--mm-border)"}` }}>
                    <span style={{ color: row.isMe ? "var(--mm-action-fg)" : "var(--mm-text-2)", fontSize: "12px", fontWeight: 700 }}>{row.player[0]}</span>
                  </div>
                  <div>
                    <span style={{ color: row.isMe ? "var(--mm-amber)" : "var(--mm-text)", fontSize: "13px", fontWeight: row.isMe ? 700 : 500 }}>
                      {row.isMe ? t("leaderboardYou") : row.player}
                    </span>
                    <div style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{row.city}</div>
                  </div>
                </div>
                <span style={{ color: tab === "timed" ? "var(--mm-red)" : "var(--mm-amber)", fontSize: "13px", fontWeight: 800 }}>{row.scoreLabel}</span>
              </div>
            ))
          )}
        </div>

        <p style={{ color: "var(--mm-text-3)", fontSize: "12px", textAlign: "center", marginTop: "16px" }}>{t("leaderboardFooter")}</p>
      </div>
    </div>
  );
}
