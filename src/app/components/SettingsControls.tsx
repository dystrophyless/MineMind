import { Moon, Sun } from "lucide-react";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { useThemeMode, type ThemeMode } from "../theme/ThemeProvider";
import type { Locale } from "../i18n/translations";

type Props = {
  compact?: boolean;
};

export function SettingsControls({ compact }: Props) {
  const t = useT();
  const { locale, localeLabels, setLocale } = useLocale();
  const { theme, setTheme } = useThemeMode();
  const nextTheme: ThemeMode = theme === "black" ? "white" : "black";
  const nextLocale: Locale = locale === "en" ? "ru" : "en";
  const activeThemeLabel = theme === "black" ? t("settingsBlack") : t("settingsWhite");
  const ThemeIcon = theme === "black" ? Moon : Sun;
  const btnSize = compact ? "32px" : "36px";
  const iconSize = compact ? 15 : 16;
  const sharedStyle = {
    width: btnSize,
    height: btnSize,
    background: "var(--mm-nav-control-bg)",
    border: "1px solid var(--mm-nav-control-border)",
    boxShadow: "var(--mm-nav-control-shadow)",
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`${t("settingsLocale")}: ${localeLabels[locale]}`}
        title={`${t("settingsLocale")}: ${localeLabels[locale]}`}
        onClick={() => setLocale(nextLocale)}
        className="grid place-items-center rounded-lg transition-all duration-200 hover:brightness-110 active:scale-95"
        style={{
          ...sharedStyle,
          color: "var(--mm-text-2)",
          fontFamily: "var(--font-mabry)",
          fontSize: compact ? "11px" : "12px",
          fontWeight: 700,
        }}
      >
        {localeLabels[locale]}
      </button>

      <button
        type="button"
        aria-label={`${t("settingsTheme")}: ${activeThemeLabel}`}
        aria-pressed={theme === "black"}
        title={`${t("settingsTheme")}: ${activeThemeLabel}`}
        onClick={() => setTheme(nextTheme)}
        className="relative grid place-items-center rounded-lg transition-all duration-200 hover:brightness-110 active:scale-95"
        style={{
          ...sharedStyle,
          color: theme === "black" ? "var(--mm-amber-light)" : "var(--mm-amber-dim)",
        }}
      >
        <ThemeIcon size={iconSize} strokeWidth={2.25} />
      </button>
    </div>
  );
}
