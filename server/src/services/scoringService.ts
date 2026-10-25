/**
 * Server-authoritative scoring service for Quiz Royale.
 *
 * Rules:
 * - Base points for correct answer: 500
 * - Speed bonus: Math.floor(500 * remainingTimeSeconds / 15)
 * - Maximum score for a correct answer: 1000 points
 * - Incorrect answer or timeout: 0 points
 */

export interface ScoreCalculationResult {
  isCorrect: boolean;
  basePoints: number;
  speedBonus: number;
  totalPointsEarned: number;
  remainingSeconds: number;
}

export class ScoringService {
  public static readonly BASE_POINTS = 500;
  public static readonly MAX_BONUS = 500;
  public static readonly DEFAULT_TIME_LIMIT_SECONDS = 15;

  /**
   * Calculates points earned for a submission.
   *
   * @param isCorrect Whether the selected option matches the server's correct index
   * @param elapsedMs Milliseconds elapsed since the question opened
   * @param timeLimitSeconds Total duration allotted for the question (default: 15s)
   */
  public static calculateScore(
    isCorrect: boolean,
    elapsedMs: number,
    timeLimitSeconds: number = ScoringService.DEFAULT_TIME_LIMIT_SECONDS
  ): ScoreCalculationResult {
    if (!isCorrect) {
      return {
        isCorrect: false,
        basePoints: 0,
        speedBonus: 0,
        totalPointsEarned: 0,
        remainingSeconds: 0,
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
        totalPointsEarned: 0,
        remainingSeconds: 0,
      };
    }

    // Formula: floor(500 * remainingTime / 15)
    const speedBonus = Math.min(
      this.MAX_BONUS,
      Math.max(0, Math.floor((this.MAX_BONUS * remainingSeconds) / timeLimitSeconds))
    );

    const totalPointsEarned = this.BASE_POINTS + speedBonus;

    return {
      isCorrect: true,
      basePoints: this.BASE_POINTS,
      speedBonus,
      totalPointsEarned,
      remainingSeconds: Math.round(remainingSeconds * 10) / 10,
    };
  }
}
