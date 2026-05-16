import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { BombIcon, RacingFlagIcon } from "hugeicons-react";
import { CellState, GameStatus, NUMBER_COLORS } from "./useGameLogic";

type Props = {
  board: CellState[][];
  status: GameStatus;
  onReveal: (r: number, c: number) => void;
  onFlag: (r: number, c: number) => void;
  highlightedCells?: Set<string>;
  safeCells?: Set<string>;
  mobileCompact?: boolean;
  flagsEnabled?: boolean;
};

function Cell({
  cell,
  row,
  col,
  status,
  onReveal,
  onFlag,
  isHighlighted,
  isSafe,
  mobileCompact,
  flagsEnabled,
}: {
  cell: CellState;
  row: number;
  col: number;
  status: GameStatus;
  onReveal: (r: number, c: number) => void;
  onFlag: (r: number, c: number) => void;
  isHighlighted?: boolean;
  isSafe?: boolean;
  mobileCompact?: boolean;
  flagsEnabled: boolean;
}) {
  const longPressTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const resetLongPressRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const didLongPressRef = useRef(false);
  const suppressClickUntilRef = useRef(0);

  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const markLongPressHandled = useCallback(() => {
    didLongPressRef.current = true;
    suppressClickUntilRef.current = Date.now() + 700;
    if (resetLongPressRef.current) window.clearTimeout(resetLongPressRef.current);
    resetLongPressRef.current = window.setTimeout(() => {
      didLongPressRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) window.clearTimeout(longPressTimerRef.current);
      if (resetLongPressRef.current) window.clearTimeout(resetLongPressRef.current);
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (Date.now() < suppressClickUntilRef.current) {
      e.preventDefault();
      return;
    }
    if (status === "won" || status === "lost") return;
    onReveal(row, col);
  }, [row, col, status, onReveal]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    if (!flagsEnabled) return;
    if (status === "won" || status === "lost" || cell.isRevealed) return;
    onFlag(row, col);
  }, [row, col, status, cell.isRevealed, flagsEnabled, onFlag]);

  const handleLongPress = useCallback(() => {
    if (!flagsEnabled) return;
    if (status === "won" || status === "lost" || cell.isRevealed) return;
    onFlag(row, col);
  }, [row, col, status, cell.isRevealed, flagsEnabled, onFlag]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse") return;
    if (!flagsEnabled) return;
    if (status === "won" || status === "lost" || cell.isRevealed) return;

    cancelLongPress();
    longPressTimerRef.current = window.setTimeout(() => {
      markLongPressHandled();
      handleLongPress();
    }, 450);
  }, [cancelLongPress, cell.isRevealed, flagsEnabled, handleLongPress, markLongPressHandled, status]);

  const size = mobileCompact ? "" : "w-9 h-9 md:w-10 md:h-10";
  const mobileCellSize = mobileCompact
    ? ({
        width: "var(--mm-mobile-cell-size)",
        height: "var(--mm-mobile-cell-size)",
        minWidth: "var(--mm-mobile-cell-size)",
        touchAction: "manipulation",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      } as CSSProperties)
    : undefined;

  if (cell.isRevealed) {
    if (cell.isMine) {
      return (
        <div
          className={`${size} flex items-center justify-center rounded-sm select-none`}
          style={{
            ...mobileCellSize,
            background: "var(--mm-cell-mine-bg)",
            boxShadow: "var(--cell-open-shadow), 0 0 8px rgba(229,90,90,0.4)",
            border: "1px solid rgba(229,90,90,0.3)",
          }}
        >
          {mobileCompact
            ? <span style={{ width: "calc(var(--mm-mobile-cell-size) * 0.58)", height: "calc(var(--mm-mobile-cell-size) * 0.58)", display: "flex" }}><BombIcon size="100%" color="var(--mm-red)" /></span>
            : <BombIcon size={16} color="var(--mm-red)" />}
        </div>
      );
    }

    if (cell.neighborMines === 0) {
      return (
        <div
          className={`${size} rounded-sm select-none`}
          style={{
            ...mobileCellSize,
            background: "var(--mm-cell-empty-bg)",
            boxShadow: "var(--cell-open-shadow)",
            border: "1px solid var(--mm-border)",
          }}
        />
      );
    }

    return (
      <div
        className={`${size} flex items-center justify-center rounded-sm select-none`}
        style={{
          ...mobileCellSize,
          background: "var(--mm-cell-open-bg)",
          boxShadow: "var(--cell-open-shadow)",
          border: "1px solid var(--mm-border)",
          color: NUMBER_COLORS[cell.neighborMines] || "#EDE8DE",
          fontSize: mobileCompact ? "clamp(7px, calc(var(--mm-mobile-cell-size) * 0.46), 11px)" : "13px",
          fontWeight: 700,
          letterSpacing: 0,
        }}
      >
        {cell.neighborMines}
      </div>
    );
  }

  if (cell.isFlagged) {
    return (
      <button
        className={`${size} flex items-center justify-center rounded-sm select-none cursor-pointer transition-transform active:scale-95`}
        style={{
          ...mobileCellSize,
          background: "var(--mm-cell-flag-bg)",
          boxShadow: "var(--cell-closed-shadow), 0 0 8px var(--mm-amber-glow)",
          border: "1px solid var(--mm-border-amber)",
        }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onPointerDown={handlePointerDown}
        onPointerUp={cancelLongPress}
        onPointerCancel={cancelLongPress}
        onPointerLeave={cancelLongPress}
      >
        {mobileCompact
          ? <span style={{ width: "calc(var(--mm-mobile-cell-size) * 0.54)", height: "calc(var(--mm-mobile-cell-size) * 0.54)", display: "flex" }}><RacingFlagIcon size="100%" color="var(--mm-amber)" /></span>
          : <RacingFlagIcon size={15} color="var(--mm-amber)" />}
      </button>
    );
  }

  let closedBg = "var(--mm-cell-closed-bg)";
  let closedShadow = "var(--cell-closed-shadow)";
  let closedBorder = "1px solid var(--mm-border)";
  let glowEffect = "";

  if (isSafe) {
    closedBg = "var(--mm-cell-safe-bg)";
    closedShadow = "var(--cell-closed-shadow), 0 0 10px var(--mm-green-glow)";
    closedBorder = "1px solid rgba(76,217,123,0.25)";
    glowEffect = "0 0 12px rgba(76,217,123,0.2)";
  } else if (isHighlighted) {
    closedBg = "var(--mm-cell-danger-bg)";
    closedShadow = "var(--cell-closed-shadow), 0 0 10px var(--mm-red-glow)";
    closedBorder = "1px solid rgba(229,90,90,0.25)";
  }

  return (
    <button
      className={`${size} rounded-sm select-none cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-95`}
      style={{
        ...mobileCellSize,
        background: closedBg,
        boxShadow: closedShadow + (glowEffect ? `, ${glowEffect}` : ""),
        border: closedBorder,
      }}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onPointerDown={handlePointerDown}
      onPointerUp={cancelLongPress}
      onPointerCancel={cancelLongPress}
      onPointerLeave={cancelLongPress}
    />
  );
}

