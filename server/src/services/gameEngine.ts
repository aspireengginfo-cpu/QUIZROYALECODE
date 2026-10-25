import { Server } from 'socket.io';
import { ClientQuestion, Player, QuestionData, RoomState } from '../types';
import { QuestionRepository } from '../questions/questionRepository';
import { RoomManager } from './roomManager';
import { ScoringService } from './scoringService';
import { saveGameSessionToHistory } from '../config/database';

export class GameEngine {
  private static io: Server;
  // Private server-only map of roomCode -> array of full QuestionData (with answer keys)
  private static roomQuestions: Map<string, QuestionData[]> = new Map();
  // Active server timers per room
  private static roomTimers: Map<string, NodeJS.Timeout> = new Map();

  public static initialize(io: Server): void {
    this.io = io;
  }

  /**
   * Starts a game in a room
   */
  public static async startGame(roomCode: string): Promise<{ success: boolean; error?: string }> {
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    const validation = RoomManager.canStartGame(roomCode);
    if (!validation.canStart) {
      return { success: false, error: validation.reason };
    }

    try {
      // 1. Fetch randomized questions
      const questions = await QuestionRepository.getRandomQuestions(room.totalQuestions);
      if (!questions || questions.length === 0) {
        return { success: false, error: 'Could not load quiz questions. Please try again.' };
      }

      this.roomQuestions.set(roomCode, questions);
      room.currentQuestionIndex = 0;
      room.status = 'COUNTDOWN';

      // Reset all player game stats
      room.players.forEach((p) => {
        p.score = 0;
        p.correctAnswersCount = 0;
        p.hasAnsweredCurrent = false;
        p.lastAnswerIndex = undefined;
        p.lastPointsEarned = 0;
        p.lastAnswerTimeMs = undefined;
      });

      // Broadcast countdown state
      this.io.to(roomCode).emit('room:state', room);
      this.io.to(roomCode).emit('game:countdown_start', { count: 3 });

      // After 3-second countdown, deliver question 1
      this.clearRoomTimer(roomCode);
      const timer = setTimeout(() => {
        this.deliverCurrentQuestion(roomCode);
      }, 3000);
      this.roomTimers.set(roomCode, timer);

      return { success: true };
    } catch (err: any) {
      console.error(`❌ [GAME START ERROR] Room ${roomCode}:`, err);
      return { success: false, error: 'Internal error starting game.' };
    }
  }

  /**
   * Delivers the current question to clients (SCRUBS correct answer and explanation!)
   */
  public static deliverCurrentQuestion(roomCode: string): void {
    const room = RoomManager.getRoom(roomCode);
    const questions = this.roomQuestions.get(roomCode);
    if (!room || !questions) return;

    if (room.currentQuestionIndex >= questions.length) {
      this.finishGame(roomCode);
      return;
    }

    const fullQuestion = questions[room.currentQuestionIndex];
    const timeLimit = room.questionTimeLimit || 15;

    // Build client-safe question (strictly NO correctIndex or explanation)
    const clientQuestion: ClientQuestion = {
      questionId: fullQuestion.questionId,
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: questions.length,
      question: fullQuestion.question,
      options: fullQuestion.options,
      category: fullQuestion.category,
      difficulty: fullQuestion.difficulty,
      timeLimit,
    };

    room.status = 'QUESTION_ACTIVE';
    room.currentQuestion = clientQuestion;
    room.roundStartTime = Date.now();
    room.roundEndTime = room.roundStartTime + timeLimit * 1000;
    room.roundResults = undefined;

    // Reset player round flags
    room.players.forEach((p) => {
      p.hasAnsweredCurrent = false;
      p.lastAnswerIndex = undefined;
      p.lastPointsEarned = 0;
      p.lastAnswerTimeMs = undefined;
    });

    console.log(
      `🎯 [ROUND ${clientQuestion.questionNumber}/${clientQuestion.totalQuestions}] Room ${roomCode}: "${fullQuestion.question.slice(0, 40)}..."`
    );

    // Broadcast question to room
    this.io.to(roomCode).emit('game:question_start', clientQuestion);
    this.io.to(roomCode).emit('room:state', room);

    // Start server-authoritative timer
    this.clearRoomTimer(roomCode);
    const timer = setTimeout(() => {
      this.closeCurrentQuestion(roomCode);
    }, timeLimit * 1000);
    this.roomTimers.set(roomCode, timer);
  }

