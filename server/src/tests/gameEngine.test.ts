import { describe, it, expect } from 'vitest';
import { QuestionRepository } from '../questions/questionRepository';
import { RoomManager } from '../services/roomManager';
import { GameEngine } from '../services/gameEngine';
import { saveGameSessionToHistory, getPastGameSessions } from '../config/database';
import { QuestionData } from '../types';

describe('GameEngine & Question Security', () => {
  it('correctly tracks the correct option when shuffling option choices', () => {
    const testQuestion: QuestionData = {
      questionId: 'test-q1',
      category: 'Science',
      question: 'What is water?',
      options: ['H2O', 'CO2', 'NaCl', 'CH4'],
      correctIndex: 0, // 'H2O'
      explanation: 'Water is H2O',
    };

    // Run shuffle 20 times and ensure the correctIndex always matches 'H2O'
    for (let i = 0; i < 20; i++) {
      const shuffled = QuestionRepository.shuffleOptions(testQuestion);
      expect(shuffled.options).toHaveLength(4);
      expect(shuffled.options[shuffled.correctIndex]).toBe('H2O');
    }
  });

  it('rejects starting a game if fewer than 2 players are connected', () => {
    const { room } = RoomManager.createRoom('socket-solo-start', 'SoloHost');
    const startCheck = RoomManager.canStartGame(room.roomCode);
    expect(startCheck.canStart).toBe(false);
    expect(startCheck.reason).toContain('At least 2 players');
  });

  it('allows starting a game when 2 or more players are connected', () => {
    const { room } = RoomManager.createRoom('socket-host-p2', 'Host');
    RoomManager.joinRoom('socket-p2-join', room.roomCode, 'Challenger');
    const startCheck = RoomManager.canStartGame(room.roomCode);
    expect(startCheck.canStart).toBe(true);
  });

  it('rejects duplicate answer submissions from the same player on the same question', () => {
    const { room } = RoomManager.createRoom('socket-ans-host', 'Host');
    RoomManager.joinRoom('socket-ans-p2', room.roomCode, 'Player2');

    // Simulate question active
    room.status = 'QUESTION_ACTIVE';
    room.currentQuestionIndex = 0;
    room.roundStartTime = Date.now();

    const p1 = room.players[0];
    p1.hasAnsweredCurrent = true; // Player already submitted

    const dupeAttempt = GameEngine.handleAnswerSubmission(
      'socket-ans-host',
      room.roomCode,
      'any-q',
      1
    );

    expect(dupeAttempt.success).toBe(false);
    expect(dupeAttempt.error).toContain('already submitted');
  });

  it('persists and retrieves completed game history in fallback mode', async () => {
    const testRecord = {
      roomCode: 'TEST99',
      startedAt: new Date(),
      completedAt: new Date(),
      totalQuestions: 10,
      winner: {
        playerId: 'p_winner',
        nickname: 'Champion',
        score: 8500,
        avatar: '👑',
      },
      leaderboard: [
        { rank: 1, playerId: 'p_winner', nickname: 'Champion', score: 8500, correctCount: 9 },
        { rank: 2, playerId: 'p_runnerup', nickname: 'RunnerUp', score: 6200, correctCount: 7 },
      ],
    };

    await saveGameSessionToHistory(testRecord);
    const history = await getPastGameSessions(5);
    expect(history.length).toBeGreaterThan(0);
    const found = history.find((h) => h.roomCode === 'TEST99');
    expect(found).toBeDefined();
    expect(found?.winner.nickname).toBe('Champion');
    expect(found?.winner.score).toBe(8500);
  });
});
