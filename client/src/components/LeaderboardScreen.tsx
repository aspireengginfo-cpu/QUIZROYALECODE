import React from 'react';
import { Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { Player, RoomState } from '../types';

interface LeaderboardScreenProps {
  room: RoomState;
  currentPlayer: Player;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  room,
  currentPlayer,
}) => {
  // Sort players by score descending
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center animate-fade-in">
      {/* Intermission Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-xs font-semibold text-purple-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Round {room.currentQuestionIndex + 1} of {room.totalQuestions} Complete</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
          <span>Live Leaderboard</span>
        </h2>
      </div>

      {/* Leaderboard Table Card */}
      <div className="w-full glass-panel-glow rounded-3xl p-4 sm:p-6 shadow-2xl">
        <div className="space-y-2.5">
          {sortedPlayers.map((player, idx) => {
            const isYou = player.id === currentPlayer.id;
            const rank = idx + 1;
            const lastRoundPts = player.lastPointsEarned || 0;

            let rankBadge = `${rank}`;
            if (rank === 1) rankBadge = '🥇';
            else if (rank === 2) rankBadge = '🥈';
            else if (rank === 3) rankBadge = '🥉';

            return (
              <div
                key={player.id}
                className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-between transition-all ${
                  isYou
                    ? 'bg-gradient-to-r from-purple-900/90 to-royale-800 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.01]'
                    : 'bg-royale-800/40 border border-purple-500/20'
                }`}
              >
                {/* Left: Rank & Nickname */}
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-900/70 border border-purple-500/30 flex items-center justify-center font-bold text-base text-white flex-shrink-0">
                    {rankBadge}
                  </span>
                  <span className="text-2xl">{player.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-base">
                        {player.nickname}
                      </span>
                      {isYou && (
                        <span className="text-[10px] font-bold bg-cyan-500/30 text-cyan-300 px-1.5 py-0.5 rounded-md">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-purple-300">
                      {player.correctAnswersCount} correct answers
                    </span>
                  </div>
                </div>

                {/* Right: Round Delta & Total Points */}
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-mono font-black text-amber-300">
                    {player.score.toLocaleString()} <span className="text-xs text-purple-300">PTS</span>
                  </div>
                  {lastRoundPts > 0 ? (
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{lastRoundPts.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-purple-400/60 font-mono">+0</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs font-semibold text-purple-300/80 mt-6 tracking-wide animate-pulse">
        Next question loading shortly...
      </p>
    </div>
  );
};
