import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");
const THEME_CSS = join(SRC, "styles", "theme.css");
const APP = join(SRC, "app", "App.tsx");
const NAV_BAR = join(SRC, "app", "components", "NavBar.tsx");
const LANDING_PAGE = join(SRC, "app", "components", "LandingPage.tsx");
const GAME_DASHBOARD = join(SRC, "app", "components", "GameDashboard.tsx");
const CONTROL_PANEL = join(SRC, "app", "components", "game", "ControlPanel.tsx");
const MOBILE_GAME = join(SRC, "app", "components", "MobileGame.tsx");
const LEADERBOARD = join(SRC, "app", "components", "Leaderboard.tsx");
const DAILY_CHALLENGE = join(SRC, "app", "components", "DailyChallenge.tsx");
const PROFILE_STATS = join(SRC, "app", "components", "ProfileStats.tsx");
const DESIGN_SHOWCASE = join(SRC, "app", "components", "DesignSystemShowcase.tsx");
const MINESWEEPER_BOARD = join(SRC, "app", "components", "game", "MinesweeperBoard.tsx");
const USE_GAME_LOGIC = join(SRC, "app", "components", "game", "useGameLogic.ts");
const EXTENSIONS = new Set([".css", ".tsx", ".ts", ".jsx", ".js"]);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return EXTENSIONS.has(path.slice(path.lastIndexOf("."))) ? [path] : [];
  });
}

function sourceFiles() {
  return walk(SRC).map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));
}

