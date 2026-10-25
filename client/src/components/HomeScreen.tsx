import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, PlusCircle, LogIn, Trophy, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { GameHistoryItem } from '../types';
import { getServerUrl } from '../utils/socket';

const AVATARS = ['👑', '⚡', '🦁', '🦊', '🚀', '💎', '🐉', '🎯', '🦉', '🔥'];

interface HomeScreenProps {
  initialNickname: string;
  initialAvatar: string;
  onCreateRoom: (nickname: string, avatar: string) => void;
  onJoinRoom: (roomCode: string, nickname: string, avatar: string) => void;
  isLoading: boolean;
  errorMessage?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  initialNickname,
  initialAvatar,
  onCreateRoom,
  onJoinRoom,
  isLoading,
  errorMessage,
}) => {
  const [nickname, setNickname] = useState(initialNickname || '');
  const [avatar, setAvatar] = useState(initialAvatar || '👑');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [recentHistory, setRecentHistory] = useState<GameHistoryItem[]>([]);

  // Check URL params for room code (e.g. ?room=XYZ123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('room');
    if (codeParam) {
      setRoomCodeInput(codeParam.toUpperCase().slice(0, 6));
      setActiveTab('join');
    }
  }, []);

  // Fetch recent completed games
  useEffect(() => {
    fetch(`${getServerUrl()}/api/history?limit=4`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.history) {
          setRecentHistory(data.history);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = nickname.trim() || 'Champion';
    sound.playClick();
    onCreateRoom(cleanNick, avatar);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = nickname.trim() || 'Challenger';
    const cleanCode = roomCodeInput.trim().toUpperCase();
    if (!cleanCode) return;
    sound.playClick();
    onJoinRoom(cleanCode, cleanNick, avatar);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-xs sm:text-sm font-semibold text-purple-200 mb-6 shadow-sm animate-pulse-fast">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Real-Time Multiplayer Game-Show</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-black text-center tracking-tight mb-4">
        Outsmart Friends in{' '}
        <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Quiz Royale
        </span>
      </h1>

      <p className="text-base sm:text-lg text-purple-200/80 text-center max-w-xl mb-8">
        Fast-paced 15-second trivia rounds. 2–10 players. No login required.
        Answer faster for huge speed bonuses!
      </p>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="w-full max-w-md mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-3 animate-bounce-subtle">
          <span className="text-xl">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Interactive Card */}
      <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 relative">
        {/* Step 1: Identity & Avatar */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
            1. Choose Your Identity
          </label>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 16))}
              placeholder="Enter your nickname..."
              className="flex-1 bg-royale-900/90 border border-purple-500/40 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-semibold text-base transition-all"
              maxLength={16}
              required
            />
          </div>

          {/* Avatar selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAvatar(av);
                }}
                className={`p-2 text-xl rounded-xl transition-all flex-shrink-0 ${
                  avatar === av
                    ? 'bg-gradient-to-br from-amber-400 to-rose-500 scale-110 shadow-md shadow-amber-500/40 border-2 border-white'
                    : 'bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/20'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Choose Mode (Create vs Join) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
            2. Select Game Mode
          </label>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-royale-900/80 p-1.5 rounded-2xl border border-purple-500/30 mb-5">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('create');
              }}
              className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Room</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('join');
              }}
              className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'join'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Join Room</span>
            </button>
          </div>

          {/* Create Room Form */}
          {activeTab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-500/20 text-xs text-purple-200">
                You will be the host. Invite up to 9 other players via room code or instant share link!
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base btn-royale text-white flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Creating Royale Room...</span>
                ) : (
                  <>
                    <Crown className="w-5 h-5 text-amber-300" />
                    <span>Host New Game</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Join Room Form */
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="ENTER 6-DIGIT CODE"
                  className="w-full bg-royale-900/90 border border-cyan-500/40 rounded-xl px-4 py-3.5 text-center text-xl font-mono font-bold tracking-widest text-cyan-300 placeholder-purple-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 uppercase"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || roomCodeInput.trim().length !== 6}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Entering Arena...</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-amber-300" />
                    <span>Join Royale Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Hall of Fame / Recent Games */}
      {recentHistory.length > 0 && (
        <div className="w-full max-w-md mt-10">
          <div className="flex items-center gap-2 mb-3 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Recent Champions Hall of Fame</span>
          </div>
          <div className="space-y-2">
            {recentHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-royale-800/40 border border-purple-500/20 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.winner.avatar || '👑'}</span>
                  <div>
                    <span className="font-bold text-white text-sm">{item.winner.nickname}</span>
                    <div className="text-purple-300/70 text-[10px]">
                      Room {item.roomCode} • {item.totalQuestions} questions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-amber-300 text-sm">
                    {item.winner.score.toLocaleString()} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
