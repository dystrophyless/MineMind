import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getInitialTheme } from "../preferences/initialPreferences.mjs";

const STORAGE_KEY = "minemind.theme";

export type ThemeMode = "white" | "black";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "black";
  return getInitialTheme({
    storedTheme: window.localStorage.getItem(STORAGE_KEY),
    prefersDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
  }) as ThemeMode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "black");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeMode must be used within ThemeProvider");
  return context;
}
