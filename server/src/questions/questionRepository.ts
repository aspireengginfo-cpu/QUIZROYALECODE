import { QuestionData } from '../types';
import { SEED_QUESTIONS } from './seedQuestions';
import { isDatabaseConnected } from '../config/database';

export class QuestionRepository {
  private static inMemoryQuestions: QuestionData[] = [...SEED_QUESTIONS];

  /**
   * Seeds MongoDB if connected and question collection is empty
   */
  public static async initialize(): Promise<void> {
    if (isDatabaseConnected()) {
      try {
        const { Question } = await import('../models/Question');
        const count = await Question.countDocuments();
        if (count === 0) {
          console.log(`🌱 [SEED] Seeding MongoDB with ${SEED_QUESTIONS.length} verified questions...`);
          await Question.insertMany(SEED_QUESTIONS);
          console.log('✅ [SEED] Database seeded successfully!');
        } else {
          console.log(`📚 [SEED] Database already contains ${count} questions.`);
        }
      } catch (err: any) {
        console.error('❌ [SEED] Error initializing questions in MongoDB:', err.message);
      }
    } else {
      console.log(`📚 [QUESTIONS] Using built-in question repository (${this.inMemoryQuestions.length} verified questions available).`);
    }
  }

  /**
   * Fetches a randomized set of N questions with options shuffled, preserving internal correctIndex
   */
  public static async getRandomQuestions(count: number = 10): Promise<QuestionData[]> {
    let sourcePool: QuestionData[] = [];

    if (isDatabaseConnected()) {
      try {
        const { Question } = await import('../models/Question');
        const docs = await Question.find().lean();
        if (docs && docs.length > 0) {
          sourcePool = docs.map((d: any) => ({
            questionId: d.questionId,
            question: d.question,
            options: d.options,
            correctIndex: d.correctIndex,
            category: d.category,
            difficulty: d.difficulty,
            explanation: d.explanation,
          }));
        }
      } catch (err: any) {
        console.warn('⚠️ Falling back to in-memory questions:', err.message);
      }
    }

    if (sourcePool.length === 0) {
      sourcePool = [...this.inMemoryQuestions];
    }

    // Shuffle pool with Fisher-Yates
    const shuffledPool = [...sourcePool];
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }

    const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

    // For each question, randomize option order while recalculating correctIndex
    return selected.map((q) => this.shuffleOptions(q));
  }

  /**
   * Shuffles the 4 options of a question and updates correctIndex accordingly
   */
  public static shuffleOptions(question: QuestionData): QuestionData {
    const originalCorrectOption = question.options[question.correctIndex];

    // Create array of pairs [option, isCorrect]
    const optionsWithFlag = question.options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === question.correctIndex,
    }));

    // Fisher-Yates shuffle
    for (let i = optionsWithFlag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithFlag[i], optionsWithFlag[j]] = [optionsWithFlag[j], optionsWithFlag[i]];
    }

    const newOptions = optionsWithFlag.map((item) => item.text);
    const newCorrectIndex = newOptions.indexOf(originalCorrectOption);

    return {
      ...question,
      options: newOptions,
      correctIndex: newCorrectIndex,
    };
  }

  public static getTotalQuestionCount(): number {
    return this.inMemoryQuestions.length;
  }
}
