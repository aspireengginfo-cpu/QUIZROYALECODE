export type QuestionCategory =
  | 'Science'
  | 'Geography'
  | 'History'
  | 'Technology'
  | 'Nature'
  | 'Sports'
  | 'General Knowledge';

export interface ClientQuestion {
  questionId: string;
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  category: QuestionCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface Player {
  id: string;
  socketId: string;
  nickname: string;
  avatar: string;
  score: number;
  isHost: boolean;
  hasAnsweredCurrent: boolean;
  lastAnswerIndex?: number;
  lastPointsEarned?: number;
  correctAnswersCount: number;
  currentStreak: number;
  highestStreak: number;
  lastMultiplier?: number;
  streakBonusPoints?: number;
  connected: boolean;
}

export type RoomStatus =
  | 'LOBBY'
  | 'COUNTDOWN'
  | 'QUESTION_ACTIVE'
  | 'QUESTION_REVEAL'
  | 'LEADERBOARD'
  | 'GAME_OVER';

export interface RoomState {
  roomCode: string;
  status: RoomStatus;
  hostId: string;
  players: Player[];
  currentQuestionIndex: number;
  totalQuestions: number;
  questionTimeLimit: number;
  roundStartTime?: number;
  roundEndTime?: number;
  currentQuestion?: ClientQuestion;
  roundResults?: {
    correctIndex: number;
    explanation?: string;
    answerDistributions: number[];
  };
  winner?: {
    id: string;
    nickname: string;
    score: number;
    avatar: string;
  };
}

export interface GameHistoryItem {
  roomCode: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  winner: {
    playerId: string;
    nickname: string;
    score: number;
    avatar?: string;
  };
  leaderboard: Array<{
    rank: number;
    playerId: string;
    nickname: string;
    score: number;
    correctCount: number;
  }>;
}
