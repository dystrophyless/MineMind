import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ACHIEVEMENT_DEFS, type AchievementKey } from "../services/achievements";
import { useT } from "../i18n/LocaleProvider";

type AchievementContextValue = {
  queueAchievements: (keys: AchievementKey[]) => void;
};

export const AchievementContext = createContext<AchievementContextValue>({
  queueAchievements: () => {},
});

export function useAchievementQueue() {
  return useContext(AchievementContext);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function AchievementToastItem({
  achievementKey,
  visible,
}: {
  achievementKey: AchievementKey;
  visible: boolean;
}) {
  const t = useT();
  const isMobile = useIsMobile();
  const def = ACHIEVEMENT_DEFS.find(d => d.key === achievementKey)!;

  const baseStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 18px",
    borderRadius: "16px",
    background: "var(--mm-surface-1)",
    border: "1px solid var(--mm-border-2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    maxWidth: "320px",
    width: "max-content",
    transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
    pointerEvents: "none",
  };

  const positionStyle: React.CSSProperties = isMobile
    ? {
        bottom: "92px",
        left: "50%",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(140%)",
        opacity: visible ? 1 : 0,
      }
    : {
        bottom: "24px",
        right: "24px",
        transform: visible ? "translateX(0)" : "translateX(140%)",
        opacity: visible ? 1 : 0,
      };

  return (
    <div style={{ ...baseStyle, ...positionStyle }}>
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: "var(--mm-surface-2)",
          border: "1px solid var(--mm-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {def.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            color: "var(--mm-amber)",
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            marginBottom: "2px",
          }}
        >
          {t("achievementUnlocked")}
        </p>
        <p
          style={{
            color: "var(--mm-text)",
            fontSize: "14px",
            fontWeight: 700,
            marginBottom: "2px",
          }}
        >
          {t(def.nameKey)}
        </p>
        <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>
          {t(def.descKey)}
        </p>
      </div>
    </div>
  );
}

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<AchievementKey[]>([]);
  const [current, setCurrent] = useState<AchievementKey | null>(null);
  const [visible, setVisible] = useState(false);

  const queueAchievements = useCallback((keys: AchievementKey[]) => {
    if (keys.length === 0) return;
    setQueue(prev => [...prev, ...keys]);
  }, []);

  useEffect(() => {
    if (current !== null || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    const t = setTimeout(() => {
      setCurrent(next);
      setVisible(true);
    }, 500);
    return () => clearTimeout(t);
  }, [queue, current]);

  useEffect(() => {
    if (!current) return;
    const hideTimer = setTimeout(() => setVisible(false), 4000);
    const clearTimer = setTimeout(() => setCurrent(null), 4350);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [current]);

  return (
    <AchievementContext.Provider value={{ queueAchievements }}>
      {children}
      {current && <AchievementToastItem achievementKey={current} visible={visible} />}
    </AchievementContext.Provider>
  );
}
