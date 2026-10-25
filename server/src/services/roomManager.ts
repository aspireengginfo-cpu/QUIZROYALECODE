import { Player, RoomState, RoomStatus } from '../types';

export class RoomManager {
  private static rooms: Map<string, RoomState> = new Map();
  // Map of socketId -> roomCode
  private static socketToRoom: Map<string, string> = new Map();
  // Map of socketId -> playerId
  private static socketToPlayerId: Map<string, string> = new Map();
  // Grace timers for disconnected players
  private static disconnectGraceTimers: Map<string, NodeJS.Timeout> = new Map();

  private static readonly MAX_PLAYERS_PER_ROOM = 10;
  private static readonly MIN_PLAYERS_TO_START = 2;
  private static readonly DISCONNECT_GRACE_MS = 30000; // 30 seconds grace period

  /**
   * Generates a random, easily readable 6-character room code
   */
  public static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous 0, O, 1, I
    let code: string;
    let attempts = 0;
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      attempts++;
      if (attempts > 1000) break;
    } while (this.rooms.has(code));
    return code;
  }

  /**
   * Sanitizes user nickname
   */
  public static sanitizeNickname(nickname: string): string {
    if (!nickname || typeof nickname !== 'string') return 'Player';
    // Remove control characters, html tags, trim
    const sanitized = nickname
      .replace(/[<>'"/\\&]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return sanitized.slice(0, 16) || 'Player';
  }

  /**
   * Creates a new room with host
   */
  public static createRoom(
    hostSocketId: string,
    rawNickname: string,
    avatar: string = '👑',
    sessionPlayerId?: string
  ): { room: RoomState; player: Player } {
    const roomCode = this.generateRoomCode();
    const nickname = this.sanitizeNickname(rawNickname);
    const playerId = sessionPlayerId || `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const hostPlayer: Player = {
      id: playerId,
      socketId: hostSocketId,
      nickname,
      avatar: avatar || '👑',
      score: 0,
      isHost: true,
      hasAnsweredCurrent: false,
      correctAnswersCount: 0,
      connected: true,
    };

    const room: RoomState = {
      roomCode,
      status: 'LOBBY',
      hostId: playerId,
      players: [hostPlayer],
      currentQuestionIndex: 0,
      totalQuestions: 10,
      questionTimeLimit: 15,
    };

    this.rooms.set(roomCode, room);
    this.socketToRoom.set(hostSocketId, roomCode);
    this.socketToPlayerId.set(hostSocketId, playerId);

    return { room, player: hostPlayer };
  }

  /**
   * Joins an existing room
   */
  public static joinRoom(
    socketId: string,
    rawRoomCode: string,
    rawNickname: string,
    avatar: string = '⚡',
    sessionPlayerId?: string
  ): { success: boolean; room?: RoomState; player?: Player; error?: string } {
    const roomCode = (rawRoomCode || '').trim().toUpperCase();
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false, error: `Room ${roomCode} does not exist. Check the code and try again!` };
    }

    // Check if this is a reconnecting player
    if (sessionPlayerId) {
      const existingPlayer = room.players.find((p) => p.id === sessionPlayerId);
      if (existingPlayer) {
        // Reconnect player
        existingPlayer.socketId = socketId;
        existingPlayer.connected = true;
        existingPlayer.disconnectTimestamp = undefined;

        // Clear any active disconnect timer
        const timerKey = `${roomCode}_${sessionPlayerId}`;
        const timer = this.disconnectGraceTimers.get(timerKey);
        if (timer) {
          clearTimeout(timer);
          this.disconnectGraceTimers.delete(timerKey);
        }

        this.socketToRoom.set(socketId, roomCode);
        this.socketToPlayerId.set(socketId, existingPlayer.id);

        console.log(`🔄 [RECONNECT] Player ${existingPlayer.nickname} (${existingPlayer.id}) reconnected to room ${roomCode}`);
        return { success: true, room, player: existingPlayer };
      }
    }

    // New player joining checks
    if (room.status !== 'LOBBY') {
      return { success: false, error: 'A game is already in progress in this room.' };
    }

    if (room.players.length >= this.MAX_PLAYERS_PER_ROOM) {
      return { success: false, error: `Room ${roomCode} is full (maximum ${this.MAX_PLAYERS_PER_ROOM} players).` };
    }

    const nickname = this.sanitizeNickname(rawNickname);

    // Enforce unique nickname within room
    const isNameTaken = room.players.some(
      (p) => p.nickname.toLowerCase() === nickname.toLowerCase()
    );
    if (isNameTaken) {
      return { success: false, error: `Nickname "${nickname}" is already taken in this room. Please choose another.` };
    }

    const playerId = sessionPlayerId || `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newPlayer: Player = {
      id: playerId,
      socketId,
      nickname,
      avatar: avatar || '🎮',
      score: 0,
      isHost: false,
      hasAnsweredCurrent: false,
      correctAnswersCount: 0,
      connected: true,
    };

    room.players.push(newPlayer);
    this.socketToRoom.set(socketId, roomCode);
    this.socketToPlayerId.set(socketId, playerId);

    return { success: true, room, player: newPlayer };
  }

  /**
   * Handles player explicit leave
   */
  public static leaveRoom(socketId: string): { roomCode?: string; room?: RoomState; removedPlayer?: Player; roomDestroyed?: boolean } {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return {};

    const room = this.rooms.get(roomCode);
    if (!room) {
      this.socketToRoom.delete(socketId);
      this.socketToPlayerId.delete(socketId);
      return {};
    }

    const playerIndex = room.players.findIndex((p) => p.socketId === socketId);
    if (playerIndex === -1) {
      this.socketToRoom.delete(socketId);
      return {};
    }

    const [removedPlayer] = room.players.splice(playerIndex, 1);
    this.socketToRoom.delete(socketId);
    this.socketToPlayerId.delete(socketId);

    // If room is now empty, destroy it
    if (room.players.length === 0) {
      this.rooms.delete(roomCode);
      console.log(`🗑️ [ROOM CLEANUP] Room ${roomCode} destroyed (all players left).`);
      return { roomCode, roomDestroyed: true, removedPlayer };
    }

    // If host left, assign host to first connected player
    if (removedPlayer.isHost || room.hostId === removedPlayer.id) {
      const nextHost = room.players.find((p) => p.connected) || room.players[0];
      if (nextHost) {
        nextHost.isHost = true;
        room.hostId = nextHost.id;
        console.log(`👑 [HOST TRANSFER] Host privileges transferred to ${nextHost.nickname} in room ${roomCode}`);
      }
    }

    return { roomCode, room, removedPlayer, roomDestroyed: false };
  }

  /**
   * Handles temporary disconnect (starts 30s grace period)
   */
  public static handleDisconnect(
    socketId: string,
    onPlayerPermanentlyRemoved?: (room: RoomState, removedPlayer: Player) => void
  ): { roomCode?: string; room?: RoomState; player?: Player } {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return {};

    const room = this.rooms.get(roomCode);
    if (!room) {
      this.socketToRoom.delete(socketId);
      this.socketToPlayerId.delete(socketId);
      return {};
    }

    const player = room.players.find((p) => p.socketId === socketId);
    if (!player) return {};

    player.connected = false;
    player.disconnectTimestamp = Date.now();

    // Start 30s grace timer
    const timerKey = `${roomCode}_${player.id}`;
    const timer = setTimeout(() => {
      this.disconnectGraceTimers.delete(timerKey);
      const currentRoom = this.rooms.get(roomCode);
      if (!currentRoom) return;

      // Check if still disconnected
      const pIdx = currentRoom.players.findIndex((p) => p.id === player.id);
      if (pIdx !== -1 && !currentRoom.players[pIdx].connected) {
        const [permRemoved] = currentRoom.players.splice(pIdx, 1);
        console.log(`⏳ [GRACE EXPIRED] Player ${permRemoved.nickname} permanently removed from room ${roomCode}`);

        // Reassign host if needed
        if (permRemoved.isHost || currentRoom.hostId === permRemoved.id) {
          const nextHost = currentRoom.players.find((p) => p.connected);
          if (nextHost) {
            nextHost.isHost = true;
            currentRoom.hostId = nextHost.id;
            console.log(`👑 [HOST TRANSFER] Host transferred to ${nextHost.nickname} in room ${roomCode}`);
          }
        }

        // Destroy room if empty
        if (currentRoom.players.length === 0) {
          this.rooms.delete(roomCode);
        } else if (onPlayerPermanentlyRemoved) {
          onPlayerPermanentlyRemoved(currentRoom, permRemoved);
        }
      }
    }, this.DISCONNECT_GRACE_MS);

    this.disconnectGraceTimers.set(timerKey, timer);

    return { roomCode, room, player };
  }

  public static getRoom(roomCode: string): RoomState | undefined {
    return this.rooms.get((roomCode || '').trim().toUpperCase());
  }

  public static getRoomBySocket(socketId: string): RoomState | undefined {
    const code = this.socketToRoom.get(socketId);
    return code ? this.rooms.get(code) : undefined;
  }

  public static getPlayerBySocket(socketId: string): Player | undefined {
    const room = this.getRoomBySocket(socketId);
    return room?.players.find((p) => p.socketId === socketId);
  }

  public static isHost(socketId: string, roomCode: string): boolean {
    const room = this.getRoom(roomCode);
    if (!room) return false;
    const player = room.players.find((p) => p.socketId === socketId);
    return !!(player && (player.isHost || room.hostId === player.id));
  }

  public static canStartGame(roomCode: string): { canStart: boolean; reason?: string } {
    const room = this.getRoom(roomCode);
    if (!room) return { canStart: false, reason: 'Room not found.' };

    const connectedPlayers = room.players.filter((p) => p.connected);
    if (connectedPlayers.length < this.MIN_PLAYERS_TO_START) {
      return {
        canStart: false,
        reason: `At least ${this.MIN_PLAYERS_TO_START} players must be connected to start Quiz Royale!`,
      };
    }

    if (room.status !== 'LOBBY' && room.status !== 'GAME_OVER') {
      return { canStart: false, reason: 'Game is already running.' };
    }

    return { canStart: true };
  }

  /**
   * Resets room state for a rematch
   */
  public static resetForRematch(roomCode: string): RoomState | undefined {
    const room = this.getRoom(roomCode);
    if (!room) return undefined;

    room.status = 'LOBBY';
    room.currentQuestionIndex = 0;
    room.currentQuestion = undefined;
    room.roundResults = undefined;
    room.winner = undefined;

    // Reset player scores and answers
    room.players.forEach((p) => {
      p.score = 0;
      p.hasAnsweredCurrent = false;
      p.lastAnswerIndex = undefined;
      p.lastPointsEarned = undefined;
      p.lastAnswerTimeMs = undefined;
      p.correctAnswersCount = 0;
    });

    return room;
  }
}
