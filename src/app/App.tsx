import { useState, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { LandingPage } from "./components/LandingPage";
import { GameDashboard } from "./components/GameDashboard";
import { DailyChallenge } from "./components/DailyChallenge";
import { Leaderboard } from "./components/Leaderboard";
import { ProfileStats } from "./components/ProfileStats";
import { MobileGame } from "./components/MobileGame";
import { DesignSystemShowcase } from "./components/DesignSystemShowcase";

type Page = "landing" | "game" | "daily" | "leaderboard" | "profile" | "design";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const isMobile = useIsMobile();

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isMobile && page === "game") {
    return (
      <div
        className="size-full flex flex-col overflow-hidden relative"
        style={{ background: "var(--mm-bg)", fontFamily: "var(--font-mabry)" }}
      >
        <MobileGame />
      </div>
    );
  }

  return (
    <div
      className="size-full flex flex-col overflow-auto"
      style={{ background: "var(--mm-bg)", fontFamily: "var(--font-mabry)" }}
    >
      {/* Sticky nav */}
      <div className="sticky top-0 z-50">
        <NavBar currentPage={page} onNavigate={navigate} />
      </div>

      {/* Page content */}
      <div className="flex-1">
        {page === "landing" && (
          <LandingPage onPlay={() => navigate("game")} onDaily={() => navigate("daily")} />
        )}
        {page === "game" && (
          <GameDashboard
            onNavigate={(p) => navigate(p as Page)}
          />
        )}
        {page === "daily" && <DailyChallenge />}
        {page === "leaderboard" && <Leaderboard />}
        {page === "profile" && <ProfileStats />}
        {page === "design" && <DesignSystemShowcase />}
      </div>
    </div>
  );
}
