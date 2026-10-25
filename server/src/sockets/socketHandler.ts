import { Server, Socket } from 'socket.io';
import { RoomManager } from '../services/roomManager';
import { GameEngine } from '../services/gameEngine';

export function registerSocketHandlers(io: Server): void {
  GameEngine.initialize(io);

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [SOCKET CONNECTED] Client connected: ${socket.id}`);

    // ==========================================
    // 1. CREATE ROOM
    // ==========================================
    socket.on('room:create', (payload: { nickname?: string; avatar?: string; sessionPlayerId?: string }) => {
      try {
        const rawNickname = payload?.nickname || 'Host';
        const avatar = payload?.avatar || '👑';
        const sessionPlayerId = payload?.sessionPlayerId;

        const { room, player } = RoomManager.createRoom(
          socket.id,
          rawNickname,
          avatar,
          sessionPlayerId
        );

        socket.join(room.roomCode);
        console.log(`🏰 [ROOM CREATED] ${room.roomCode} by host "${player.nickname}" (${player.id})`);

        socket.emit('room:joined', {
          room,
          player,
          isHost: true,
        });

        io.to(room.roomCode).emit('room:state', room);
      } catch (err: any) {
        console.error('Error creating room:', err);
        socket.emit('error', { message: 'Failed to create room. Please try again.' });
      }
    });

    // ==========================================
    // 2. JOIN ROOM
    // ==========================================
    socket.on(
      'room:join',
      (payload: { roomCode: string; nickname?: string; avatar?: string; sessionPlayerId?: string }) => {
        try {
          const roomCode = (payload?.roomCode || '').trim().toUpperCase();
          const rawNickname = payload?.nickname || 'Player';
          const avatar = payload?.avatar || '⚡';
          const sessionPlayerId = payload?.sessionPlayerId;

          const result = RoomManager.joinRoom(
            socket.id,
            roomCode,
            rawNickname,
            avatar,
            sessionPlayerId
          );

          if (!result.success || !result.room || !result.player) {
            socket.emit('error', { message: result.error || 'Failed to join room.' });
            return;
          }

          socket.join(roomCode);
          console.log(`👤 [PLAYER JOINED] ${result.player.nickname} joined room ${roomCode}`);

          socket.emit('room:joined', {
            room: result.room,
            player: result.player,
            isHost: result.player.isHost,
          });

          // Broadcast updated room state to all players in the room
          io.to(roomCode).emit('room:state', result.room);
          io.to(roomCode).emit('room:player_joined', { player: result.player });
        } catch (err: any) {
          console.error('Error joining room:', err);
          socket.emit('error', { message: 'Internal error joining room.' });
        }
      }
    );

    // ==========================================
    // 3. UPDATE ROOM SETTINGS (Host only)
    // ==========================================
    socket.on('room:update_settings', (payload: { roomCode: string; totalQuestions?: number }) => {
      try {
        const roomCode = payload?.roomCode;
        if (!RoomManager.isHost(socket.id, roomCode)) {
          socket.emit('error', { message: 'Only the room host can change game settings.' });
          return;
        }

        const room = RoomManager.getRoom(roomCode);
        if (!room) return;

        if (payload.totalQuestions && [5, 10, 15, 20].includes(payload.totalQuestions)) {
          room.totalQuestions = payload.totalQuestions;
        }

        io.to(roomCode).emit('room:state', room);
      } catch (err: any) {
        console.error('Error updating settings:', err);
      }
    });

    // ==========================================
    // 4. KICK PLAYER (Host only)
    // ==========================================
    socket.on('room:kick_player', (payload: { roomCode: string; playerIdToKick: string }) => {
      try {
        const roomCode = payload?.roomCode;
        if (!RoomManager.isHost(socket.id, roomCode)) {
          socket.emit('error', { message: 'Only the host can kick players.' });
          return;
        }

        const room = RoomManager.getRoom(roomCode);
        if (!room) return;

        const playerToKick = room.players.find((p) => p.id === payload.playerIdToKick);
        if (!playerToKick) return;

        // Notify kicked player
        io.to(playerToKick.socketId).emit('room:kicked', { message: 'You were removed from the room by the host.' });

        // Remove from room
        RoomManager.leaveRoom(playerToKick.socketId);
        io.to(roomCode).emit('room:state', room);
      } catch (err: any) {
        console.error('Error kicking player:', err);
      }
    });

    // ==========================================
    // 5. START GAME (Host only)
    // ==========================================
    socket.on('game:start', async (payload: { roomCode: string }) => {
      try {
        const roomCode = payload?.roomCode;
        if (!RoomManager.isHost(socket.id, roomCode)) {
          socket.emit('error', { message: 'Only the host can start the game.' });
          return;
        }

        const result = await GameEngine.startGame(roomCode);
        if (!result.success) {
          socket.emit('error', { message: result.error || 'Failed to start game.' });
        }
      } catch (err: any) {
        console.error('Error starting game:', err);
        socket.emit('error', { message: 'Error starting game.' });
      }
    });

    // ==========================================
    // 6. SUBMIT ANSWER
    // ==========================================
    socket.on(
      'game:submit_answer',
      (payload: { roomCode: string; questionId: string; selectedOptionIndex: number }) => {
        try {
          const { roomCode, questionId, selectedOptionIndex } = payload || {};
          if (!roomCode || !questionId || selectedOptionIndex === undefined) {
            socket.emit('error', { message: 'Invalid submission data.' });
            return;
          }

          const result = GameEngine.handleAnswerSubmission(
            socket.id,
            roomCode,
            questionId,
            selectedOptionIndex
          );

          if (!result.success) {
            socket.emit('error', { message: result.error || 'Submission failed.' });
          }
        } catch (err: any) {
          console.error('Error submitting answer:', err);
        }
      }
    );

    // ==========================================
    // 7. REMATCH (Host only)
    // ==========================================
    socket.on('game:rematch', (payload: { roomCode: string }) => {
      try {
        const roomCode = payload?.roomCode;
        if (!RoomManager.isHost(socket.id, roomCode)) {
          socket.emit('error', { message: 'Only the host can request a rematch.' });
          return;
        }

        const resetRoom = RoomManager.resetForRematch(roomCode);
        if (resetRoom) {
          GameEngine.clearRoomTimer(roomCode);
          console.log(`🔁 [REMATCH] Room ${roomCode} reset to lobby by host.`);
          io.to(roomCode).emit('room:state', resetRoom);
          io.to(roomCode).emit('game:rematch_ready');
        }
      } catch (err: any) {
        console.error('Error triggering rematch:', err);
      }
    });

    // ==========================================
    // 8. LEAVE ROOM
    // ==========================================
    socket.on('room:leave', () => {
      try {
        const result = RoomManager.leaveRoom(socket.id);
        if (result.roomCode) {
          socket.leave(result.roomCode);
          if (result.room) {
            io.to(result.roomCode).emit('room:state', result.room);
            io.to(result.roomCode).emit('room:player_left', {
              playerId: result.removedPlayer?.id,
              nickname: result.removedPlayer?.nickname,
            });
          }
        }
      } catch (err: any) {
        console.error('Error leaving room:', err);
      }
    });

    // ==========================================
    // 9. DISCONNECT
    // ==========================================
    socket.on('disconnect', () => {
      try {
        console.log(`❌ [SOCKET DISCONNECTED] Client disconnected: ${socket.id}`);
        const result = RoomManager.handleDisconnect(socket.id, (room, removedPlayer) => {
          io.to(room.roomCode).emit('room:state', room);
          io.to(room.roomCode).emit('room:player_left', {
            playerId: removedPlayer.id,
            nickname: removedPlayer.nickname,
          });
        });

        if (result.roomCode && result.room) {
          io.to(result.roomCode).emit('room:state', result.room);
          io.to(result.roomCode).emit('room:player_disconnected', {
            playerId: result.player?.id,
            nickname: result.player?.nickname,
          });
        }
      } catch (err: any) {
        console.error('Error handling disconnect:', err);
      }
    });
  });
}
