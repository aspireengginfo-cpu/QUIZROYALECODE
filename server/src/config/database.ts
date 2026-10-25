import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GameResultRecord } from '../types';

dotenv.config();

let isConnected = false;

// Fallback in-memory/file store for completed game sessions when MongoDB is not connected
const FALLBACK_HISTORY_FILE = path.join(__dirname, '../../history_fallback.json');

export async function connectDatabase(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.trim() === '') {
    console.warn(
      '⚠️  [DATABASE] No MONGODB_URI environment variable detected.\n' +
      '   Running in DEVELOPMENT FALLBACK MODE (in-memory questions & local history persistence).\n' +
      '   To use MongoDB Atlas, set MONGODB_URI in your .env or host dashboard.'
    );
    isConnected = false;
    return false;
  }

  try {
    console.log('🔄 [DATABASE] Attempting connection to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ [DATABASE] Successfully connected to MongoDB Atlas!');
    return true;
  } catch (err: any) {
    console.warn(
      `⚠️  [DATABASE] Connection to MongoDB failed (${err.message}).\n` +
      '   Falling back to in-memory question repository and local file persistence.\n' +
      '   The server remains 100% operational in fallback mode.'
    );
    isConnected = false;
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected;
}

// Persist completed game session either to MongoDB or fallback JSON
export async function saveGameSessionToHistory(record: GameResultRecord): Promise<void> {
  if (isConnected) {
    try {
      const { GameSession } = await import('../models/GameSession');
      await GameSession.create(record);
      console.log(`💾 [DATABASE] Saved game session for room ${record.roomCode} to MongoDB.`);
      return;
    } catch (err: any) {
      console.error('❌ [DATABASE] Failed saving to MongoDB, falling back to local file:', err.message);
    }
  }

  // Fallback to local JSON file
  try {
    let existing: GameResultRecord[] = [];
    if (fs.existsSync(FALLBACK_HISTORY_FILE)) {
      const raw = fs.readFileSync(FALLBACK_HISTORY_FILE, 'utf-8');
      existing = JSON.parse(raw);
    }
    existing.unshift(record);
    // Keep last 50 games
    if (existing.length > 50) {
      existing = existing.slice(0, 50);
    }
    fs.writeFileSync(FALLBACK_HISTORY_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`💾 [FALLBACK] Saved game session for room ${record.roomCode} to fallback storage.`);
  } catch (fileErr: any) {
    console.error('❌ [FALLBACK] Error saving to fallback file:', fileErr.message);
  }
}

// Retrieve past games
export async function getPastGameSessions(limit = 10): Promise<GameResultRecord[]> {
  if (isConnected) {
    try {
      const { GameSession } = await import('../models/GameSession');
      const docs = await GameSession.find().sort({ completedAt: -1 }).limit(limit).lean();
      return docs as unknown as GameResultRecord[];
    } catch (err: any) {
      console.warn('⚠️ [DATABASE] Error fetching history from MongoDB, using fallback:', err.message);
    }
  }

  try {
    if (fs.existsSync(FALLBACK_HISTORY_FILE)) {
      const raw = fs.readFileSync(FALLBACK_HISTORY_FILE, 'utf-8');
      const data: GameResultRecord[] = JSON.parse(raw);
      return data.slice(0, limit);
    }
  } catch (err: any) {
    console.error('Error reading fallback history:', err);
  }
  return [];
}
