import { useState, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { LandingPage } from "./components/LandingPage";
import { GameDashboard } from "./components/GameDashboard";
import { DailyChallenge } from "./components/DailyChallenge";
import { Leaderboard } from "./components/Leaderboard";
import { ProfileStats } from "./components/ProfileStats";
import { MobileGame } from "./components/MobileGame";
import { DesignSystemShowcase } from "./components/DesignSystemShowcase";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { useAuth } from "./contexts/AuthContext";

type Page = "landing" | "game" | "daily" | "leaderboard" | "profile" | "design" | "login" | "register";

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
  const [gameInitialMode, setGameInitialMode] = useState<"classic" | "noFlags" | "timed" | "daily">("classic");
  const { user, isLoading, needsOnboarding } = useAuth();
  const isAuthenticated = !!user;
  const isMobile = useIsMobile();
  const authRequiredPages = new Set<Page>(["game", "daily", "leaderboard", "profile", "design"]);
  const showGuestLanding = !isAuthenticated && authRequiredPages.has(page);
  const visiblePage = showGuestLanding ? "landing" : page;
  const contentInsetClass = !isAuthenticated ? "pt-[64px] md:pt-0" : visiblePage === "game" ? "pb-0 md:pb-0" : "pb-[76px] md:pb-0";

  const navigate = (p: Page) => {
    if (!isAuthenticated && authRequiredPages.has(p)) {
      setPage("login");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeAuth = () => {
    navigate("profile");
  };

  if (isLoading) return null;

  if (user && needsOnboarding) {
    return <OnboardingPage onComplete={completeAuth} />;
  }

  if (page === "login") {
    return (
      <LoginPage
        onLogin={completeAuth}
        onGoRegister={() => navigate("register")}
      />
    );
  }

  if (page === "register") {
    return (
      <RegisterPage
        onRegister={completeAuth}
        onGoLogin={() => navigate("login")}
      />
    );
  }

  return (
    <div
      className="size-full flex flex-col overflow-auto"
      style={{ background: "var(--mm-bg)", fontFamily: "var(--font-mabry)" }}
    >
      {/* Sticky nav */}
      <div className="hidden md:block sticky top-0 z-50">
        <NavBar currentPage={visiblePage} isAuthenticated={isAuthenticated} onNavigate={navigate} />
      </div>

      {/* Page content */}
      <div className={`flex-1 ${contentInsetClass}`}>
        {visiblePage === "landing" && (
          <LandingPage
            onPlay={() => { setGameInitialMode("classic"); navigate("game"); }}
            onPlayDaily={() => { setGameInitialMode("daily"); navigate("game"); }}
          />
        )}
        {visiblePage === "game" && isMobile && <MobileGame initialMode={gameInitialMode} />}
        {visiblePage === "game" && !isMobile && (
          <GameDashboard
            onNavigate={(p) => navigate(p as Page)}
            initialMode={gameInitialMode}
          />
        )}
        {visiblePage === "daily" && <DailyChallenge />}
        {visiblePage === "leaderboard" && <Leaderboard />}
        {visiblePage === "profile" && <ProfileStats />}
        {visiblePage === "design" && <DesignSystemShowcase />}
      </div>

      <div className="md:hidden">
        <NavBar currentPage={visiblePage} isAuthenticated={isAuthenticated} onNavigate={navigate} />
      </div>
    </div>
  );
}
