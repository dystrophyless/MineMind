import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const SRC = join(ROOT, "src");
const THEME_CSS = join(SRC, "styles", "theme.css");
const NAV_BAR = join(SRC, "app", "components", "NavBar.tsx");
const LANDING_PAGE = join(SRC, "app", "components", "LandingPage.tsx");
const LEADERBOARD = join(SRC, "app", "components", "Leaderboard.tsx");
const DAILY_CHALLENGE = join(SRC, "app", "components", "DailyChallenge.tsx");
const PROFILE_STATS = join(SRC, "app", "components", "ProfileStats.tsx");
const DESIGN_SHOWCASE = join(SRC, "app", "components", "DesignSystemShowcase.tsx");
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

test("white theme landing cta uses a non-amber contrast border", () => {
  const theme = readFileSync(THEME_CSS, "utf8");
  const landingPage = readFileSync(LANDING_PAGE, "utf8");

  assert.match(theme, /--mm-cta-border:\s*var\(--mm-border-amber\);/);
  assert.equal(whiteThemeVariable("--mm-cta-border"), "rgba(37, 99, 235, 0.24)");
  assert.match(landingPage, /border:\s*"1px solid var\(--mm-cta-border\)"/);
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

test("profile hero removes pro avatar ornament and uses refined rank badges", () => {
  const profileStats = readFileSync(PROFILE_STATS, "utf8");

  assert.doesNotMatch(profileStats, /DiamondIcon/);
  assert.doesNotMatch(profileStats, /-top-1 -right-1/);
  assert.match(profileStats, /function ProfileRankBadge/);
  assert.match(profileStats, /h-8 rounded-full px-3/);
  assert.match(profileStats, /#247 \{t\("leaderboardGlobal"\)\}/);
  assert.match(profileStats, /#12 in Almaty/);
  assert.match(profileStats, /--mm-pro-badge-bg/);
  assert.match(profileStats, /--mm-nav-control-bg/);
});
