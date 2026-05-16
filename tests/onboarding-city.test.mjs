import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const SRC = join(ROOT, "src");
const CITY_DATA = join(SRC, "app", "data", "cities.ts");
const CITY_PICKER = join(SRC, "app", "components", "CityPicker.tsx");
const ONBOARDING_PAGE = join(SRC, "app", "components", "OnboardingPage.tsx");
const REGISTER_PAGE = join(SRC, "app", "components", "RegisterPage.tsx");
const AUTH_CONTEXT = join(SRC, "app", "contexts", "AuthContext.tsx");
const APP = join(SRC, "app", "App.tsx");
const PROFILE_STATS = join(SRC, "app", "components", "ProfileStats.tsx");
const TRANSLATIONS = join(SRC, "app", "i18n", "translations.ts");

function text(path) {
  return readFileSync(path, "utf8");
}

test("city data exports a broad city list and country-code map", () => {
  assert.ok(existsSync(CITY_DATA), "cities.ts should exist");
  const source = text(CITY_DATA);

  assert.match(source, /export const CITIES/);
  assert.match(source, /export const CITY_COUNTRY_MAP/);
  assert.ok((source.match(/name:/g) ?? []).length >= 100, "CITIES should contain about 120 entries");
  assert.match(source, /name:\s*"Almaty"[\s\S]*country:\s*"Kazakhstan"[\s\S]*code:\s*"KZ"/);
});

test("CityPicker is a searchable required combobox backed by shared city data", () => {
  assert.ok(existsSync(CITY_PICKER), "CityPicker.tsx should exist");
  const source = text(CITY_PICKER);

  assert.match(source, /import \{ CITIES/);
  assert.match(source, /role="combobox"/);
  assert.match(source, /query/);
  assert.match(source, /city\.name\.toLowerCase\(\)\.includes/);
  assert.match(source, /city\.country\.toLowerCase\(\)\.includes/);
  assert.match(source, /city\.flag/);
  assert.match(source, /city\.code/);
  assert.match(source, /onChange\(city\.name\)/);
});

test("email registration verifies OTP before collecting username and city", () => {
  const source = text(REGISTER_PAGE);

  assert.match(source, /type RegisterStep = "credentials" \| "code" \| "username" \| "city"/);
  assert.match(source, /city: string/);
  assert.match(source, /setStep\("code"\)/);
  assert.match(source, /supabase\.auth\.verifyOtp/);
  assert.match(source, /setStep\("username"\)/);
  assert.match(source, /setStep\("city"\)/);
  assert.match(source, /<CityPicker/);
  assert.match(source, /insert\(\{ user_id: userId, username: data\.username, city: data\.city \}\)/);
});

test("OAuth auth state requires explicit onboarding instead of auto-profile creation", () => {
  const source = text(AUTH_CONTEXT);

  assert.match(source, /needsOnboarding: boolean/);
  assert.match(source, /completeOnboarding: \(\) => void/);
  assert.match(source, /setNeedsOnboarding\(true\)/);
  assert.match(source, /setNeedsOnboarding\(false\)/);
  assert.doesNotMatch(source, /const username = `\$\{base\}_/);
  assert.doesNotMatch(source, /member_since: new Date\(\)\.toISOString\(\)/);
});

test("every authenticated user must have a profile before app access", () => {
  const source = text(AUTH_CONTEXT);

  assert.match(source, /if \(authUser\) \{/);
  assert.doesNotMatch(source, /app_metadata\?\.provider\s*!==\s*"email"/);
  assert.match(source, /from\("user_profiles"\)/);
  assert.match(source, /setNeedsOnboarding\(true\)/);
});

test("App renders onboarding full-screen for authenticated users missing a profile", () => {
  const source = text(APP);

  assert.match(source, /import \{ OnboardingPage \}/);
  assert.match(source, /needsOnboarding/);
  assert.match(source, /if \(user && needsOnboarding\)/);
  assert.match(source, /<OnboardingPage/);
});

test("profile rank city badges are removed while translations keep generic city labels", () => {
  const profile = text(PROFILE_STATS);
  const translations = text(TRANSLATIONS);

  assert.doesNotMatch(profile, /CITY_COUNTRY_MAP/);
  assert.doesNotMatch(profile, /<sup/);
  assert.doesNotMatch(profile, /cityCode/);
  assert.match(translations, /leaderboardAlmatyRank:\s*"City rank"/);
  assert.match(translations, /leaderboardCity:\s*"City"/);
  assert.doesNotMatch(translations, /leaderboardAlmatyRank:\s*"Almaty rank"/);
  assert.doesNotMatch(translations, /leaderboardCity:\s*"Almaty"/);
});
