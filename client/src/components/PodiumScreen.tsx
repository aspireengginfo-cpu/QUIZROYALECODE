import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Crown, Trophy, RotateCcw, Home, Sparkles, Award } from 'lucide-react';
import { Player, RoomState } from '../types';
import { sound } from '../utils/audio';

interface PodiumScreenProps {
  room: RoomState;
  currentPlayer: Player;
  isHost: boolean;
  onRematch: () => void;
  onReturnHome: () => void;
}

export const PodiumScreen: React.FC<PodiumScreenProps> = ({
  room,
  currentPlayer,
  isHost,
  onRematch,
  onReturnHome,
}) => {
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const first = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];

  // Trigger celebration effects on mount
  useEffect(() => {
    sound.playFanfare();

    // Confetti cannon
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center animate-fade-in">
      {/* Crown Banner */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-purple-500/30 border border-amber-400/50 text-xs sm:text-sm font-black text-amber-300 mb-3 shadow-lg animate-bounce-subtle">
        <Crown className="w-4 h-4 text-amber-400" />
        <span>ROYALE CEREMONY</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-center tracking-tight text-white mb-2">
        Game Completed!
      </h1>
      <p className="text-sm sm:text-base text-purple-200/80 mb-8 text-center">
        Honoring our trivia champions across {room.totalQuestions} battle rounds!
      </p>

      {/* 3-Tier Podium */}
      <div className="w-full max-w-2xl flex items-end justify-center gap-3 sm:gap-6 mb-10 pt-10">
        {/* 2nd Place */}
        {second && (
          <div className="flex-1 flex flex-col items-center">
            <div className="text-3xl sm:text-4xl mb-2">{second.avatar}</div>
            <span className="font-bold text-white text-xs sm:text-sm text-center truncate max-w-[100px]">
              {second.nickname}
            </span>
            <span className="font-mono font-extrabold text-xs text-amber-300 mb-2">
              {second.score.toLocaleString()} pts
            </span>
            <div className="w-full h-32 sm:h-40 rounded-t-3xl bg-gradient-to-t from-purple-900/90 to-purple-700/60 border-t-4 border-l-2 border-r-2 border-gray-300 flex flex-col items-center justify-center p-2 shadow-xl shadow-purple-900/40">
              <span className="text-3xl sm:text-4xl font-black text-gray-200">2</span>
              <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider">
                Silver
              </span>
            </div>
          </div>
        )}

        {/* 1st Place Champion */}
        {first && (
          <div className="flex-1 flex flex-col items-center relative -mt-8">
            <div className="absolute -top-10 text-amber-400 animate-bounce">
              <Crown className="w-10 h-10 drop-shadow-[0_0_15px_rgba(245,158,11,1)]" />
            </div>
            <div className="text-4xl sm:text-5xl mb-2">{first.avatar}</div>
            <span className="font-black text-amber-300 text-sm sm:text-base text-center truncate max-w-[120px]">
              {first.nickname}
            </span>
            <span className="font-mono font-black text-sm text-amber-400 mb-2">
              {first.score.toLocaleString()} pts
            </span>
            <div className="w-full h-44 sm:h-52 rounded-t-3xl bg-gradient-to-t from-amber-950/90 via-purple-900/80 to-amber-600/70 border-t-4 border-l-2 border-r-2 border-amber-400 flex flex-col items-center justify-center p-2 shadow-2xl shadow-amber-500/20">
              <span className="text-4xl sm:text-5xl font-black text-amber-300">1</span>
              <span className="text-[11px] uppercase font-black text-amber-200 tracking-widest">
                CHAMPION
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="flex-1 flex flex-col items-center">
            <div className="text-3xl sm:text-4xl mb-2">{third.avatar}</div>
            <span className="font-bold text-white text-xs sm:text-sm text-center truncate max-w-[100px]">
              {third.nickname}
            </span>
            <span className="font-mono font-extrabold text-xs text-amber-300 mb-2">
              {third.score.toLocaleString()} pts
            </span>
            <div className="w-full h-24 sm:h-32 rounded-t-3xl bg-gradient-to-t from-purple-900/90 to-purple-800/60 border-t-4 border-l-2 border-r-2 border-amber-700 flex flex-col items-center justify-center p-2 shadow-lg shadow-purple-900/40">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">3</span>
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                Bronze
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Full Rankings Table */}
      <div className="w-full max-w-2xl glass-panel-glow rounded-3xl p-5 sm:p-6 mb-8">
        <h3 className="text-base font-bold text-purple-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Final Royale Standings</span>
        </h3>
        <div className="space-y-2">
          {sortedPlayers.map((player, idx) => {
            const isYou = player.id === currentPlayer.id;
            const accuracy = Math.round((player.correctAnswersCount / room.totalQuestions) * 100);

            return (
              <div
                key={player.id}
                className={`p-3.5 rounded-2xl flex items-center justify-between text-sm ${
                  isYou
                    ? 'bg-purple-900/80 border border-cyan-400 shadow-md'
                    : 'bg-royale-900/50 border border-purple-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono font-bold text-purple-300">
                    #{idx + 1}
                  </span>
                  <span className="text-xl">{player.avatar}</span>
                  <div>
                    <span className="font-bold text-white">{player.nickname}</span>
                    {isYou && (
                      <span className="ml-1.5 text-[9px] font-bold bg-cyan-500/30 text-cyan-300 px-1 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                    <span className="block text-[11px] text-purple-300/80">
                      {player.correctAnswersCount}/{room.totalQuestions} correct ({accuracy}%) • Best Streak: 🔥 {player.highestStreak || 0}
                    </span>
                  </div>
                </div>
                <div className="font-mono font-black text-base text-amber-300">
                  {player.score.toLocaleString()} <span className="text-xs text-purple-300">PTS</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
        {isHost ? (
          <button
            onClick={() => {
              sound.playClick();
              onRematch();
            }}
            className="flex-1 py-4 px-6 rounded-2xl font-black text-base btn-royale text-white flex items-center justify-center gap-2 shadow-xl animate-pulse-fast cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN (REMATCH)</span>
          </button>
        ) : (
          <div className="flex-1 p-3 rounded-2xl bg-royale-800/80 border border-purple-500/30 text-center text-xs text-purple-200">
            Waiting for host to launch rematch...
          </div>
        )}

        <button
          onClick={() => {
            sound.playClick();
            onReturnHome();
          }}
          className="py-4 px-6 rounded-2xl font-bold text-sm bg-royale-900 hover:bg-royale-800 border border-purple-500/30 text-purple-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Exit to Home</span>
        </button>
      </div>
    </div>
  );
};
