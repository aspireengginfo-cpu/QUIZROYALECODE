import { io, Socket } from 'socket.io-client';

// Determine socket server URL
export function getServerUrl(): string {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  // If running in Vite dev server (usually localhost:5173), point to backend at localhost:4000
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:4000';
  }
  // Otherwise use current origin
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000';
}

// Stable Session Player ID
export function getOrCreateSessionPlayerId(): string {
  const STORAGE_KEY = 'quiz_royale_player_session_id';
  let playerId = sessionStorage.getItem(STORAGE_KEY);
  if (!playerId) {
    playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem(STORAGE_KEY, playerId);
  }
  return playerId;
}

export function getSavedNickname(): string {
  return localStorage.getItem('quiz_royale_nickname') || '';
}

export function saveNickname(nickname: string): void {
  localStorage.setItem('quiz_royale_nickname', nickname);
}

export function getSavedAvatar(): string {
  return localStorage.getItem('quiz_royale_avatar') || '👑';
}

export function saveAvatar(avatar: string): void {
  localStorage.setItem('quiz_royale_avatar', avatar);
}

export const socket: Socket = io(getServerUrl(), {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket', 'polling'],
});
