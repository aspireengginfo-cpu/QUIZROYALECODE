import React, { useEffect } from 'react';
import { Check, X, Sparkles, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { ClientQuestion, Player, RoomState } from '../types';
import { sound } from '../utils/audio';

interface RevealScreenProps {
  question: ClientQuestion;
  room: RoomState;
  currentPlayer: Player;
}

const OPTION_BADGES = ['A', 'B', 'C', 'D'];

export const RevealScreen: React.FC<RevealScreenProps> = ({
  question,
  room,
  currentPlayer,
}) => {
  const roundResults = room.roundResults;
  const correctIndex = roundResults?.correctIndex ?? -1;
  const explanation = roundResults?.explanation;
  const distributions = roundResults?.answerDistributions || [0, 0, 0, 0];

  const playerAnswerIndex = currentPlayer.lastAnswerIndex;
  const isCorrect = playerAnswerIndex === correctIndex;
  const didAnswer = playerAnswerIndex !== undefined && playerAnswerIndex >= 0;
  const pointsEarned = currentPlayer.lastPointsEarned || 0;

  // Play audio on reveal mount
  useEffect(() => {
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  }, [isCorrect]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center animate-fade-in">
      {/* Player Feedback Banner */}
      <div className="w-full max-w-md mb-6">
        {isCorrect ? (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-2 border-emerald-400 text-center shadow-xl shadow-emerald-500/20 animate-bounce-subtle">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Correct Answer</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              +{pointsEarned.toLocaleString()} <span className="text-amber-300">POINTS</span>
            </div>
            <div className="text-xs text-emerald-200/80 mt-1">
              500 Base + {pointsEarned - 500} Speed Bonus!
            </div>
          </div>
        ) : didAnswer ? (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950 via-purple-950 to-rose-950 border-2 border-rose-500 text-center shadow-xl shadow-rose-500/20">
            <div className="inline-flex items-center gap-1.5 text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <X className="w-4 h-4" />
              <span>Incorrect Choice</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              +0 <span className="text-purple-300">POINTS</span>
            </div>
            <div className="text-xs text-rose-200/80 mt-1">
              Better luck next round! Keep moving!
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950 via-purple-950 to-amber-950 border-2 border-amber-500 text-center shadow-xl shadow-amber-500/20">
            <div className="inline-flex items-center gap-1.5 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Time Out</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              +0 <span className="text-purple-300">POINTS</span>
            </div>
            <div className="text-xs text-amber-200/80 mt-1">
              No answer submitted before time expired.
            </div>
          </div>
        )}
      </div>

      {/* Question Recap Title */}
      <div className="w-full glass-panel rounded-2xl p-5 mb-5 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {question.question}
        </h3>
      </div>

      {/* Answer Options Grid with Correct / Incorrect Badges */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {question.options.map((optionText, idx) => {
          const isThisCorrect = idx === correctIndex;
          const isUserPick = idx === playerAnswerIndex;
          const countPicked = distributions[idx] || 0;

          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between transition-all shadow-md ${
                isThisCorrect
                  ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-emerald-500/30 scale-[1.02]'
                  : isUserPick
                  ? 'bg-rose-950/80 border-rose-500 text-rose-100 opacity-90'
                  : 'bg-royale-900/50 border-purple-500/20 text-purple-300/60 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3.5 pr-2">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm text-white flex-shrink-0 shadow-md ${
                    isThisCorrect
                      ? 'bg-emerald-600'
                      : isUserPick
                      ? 'bg-rose-600'
                      : 'bg-purple-900'
                  }`}
                >
                  {OPTION_BADGES[idx]}
                </span>
                <div>
                  <span className="font-semibold text-base sm:text-lg block leading-snug">
                    {optionText}
                  </span>
                  <span className="text-[11px] text-purple-300/80 font-medium">
                    {countPicked} player{countPicked === 1 ? '' : 's'} chose this
                  </span>
                </div>
              </div>

              {isThisCorrect ? (
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-400/50">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Correct</span>
                </div>
              ) : isUserPick ? (
                <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold bg-rose-900/80 px-2.5 py-1 rounded-lg border border-rose-400/50">
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Your Pick</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Explanation Card */}
      {explanation && (
        <div className="w-full glass-panel-glow rounded-2xl p-5 border border-purple-400/30 text-purple-200 text-sm flex gap-3.5 shadow-lg">
          <BookOpen className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Did You Know?</span>
            <p className="text-purple-200/90 leading-relaxed">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
