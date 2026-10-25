import mongoose, { Document, Schema } from 'mongoose';

export interface IGameSessionDocument extends Document {
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
  createdAt: Date;
}

const GameSessionSchema = new Schema<IGameSessionDocument>(
  {
    roomCode: {
      type: String,
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    winner: {
      playerId: { type: String, required: true },
      nickname: { type: String, required: true },
      score: { type: Number, required: true },
      avatar: { type: String },
    },
    leaderboard: [
      {
        rank: { type: Number, required: true },
        playerId: { type: String, required: true },
        nickname: { type: String, required: true },
        score: { type: Number, required: true },
        correctCount: { type: Number, required: true },
      },
    ],
    questionsSummary: [
      {
        questionId: { type: String },
        question: { type: String },
        category: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const GameSession = mongoose.model<IGameSessionDocument>(
  'GameSession',
  GameSessionSchema
);
