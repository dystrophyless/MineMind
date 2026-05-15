import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { BombIcon, StopWatchIcon, ArrowReloadHorizontalIcon } from "hugeicons-react";
import { ChevronDownIcon } from "lucide-react";
import { MinesweeperBoard } from "./game/MinesweeperBoard";
import { useGameLogic, BoardPreset } from "./game/useGameLogic";
import { applyTimedBoardClear, countCorrectFlags, TIMED_MODE_INITIAL_SECONDS } from "./game/gameRules.mjs";
import { useT } from "../i18n/LocaleProvider";

type MobileGameMode = "classic" | "noFlags" | "timed" | "daily";

type Props = {
  initialMode?: MobileGameMode;
};

export function MobileGame({ initialMode = "classic" }: Props) {
  const t = useT();
  const { user } = useAuth();
  const savedRef = useRef(false);
  const [mode, setMode] = useState<MobileGameMode>(initialMode);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [timedSecondsLeft, setTimedSecondsLeft] = useState(TIMED_MODE_INITIAL_SECONDS);
  const [timedMinesFound, setTimedMinesFound] = useState(0);
  const [timedBest, setTimedBest] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const mobileBoardPreset: BoardPreset = mode === "daily" ? "daily" : "standard";
  const { board, status, time, formatTime, minesLeft, revealCell, toggleFlag, resetGame, endGame } = useGameLogic(mobileBoardPreset, {
    allowFlags: mode !== "noFlags",
  });
  const modeLabels: Record<MobileGameMode, string> = {
    classic: t("mobileModeClassic"),
    noFlags: t("mobileModeNoFlags"),
    timed: t("mobileModeTimed"),
    daily: t("mobileModeDaily"),
  };
  const resetTimedRun = () => {
    setTimedSecondsLeft(TIMED_MODE_INITIAL_SECONDS);
    setTimedMinesFound(0);
  };
  const restartGame = () => {
    resetGame();
    resetTimedRun();
  };
  const selectMode = (nextMode: MobileGameMode) => {
    setMode(nextMode);
    setModeMenuOpen(false);
    resetGame();
    resetTimedRun();
  };
  const timerText = mode === "timed" ? formatTime(timedSecondsLeft) : formatTime(time);
  const resultText = status === "won"
    ? `${t("mobileClearedIn")} ${formatTime(time)}!`
    : mode === "timed" && timedSecondsLeft === 0
      ? t("mobileTimeUp")
      : t("mobileTryAgain");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("game_attempts")
      .select("mines_found")
      .eq("user_id", user.id)
      .eq("mode", "timed")
      .not("mines_found", "is", null)
      .order("mines_found", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (data?.mines_found) setTimedBest(data.mines_found); });
  }, [user]);

  useEffect(() => {
    setBestTime(null);
    if (!user || mode === "timed") return;
    supabase
      .from("game_attempts")
      .select("time_seconds")
      .eq("user_id", user.id)
      .eq("mode", mode)
      .eq("status", "won")
      .not("time_seconds", "is", null)
      .order("time_seconds", { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setBestTime(data?.time_seconds ?? null));
  }, [user, mode]);

  useEffect(() => {
    if (mode !== "timed" || status !== "playing") return;

    const interval = window.setInterval(() => {
      setTimedSecondsLeft(seconds => {
        if (seconds <= 1) {
          endGame();
          setTimedBest(best => Math.max(best, timedMinesFound));
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [endGame, mode, status, timedMinesFound]);

  useEffect(() => {
    if (mode !== "timed" || status !== "won") return;

    const nextRun = applyTimedBoardClear({
      secondsLeft: timedSecondsLeft,
      minesFound: timedMinesFound,
      correctFlags: countCorrectFlags(board),
    });
    setTimedSecondsLeft(nextRun.secondsLeft);
    setTimedMinesFound(nextRun.minesFound);
    setTimedBest(best => Math.max(best, nextRun.minesFound));
    resetGame();
  }, [board, mode, resetGame, status, timedMinesFound, timedSecondsLeft]);

  useEffect(() => {
    if (mode === "timed" && status === "lost") {
      setTimedBest(best => Math.max(best, timedMinesFound));
    }
  }, [mode, status, timedMinesFound]);

  useEffect(() => {
    if (status === "idle" || status === "playing") {
      savedRef.current = false;
      return;
    }
    if (savedRef.current || !user) return;

    // Skip saving individual boards in timed mode — only save when the run ends (status === "lost")
    if (mode === "timed" && status === "won") return;
    // Skip daily — handled separately
    if (mode === "daily") return;

    savedRef.current = true;

    const attempt = {
      user_id: user.id,
      mode,
      status,
      ...(mode === "timed"
        ? { mines_found: timedMinesFound }
        : { time_seconds: time }),
    };

    supabase.from("game_attempts").insert(attempt).then(({ error }) => {
      if (error) console.error("Failed to save game attempt:", error.message);
    });

    if (status === "won" && mode !== "timed" && mode !== "daily") {
      setBestTime(prev => prev === null || time < prev ? time : prev);
    }
  }, [status, mode, user, time, timedMinesFound]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col select-none overflow-hidden" style={{ background: "var(--mm-bg)", maxWidth: "430px", margin: "0 auto" }}>
      <div className="flex items-center justify-between px-4 py-2.5 gap-3" style={{ background: "var(--mm-surface-2)", borderBottom: "1px solid var(--mm-border)" }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <StopWatchIcon size={13} color="var(--mm-amber)" />
            <span style={{ color: "var(--mm-amber)", fontSize: "16px", fontWeight: 800 }}>{timerText}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BombIcon size={13} color="var(--mm-red)" />
            <span style={{ color: "var(--mm-red)", fontSize: "16px", fontWeight: 800 }}>{minesLeft}</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div
            className="relative"
            onBlur={(event) => {
              const nextTarget = event.relatedTarget;
              if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                setModeMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              aria-label={t("mobileModeSelect")}
              aria-haspopup="listbox"
              aria-expanded={modeMenuOpen}
              onClick={() => setModeMenuOpen(open => !open)}
              className="flex h-9 min-w-[112px] items-center justify-between gap-2 rounded-xl px-3"
              style={{
                background: "var(--mm-surface-3)",
                border: "1px solid var(--mm-border)",
                color: "var(--mm-text-2)",
                fontSize: "12px",
                fontFamily: "var(--font-mabry)",
                fontWeight: 600,
              }}
            >
              <span>{modeLabels[mode]}</span>
              <ChevronDownIcon size={14} strokeWidth={2.3} />
            </button>

            {modeMenuOpen && (
              <div
                role="listbox"
                className="absolute right-0 top-[calc(100%+6px)] z-30 w-[144px] overflow-hidden rounded-xl py-1"
                style={{
                  background: "var(--mm-surface-2)",
                  border: "1px solid var(--mm-border-2)",
                }}
              >
                {(Object.entries(modeLabels) as [MobileGameMode, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="option"
                    aria-selected={mode === key}
                    onClick={() => selectMode(key)}
                    className="w-full px-3 py-2 text-left"
                    style={{
                      background: mode === key ? "var(--mm-amber-glow)" : "transparent",
                      color: mode === key ? "var(--mm-amber)" : "var(--mm-text-2)",
                      fontSize: "12px",
                      fontFamily: "var(--font-mabry)",
                      fontWeight: mode === key ? 800 : 600,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={restartGame}
            aria-label={t("controlsNewGame")}
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}
          >
            <ArrowReloadHorizontalIcon size={15} color="var(--mm-amber)" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2" style={{ background: "var(--mm-bg)", borderBottom: "1px solid var(--mm-border)" }}>
        <span style={{ color: "var(--mm-text-3)", fontSize: "11px", fontWeight: 700 }}>9 x 9</span>
        <span style={{ color: "var(--mm-text-2)", fontSize: "11px", fontWeight: 700 }}>{modeLabels[mode]}</span>
        <span style={{ color: "var(--mm-amber)", fontSize: "11px", fontWeight: 800 }}>
          {mode === "timed"
            ? `${t("tableBest")} ${timedBest} ${t("boardMines")}`
            : bestTime !== null
              ? `${t("tableBest")} ${formatTime(Math.round(bestTime))}`
              : `${t("tableBest")} —`}
        </span>
      </div>
      {mode === "timed" && (
        <div className="flex items-center justify-center gap-3 px-4 py-2" style={{ background: "var(--mm-surface-1)", borderBottom: "1px solid var(--mm-border)" }}>
          <span style={{ color: "var(--mm-text-2)", fontSize: "12px", fontWeight: 700 }}>{t("mobileTimedScore")} {timedMinesFound} {t("boardMines")}</span>
          <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>+5s {t("mobileTimedBonus")}</span>
        </div>
      )}

      <div className="flex-1 grid place-items-center px-4 py-4 overflow-auto">
        <div className="w-full pb-[calc(88px+env(safe-area-inset-bottom))]">
          <div className="flex w-full flex-col items-center justify-center gap-6">
            <MinesweeperBoard board={board} status={status} onReveal={revealCell} onFlag={toggleFlag} mobileCompact flagsEnabled={mode !== "noFlags"} />

            {status !== "idle" && status !== "playing" && (
              <div className="w-full rounded-xl py-3 px-4 text-center" style={{ background: status === "won" ? "var(--mm-green-glow)" : "var(--mm-red-glow)", border: `1px solid ${status === "won" ? "rgba(76,217,123,0.3)" : "rgba(229,90,90,0.3)"}` }}>
                <p style={{ color: status === "won" ? "var(--mm-green)" : "var(--mm-red)", fontSize: "14px", fontWeight: 700 }}>
                  {resultText}
                </p>
              </div>
            )}

            <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{mode === "noFlags" ? t("mobileNoFlagsHelp") : t("boardTouchHelp")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
