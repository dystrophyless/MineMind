import { useCallback } from "react";
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
}) {
  const handleClick = useCallback(() => {
    if (status === "won" || status === "lost") return;
    onReveal(row, col);
  }, [row, col, status, onReveal]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (status === "won" || status === "lost" || cell.isRevealed) return;
    onFlag(row, col);
  }, [row, col, status, cell.isRevealed, onFlag]);

  const handleLongPress = useCallback(() => {
    if (status === "won" || status === "lost" || cell.isRevealed) return;
    onFlag(row, col);
  }, [row, col, status, cell.isRevealed, onFlag]);

  const size = mobileCompact ? "w-8 h-8" : "w-9 h-9 md:w-10 md:h-10";

  if (cell.isRevealed) {
    if (cell.isMine) {
      return (
        <div
          className={`${size} flex items-center justify-center rounded-sm select-none`}
          style={{
            background: "linear-gradient(135deg, #3D1B1B, #2A1010)",
            boxShadow: "var(--cell-open-shadow), 0 0 8px rgba(229,90,90,0.4)",
            border: "1px solid rgba(229,90,90,0.3)",
          }}
        >
          <BombIcon size={mobileCompact ? 14 : 16} color="#E55A5A" />
        </div>
      );
    }

    if (cell.neighborMines === 0) {
      return (
        <div
          className={`${size} rounded-sm select-none`}
          style={{
            background: "linear-gradient(135deg, #0A0C14, #0F1220)",
            boxShadow: "var(--cell-open-shadow)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />
      );
    }

    return (
      <div
        className={`${size} flex items-center justify-center rounded-sm select-none`}
        style={{
          background: "linear-gradient(135deg, #0D1020, #111428)",
          boxShadow: "var(--cell-open-shadow)",
          border: "1px solid rgba(255,255,255,0.05)",
          color: NUMBER_COLORS[cell.neighborMines] || "#EDE8DE",
          fontSize: mobileCompact ? "11px" : "13px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
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
          background: "linear-gradient(145deg, #2A2240, #1C1830)",
          boxShadow: "var(--cell-closed-shadow), 0 0 8px var(--mm-amber-glow)",
          border: "1px solid var(--mm-border-amber)",
        }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        <RacingFlagIcon size={mobileCompact ? 13 : 15} color="#E8A020" />
      </button>
    );
  }

  let closedBg = "linear-gradient(145deg, #2A2D40, #1E2035)";
  let closedShadow = "var(--cell-closed-shadow)";
  let closedBorder = "1px solid var(--mm-border)";
  let glowEffect = "";

  if (isSafe) {
    closedBg = "linear-gradient(145deg, #1A2E22, #162418)";
    closedShadow = "var(--cell-closed-shadow), 0 0 10px var(--mm-green-glow)";
    closedBorder = "1px solid rgba(76,217,123,0.25)";
    glowEffect = "0 0 12px rgba(76,217,123,0.2)";
  } else if (isHighlighted) {
    closedBg = "linear-gradient(145deg, #2A2220, #201A18)";
    closedShadow = "var(--cell-closed-shadow), 0 0 10px var(--mm-red-glow)";
    closedBorder = "1px solid rgba(229,90,90,0.25)";
  }

  return (
    <button
      className={`${size} rounded-sm select-none cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-95`}
      style={{
        background: closedBg,
        boxShadow: closedShadow + (glowEffect ? `, ${glowEffect}` : ""),
        border: closedBorder,
      }}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    />
  );
}

export function MinesweeperBoard({ board, status, onReveal, onFlag, highlightedCells, safeCells, mobileCompact }: Props) {
  return (
    <div
      className="inline-block p-3 rounded-xl"
      style={{
        background: "linear-gradient(135deg, #0A0C14, #0D1020)",
        border: "1px solid var(--mm-border-2)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="grid"
        style={{ gap: mobileCompact ? "2px" : "3px", gridTemplateColumns: `repeat(${board[0]?.length || 9}, 1fr)` }}
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
            />
          ))
        )}
      </div>
    </div>
  );
}
