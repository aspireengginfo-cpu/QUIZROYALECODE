import { describe, it, expect } from 'vitest';
import { RoomManager } from '../services/roomManager';

describe('RoomManager — Room Lifecycle & Membership', () => {
  it('creates a room with a 6-character code and assigns the creator as host', () => {
    const { room, player } = RoomManager.createRoom('socket-host-1', 'QuizQueen', '👑');
    expect(room.roomCode).toBeDefined();
    expect(room.roomCode).toHaveLength(6);
    expect(room.status).toBe('LOBBY');
    expect(player.isHost).toBe(true);
    expect(player.nickname).toBe('QuizQueen');
    expect(room.hostId).toBe(player.id);
    expect(room.players).toHaveLength(1);
  });

  it('sanitizes malicious characters in player nicknames', () => {
    const sanitized = RoomManager.sanitizeNickname('<script>alert("hack")</script>Player 1');
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
    expect(sanitized).not.toContain('"');
  });

  it('allows players to join an existing room in LOBBY status', () => {
    const { room } = RoomManager.createRoom('socket-host-2', 'HostBob');
    const joinResult = RoomManager.joinRoom('socket-player-2', room.roomCode, 'ChallengerAlice', '⚡');
    expect(joinResult.success).toBe(true);
    expect(joinResult.player?.nickname).toBe('ChallengerAlice');
    expect(room.players).toHaveLength(2);
  });

  it('rejects joining a non-existent room code', () => {
    const result = RoomManager.joinRoom('socket-err', 'NONEXIST', 'Alice');
    expect(result.success).toBe(false);
    expect(result.error).toContain('does not exist');
  });

  it('rejects duplicate nicknames within the same room', () => {
    const { room } = RoomManager.createRoom('socket-host-3', 'DupeKing');
    const joinResult = RoomManager.joinRoom('socket-player-3', room.roomCode, 'DupeKing');
    expect(joinResult.success).toBe(false);
    expect(joinResult.error).toContain('already taken');
  });

  it('enforces the maximum 10-player limit per room', () => {
    const { room } = RoomManager.createRoom('socket-host-4', 'Host4');
    // Add 9 more players to reach 10 total
    for (let i = 1; i <= 9; i++) {
      const res = RoomManager.joinRoom(`socket-p-${i}`, room.roomCode, `Player_${i}`);
      expect(res.success).toBe(true);
    }
    expect(room.players).toHaveLength(10);

    // 11th player must be rejected
    const eleventh = RoomManager.joinRoom('socket-p-11', room.roomCode, 'Player_11');
    expect(eleventh.success).toBe(false);
    expect(eleventh.error).toContain('is full');
  });

  it('transfers host privileges when the host leaves the room', () => {
    const { room, player: hostPlayer } = RoomManager.createRoom('socket-host-5', 'OriginalHost');
    RoomManager.joinRoom('socket-p2-5', room.roomCode, 'SecondPlayer');
    expect(room.hostId).toBe(hostPlayer.id);

    // Host leaves
    const leaveRes = RoomManager.leaveRoom('socket-host-5');
    expect(leaveRes.roomDestroyed).toBe(false);
    expect(room.players).toHaveLength(1);
    expect(room.players[0].isHost).toBe(true);
    expect(room.hostId).toBe(room.players[0].id);
  });

  it('destroys room when the last remaining player leaves', () => {
    const { room } = RoomManager.createRoom('socket-host-solo', 'SoloPlayer');
    const leaveRes = RoomManager.leaveRoom('socket-host-solo');
    expect(leaveRes.roomDestroyed).toBe(true);
    expect(RoomManager.getRoom(room.roomCode)).toBeUndefined();
  });

  it('resets scores and game state on rematch', () => {
    const { room } = RoomManager.createRoom('socket-rematch-host', 'HostR');
    RoomManager.joinRoom('socket-rematch-p2', room.roomCode, 'PlayerR');

    // Simulate game played
    room.status = 'GAME_OVER';
    room.players[0].score = 4200;
    room.players[1].score = 3100;

    const reset = RoomManager.resetForRematch(room.roomCode);
    expect(reset?.status).toBe('LOBBY');
    expect(reset?.players[0].score).toBe(0);
    expect(reset?.players[1].score).toBe(0);
  });
});
