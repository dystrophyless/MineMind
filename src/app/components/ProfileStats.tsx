import { StopWatchIcon, FireIcon, ChartUpIcon, BombIcon, FlashIcon } from "hugeicons-react";
import { Hexagon, LogOutIcon } from "lucide-react";
import { useT, useLocale } from "../i18n/LocaleProvider";
import type { ReactNode } from "react";
import type { TranslationKey } from "../i18n/translations";
import { useProfileStats } from "../hooks/useProfileStats";
import { SettingsControls } from "./SettingsControls";
import { useAuth } from "../contexts/AuthContext";
import { ACHIEVEMENT_DEFS } from "../services/achievements";

const RU_MEMBER_MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

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
  const { locale } = useLocale();
  const { signOut } = useAuth();
  const { data: profileData, isLoading } = useProfileStats();

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

  const modeKeyMap: Record<string, TranslationKey> = {
    classic: "mobileModeClassic",
    noFlags: "mobileModeNoFlags",
    timed: "mobileModeTimed",
    daily: "mobileModeDaily",
  };

  if (isLoading) return <div style={{ padding: "64px", textAlign: "center", color: "var(--mm-text-3)" }}>{t("loading")}</div>;
  if (!profileData) return null;

  const memberSinceText = (() => {
    const date = new Date(profileData.memberSince);
    const dateStr = locale === "ru"
      ? `${RU_MEMBER_MONTHS[date.getMonth()]} ${date.getFullYear()}`
      : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return locale === "ru" ? `Участник с ${dateStr}` : `Member since ${dateStr}`;
  })();

  const levelTitleKey = (() => {
    const level = profileData.level;
    if (level <= 1) return "levelBeginner";
    if (level === 2) return "levelExplorer";
    if (level === 3) return "levelTactician";
    if (level === 4) return "levelStrategist";
    if (level === 5) return "levelExpert";
    if (level === 6) return "levelMaster";
    return "levelGrandmaster";
  })() as Parameters<typeof t>[0];

  const winRateChange = profileData.winRateChangeThisWeek;
  const winRateDetailText = winRateChange !== null
    ? `${winRateChange >= 0 ? "+" : ""}${winRateChange}% ${t("profileThisWeek")}`
    : `${profileData.wins.toLocaleString()} ${t("profileWins")} / ${profileData.gamesPlayed.toLocaleString()} ${t("profileGames")}`;

  const mainStats = [
    { label: t("landingWinRate"), value: `${profileData.winRate}%`, icon: <ChartUpIcon size={16} color="var(--mm-green)" />, color: "var(--mm-green)", change: winRateDetailText },
    { label: t("profileGamesPlayed"), value: profileData.gamesPlayed.toLocaleString(), icon: <ChartUpIcon size={16} color="var(--mm-blue)" />, color: "var(--mm-blue)", change: `+${profileData.gamesToday} ${t("profileToday")}` },
    { label: t("landingBestTime"), value: profileData.bestTimeSeconds ? formatTime(profileData.bestTimeSeconds) : "—", icon: <StopWatchIcon size={16} color="var(--mm-amber)" />, color: "var(--mm-amber)", change: t("mobileModeClassic") },
    { label: t("profileCurrentStreak"), value: profileData.currentStreak.toString(), icon: <FireIcon size={16} color="var(--mm-red)" />, color: "var(--mm-red)", change: `${t("profilePersonalBest")} ${profileData.bestStreak}` },
  ];

  const favMode = {
    label: t("profileFavMode"),
    value: t(modeKeyMap[profileData.favoriteMode] ?? "mobileModeClassic"),
    icon: <BombIcon size={16} color="var(--mm-purple)" />,
    color: "var(--mm-purple)",
    change: `${profileData.favModePercentage}% ${t("profileOfGames")}`,
  };

  const badges = ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    unlocked: profileData.badges.find(b => b.key === def.key)?.unlocked ?? false,
  }));
  const unlockedBadges = badges.filter(b => b.unlocked).length;

  const recentGames: { mode: string; time: string; result: RecentGameResult; date: string }[] = profileData.recentGames.map(g => ({
    mode: t(modeKeyMap[g.mode] ?? "mobileModeClassic"),
    time: g.mode === "timed"
      ? `${g.minesFound ?? 0} ${t("boardMines")}`
      : g.timeSeconds ? formatTime(g.timeSeconds) : "—",
    result: g.status,
    date: new Date(g.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-3 md:hidden">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "var(--mm-brand-mark-bg)",
                border: "1px solid var(--mm-brand-mark-border)",
                color: "var(--mm-brand-mark-color)",
                boxShadow: "var(--mm-brand-mark-shadow)",
              }}
            >
              <Hexagon size={15} strokeWidth={2.1} />
            </div>
            <span style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700 }}>
              Mine<span style={{ color: "var(--mm-brand-text-accent)" }}>Mind</span>
            </span>
          </div>
          <SettingsControls compact />
        </div>

        <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
          <div className="profile-identity-row flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "var(--mm-action-bg)", boxShadow: "var(--mm-action-shadow)" }}>
              <span style={{ color: "var(--mm-action-fg)", fontSize: "32px", fontWeight: 800 }}>{profileData.avatarInitial}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 style={{ color: "var(--mm-text)", fontSize: "24px", fontWeight: 800, lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profileData.username}</h1>
                  <p style={{ color: "var(--mm-text-2)", fontSize: "13px", marginTop: "6px" }}>{memberSinceText}</p>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  aria-label={t("profileSignOut")}
                  className="profile-signout-button h-10 w-10 sm:w-auto sm:px-3.5 rounded-xl flex items-center justify-center sm:justify-start gap-2 shrink-0 transition-colors duration-200 hover:brightness-110"
                  style={{
                    background: "var(--mm-surface-2)",
                    border: "1px solid var(--mm-border-2)",
                    color: "var(--mm-red)",
                    fontSize: "13px",
                    fontWeight: 800,
                    fontFamily: "var(--font-mabry)",
                  }}
                >
                  <LogOutIcon size={15} strokeWidth={2.4} />
                  <span className="hidden sm:inline">{t("profileSignOut")}</span>
                </button>
              </div>

              <div className="mt-5">
                <div className="flex justify-between mb-1.5">
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{t("profileLevel")} {profileData.level} — {t(levelTitleKey)}</span>
                  <span style={{ color: "var(--mm-amber)", fontSize: "11px" }}>{`${profileData.xp.toLocaleString()} / 10,000 XP`}</span>
                </div>
                <ProgressBar value={profileData.xp} max={10000} color="var(--mm-amber)" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {mainStats.map(s => (
            <div key={s.label} className="rounded-2xl p-5 transition-all duration-200 hover:translate-y-[-1px]" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase" }}>{s.label}</span>
              </div>
              <p style={{ color: s.color, fontSize: "26px", fontWeight: 800, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</p>
              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{s.change}</p>
            </div>
          ))}
          <div className="col-span-2 lg:col-span-4 rounded-2xl p-5 flex items-center gap-6 transition-all duration-200 hover:translate-y-[-1px]" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {favMode.icon}
                <span style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase" }}>{favMode.label}</span>
              </div>
              <p style={{ color: favMode.color, fontSize: "26px", fontWeight: 800, marginBottom: "4px" }}>{favMode.value}</p>
              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{favMode.change}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl p-5" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>{t("profileWinRateByMode")}</p>
            <div className="flex flex-col gap-4">
              {["classic", "noFlags", "timed", "daily"].map(m => {
                const row = profileData.modeStats.find(s => s.mode === m);
                const rate = row && row.total > 0 ? Math.round((row.wins / row.total) * 100) : 0;
                const colors: Record<string, string> = {
                  classic: "var(--mm-green)",
                  noFlags: "var(--mm-blue)",
                  timed: "var(--mm-amber)",
                  daily: "var(--mm-red)",
                };
                return (
                  <div key={m}>
                    <div className="flex justify-between mb-1.5">
                      <span style={{ color: "var(--mm-text-2)", fontSize: "13px" }}>{t(modeKeyMap[m] ?? "mobileModeClassic")}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{row?.total ?? 0} {t("profileGames")}</span>
                        <span style={{ color: colors[m], fontSize: "13px", fontWeight: 700, width: "40px", textAlign: "right" }}>{rate}%</span>
                      </div>
                    </div>
                    <ProgressBar value={rate} max={100} color={colors[m]} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>{t("profileRecentGames")}</p>
            <div className="flex flex-col gap-2">
              {recentGames.map((g, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: g.result === "won" ? "var(--mm-green)" : "var(--mm-red)" }} />
                  <span style={{ color: "var(--mm-text-2)", fontSize: "12px", flex: 1 }}>{g.mode}</span>
                  <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 700 }}>{g.time}</span>
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{g.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700 }}>{t("profileAchievements")}</p>
            <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>{unlockedBadges} / {badges.length} {t("profileUnlocked")}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {badges.map(b => (
              <div
                key={b.key}
                className="rounded-xl p-4 text-center flex flex-col items-center gap-2"
                style={{
                  background: b.unlocked ? "var(--mm-surface-2)" : "var(--mm-surface-1)",
                  border: `1px solid ${b.unlocked ? "var(--mm-border-2)" : "var(--mm-border)"}`,
                  opacity: b.unlocked ? 1 : 0.4,
                  filter: b.unlocked ? "none" : "grayscale(1)",
                }}
              >
                <span className="h-6 flex items-center justify-center">{b.icon}</span>
                <div>
                  <p style={{ color: "var(--mm-text)", fontSize: "11px", fontWeight: 600 }}>{t(b.nameKey)}</p>
                  <p style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{t(b.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
