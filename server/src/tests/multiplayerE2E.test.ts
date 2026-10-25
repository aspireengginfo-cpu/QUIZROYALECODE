import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { io as ClientSocket, Socket as ClientSocketType } from 'socket.io-client';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { registerSocketHandlers } from '../sockets/socketHandler';
import { RoomState, ClientQuestion } from '../types';

describe('Real-Time Multiplayer End-to-End Simulation', () => {
  let server: http.Server;
  let io: Server;
  let p1Socket: ClientSocketType;
  let p2Socket: ClientSocketType;
  const PORT = 4099;
  const SERVER_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    const app = express();
    server = http.createServer(app);
    io = new Server(server, { cors: { origin: '*' } });
    registerSocketHandlers(io);

    await new Promise<void>((resolve) => {
      server.listen(PORT, () => resolve());
    });
  });

  afterAll(async () => {
    p1Socket?.disconnect();
    p2Socket?.disconnect();
    io?.close();
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('orchestrates a full 2-player multiplayer room, start, and answer synchronization', async () => {
    // 1. Connect Player 1 (Host)
    p1Socket = ClientSocket(SERVER_URL, { reconnection: false });
    await new Promise<void>((resolve) => {
      p1Socket.on('connect', () => resolve());
    });
    expect(p1Socket.connected).toBe(true);

    // 2. Player 1 creates room
    let roomCode = '';
    const roomCreatedPromise = new Promise<RoomState>((resolve) => {
      p1Socket.on('room:joined', (data: { room: RoomState }) => {
        resolve(data.room);
      });
    });
    p1Socket.emit('room:create', { nickname: 'HostPlayer', avatar: '👑' });
    const createdRoom = await roomCreatedPromise;
    roomCode = createdRoom.roomCode;
    expect(roomCode).toHaveLength(6);
    expect(createdRoom.players).toHaveLength(1);
    expect(createdRoom.players[0].isHost).toBe(true);

    // 3. Connect Player 2
    p2Socket = ClientSocket(SERVER_URL, { reconnection: false });
    await new Promise<void>((resolve) => {
      p2Socket.on('connect', () => resolve());
    });
    expect(p2Socket.connected).toBe(true);

    // 4. Player 2 joins the room
    const p2JoinedPromise = new Promise<RoomState>((resolve) => {
      p2Socket.on('room:joined', (data: { room: RoomState }) => {
        resolve(data.room);
      });
    });
    p2Socket.emit('room:join', { roomCode, nickname: 'Challenger', avatar: '⚡' });
    const joinedRoom = await p2JoinedPromise;
    expect(joinedRoom.players).toHaveLength(2);

    // 5. Host configures room to 5 questions
    p1Socket.emit('room:update_settings', { roomCode, totalQuestions: 5 });

    // 6. Host starts game
    const p1CountdownPromise = new Promise<{ count: number }>((resolve) => {
      p1Socket.on('game:countdown_start', (data) => resolve(data));
    });
    const p2CountdownPromise = new Promise<{ count: number }>((resolve) => {
      p2Socket.on('game:countdown_start', (data) => resolve(data));
    });

    p1Socket.emit('game:start', { roomCode });

    const [p1Countdown, p2Countdown] = await Promise.all([p1CountdownPromise, p2CountdownPromise]);
    expect(p1Countdown.count).toBe(3);
    expect(p2Countdown.count).toBe(3);

    // 7. Verify both players receive synchronized Question 1 without answer key!
    const p1QuestionPromise = new Promise<ClientQuestion>((resolve) => {
      p1Socket.on('game:question_start', (q) => resolve(q));
    });
    const p2QuestionPromise = new Promise<ClientQuestion>((resolve) => {
      p2Socket.on('game:question_start', (q) => resolve(q));
    });

    const [p1Q, p2Q] = await Promise.all([p1QuestionPromise, p2QuestionPromise]);

    expect(p1Q.questionId).toBe(p2Q.questionId);
    expect(p1Q.question).toBe(p2Q.question);
    expect(p1Q.options).toEqual(p2Q.options);
    expect(p1Q.questionNumber).toBe(1);

    // Strict Anti-cheat assertion: correctIndex MUST NOT be exposed on client question
    expect((p1Q as any).correctIndex).toBeUndefined();
    expect((p2Q as any).correctIndex).toBeUndefined();
    expect((p1Q as any).explanation).toBeUndefined();

    // 8. Player 1 submits answer option 0
    const p1AckPromise = new Promise<{ questionId: string; selectedOptionIndex: number }>((resolve) => {
      p1Socket.on('game:answer_acknowledged', (ack) => resolve(ack));
    });
    p1Socket.emit('game:submit_answer', {
      roomCode,
      questionId: p1Q.questionId,
      selectedOptionIndex: 0,
    });
    const p1Ack = await p1AckPromise;
    expect(p1Ack.selectedOptionIndex).toBe(0);

    // 9. Player 2 submits answer option 1
    const p2AckPromise = new Promise<{ questionId: string; selectedOptionIndex: number }>((resolve) => {
      p2Socket.on('game:answer_acknowledged', (ack) => resolve(ack));
    });
    p2Socket.emit('game:submit_answer', {
      roomCode,
      questionId: p2Q.questionId,
      selectedOptionIndex: 1,
    });
    const p2Ack = await p2AckPromise;
    expect(p2Ack.selectedOptionIndex).toBe(1);

    // 10. Since all players answered, server triggers early question reveal!
    const revealPromise = new Promise<{
      correctIndex: number;
      explanation?: string;
      answerDistributions: number[];
    }>((resolve) => {
      p1Socket.on('game:question_end', (revealData) => resolve(revealData));
    });

    const reveal = await revealPromise;
    expect(reveal.correctIndex).toBeGreaterThanOrEqual(0);
    expect(reveal.correctIndex).toBeLessThanOrEqual(3);
    expect(reveal.answerDistributions).toHaveLength(4);
    // At least 1 player picked option 0 and 1 picked option 1
    expect(reveal.answerDistributions[0]).toBeGreaterThanOrEqual(1);
    expect(reveal.answerDistributions[1]).toBeGreaterThanOrEqual(1);
  }, 15000);
});
