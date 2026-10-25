/**
 * Server-authoritative scoring service for Quiz Royale with Streak Multipliers.
 *
 * Rules:
 * - Base points for correct answer: 500
 * - Speed bonus: Math.floor(500 * remainingTimeSeconds / 15)
 * - Maximum base + speed score: 1000 points
 * - Streak Multipliers:
 *   - 1 correct: 1.0x (Standard)
 *   - 2 in a row: 1.2x (🔥 2-Streak bonus)
 *   - 3 in a row: 1.5x (🔥🔥 3-Streak bonus)
 *   - 4+ in a row: 2.0x (⚡👑 ON FIRE Double Points!)
 * - Incorrect answer or timeout: 0 points (Streak resets to 0)
 */

export interface ScoreCalculationResult {
  isCorrect: boolean;
  basePoints: number;
  speedBonus: number;
  streakMultiplier: number;
  streakBonus: number;
  totalPointsEarned: number;
  remainingSeconds: number;
  newStreak: number;
}

export class ScoringService {
  public static readonly BASE_POINTS = 500;
  public static readonly MAX_BONUS = 500;
  public static readonly DEFAULT_TIME_LIMIT_SECONDS = 15;

  /**
   * Calculates points earned for a submission with streak multiplier.
   *
   * @param isCorrect Whether the selected option matches the server's correct index
   * @param elapsedMs Milliseconds elapsed since the question opened
   * @param timeLimitSeconds Total duration allotted for the question (default: 15s)
   * @param currentStreak The player's existing streak count before this round
   */
  public static calculateScore(
    isCorrect: boolean,
    elapsedMs: number,
    timeLimitSeconds: number = ScoringService.DEFAULT_TIME_LIMIT_SECONDS,
    currentStreak: number = 0
  ): ScoreCalculationResult {
    if (!isCorrect) {
      return {
        isCorrect: false,
        basePoints: 0,
        speedBonus: 0,
        streakMultiplier: 1.0,
        streakBonus: 0,
        totalPointsEarned: 0,
        remainingSeconds: 0,
        newStreak: 0,
      };
    }

    const totalAllottedMs = timeLimitSeconds * 1000;
    // Bound elapsed between 0 and totalAllottedMs
    const effectiveElapsedMs = Math.max(0, Math.min(elapsedMs, totalAllottedMs));
    const remainingMs = totalAllottedMs - effectiveElapsedMs;
    const remainingSeconds = remainingMs / 1000;

    // If submitted after timer strictly expired, 0 points
    if (remainingMs <= 0) {
      return {
        isCorrect: true,
        basePoints: 0,
        speedBonus: 0,
        streakMultiplier: 1.0,
        streakBonus: 0,
        totalPointsEarned: 0,
        remainingSeconds: 0,
        newStreak: 0,
      };
    }

    // Formula: floor(500 * remainingTime / 15)
    const speedBonus = Math.min(
      this.MAX_BONUS,
      Math.max(0, Math.floor((this.MAX_BONUS * remainingSeconds) / timeLimitSeconds))
    );

    const rawPoints = this.BASE_POINTS + speedBonus;
    const newStreak = currentStreak + 1;

    // Determine multiplier
    let streakMultiplier = 1.0;
    if (newStreak >= 4) {
      streakMultiplier = 2.0; // Double points for 4+ streak!
    } else if (newStreak === 3) {
      streakMultiplier = 1.5; // 1.5x
    } else if (newStreak === 2) {
      streakMultiplier = 1.2; // 1.2x
    }

    const totalPointsEarned = Math.floor(rawPoints * streakMultiplier);
    const streakBonus = totalPointsEarned - rawPoints;

    return {
      isCorrect: true,
      basePoints: this.BASE_POINTS,
      speedBonus,
      streakMultiplier,
      streakBonus,
      totalPointsEarned,
      remainingSeconds: Math.round(remainingSeconds * 10) / 10,
      newStreak,
    };
  }
}
