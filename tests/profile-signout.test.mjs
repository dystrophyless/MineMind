import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const SRC = join(ROOT, "src");
const PROFILE_STATS = join(SRC, "app", "components", "ProfileStats.tsx");
const TRANSLATIONS = join(SRC, "app", "i18n", "translations.ts");

test("profile renders a sign-out button wired to auth context", () => {
  const profileStats = readFileSync(PROFILE_STATS, "utf8");
  const translations = readFileSync(TRANSLATIONS, "utf8");

  assert.match(profileStats, /import \{ useAuth \}/);
  assert.match(profileStats, /const \{ signOut \} = useAuth\(\)/);
  assert.match(profileStats, /onClick=\{signOut\}/);
  assert.match(profileStats, /LogOutIcon/);
  assert.match(profileStats, /\{t\("profileSignOut"\)\}/);
  assert.match(translations, /profileSignOut:\s*"Sign out"/);
  assert.match(translations, /profileSignOut:\s*"Выйти"/);
});
