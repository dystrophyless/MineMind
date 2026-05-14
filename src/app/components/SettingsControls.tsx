import { Moon, Sun } from "lucide-react";
import { useT } from "../i18n/LocaleProvider";
import { useThemeMode, type ThemeMode } from "../theme/ThemeProvider";

type Props = {
  compact?: boolean;
};

export function SettingsControls({ compact }: Props) {
  const t = useT();
  const { theme, setTheme } = useThemeMode();
  const nextTheme: ThemeMode = theme === "black" ? "white" : "black";
  const activeLabel = theme === "black" ? t("settingsBlack") : t("settingsWhite");
  const Icon = theme === "black" ? Moon : Sun;

  return (
    <button
      type="button"
      aria-label={`${t("settingsTheme")}: ${activeLabel}`}
      aria-pressed={theme === "black"}
      title={`${t("settingsTheme")}: ${activeLabel}`}
      onClick={() => setTheme(nextTheme)}
      className="relative grid place-items-center rounded-lg transition-all duration-200 hover:brightness-110 active:scale-95"
      style={{
        width: compact ? "32px" : "36px",
        height: compact ? "32px" : "36px",
        background: "var(--mm-nav-control-bg)",
        border: "1px solid var(--mm-nav-control-border)",
        color: theme === "black" ? "var(--mm-amber-light)" : "var(--mm-amber-dim)",
        boxShadow: "var(--mm-nav-control-shadow)",
      }}
    >
      <Icon size={compact ? 15 : 16} strokeWidth={2.25} />
    </button>
  );
}
