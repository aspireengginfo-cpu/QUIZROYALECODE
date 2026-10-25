import mongoose, { Document, Schema } from 'mongoose';
import { QuestionCategory, QuestionDifficulty } from '../types';

export interface IQuestionDocument extends Document {
  questionId: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: QuestionCategory;
  difficulty?: QuestionDifficulty;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestionDocument>(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length === 4,
        message: 'Question must have exactly 4 options',
      },
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Science',
        'Geography',
        'History',
        'Technology',
        'Nature',
        'Sports',
        'General Knowledge',
      ],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    explanation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestionDocument>('Question', QuestionSchema);
