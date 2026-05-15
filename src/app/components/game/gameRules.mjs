export const GAME_MODES = ["classic", "noFlags", "timed", "daily"];
export const RANKED_GAME_MODES = ["classic", "timed", "noFlags"];
export const LEADERBOARD_PERIODS = ["allTime", "monthly", "weekly"];
export const TIMED_MODE_INITIAL_SECONDS = 180;
export const TIMED_MODE_BOARD_CLEAR_BONUS_SECONDS = 5;

export function applyTimedBoardClear({
  secondsLeft,
  minesFound,
  correctFlags,
  bonusSeconds = TIMED_MODE_BOARD_CLEAR_BONUS_SECONDS,
}) {
  return {
    secondsLeft: secondsLeft + bonusSeconds,
    minesFound: minesFound + correctFlags,
  };
}

export function countCorrectFlags(board) {
  return board
    .flat()
    .filter(cell => cell.isMine && cell.isFlagged)
    .length;
}

function scoreAttempt(attempt, mode) {
  return mode === "timed" ? attempt.mines : attempt.seconds;
}

function isBetterAttempt(candidate, current, mode) {
  if (!current) return true;
  const candidateScore = scoreAttempt(candidate, mode);
  const currentScore = scoreAttempt(current, mode);
  return mode === "timed" ? candidateScore > currentScore : candidateScore < currentScore;
}

function formatScore(score, mode) {
  return mode === "timed" ? `${score} mines` : `${score.toFixed(2)} sec`;
}

export function getBestLeaderboardRows(attempts, mode, period) {
  const bestByPlayer = new Map();

  for (const attempt of attempts) {
    if (attempt.mode !== mode || attempt.period !== period) continue;
    const current = bestByPlayer.get(attempt.playerId);
    if (isBetterAttempt(attempt, current, mode)) {
      bestByPlayer.set(attempt.playerId, attempt);
    }
  }

  return Array.from(bestByPlayer.values())
    .sort((a, b) => {
      const aScore = scoreAttempt(a, mode);
      const bScore = scoreAttempt(b, mode);
      return mode === "timed" ? bScore - aScore : aScore - bScore;
    })
    .map((attempt, index) => {
      const score = scoreAttempt(attempt, mode);
      return {
        ...attempt,
        rank: index + 1,
        score,
        scoreLabel: formatScore(score, mode),
      };
    });
}