  /**
   * Handles an answer submission from a player
   */
  public static handleAnswerSubmission(
    socketId: string,
    roomCode: string,
    questionId: string,
    selectedOptionIndex: number
  ): { success: boolean; error?: string } {
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    if (room.status !== 'QUESTION_ACTIVE') {
      return { success: false, error: 'Question is not currently active.' };
    }

    const player = room.players.find((p) => p.socketId === socketId);
    if (!player) return { success: false, error: 'Player not found in room.' };

    if (player.hasAnsweredCurrent) {
      return { success: false, error: 'Answer already submitted for this question.' };
    }

    const questions = this.roomQuestions.get(roomCode);
    const fullQuestion = questions?.[room.currentQuestionIndex];
    if (!fullQuestion || fullQuestion.questionId !== questionId) {
      return { success: false, error: 'Mismatched question ID.' };
    }

    if (selectedOptionIndex < 0 || selectedOptionIndex > 3) {
      return { success: false, error: 'Invalid option selected.' };
    }

    const now = Date.now();
    const elapsedMs = now - (room.roundStartTime || now);
    const isCorrect = selectedOptionIndex === fullQuestion.correctIndex;

    const scoreResult = ScoringService.calculateScore(
      isCorrect,
      elapsedMs,
      room.questionTimeLimit || 15
    );

    // Lock player answer
    player.hasAnsweredCurrent = true;
    player.lastAnswerIndex = selectedOptionIndex;
    player.lastPointsEarned = scoreResult.totalPointsEarned;
    player.lastAnswerTimeMs = elapsedMs;
    player.score += scoreResult.totalPointsEarned;
    if (isCorrect) {
      player.correctAnswersCount++;
    }

    // Acknowledge submission to the answering player (confirms lock)
    this.io.to(socketId).emit('game:answer_acknowledged', {
      questionId,
      selectedOptionIndex,
      submittedAt: now,
    });

    // Notify all players in room that someone answered (WITHOUT revealing choice or correctness)
    const answeredCount = room.players.filter((p) => p.hasAnsweredCurrent && p.connected).length;
    const connectedCount = room.players.filter((p) => p.connected).length;

    this.io.to(roomCode).emit('game:player_answered', {
      playerId: player.id,
      answeredCount,
      totalConnected: connectedCount,
    });

    // If ALL connected players have answered, close question early!
    if (answeredCount >= connectedCount && connectedCount > 0) {
      console.log(`⚡ [EARLY CLOSE] All ${connectedCount} players answered in room ${roomCode}. Revealing immediately!`);
      this.clearRoomTimer(roomCode);
      // Small 300ms pause for visual smoothness before revealing
      setTimeout(() => {
        this.closeCurrentQuestion(roomCode);
      }, 300);
    }

    return { success: true };
  }

  /**
   * Closes question, reveals answer, calculates distributions
   */
  public static closeCurrentQuestion(roomCode: string): void {
    this.clearRoomTimer(roomCode);

    const room = RoomManager.getRoom(roomCode);
    const questions = this.roomQuestions.get(roomCode);
    if (!room || !questions) return;

    if (room.status !== 'QUESTION_ACTIVE') return;

    const fullQuestion = questions[room.currentQuestionIndex];
    if (!fullQuestion) return;

    room.status = 'QUESTION_REVEAL';

    // Compute answer distribution (0-3)
    const distributions = [0, 0, 0, 0];
    const playerResults: Array<{
      playerId: string;
      nickname: string;
      isCorrect: boolean;
      pointsEarned: number;
      selectedOptionIndex?: number;
      totalScore: number;
    }> = [];

    room.players.forEach((p) => {
      if (p.lastAnswerIndex !== undefined && p.lastAnswerIndex >= 0 && p.lastAnswerIndex <= 3) {
        distributions[p.lastAnswerIndex]++;
      }
      playerResults.push({
        playerId: p.id,
        nickname: p.nickname,
        isCorrect: p.lastAnswerIndex === fullQuestion.correctIndex,
        pointsEarned: p.lastPointsEarned || 0,
        selectedOptionIndex: p.lastAnswerIndex,
        totalScore: p.score,
      });
    });

    room.roundResults = {
      correctIndex: fullQuestion.correctIndex,
      explanation: fullQuestion.explanation,
      answerDistributions: distributions,
    };

    // Broadcast question end & reveal
    this.io.to(roomCode).emit('game:question_end', {
      correctIndex: fullQuestion.correctIndex,
      explanation: fullQuestion.explanation,
      answerDistributions: distributions,
      playerResults,
      updatedScores: room.players.map((p) => ({
        playerId: p.id,
        score: p.score,
        lastPointsEarned: p.lastPointsEarned || 0,
      })),
    });

    this.io.to(roomCode).emit('room:state', room);

    // Smooth in-place reveal: after 3.8 seconds, directly advance to next question or finish!
    const timer = setTimeout(() => {
      room.currentQuestionIndex++;
      if (room.currentQuestionIndex < questions.length) {
        this.deliverCurrentQuestion(roomCode);
      } else {
        this.finishGame(roomCode);
      }
    }, 3800);
    this.roomTimers.set(roomCode, timer);
  }

