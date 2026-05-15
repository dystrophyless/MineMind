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

export const MOCK_LEADERBOARD_ATTEMPTS = [
  { playerId: "you", player: "You", city: "Almaty", mode: "timed", period: "weekly", mines: 23, isMe: true },
  { playerId: "you", player: "You", city: "Almaty", mode: "timed", period: "weekly", mines: 41, isMe: true },
  { playerId: "you", player: "You", city: "Almaty", mode: "timed", period: "weekly", mines: 38, isMe: true },
  { playerId: "you", player: "You", city: "Almaty", mode: "timed", period: "weekly", mines: 64, isMe: true },
  { playerId: "you", player: "You", city: "Almaty", mode: "timed", period: "weekly", mines: 52, isMe: true },
  { playerId: "nova", player: "NovakD", city: "Belgrade", mode: "timed", period: "weekly", mines: 58 },
  { playerId: "aliya", player: "AliyaM", city: "Almaty", mode: "timed", period: "weekly", mines: 49 },
  { playerId: "kim", player: "KimJH", city: "Seoul", mode: "timed", period: "monthly", mines: 71 },
  { playerId: "you", player: "You", city: "Almaty", mode: "timed", period: "monthly", mines: 64, isMe: true },
  { playerId: "maria", player: "MariaG", city: "Madrid", mode: "timed", period: "allTime", mines: 92 },
  { playerId: "you", player: "You", city: "Almaty", mode: "timed", period: "allTime", mines: 64, isMe: true },

  { playerId: "max", player: "Max", city: "Berlin", mode: "classic", period: "allTime", seconds: 38.21 },
  { playerId: "ivy", player: "Ivy", city: "London", mode: "classic", period: "allTime", seconds: 43.77 },
  { playerId: "you", player: "You", city: "Almaty", mode: "classic", period: "allTime", seconds: 41.09, isMe: true },
  { playerId: "max", player: "Max", city: "Berlin", mode: "classic", period: "weekly", seconds: 41.09 },
  { playerId: "you", player: "You", city: "Almaty", mode: "classic", period: "weekly", seconds: 44.38, isMe: true },
  { playerId: "ivy", player: "Ivy", city: "London", mode: "classic", period: "monthly", seconds: 39.84 },
  { playerId: "you", player: "You", city: "Almaty", mode: "classic", period: "monthly", seconds: 42.22, isMe: true },

  { playerId: "noa", player: "Noa", city: "Paris", mode: "noFlags", period: "allTime", seconds: 49.32 },
  { playerId: "you", player: "You", city: "Almaty", mode: "noFlags", period: "allTime", seconds: 55.91, isMe: true },
  { playerId: "sven", player: "SvenB", city: "Stockholm", mode: "noFlags", period: "weekly", seconds: 52.44 },
  { playerId: "you", player: "You", city: "Almaty", mode: "noFlags", period: "weekly", seconds: 58.12, isMe: true },
  { playerId: "dana", player: "DanaK", city: "Almaty", mode: "noFlags", period: "monthly", seconds: 51.08 },
  { playerId: "you", player: "You", city: "Almaty", mode: "noFlags", period: "monthly", seconds: 56.2, isMe: true },
];