function whiteThemeVariable(name) {
  const theme = readFileSync(THEME_CSS, "utf8");
  const block = theme.match(/\[data-theme="white"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const value = block.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1];
  assert.ok(value, `Missing ${name} in white theme`);
  return value;
}

test("app source does not use CSS gradient functions", () => {
  const offenders = sourceFiles()
    .filter(({ text }) => /\b(?:linear|radial|conic)-gradient\(/.test(text))
    .map(({ path }) => path);

  assert.deepEqual(offenders, []);
});

test("buttons do not define inline shadow styles", () => {
  const offenders = sourceFiles()
    .filter(({ text }) => /<button[^\n]*boxShadow\s*:/.test(text))
    .map(({ path }) => path);

  assert.deepEqual(offenders, []);
});

test("white theme primary button uses a light amber fill with dark text", () => {
  assert.equal(whiteThemeVariable("--mm-action-bg"), "#F2B84A");
  assert.equal(whiteThemeVariable("--mm-action-fg"), "#111827");
});

test("white theme board cells have visible contrast", () => {
  assert.equal(whiteThemeVariable("--mm-board-bg"), "#DDE5EF");
  assert.equal(whiteThemeVariable("--mm-cell-closed-bg"), "#BFCBDD");
  assert.equal(whiteThemeVariable("--mm-cell-open-bg"), "#F8FAFC");
  assert.equal(whiteThemeVariable("--mm-cell-empty-bg"), "#E8EDF5");
  assert.match(whiteThemeVariable("--cell-closed-shadow"), /rgba\(15,23,42,0\.22\)/);
});

test("white theme landing cta uses the standard page border token", () => {
  const theme = readFileSync(THEME_CSS, "utf8");
  const landingPage = readFileSync(LANDING_PAGE, "utf8");

  assert.match(theme, /--mm-cta-border:\s*var\(--mm-border-amber\);/);
  assert.equal(whiteThemeVariable("--mm-cta-border"), "var(--mm-border)");
  assert.match(landingPage, /border:\s*"1px solid var\(--mm-cta-border\)"/);
});

test("landing cta uses the same max-width rhythm as other landing sections", () => {
  const landingPage = readFileSync(LANDING_PAGE, "utf8");

  assert.match(landingPage, /<section id="landing-cta" className="max-w-7xl mx-auto px-6 mb-20">/);
  assert.match(landingPage, /rounded-3xl p-12 text-center relative overflow-hidden/);
  assert.doesNotMatch(landingPage, /<section className="mx-6 mb-20 rounded-3xl/);
});

test("landing hero uses downloaded theme-aware brain artwork instead of mini grid", () => {
  const landingPage = readFileSync(LANDING_PAGE, "utf8");
  const darkImage = join(PUBLIC, "images", "landing-brain-dark.png");
  const lightImage = join(PUBLIC, "images", "landing-brain-light.png");

  assert.ok(existsSync(darkImage), "Dark landing brain image should be copied into public assets");
  assert.ok(existsSync(lightImage), "Light landing brain image should be copied into public assets");
  assert.match(landingPage, /LANDING_BRAIN_IMAGES/);
  assert.match(landingPage, /useThemeMode/);
  assert.match(landingPage, /src=\{LANDING_BRAIN_IMAGES\[theme\]\}/);
  assert.match(landingPage, /alt="Minesweeper brain board illustration"/);
  assert.doesNotMatch(landingPage, /MINI_BOARD/);
  assert.doesNotMatch(landingPage, /function MiniCell/);
  assert.doesNotMatch(landingPage, /function BrainBoardIllustration/);
  assert.doesNotMatch(landingPage, /BRAIN_CELLS/);
  assert.doesNotMatch(landingPage, /gridTemplateColumns:\s*"repeat\(5, 1fr\)"/);
});

test("landing hero brain artwork does not overlap dashboard on mobile", () => {
  const landingPage = readFileSync(LANDING_PAGE, "utf8");

  assert.match(landingPage, /className="w-full max-w-\[560px\] mx-auto mt-0 mb-4 lg:-mt-12 lg:-mb-16 pointer-events-none"/);
  assert.match(landingPage, /className="w-full rounded-2xl p-4 relative z-10"/);
  assert.doesNotMatch(landingPage, /marginTop:\s*"-48px"/);
  assert.doesNotMatch(landingPage, /marginBottom:\s*"-64px"/);
});

test("nav buttons use tokenized hover feedback", () => {
  const navBar = readFileSync(NAV_BAR, "utf8");
  const theme = readFileSync(THEME_CSS, "utf8");

  assert.match(theme, /--mm-nav-hover-bg:/);
  assert.match(theme, /--mm-nav-hover-border:/);
  assert.match(theme, /--mm-nav-hover-fg:/);
  assert.match(navBar, /onMouseEnter/);
  assert.match(navBar, /onMouseLeave/);
  assert.match(navBar, /--mm-nav-hover-bg/);
});

test("pro nav item does not render a duplicate badge", () => {
  const navBar = readFileSync(NAV_BAR, "utf8");

  assert.doesNotMatch(navBar, /item\.page === "design"/);
  assert.doesNotMatch(navBar, /toUpperCase\(\)/);
});

test("nav keeps play while daily and pro links are removed", () => {
  const navBar = readFileSync(NAV_BAR, "utf8");
  const desktopNavItems = navBar.match(/const navItems:[\s\S]*?= \[([\s\S]*?)\n  \];/)?.[1] ?? "";
  const mobileNavItems = navBar.match(/const mobileNavItems:[\s\S]*?= \[([\s\S]*?)\n  \];/)?.[1] ?? "";

  assert.match(desktopNavItems, /\{ page: "game", label: t\("mobilePlay"\)/);
  assert.match(mobileNavItems, /\{ page: "game", label: t\("mobilePlay"\)/);
  assert.doesNotMatch(navBar, /\{ page: "daily", label: t\("navDaily"\)/);
  assert.doesNotMatch(navBar, /\{ page: "design", label: t\("navPro"\)/);
});

test("mobile primary navigation is a bottom bar instead of a top bar", () => {
  const app = readFileSync(APP, "utf8");
  const navBar = readFileSync(NAV_BAR, "utf8");

  assert.match(app, /className="hidden md:block sticky top-0 z-50"/);
  assert.match(app, /visiblePage === "game" \? "pb-0 md:pb-0"/);
  assert.match(navBar, /className="hidden md:flex items-center justify-between/);
  assert.match(navBar, /aria-label="Mobile primary navigation"/);
  assert.match(navBar, /md:hidden fixed bottom-0 left-0 right-0 z-50/);
  assert.match(navBar, /aria-label="Mobile primary navigation"[\s\S]*background:\s*"var\(--mm-bg\)"/);
  assert.match(navBar, /borderTop:\s*"1px solid var\(--mm-border\)"/);
  assert.doesNotMatch(navBar, /MenuCircleIcon/);
});

test("logged-out users see auth-only navbar and protected pages require auth", () => {
  const app = readFileSync(APP, "utf8");
  const navBar = readFileSync(NAV_BAR, "utf8");

  assert.match(app, /const authRequiredPages = new Set<Page>\(\["game", "daily", "leaderboard", "profile", "design"\]\)/);
  assert.match(app, /if \(!isAuthenticated && authRequiredPages\.has\(p\)\)/);
  assert.match(app, /const showGuestLanding = !isAuthenticated && authRequiredPages\.has\(page\)/);
  assert.match(app, /const visiblePage = showGuestLanding \? "landing" : page/);
  assert.match(app, /contentInsetClass/);
  assert.match(app, /!isAuthenticated \? "pt-\[64px\] md:pt-0"/);
  assert.match(app, /currentPage=\{visiblePage\}/);
  assert.doesNotMatch(app, /onLandingSection|scrollToLandingSection|landing-\$\{section\}/);
  assert.doesNotMatch(navBar, /LandingSection|guestNavItems|landingNavFeatures|landingNavStats|landingNavStart|onLandingSection/);
  assert.match(navBar, /aria-label="Mobile guest navigation"/);
  assert.match(navBar, /className="md:hidden fixed top-0 left-0 right-0 z-50/);
  assert.match(navBar, /onClick=\{\(\) => onNavigate\("login"\)\}/);
  assert.match(navBar, /onClick=\{\(\) => onNavigate\("register"\)\}/);
  assert.match(navBar, /\{t\("navSignIn"\)\}/);
  assert.match(navBar, /\{t\("navSignUp"\)\}/);
  assert.match(navBar, /if \(!isAuthenticated\)/);
});

test("landing page exposes sections for guest navbar anchors", () => {
  const landingPage = readFileSync(LANDING_PAGE, "utf8");

  assert.match(landingPage, /<section id="landing-hero"/);
  assert.match(landingPage, /id="landing-stats"/);
  assert.match(landingPage, /<section id="landing-features"/);
  assert.match(landingPage, /<section id="landing-cta"/);
});

test("mobile play page does not render a duplicate top header", () => {
  const mobileGame = readFileSync(MOBILE_GAME, "utf8");

  assert.doesNotMatch(mobileGame, /Mine<span/);
  assert.doesNotMatch(mobileGame, /SettingsControls/);
  assert.doesNotMatch(mobileGame, /Menu01Icon/);
  assert.doesNotMatch(mobileGame, /SparklesIcon/);
  assert.match(mobileGame, /<div className="flex items-center justify-between px-4 py-2\.5 gap-3"/);
});

test("mobile play page centers board area and has mode dropdown", () => {
  const mobileGame = readFileSync(MOBILE_GAME, "utf8");

  assert.match(mobileGame, /useState<MobileGameMode>\(initialMode\)/);
  assert.match(mobileGame, /const mobileBoardPreset: BoardPreset = mode === "daily" \? "daily" : "standard"/);
  assert.match(mobileGame, /useGameLogic\(mobileBoardPreset,/);
  assert.match(mobileGame, /allowFlags:\s*mode !== "noFlags"/);
  assert.match(mobileGame, /TIMED_MODE_INITIAL_SECONDS/);
  assert.match(mobileGame, /min-h-\[100dvh\]/);
  assert.match(mobileGame, /pb-\[calc\(88px\+env\(safe-area-inset-bottom\)\)\]/);
  assert.match(mobileGame, /className="flex items-center justify-between px-4 py-2\.5 gap-3"/);
  assert.match(mobileGame, /className="flex items-center gap-4"/);
  assert.match(mobileGame, /className="flex items-center justify-end gap-2"/);
  assert.match(mobileGame, /className="flex-1 grid place-items-center px-4 py-4 overflow-auto"/);
  assert.match(mobileGame, /className="flex w-full flex-col items-center justify-center gap-6"/);
  assert.doesNotMatch(mobileGame, /<select/);
  assert.match(mobileGame, /aria-label=\{t\("mobileModeSelect"\)\}/);
  assert.match(mobileGame, /const \[modeMenuOpen, setModeMenuOpen\] = useState\(false\)/);
  assert.match(mobileGame, /aria-haspopup="listbox"/);
  assert.match(mobileGame, /aria-expanded=\{modeMenuOpen\}/);
  assert.match(mobileGame, /ChevronDownIcon/);
  assert.match(mobileGame, /className="relative"/);
  assert.match(mobileGame, /className="flex h-9 min-w-\[112px\] items-center justify-between gap-2 rounded-xl px-3"/);
  assert.match(mobileGame, /className="h-9 w-9 rounded-xl flex items-center justify-center"/);
  assert.match(mobileGame, /background:\s*"var\(--mm-amber-glow\)"/);
  assert.match(mobileGame, /border:\s*"1px solid var\(--mm-border-amber\)"/);
  assert.match(mobileGame, /Object\.entries\(modeLabels\)/);
  assert.match(mobileGame, /bestTime/);
  assert.match(mobileGame, /9 x 9/);
  assert.doesNotMatch(mobileGame, /difficultyLabels/);
  assert.doesNotMatch(mobileGame, /setDifficulty/);
});

test("mobile game modes replace difficulty modes", () => {
  const mobileGame = readFileSync(MOBILE_GAME, "utf8");

  assert.match(mobileGame, /type MobileGameMode = "classic" \| "noFlags" \| "timed" \| "daily"/);
  assert.match(mobileGame, /mobileModeClassic/);
  assert.match(mobileGame, /mobileModeNoFlags/);
  assert.match(mobileGame, /mobileModeTimed/);
  assert.match(mobileGame, /mobileModeDaily/);
  assert.doesNotMatch(mobileGame, /difficultyBeginner/);
  assert.doesNotMatch(mobileGame, /difficultyAdvanced/);
  assert.doesNotMatch(mobileGame, /difficultyExpert/);
});

test("desktop play page uses the same four 9x9 game modes instead of old difficulties", () => {
  const dashboard = readFileSync(GAME_DASHBOARD, "utf8");
  const controls = readFileSync(CONTROL_PANEL, "utf8");

  assert.match(dashboard, /useState<GameMode>\(initialMode\)/);
  assert.match(dashboard, /const gameBoardPreset: BoardPreset = mode === "daily" \? "daily" : "standard"/);
  assert.match(dashboard, /useGameLogic\(gameBoardPreset,/);
  assert.match(dashboard, /allowFlags:\s*mode !== "noFlags"/);
  assert.match(dashboard, /flagsEnabled=\{mode !== "noFlags"\}/);
  assert.match(dashboard, /\{t\("mode"\)\}/);
  assert.match(dashboard, /\{modeLabels\[mode\]\}/);
  assert.doesNotMatch(dashboard, /modeLabels\[mode\]\} \{t\("mode"\)\}/);
  assert.doesNotMatch(dashboard, /9 x 9/);
  assert.doesNotMatch(dashboard, /config\.mines/);
  assert.doesNotMatch(dashboard, /statusLabel/);
  assert.doesNotMatch(dashboard, /setDifficulty/);
  assert.doesNotMatch(dashboard, /difficultyLabels/);
  assert.match(controls, /type GameMode = "classic" \| "noFlags" \| "timed" \| "daily"/);
  assert.match(controls, /mode: GameMode/);
  assert.match(controls, /onModeChange: \(mode: GameMode\) => void/);
  assert.match(controls, /mobileModeClassic/);
  assert.match(controls, /mobileModeNoFlags/);
  assert.match(controls, /mobileModeTimed/);
  assert.match(controls, /mobileModeDaily/);
  assert.doesNotMatch(controls, /difficultyAdvanced/);
  assert.doesNotMatch(controls, /difficultyExpert/);
});

test("daily game mode stays in-place on mobile and desktop", () => {
  const app = readFileSync(APP, "utf8");
  const dashboard = readFileSync(GAME_DASHBOARD, "utf8");
  const controls = readFileSync(CONTROL_PANEL, "utf8");
  const mobileGame = readFileSync(MOBILE_GAME, "utf8");

  assert.match(app, /<MobileGame initialMode=\{gameInitialMode\} \/>/);
  assert.doesNotMatch(dashboard, /onDailyMode=\{\(\) => onNavigate\("daily"\)\}/);
  assert.doesNotMatch(controls, /onDailyMode/);
  assert.match(controls, /onModeChange\(nextMode\);/);
  assert.doesNotMatch(mobileGame, /onDailyMode/);
  assert.match(mobileGame, /setMode\(nextMode\);/);
  assert.doesNotMatch(mobileGame, /navigate\("daily"\)/);
});

test("timed mode rules are visible in mobile and desktop game surfaces", () => {
  const mobileGame = readFileSync(MOBILE_GAME, "utf8");
  const dashboard = readFileSync(GAME_DASHBOARD, "utf8");

  for (const [name, text] of [["MobileGame", mobileGame], ["GameDashboard", dashboard]]) {
    assert.match(text, /TIMED_MODE_INITIAL_SECONDS/, `${name} should start timed mode from the shared rule`);
    assert.match(text, /mode !== "timed" \|\| status !== "playing"/, `${name} should start timed countdown only after the first reveal`);
    assert.match(text, /applyTimedBoardClear/, `${name} should add timed bonus and score cleared boards`);
    assert.match(text, /countCorrectFlags/, `${name} should score only correctly flagged mines`);
    assert.match(text, /getTimedTimeoutResult/, `${name} should turn timed timeout into a scored survival result`);
    assert.match(text, /endGame\(result\.status\)/, `${name} should finish with the timed survival status`);
    assert.match(text, /timedMinesFound/, `${name} should show timed mine score`);
  }
}
);

test("game logic supports no-flags and timed mobile modes without changing desktop defaults", () => {
  const logic = readFileSync(USE_GAME_LOGIC, "utf8");

  assert.match(logic, /type GameLogicOptions = \{/);
  assert.match(logic, /allowFlags\?: boolean/);
  assert.match(logic, /timeLimit\?: number/);
  assert.match(logic, /export function useGameLogic\(boardPreset: BoardPreset, options: GameLogicOptions = \{\}\)/);
  assert.match(logic, /const \{ allowFlags = true, timeLimit \} = options/);
  assert.match(logic, /if \(!allowFlags\) return;/);
  assert.match(logic, /timeLimit !== undefined && next >= timeLimit/);
  assert.match(logic, /timeRemaining/);
});

test("leaderboard splits ranked results by game mode and period", () => {
  const leaderboard = readFileSync(LEADERBOARD, "utf8");

  assert.match(leaderboard, /type LeaderboardScope = "global" \| "city"/);
  assert.match(leaderboard, /useState<LeaderboardScope>\("global"\)/);
  assert.match(leaderboard, /leaderboardGlobal/);
  assert.match(leaderboard, /leaderboardCity/);
  assert.match(leaderboard, /RANKED_GAME_MODES/);
  assert.match(leaderboard, /LEADERBOARD_PERIODS/);
  assert.match(leaderboard, /leaderboardModeClassic/);
  assert.match(leaderboard, /leaderboardModeTimed/);
  assert.match(leaderboard, /leaderboardModeNoFlags/);
  assert.match(leaderboard, /leaderboardPeriodAllTime/);
  assert.match(leaderboard, /leaderboardPeriodMonthly/);
  assert.match(leaderboard, /leaderboardPeriodWeekly/);
  assert.match(leaderboard, /scoreLabel/);
});

test("leaderboard filters are grouped into one compact filter panel", () => {
  const leaderboard = readFileSync(LEADERBOARD, "utf8");

  assert.match(leaderboard, /const filterGroups/);
  assert.match(leaderboard, /label: t\("leaderboardGlobal"\)/);
  assert.match(leaderboard, /label: t\("mode"\)/);
  assert.match(leaderboard, /label: t\("leaderboardPeriodAllTime"\)/);
  assert.match(leaderboard, /rounded-2xl p-2 mb-6/);
  assert.match(leaderboard, /grid grid-cols-1 gap-2 md:grid-cols-\[auto_auto_auto\]/);
  assert.match(leaderboard, /role="group"/);
  assert.match(leaderboard, /aria-label=\{group\.label\}/);
});

test("mobile compact board scales to wider column counts if reused", () => {
  const board = readFileSync(MINESWEEPER_BOARD, "utf8");

  assert.match(board, /--mm-board-cols/);
  assert.match(board, /--mm-mobile-cell-size/);
  assert.match(board, /\?\s*`repeat\(\$\{board\[0\]\?\.length \|\| 9\}, var\(--mm-mobile-cell-size\)\)`/);
  assert.doesNotMatch(board, /mobileCompact \? "w-8 h-8"/);
});

test("leaderboard tabs use tokenized hover feedback", () => {
  const leaderboard = readFileSync(LEADERBOARD, "utf8");

  assert.match(leaderboard, /hoveredTab/);
  assert.match(leaderboard, /onMouseEnter/);
  assert.match(leaderboard, /onMouseLeave/);
  assert.match(leaderboard, /--mm-nav-hover-bg/);
  assert.match(leaderboard, /--mm-nav-hover-border/);
  assert.match(leaderboard, /--mm-nav-hover-fg/);
});

test("daily challenge uses compact dashboard layout", () => {
  const dailyChallenge = readFileSync(DAILY_CHALLENGE, "utf8");

  assert.match(dailyChallenge, /max-w-\[1180px\]/);
  assert.match(dailyChallenge, /xl:grid-cols-\[auto_360px\]/);
  assert.match(dailyChallenge, /xl:sticky/);
  assert.match(dailyChallenge, /rounded-2xl p-4 sm:p-5 w-fit max-w-full mx-auto/);
  assert.match(dailyChallenge, /xl:max-h-\[calc\(100vh-132px\)\]/);
  assert.match(dailyChallenge, /grid-cols-1 sm:grid-cols-3/);
  assert.match(dailyChallenge, /grid-cols-1 sm:grid-cols-2 xl:grid-cols-1/);
});

test("nav destination pages use leaderboard outer padding", () => {
  const pages = [
    ["Leaderboard", readFileSync(LEADERBOARD, "utf8")],
    ["DailyChallenge", readFileSync(DAILY_CHALLENGE, "utf8")],
    ["ProfileStats", readFileSync(PROFILE_STATS, "utf8")],
    ["DesignSystemShowcase", readFileSync(DESIGN_SHOWCASE, "utf8")],
  ];

  for (const [name, text] of pages) {
    assert.match(text, /mx-auto px-4 py-8/, `${name} should use leaderboard page padding`);
  }
});

test("profile hero removes rank badges and keeps mobile identity compact", () => {
  const profileStats = readFileSync(PROFILE_STATS, "utf8");

  assert.doesNotMatch(profileStats, /DiamondIcon/);
  assert.doesNotMatch(profileStats, /-top-1 -right-1/);
  assert.doesNotMatch(profileStats, /function ProfileRankBadge/);
  assert.doesNotMatch(profileStats, /profileData\.globalRank/);
  assert.doesNotMatch(profileStats, /profileData\.cityRank/);
  assert.doesNotMatch(profileStats, /leaderboardGlobal/);
  assert.match(profileStats, /profile-identity-row flex items-start gap-4/);
  assert.match(profileStats, /profile-signout-button h-10 w-10/);
  assert.match(profileStats, /<span className="hidden sm:inline">\{t\("profileSignOut"\)\}<\/span>/);
});

test("accuracy metric is removed from visible product surfaces", () => {
  const files = [
    ["LandingPage", readFileSync(LANDING_PAGE, "utf8")],
    ["GameDashboard", readFileSync(GAME_DASHBOARD, "utf8")],
    ["ControlPanel", readFileSync(CONTROL_PANEL, "utf8")],
    ["DailyChallenge", readFileSync(DAILY_CHALLENGE, "utf8")],
    ["ProfileStats", readFileSync(PROFILE_STATS, "utf8")],
  ];
  const translations = readFileSync(join(SRC, "app", "i18n", "translations.ts"), "utf8");

  for (const [name, text] of files) {
    assert.doesNotMatch(text, /accuracy/i, `${name} should not render or pass accuracy`);
  }
  assert.doesNotMatch(translations, /controlsAccuracy|landingAccuracy|dailySolvedAccuracy|profileAvgAccuracy|tableAccuracyShort/);
});

test("profile stats use current game modes instead of old difficulties", () => {
  const profileStats = readFileSync(PROFILE_STATS, "utf8");
  const translations = readFileSync(join(SRC, "app", "i18n", "translations.ts"), "utf8");

  assert.match(profileStats, /profileWinRateByMode/);
  assert.match(profileStats, /mobileModeClassic/);
  assert.match(profileStats, /mobileModeNoFlags/);
  assert.match(profileStats, /mobileModeTimed/);
  assert.match(profileStats, /mobileModeDaily/);
  assert.doesNotMatch(profileStats, /difficultyBeginner|difficultyAdvanced|difficultyExpert|profileFavDifficulty/);
  assert.match(translations, /profileWinRateByMode/);
  assert.match(translations, /profileFavMode/);
});

test("pro upgrade cta aligns icon and label as one centered row", () => {
  const controls = readFileSync(CONTROL_PANEL, "utf8");

  assert.match(controls, /<button className="w-full rounded-lg py-2 inline-flex items-center justify-center gap-1\.5 transition-all duration-200 hover:brightness-110"/);
  assert.match(controls, /<StarIcon size=\{12\} color="#fff" aria-hidden="true" \/>/);
  assert.doesNotMatch(controls, /StarIcon[\s\S]*marginRight:\s*"6px"/);
});