  /**
   * Shows leaderboard intermission between questions
   */
  public static showLeaderboardIntermission(roomCode: string): void {
    this.clearRoomTimer(roomCode);

    const room = RoomManager.getRoom(roomCode);
    const questions = this.roomQuestions.get(roomCode);
    if (!room || !questions) return;

    room.status = 'LEADERBOARD';

    // Sort players by score descending
    const sortedLeaderboard = [...room.players]
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        rank: idx + 1,
        playerId: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        correctCount: p.correctAnswersCount,
        lastPointsEarned: p.lastPointsEarned || 0,
      }));

    this.io.to(roomCode).emit('game:leaderboard', {
      leaderboard: sortedLeaderboard,
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: questions.length,
    });
    this.io.to(roomCode).emit('room:state', room);

    // After 3.5 seconds of leaderboard intermission, advance to next question or end
    const timer = setTimeout(() => {
      room.currentQuestionIndex++;
      if (room.currentQuestionIndex < questions.length) {
        this.deliverCurrentQuestion(roomCode);
      } else {
        this.finishGame(roomCode);
      }
    }, 3500);
    this.roomTimers.set(roomCode, timer);
  }

  /**
   * Concludes the game, crowns the winner, persists to database/fallback
   */
  public static async finishGame(roomCode: string): Promise<void> {
    this.clearRoomTimer(roomCode);

    const room = RoomManager.getRoom(roomCode);
    const questions = this.roomQuestions.get(roomCode);
    if (!room) return;

    room.status = 'GAME_OVER';

    // Sort leaderboard
    const rankedPlayers = [...room.players].sort((a, b) => b.score - a.score);
    const winnerPlayer = rankedPlayers[0];

    const winner = winnerPlayer
      ? {
          id: winnerPlayer.id,
          nickname: winnerPlayer.nickname,
          score: winnerPlayer.score,
          avatar: winnerPlayer.avatar,
        }
      : undefined;

    room.winner = winner;

    const finalLeaderboard = rankedPlayers.map((p, idx) => ({
      rank: idx + 1,
      playerId: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      score: p.score,
      correctCount: p.correctAnswersCount,
    }));

    // Broadcast Game Over
    this.io.to(roomCode).emit('game:over', {
      winner,
      finalLeaderboard,
      totalQuestions: room.totalQuestions,
    });
    this.io.to(roomCode).emit('room:state', room);

    console.log(`🏆 [GAME OVER] Room ${roomCode} finished! Winner: ${winner?.nickname} with ${winner?.score} points!`);

    // Persist game session
    if (winner) {
      saveGameSessionToHistory({
        roomCode,
        startedAt: new Date(room.roundStartTime ? room.roundStartTime - room.totalQuestions * 20000 : Date.now() - 150000),
        completedAt: new Date(),
        totalQuestions: questions ? questions.length : room.totalQuestions,
        winner: {
          playerId: winner.id,
          nickname: winner.nickname,
          score: winner.score,
          avatar: winner.avatar,
        },
        leaderboard: finalLeaderboard,
        questionsSummary: questions?.map((q) => ({
          questionId: q.questionId,
          question: q.question,
          category: q.category,
        })),
      }).catch((err) => console.error('Error saving game history:', err));
    }
  }

  public static clearRoomTimer(roomCode: string): void {
    const existing = this.roomTimers.get(roomCode);
    if (existing) {
      clearTimeout(existing);
      this.roomTimers.delete(roomCode);
    }
  }
}
