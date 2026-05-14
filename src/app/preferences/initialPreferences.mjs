export const LOCALES = ["en", "ru"];
export const THEME_MODES = ["white", "black"];

export function isLocale(value) {
  return LOCALES.includes(value);
}

export function isThemeMode(value) {
  return THEME_MODES.includes(value);
}

export function getInitialLocale({ storedLocale, browserLanguage }) {
  if (isLocale(storedLocale)) return storedLocale;
  return browserLanguage?.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function getInitialTheme({ storedTheme, prefersDark }) {
  if (isThemeMode(storedTheme)) return storedTheme;
  return prefersDark ? "black" : "white";
}
