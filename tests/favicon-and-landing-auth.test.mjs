import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const INDEX = join(ROOT, "index.html");
const APP = join(ROOT, "src", "app", "App.tsx");
const LANDING = join(ROOT, "src", "app", "components", "LandingPage.tsx");
const FAVICON = join(ROOT, "public", "favicon.svg");

test("site uses the MineMind logo as favicon", () => {
  const index = readFileSync(INDEX, "utf8");

  assert.match(index, /rel="icon"/);
  assert.match(index, /href="\/favicon\.svg"/);
  assert.equal(existsSync(FAVICON), true);
});

test("favicon uses the plain hexagon brand mark without an extra center stroke", () => {
  const favicon = readFileSync(FAVICON, "utf8");

  assert.match(favicon, /<rect[^>]+fill="#f4a51c"/);
  assert.match(favicon, /<path[^>]+stroke="#141414"/);
  assert.doesNotMatch(favicon, /M24 21v6/);
});

test("landing dashboard sign-in button is guest-only and navigates to login", () => {
  const app = readFileSync(APP, "utf8");
  const landing = readFileSync(LANDING, "utf8");

  assert.doesNotMatch(app, /const goToLogin = \(\) => \{/);
  assert.match(app, /onSignIn=\{\(\) => navigate\("login"\)\}/);
  assert.match(app, /isAuthenticated=\{isAuthenticated\}/);
  assert.match(landing, /isAuthenticated: boolean/);
  assert.match(landing, /onSignIn: \(\) => void/);
  assert.match(landing, /!isAuthenticated && \(/);
  assert.match(landing, /onClick=\{onSignIn\}/);
  const signInButtonBlock = landing.match(/!isAuthenticated && \([\s\S]*?<button[\s\S]*?<\/button>/)?.[0] ?? "";
  assert.match(signInButtonBlock, /onClick=\{onSignIn\}/);
  assert.doesNotMatch(signInButtonBlock, /onClick=\{onPlay\}/);
});

test("landing artwork cannot overlay or intercept the dashboard sign-in button", () => {
  const landing = readFileSync(LANDING, "utf8");

  assert.match(landing, /className="[^"]*pointer-events-none[^"]*"/);
  assert.match(landing, /className="w-full rounded-2xl p-4 relative z-10"/);
});
