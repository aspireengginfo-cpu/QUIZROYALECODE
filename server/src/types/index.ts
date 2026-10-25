export type QuestionCategory =
  | 'Science'
  | 'Geography'
  | 'History'
  | 'Technology'
  | 'Nature'
  | 'Sports'
  | 'General Knowledge';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionData {
  questionId: string;
  question: string;
  options: string[];
  correctIndex: number; // Server-only, strictly scrubbed before client broadcast
  category: QuestionCategory;
  difficulty?: QuestionDifficulty;
  explanation?: string;
}

// Client-safe version of a question
export interface ClientQuestion {
  questionId: string;
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  category: QuestionCategory;
  difficulty?: QuestionDifficulty;
  timeLimit: number; // seconds (default: 15)
}

export interface Player {
  id: string; // Socket ID or stable player session ID
  socketId: string;
  nickname: string;
  avatar: string;
  score: number;
  isHost: boolean;
  hasAnsweredCurrent: boolean;
  lastAnswerIndex?: number;
  lastPointsEarned?: number;
  lastAnswerTimeMs?: number;
  correctAnswersCount: number;
  connected: boolean;
  disconnectTimestamp?: number;
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
    answerDistributions: number[]; // count of players who picked 0, 1, 2, 3
  };
  winner?: {
    id: string;
    nickname: string;
    score: number;
    avatar: string;
  };
}

export interface AnswerSubmissionPayload {
  roomCode: string;
  questionId: string;
  selectedOptionIndex: number;
}

export interface GameResultRecord {
  roomCode: string;
  startedAt: Date;
  completedAt: Date;
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
  questionsSummary?: Array<{
    questionId: string;
    question: string;
    category: string;
  }>;
}
