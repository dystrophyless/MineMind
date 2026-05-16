export const GAME_MODES = ["classic", "noFlags", "timed", "daily"];
export const RANKED_GAME_MODES = ["classic", "timed", "noFlags"];
export const LEADERBOARD_PERIODS = ["allTime", "monthly", "weekly"];
export const TIMED_MODE_INITIAL_SECONDS = 60;
export const TIMED_MODE_BOARD_CLEAR_BONUS_SECONDS = 5;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

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

export function calculateXpAward({ mode, status, timeSeconds = null, minesFound = null }) {
  if (mode === "timed") {
    return clamp(10 + Math.max(0, minesFound ?? 0) * 6, 10, 250);
  }

  if (status !== "won") {
    return mode === "daily" ? 15 : 10;
  }

  const baseWinXp = mode === "daily" ? 140 : 100;
  const speedBonus = typeof timeSeconds === "number"
    ? clamp(160 - timeSeconds, 0, 60)
    : 0;

  return baseWinXp + speedBonus;
}

export function getXpLevelProgress(xp) {
  const safeXp = Math.max(0, Math.floor(xp ?? 0));
  const thresholds = [0, 100, 250];

  while (thresholds[thresholds.length - 1] <= safeXp) {
    thresholds.push(thresholds[thresholds.length - 1] * 2);
  }

  const nextIndex = thresholds.findIndex(threshold => threshold > safeXp);
  const currentLevelXp = thresholds[nextIndex - 1];
  const nextLevelXp = thresholds[nextIndex];

  return {
    level: nextIndex,
    currentLevelXp,
    nextLevelXp,
    progressXp: safeXp - currentLevelXp,
    requiredXp: nextLevelXp - currentLevelXp,
  };
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

export function getPlayerClassicRanks(attempts, profiles, playerId) {
  const profilesByPlayer = new Map(profiles.map(profile => [profile.playerId, profile]));
  const classicWins = attempts
    .filter(attempt =>
      attempt.mode === "classic" &&
      attempt.status === "won" &&
      Number.isFinite(attempt.seconds)
    )
    .map(attempt => ({ ...attempt, period: "allTime" }));

  const globalRows = getBestLeaderboardRows(classicWins, "classic", "allTime");
  const globalIndex = globalRows.findIndex(row => row.playerId === playerId);
  const globalRank = globalIndex === -1 ? null : globalIndex + 1;
  const playerCity = profilesByPlayer.get(playerId)?.city ?? null;
  const cityRank = playerCity
    ? (() => {
        const cityRows = globalRows.filter(row => profilesByPlayer.get(row.playerId)?.city === playerCity);
        const cityIndex = cityRows.findIndex(row => row.playerId === playerId);
        return cityIndex === -1 ? null : cityIndex + 1;
      })()
    : null;

  return { globalRank, cityRank };
}
