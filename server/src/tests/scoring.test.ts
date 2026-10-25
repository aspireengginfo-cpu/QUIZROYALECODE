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
});
