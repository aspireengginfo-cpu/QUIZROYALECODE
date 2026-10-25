import { Router, Request, Response } from 'express';
import { isDatabaseConnected, getPastGameSessions } from '../config/database';
import { QuestionRepository } from '../questions/questionRepository';
import { RoomManager } from '../services/roomManager';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: isDatabaseConnected(),
      mode: isDatabaseConnected() ? 'MongoDB Atlas' : 'Local Fallback (In-Memory + File)',
    },
    totalQuestionsAvailable: QuestionRepository.getTotalQuestionCount(),
  });
});

// Category and question stats
router.get('/questions/stats', (req: Request, res: Response) => {
  res.status(200).json({
    totalCount: QuestionRepository.getTotalQuestionCount(),
    categories: [
      'Science',
      'Geography',
      'History',
      'Technology',
      'Nature',
      'Sports',
      'General Knowledge',
    ],
  });
});

// Recent completed games history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const history = await getPastGameSessions(limit);
    res.status(200).json({ history });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve game history' });
  }
});

// Room check (verifies if room exists before joining)
router.get('/rooms/:roomCode', (req: Request, res: Response) => {
  const roomCode = req.params.roomCode?.toUpperCase();
  const room = RoomManager.getRoom(roomCode);

  if (!room) {
    return res.status(404).json({ exists: false, message: 'Room not found' });
  }

  res.status(200).json({
    exists: true,
    roomCode: room.roomCode,
    status: room.status,
    playerCount: room.players.filter((p) => p.connected).length,
    maxPlayers: 10,
    canJoin: room.status === 'LOBBY' && room.players.length < 10,
  });
});

export default router;
