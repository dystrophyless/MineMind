import { useState, type ReactNode } from "react";
import { CrownIcon, FlashIcon, BrainIcon, StarIcon, MenuCircleIcon } from "hugeicons-react";
import { CircleUserRound, Hexagon } from "lucide-react";
import { useT } from "../i18n/LocaleProvider";
import { SettingsControls } from "./SettingsControls";

type Page = "landing" | "game" | "daily" | "leaderboard" | "profile" | "design" | "login" | "register";

type Props = {
  currentPage: Page;
  isAuthenticated: boolean;
  onNavigate: (page: Page) => void;
};

export function NavBar({ currentPage, isAuthenticated, onNavigate }: Props) {
  const t = useT();
  const profileLabel = isAuthenticated ? t("mobileProfile") : t("navSignIn");
  const [hoveredPage, setHoveredPage] = useState<Page | null>(null);
  const [profileHovered, setProfileHovered] = useState(false);
  const navItems: { page: Exclude<Page, "login" | "register">; label: string; icon: ReactNode }[] = [
    { page: "daily", label: t("navDaily"), icon: <FlashIcon size={14} color="inherit" /> },
    { page: "leaderboard", label: t("navLeaderboard"), icon: <CrownIcon size={14} color="inherit" /> },
    { page: "profile", label: t("navStats"), icon: <BrainIcon size={14} color="inherit" /> },
    { page: "design", label: t("navPro"), icon: <StarIcon size={14} color="inherit" /> },
  ];

  return (
    <nav
      className="flex items-center justify-between px-6 py-3 relative z-50"
      style={{
        background: "var(--mm-nav-bg)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--mm-border)",
        boxShadow: "var(--mm-nav-shadow)",
      }}
    >
      {/* Logo */}
      <button
        className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        onClick={() => onNavigate("landing")}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--mm-brand-mark-bg)",
            border: "1px solid var(--mm-brand-mark-border)",
            color: "var(--mm-brand-mark-color)",
            boxShadow: "var(--mm-brand-mark-shadow)",
          }}
        >
          <Hexagon size={15} strokeWidth={2.1} />
        </div>
        <span style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Mine<span style={{ color: "var(--mm-brand-text-accent)" }}>Mind</span>
        </span>
      </button>

      {/* Center nav — desktop */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(item => {
          const isActive = currentPage === item.page;
          const isHovered = hoveredPage === item.page;

          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              onMouseEnter={() => setHoveredPage(item.page)}
              onMouseLeave={() => setHoveredPage(null)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                background: isActive ? "var(--mm-selected-bg)" : isHovered ? "var(--mm-nav-hover-bg)" : "transparent",
                color: isActive ? "var(--mm-selected-fg)" : isHovered ? "var(--mm-nav-hover-fg)" : "var(--mm-text-2)",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                fontFamily: "var(--font-mabry)",
                border: isActive ? "1px solid var(--mm-selected-border)" : isHovered ? "1px solid var(--mm-nav-hover-border)" : "1px solid transparent",
              }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
      </div>

      {/* Right: Theme + Profile */}
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <SettingsControls />
        </div>
        <button
          onClick={() => onNavigate(isAuthenticated ? "profile" : "login")}
          onMouseEnter={() => setProfileHovered(true)}
          onMouseLeave={() => setProfileHovered(false)}
          aria-label={profileLabel}
          className="h-9 rounded-lg flex items-center justify-center md:justify-start gap-2 px-2 md:px-3 transition-all duration-200 active:scale-95"
          style={{
            background: currentPage === "profile" ? "var(--mm-amber-glow)" : profileHovered ? "var(--mm-nav-hover-bg)" : "var(--mm-nav-control-bg)",
            border: currentPage === "profile" ? "1px solid var(--mm-border-amber)" : profileHovered ? "1px solid var(--mm-nav-hover-border)" : "1px solid var(--mm-nav-control-border)",
            color: currentPage === "profile" ? "var(--mm-amber)" : profileHovered ? "var(--mm-nav-hover-fg)" : "var(--mm-text-2)",
            boxShadow: "var(--mm-nav-control-shadow)",
          }}
        >
          <CircleUserRound size={17} strokeWidth={2.2} />
          <span
            className="hidden md:inline"
            style={{ fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}
          >
            {profileLabel}
          </span>
        </button>
        {/* Mobile menu */}
        <div className="md:hidden">
          <SettingsControls compact />
        </div>
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center"
          style={{ color: "var(--mm-text-2)" }}
        >
          <MenuCircleIcon size={20} color="var(--mm-text-2)" />
        </button>
      </div>
    </nav>
  );
}
