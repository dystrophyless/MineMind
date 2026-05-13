import type { ReactNode } from "react";
import { CrownIcon, FlashIcon, BrainIcon, StarIcon, ProfileIcon, MenuCircleIcon } from "hugeicons-react";

type Page = "landing" | "game" | "daily" | "leaderboard" | "profile" | "design";

type Props = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function NavBar({ currentPage, onNavigate }: Props) {
  const navItems: { page: Page; label: string; icon: ReactNode }[] = [
    { page: "daily", label: "Daily", icon: <FlashIcon size={14} color="inherit" /> },
    { page: "leaderboard", label: "Leaderboard", icon: <CrownIcon size={14} color="inherit" /> },
    { page: "profile", label: "Stats", icon: <BrainIcon size={14} color="inherit" /> },
    { page: "design", label: "Pro", icon: <StarIcon size={14} color="inherit" /> },
  ];

  return (
    <nav
      className="flex items-center justify-between px-6 py-3 relative z-50"
      style={{
        background: "rgba(13,15,23,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--mm-border)",
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
            background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))",
            boxShadow: "0 2px 12px var(--mm-amber-glow-strong)",
          }}
        >
          <span style={{ color: "#0D0F17", fontSize: "16px", lineHeight: 1 }}>⬡</span>
        </div>
        <span style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Mine<span style={{ color: "var(--mm-amber)" }}>Mind</span>
        </span>
      </button>

      {/* Center nav — desktop */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background: currentPage === item.page ? "var(--mm-amber-glow)" : "transparent",
              color: currentPage === item.page ? "var(--mm-amber)" : "var(--mm-text-2)",
              fontSize: "13px",
              fontWeight: currentPage === item.page ? 600 : 500,
              fontFamily: "var(--font-mabry)",
              border: currentPage === item.page ? "1px solid var(--mm-border-amber)" : "1px solid transparent",
            }}
          >
            {item.icon}
            {item.label}
            {item.page === "design" && (
              <span
                className="px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--mm-amber)", color: "var(--mm-bg)", fontSize: "9px", fontWeight: 800 }}
              >
                PRO
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right: Play + Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("game")}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))",
            color: "var(--mm-bg)",
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: "var(--font-mabry)",
            boxShadow: "0 2px 10px var(--mm-amber-glow-strong)",
          }}
        >
          Play Now
        </button>
        <button
          onClick={() => onNavigate("profile")}
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 hover:ring-2"
          style={{
            background: "var(--mm-surface-3)",
            border: "1px solid var(--mm-border-2)",
            ringColor: "var(--mm-amber)",
          }}
        >
          <ProfileIcon size={16} color="var(--mm-text-2)" />
        </button>
        {/* Mobile menu */}
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
