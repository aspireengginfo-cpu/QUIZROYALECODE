import React, { useState } from 'react';
import { Crown, Users, Play, Copy, Check, Share2, LogOut, ShieldAlert, Sparkles, UserMinus } from 'lucide-react';
import { sound } from '../utils/audio';
import { Player, RoomState } from '../types';

interface LobbyScreenProps {
  room: RoomState;
  currentPlayer: Player;
  isHost: boolean;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onUpdateQuestionsCount: (count: number) => void;
  onKickPlayer: (playerId: string) => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  currentPlayer,
  isHost,
  onStartGame,
  onLeaveRoom,
  onUpdateQuestionsCount,
  onKickPlayer,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const connectedPlayers = room.players.filter((p) => p.connected);
  const canStart = isHost && connectedPlayers.length >= 2;

  const copyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    sound.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${room.roomCode}`;
    navigator.clipboard.writeText(url);
    sound.playClick();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Lobby Hero Card */}
      <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-xs font-semibold text-purple-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Match Lobby</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Assemble Your Royale Squad
            </h2>
            <p className="text-sm text-purple-300 mt-1">
              Share the room code or invite link. Match begins once host launches!
            </p>
          </div>

          {/* Room Code Badge */}
          <div className="bg-royale-900/90 border-2 border-amber-400/50 rounded-2xl p-4 flex flex-col items-center shadow-xl shadow-amber-500/10 min-w-[200px]">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-1">
              ROOM CODE
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              {room.roomCode}
            </span>
            <div className="flex items-center gap-2 mt-3 w-full">
              <button
                onClick={copyCode}
                className="flex-1 py-1.5 px-3 rounded-lg bg-purple-800/60 hover:bg-purple-700/80 border border-purple-400/30 text-xs font-semibold text-purple-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                title="Copy Room Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Code'}</span>
              </button>
              <button
                onClick={copyInviteLink}
                className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-800/60 hover:bg-cyan-700/80 border border-cyan-400/30 text-xs font-semibold text-cyan-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                title="Copy Direct Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Host Game Settings */}
        {isHost && (
          <div className="mt-6 pt-6 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Rounds:
              </span>
              <div className="flex items-center gap-1.5">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      sound.playClick();
                      onUpdateQuestionsCount(count);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      room.totalQuestions === count
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md border border-purple-300/40'
                        : 'bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-purple-300 font-medium">
              15 seconds per question • 1,000 max pts/round
            </div>
          </div>
        )}
      </div>

      {/* Players Grid Header */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Connected Players ({connectedPlayers.length} / 10)</span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onLeaveRoom();
          }}
          className="text-xs font-semibold text-purple-300 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Leave Room</span>
        </button>
      </div>

      {/* Players List Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {room.players.map((p) => {
          const isYou = p.id === currentPlayer.id;
          return (
            <div
              key={p.id}
              className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                isYou
                  ? 'bg-gradient-to-r from-purple-900/80 to-royale-800 border-2 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'glass-panel'
              } ${!p.connected ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-1.5 rounded-xl bg-purple-900/50 border border-purple-500/20">
                  {p.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">
                      {p.nickname}
                    </span>
                    {isYou && (
                      <span className="text-[10px] font-bold bg-cyan-500/30 text-cyan-300 px-1.5 py-0.5 rounded-md">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {p.isHost && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.5 rounded-md">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>HOST</span>
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Host Kick Option (cannot kick self) */}
              {isHost && !isYou && (
                <button
                  onClick={() => {
                    sound.playClick();
                    if (confirm(`Remove ${p.nickname} from this room?`)) {
                      onKickPlayer(p.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-950/50 text-purple-400 hover:text-rose-400 transition-colors"
                  title={`Kick ${p.nickname}`}
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {/* Empty player placeholders */}
        {Array.from({ length: Math.max(0, 10 - room.players.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="p-4 rounded-2xl border border-dashed border-purple-500/20 bg-purple-950/20 flex items-center justify-center text-xs text-purple-400/50 font-medium"
          >
            <span>Empty Slot</span>
          </div>
        ))}
      </div>

      {/* Start Game Action Card */}
      <div className="w-full max-w-md">
        {isHost ? (
          <div className="space-y-3">
            <button
              onClick={() => {
                sound.playClick();
                onStartGame();
              }}
              disabled={!canStart}
              className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                canStart
                  ? 'btn-royale text-white shadow-xl shadow-purple-500/40 cursor-pointer animate-pulse-fast'
                  : 'bg-purple-950/50 border border-purple-500/20 text-purple-400/60 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START QUIZ ROYALE</span>
            </button>
            {!canStart && (
              <p className="text-center text-xs text-amber-300/80 font-medium flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>At least 2 players are required to start the battle.</span>
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-royale-800/60 border border-purple-500/30 text-center">
            <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center mx-auto mb-2 animate-bounce-subtle">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Waiting for the Host to start</h4>
            <p className="text-xs text-purple-300">
              Get ready! The quiz will begin simultaneously for all players.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
