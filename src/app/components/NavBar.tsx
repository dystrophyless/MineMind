import { useState, type ReactNode } from "react";
import { BrainIcon, CrownIcon, FlashIcon, PlayIcon, StarIcon } from "hugeicons-react";
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
  const mobileNavItems: { page: Page; label: string; icon: ReactNode; isActive?: boolean }[] = [
    { page: "game", label: t("mobilePlay"), icon: <PlayIcon size={18} color="inherit" /> },
    { page: "daily", label: t("navDaily"), icon: <FlashIcon size={18} color="inherit" /> },
    { page: "leaderboard", label: t("mobileRanks"), icon: <CrownIcon size={18} color="inherit" /> },
    { page: "design", label: t("navPro"), icon: <StarIcon size={18} color="inherit" /> },
    {
      page: isAuthenticated ? "profile" : "login",
      label: profileLabel,
      icon: <CircleUserRound size={18} strokeWidth={2.2} />,
      isActive: currentPage === "profile",
    },
  ];

  if (!isAuthenticated) {
    return (
      <>
        <nav
          className="hidden md:flex items-center justify-between px-6 py-3 relative z-50"
          style={{
            background: "var(--mm-nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--mm-border)",
            boxShadow: "var(--mm-nav-shadow)",
          }}
        >
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
            <span style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700 }}>
              Mine<span style={{ color: "var(--mm-brand-text-accent)" }}>Mind</span>
            </span>
          </button>

          <div className="flex items-center gap-1">
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

          <div className="flex items-center gap-2">
            <SettingsControls />
            <button
              onClick={() => onNavigate("login")}
              onMouseEnter={() => setProfileHovered(true)}
              onMouseLeave={() => setProfileHovered(false)}
              aria-label={profileLabel}
              className="h-9 rounded-lg flex items-center justify-start gap-2 px-3 transition-all duration-200 active:scale-95"
              style={{
                background: profileHovered ? "var(--mm-nav-hover-bg)" : "var(--mm-nav-control-bg)",
                border: profileHovered ? "1px solid var(--mm-nav-hover-border)" : "1px solid var(--mm-nav-control-border)",
                color: profileHovered ? "var(--mm-nav-hover-fg)" : "var(--mm-text-2)",
                boxShadow: "var(--mm-nav-control-shadow)",
              }}
            >
              <CircleUserRound size={17} strokeWidth={2.2} />
              <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
                {profileLabel}
              </span>
            </button>
          </div>
        </nav>

        <nav
          aria-label="Mobile guest navigation"
          className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3"
          style={{
            background: "var(--mm-nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--mm-border)",
            boxShadow: "var(--mm-nav-shadow)",
          }}
        >
          <button
            className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80"
            onClick={() => onNavigate("landing")}
          >
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
            <span className="truncate" style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 800 }}>
              Mine<span style={{ color: "var(--mm-brand-text-accent)" }}>Mind</span>
            </span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate("login")}
              className="h-9 rounded-lg px-3 transition-all duration-200 active:scale-95"
              style={{
                background: "var(--mm-nav-control-bg)",
                border: "1px solid var(--mm-nav-control-border)",
                color: "var(--mm-text)",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "var(--font-mabry)",
                boxShadow: "var(--mm-nav-control-shadow)",
              }}
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="h-9 rounded-lg px-3 transition-all duration-200 active:scale-95"
              style={{
                background: "var(--mm-action-bg)",
                border: "1px solid var(--mm-action-bg)",
                color: "var(--mm-action-fg)",
                fontSize: "12px",
                fontWeight: 800,
                fontFamily: "var(--font-mabry)",
              }}
            >
              Sign Up
            </button>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <nav
        className="hidden md:flex items-center justify-between px-6 py-3 relative z-50"
        style={{
          background: "var(--mm-nav-bg)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--mm-border)",
          boxShadow: "var(--mm-nav-shadow)",
        }}
      >
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
          <span style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700 }}>
            Mine<span style={{ color: "var(--mm-brand-text-accent)" }}>Mind</span>
          </span>
        </button>

        <div className="flex items-center gap-1">
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

        <div className="flex items-center gap-2">
          <SettingsControls />
          <button
            onClick={() => onNavigate(isAuthenticated ? "profile" : "login")}
            onMouseEnter={() => setProfileHovered(true)}
            onMouseLeave={() => setProfileHovered(false)}
            aria-label={profileLabel}
            className="h-9 rounded-lg flex items-center justify-start gap-2 px-3 transition-all duration-200 active:scale-95"
            style={{
              background: currentPage === "profile" ? "var(--mm-amber-glow)" : profileHovered ? "var(--mm-nav-hover-bg)" : "var(--mm-nav-control-bg)",
              border: currentPage === "profile" ? "1px solid var(--mm-border-amber)" : profileHovered ? "1px solid var(--mm-nav-hover-border)" : "1px solid var(--mm-nav-control-border)",
              color: currentPage === "profile" ? "var(--mm-amber)" : profileHovered ? "var(--mm-nav-hover-fg)" : "var(--mm-text-2)",
              boxShadow: "var(--mm-nav-control-shadow)",
            }}
          >
            <CircleUserRound size={17} strokeWidth={2.2} />
            <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
              {profileLabel}
            </span>
          </button>
        </div>
      </nav>

      <nav
        aria-label="Mobile primary navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
        style={{
          background: "var(--mm-bg)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--mm-border)",
          boxShadow: "var(--mm-nav-shadow)",
        }}
      >
        <div className="mx-auto flex max-w-[430px] items-center gap-1">
          {mobileNavItems.map(item => {
            const isActive = item.isActive ?? currentPage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                aria-current={isActive ? "page" : undefined}
                className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 transition-all duration-200 active:scale-95"
                style={{
                  background: isActive ? "var(--mm-selected-bg)" : "transparent",
                  color: isActive ? "var(--mm-selected-fg)" : "var(--mm-text-3)",
                  fontSize: "10px",
                  fontWeight: isActive ? 700 : 600,
                  fontFamily: "var(--font-mabry)",
                  border: isActive ? "1px solid var(--mm-selected-border)" : "1px solid transparent",
                }}
              >
                {item.icon}
                <span className="max-w-full truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
