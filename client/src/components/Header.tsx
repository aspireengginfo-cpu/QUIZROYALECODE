import React from 'react';
import { Crown, Volume2, VolumeX, HelpCircle, Copy, Check, Wifi, WifiOff } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  roomCode?: string;
  isConnected: boolean;
  onOpenRules: () => void;
  onLeaveRoom?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomCode,
  isConnected,
  onOpenRules,
  onLeaveRoom,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());
  const [copied, setCopied] = React.useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const copyRoomCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between z-20">
      {/* Brand Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => {
          if (onLeaveRoom) {
            if (confirm('Leave current game and return to home screen?')) {
              onLeaveRoom();
            }
          }
        }}
        title="Quiz Royale Home"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-[2px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-royale-900 rounded-[10px] flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] animate-bounce-subtle" />
          </div>
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
            QUIZ<span className="text-amber-400">ROYALE</span>
          </span>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-purple-300/70">
            <span>Multiplayer Arena</span>
          </div>
        </div>
      </div>

      {/* Center: Room Code pill if in room */}
      {roomCode && (
        <div className="hidden sm:flex items-center gap-2 bg-royale-800/80 border border-purple-500/30 rounded-full px-3 py-1 shadow-inner">
          <span className="text-xs text-purple-300 font-medium">ROOM:</span>
          <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
            {roomCode}
          </span>
          <button
            onClick={copyRoomCode}
            className="text-purple-300 hover:text-white transition-colors p-1"
            title="Copy room code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Connection status indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300 animate-pulse'
          }`}
          title={isConnected ? 'Connected to live multiplayer game server' : 'Disconnected, reconnecting...'}
        >
          {isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Reconnecting</span>
            </>
          )}
        </div>

        {/* How to play rules modal */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenRules();
          }}
          className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/20 text-purple-200 hover:text-white transition-all shadow-sm"
          title="Game Rules & Scoring"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/20 text-purple-200 hover:text-white transition-all shadow-sm"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
};