export function MinesweeperBoard({ board, status, onReveal, onFlag, highlightedCells, safeCells, mobileCompact, flagsEnabled = true }: Props) {
  const compactBoardVars = mobileCompact
    ? ({
        "--mm-board-cols": board[0]?.length || 9,
        "--mm-mobile-cell-size": "min(32px, calc((100dvw - 72px - ((var(--mm-board-cols) - 1) * 2px)) / var(--mm-board-cols)))",
      } as CSSProperties)
    : undefined;

  return (
    <div
      className="inline-block p-3 rounded-xl"
      style={{
        ...compactBoardVars,
        background: "var(--mm-board-bg)",
        border: "1px solid var(--mm-border-2)",
        boxShadow: "var(--mm-board-shadow)",
      }}
    >
      <div
        className="grid"
        style={{
          gap: mobileCompact ? "2px" : "3px",
          gridTemplateColumns: mobileCompact
            ? `repeat(${board[0]?.length || 9}, var(--mm-mobile-cell-size))`
            : `repeat(${board[0]?.length || 9}, 1fr)`,
        }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <Cell
              key={`${rIdx}-${cIdx}`}
              cell={cell}
              row={rIdx}
              col={cIdx}
              status={status}
              onReveal={onReveal}
              onFlag={onFlag}
              isHighlighted={highlightedCells?.has(`${rIdx},${cIdx}`)}
              isSafe={safeCells?.has(`${rIdx},${cIdx}`)}
              mobileCompact={mobileCompact}
              flagsEnabled={flagsEnabled}
            />
          ))
        )}
      </div>
    </div>
  );
}
