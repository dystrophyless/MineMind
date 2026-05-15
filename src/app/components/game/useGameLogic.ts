import { useState, useCallback, useEffect, useRef } from "react";

export type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type GameStatus = "idle" | "playing" | "won" | "lost";
export type Difficulty = "beginner" | "intermediate" | "expert" | "daily";

type GameLogicOptions = {
  allowFlags?: boolean;
  timeLimit?: number;
};

export const DIFFICULTY_CONFIG = {
  beginner:     { rows: 9,  cols: 9,  mines: 10, label: "Beginner" },
  intermediate: { rows: 16, cols: 16, mines: 40, label: "Advanced" },
  expert:       { rows: 16, cols: 30, mines: 99, label: "Expert" },
  daily:        { rows: 9,  cols: 9,  mines: 10, label: "Daily" },
};

export const NUMBER_COLORS: Record<number, string> = {
  1: "var(--mm-blue)",
  2: "var(--mm-green)",
  3: "var(--mm-red)",
  4: "var(--mm-purple)",
  5: "var(--mm-amber)",
  6: "var(--mm-cyan)",
  7: "var(--mm-text)",
  8: "var(--mm-text-2)",
};

type Board = CellState[][];

function createEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
}

function placeMines(board: Board, rows: number, cols: number, mines: number, safeRow: number, safeCol: number): Board {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  let placed = 0;

  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!newBoard[r][c].isMine && !(Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1)) {
      newBoard[r][c].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newBoard[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) count++;
          }
        }
        newBoard[r][c].neighborMines = count;
      }
    }
  }
  return newBoard;
}

function revealCells(board: Board, row: number, col: number, rows: number, cols: number): Board {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const stack = [[row, col]];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (newBoard[r][c].isFlagged || newBoard[r][c].isRevealed) continue;

    newBoard[r][c].isRevealed = true;

    if (newBoard[r][c].neighborMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          stack.push([r + dr, c + dc]);
        }
      }
    }
  }
  return newBoard;
}

export function useGameLogic(difficulty: Difficulty, options: GameLogicOptions = {}) {
  const { allowFlags = true, timeLimit } = options;
  const config = DIFFICULTY_CONFIG[difficulty];
  const [board, setBoard] = useState<Board>(() => createEmptyBoard(config.rows, config.cols));
  const [status, setStatus] = useState<GameStatus>("idle");
  const [time, setTime] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clicksRef = useRef({ total: 0, correct: 0 });

  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBoard(createEmptyBoard(config.rows, config.cols));
    setStatus("idle");
    setTime(0);
    setFlagCount(0);
    setAccuracy(100);
    clicksRef.current = { total: 0, correct: 0 };
  }, [config.rows, config.cols]);

  useEffect(() => {
    resetGame();
  }, [difficulty, allowFlags, timeLimit, resetGame]);

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setTime(t => {
          const next = t + 1;
          if (timeLimit !== undefined && next >= timeLimit) {
            setBoard(prev => prev.map(row => row.map(cell => cell.isMine ? { ...cell, isRevealed: true } : cell)));
            setStatus("lost");
            return timeLimit;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, timeLimit]);

  const revealCell = useCallback((row: number, col: number) => {
    setBoard(prev => {
      const cell = prev[row][col];
      if (cell.isRevealed || cell.isFlagged) return prev;

      let currentBoard = prev;

      if (status === "idle") {
        currentBoard = placeMines(prev, config.rows, config.cols, config.mines, row, col);
        setStatus("playing");
      }

      const targetCell = currentBoard[row][col];
      clicksRef.current.total++;

      if (targetCell.isMine) {
        const newBoard = currentBoard.map(r => r.map(c => ({ ...c, isRevealed: c.isMine || c.isRevealed })));
        newBoard[row][col].isRevealed = true;
        setStatus("lost");
        return newBoard;
      } else {
        clicksRef.current.correct++;
        const newBoard = revealCells(currentBoard, row, col, config.rows, config.cols);
        const revealedSafe = newBoard.flat().filter(c => c.isRevealed && !c.isMine).length;
        const totalSafe = config.rows * config.cols - config.mines;

        if (revealedSafe === totalSafe) {
          setStatus("won");
        }
        if (clicksRef.current.total > 0) {
          setAccuracy(Math.round((clicksRef.current.correct / clicksRef.current.total) * 100));
        }
        return newBoard;
      }
    });
  }, [status, config]);

  const toggleFlag = useCallback((row: number, col: number) => {
    if (!allowFlags) return;
    setBoard(prev => {
      const cell = prev[row][col];
      if (cell.isRevealed) return prev;
      const newBoard = prev.map(r => r.map(c => ({ ...c })));
      newBoard[row][col].isFlagged = !cell.isFlagged;
      setFlagCount(f => cell.isFlagged ? f - 1 : f + 1);
      return newBoard;
    });
  }, [allowFlags]);

  const minesLeft = config.mines - flagCount;
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timeRemaining = timeLimit !== undefined ? Math.max(timeLimit - time, 0) : undefined;

  return { board, status, time, timeRemaining, formatTime, minesLeft, accuracy, revealCell, toggleFlag, resetGame, config };
}
