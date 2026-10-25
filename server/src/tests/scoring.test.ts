import { describe, it, expect } from 'vitest';
import { ScoringService } from '../services/scoringService';

describe('ScoringService — Authoritative Scoring Engine', () => {
  it('awards 1000 maximum points for an instant correct answer (0ms elapsed)', () => {
    const result = ScoringService.calculateScore(true, 0, 15);
    expect(result.isCorrect).toBe(true);
    expect(result.basePoints).toBe(500);
    expect(result.speedBonus).toBe(500);
    expect(result.totalPointsEarned).toBe(1000);
    expect(result.remainingSeconds).toBe(15);
  });

  it('correctly calculates speed bonus proportional to remaining time', () => {
    // 7.5 seconds elapsed out of 15s -> 7.5s remaining
    // speed bonus = floor(500 * 7.5 / 15) = floor(250) = 250
    // total = 500 + 250 = 750 points
    const result = ScoringService.calculateScore(true, 7500, 15);
    expect(result.isCorrect).toBe(true);
    expect(result.basePoints).toBe(500);
    expect(result.speedBonus).toBe(250);
    expect(result.totalPointsEarned).toBe(750);
    expect(result.remainingSeconds).toBe(7.5);
  });

  it('awards minimum 500 base points at the very last millisecond before expiration', () => {
    // 14,990ms elapsed -> 10ms remaining
    // speed bonus = floor(500 * 0.01 / 15) = 0
    // total = 500 points
    const result = ScoringService.calculateScore(true, 14990, 15);
    expect(result.isCorrect).toBe(true);
    expect(result.basePoints).toBe(500);
    expect(result.speedBonus).toBe(0);
    expect(result.totalPointsEarned).toBe(500);
  });

  it('awards 0 points for an incorrect answer regardless of speed', () => {
    const instantWrong = ScoringService.calculateScore(false, 100, 15);
    expect(instantWrong.isCorrect).toBe(false);
    expect(instantWrong.totalPointsEarned).toBe(0);
    expect(instantWrong.speedBonus).toBe(0);
  });

  it('awards 0 points if submitted after the timer has strictly expired (>15s)', () => {
    const timedOut = ScoringService.calculateScore(true, 15001, 15);
    expect(timedOut.totalPointsEarned).toBe(0);
    expect(timedOut.speedBonus).toBe(0);
  });

  it('applies 1.2x streak multiplier for 2 consecutive correct answers', () => {
    // 0ms elapsed -> raw = 1000 pts. With streak = 1 -> newStreak = 2 -> 1.2x -> 1200 pts
    const result = ScoringService.calculateScore(true, 0, 15, 1);
    expect(result.newStreak).toBe(2);
    expect(result.streakMultiplier).toBe(1.2);
    expect(result.totalPointsEarned).toBe(1200);
    expect(result.streakBonus).toBe(200);
  });

  it('applies 1.5x streak multiplier for 3 consecutive correct answers', () => {
    // raw = 1000 pts. With streak = 2 -> newStreak = 3 -> 1.5x -> 1500 pts
    const result = ScoringService.calculateScore(true, 0, 15, 2);
    expect(result.newStreak).toBe(3);
    expect(result.streakMultiplier).toBe(1.5);
    expect(result.totalPointsEarned).toBe(1500);
    expect(result.streakBonus).toBe(500);
  });

  it('applies 2.0x DOUBLE POINTS multiplier for 4 or more consecutive correct answers', () => {
    // raw = 1000 pts. With streak = 3 -> newStreak = 4 -> 2.0x -> 2000 pts!
    const result = ScoringService.calculateScore(true, 0, 15, 3);
    expect(result.newStreak).toBe(4);
    expect(result.streakMultiplier).toBe(2.0);
    expect(result.totalPointsEarned).toBe(2000);
    expect(result.streakBonus).toBe(1000);
  });

  it('resets streak to 0 upon an incorrect answer', () => {
    const result = ScoringService.calculateScore(false, 500, 15, 3);
    expect(result.newStreak).toBe(0);
    expect(result.streakMultiplier).toBe(1.0);
    expect(result.totalPointsEarned).toBe(0);
  });
});
