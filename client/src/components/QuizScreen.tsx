import React, { useEffect, useState, useRef } from 'react';
import { Timer, CheckCircle, Lock, Award, Users } from 'lucide-react';
import { ClientQuestion, Player, RoomState } from '../types';
import { sound } from '../utils/audio';

interface QuizScreenProps {
  question: ClientQuestion;
  room: RoomState;
  currentPlayer: Player;
  onSubmitAnswer: (optionIndex: number) => void;
  selectedOptionIndex?: number;
  hasLockedAnswer: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Science: 'from-emerald-500 to-teal-600 border-emerald-400/40 text-emerald-200',
  Geography: 'from-blue-500 to-cyan-600 border-blue-400/40 text-blue-200',
  History: 'from-amber-500 to-yellow-600 border-amber-400/40 text-amber-200',
  Technology: 'from-cyan-500 to-indigo-600 border-cyan-400/40 text-cyan-200',
  Nature: 'from-green-500 to-emerald-600 border-green-400/40 text-green-200',
  Sports: 'from-orange-500 to-red-600 border-orange-400/40 text-orange-200',
  'General Knowledge': 'from-purple-500 to-pink-600 border-purple-400/40 text-purple-200',
};

const OPTION_BADGES = ['A', 'B', 'C', 'D'];
const OPTION_COLORS = [
  'bg-blue-600 border-blue-400',
  'bg-purple-600 border-purple-400',
  'bg-amber-600 border-amber-400',
  'bg-rose-600 border-rose-400',
];

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  room,
  currentPlayer,
  onSubmitAnswer,
  selectedOptionIndex,
  hasLockedAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit || 15);
  const startTimeRef = useRef<number>(room.roundStartTime || Date.now());

  // Count answered vs total connected players
  const connectedPlayers = room.players.filter((p) => p.connected);
  const answeredCount = connectedPlayers.filter((p) => p.hasAnsweredCurrent).length;

  // Countdown timer synced with server start time
  useEffect(() => {
    startTimeRef.current = room.roundStartTime || Date.now();
    const durationMs = (question.timeLimit || 15) * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const remainingSec = Math.ceil(remainingMs / 1000);

      setTimeLeft(remainingSec);

      // Warning ticks for last 5 seconds
      if (remainingSec <= 5 && remainingSec > 0 && remainingMs % 1000 < 100) {
        sound.playTick();
      }

      if (remainingMs <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [question.questionId, room.roundStartTime, question.timeLimit]);

  // Keyboard shortcut listener (1/2/3/4 or A/B/C/D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasLockedAnswer) return;
      const key = e.key.toUpperCase();
      let index = -1;
      if (key === '1' || key === 'A') index = 0;
      else if (key === '2' || key === 'B') index = 1;
      else if (key === '3' || key === 'C') index = 2;
      else if (key === '4' || key === 'D') index = 3;

      if (index !== -1 && index < question.options.length) {
        handleOptionClick(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasLockedAnswer, question.options]);

  const handleOptionClick = (idx: number) => {
    if (hasLockedAnswer || timeLeft <= 0) return;
    sound.playClick();
    onSubmitAnswer(idx);
  };

  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / (question.timeLimit || 15)) * 100));
  const isUrgent = timeLeft <= 5;
  const categoryStyle = CATEGORY_COLORS[question.category] || CATEGORY_COLORS['General Knowledge'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* Top Status Bar: Question Progress, Category Pill, Timer & Scores */}
      <div className="w-full flex items-center justify-between mb-4 gap-2">
        {/* Question Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-300">
            QUESTION
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-500/40 text-amber-300 font-mono font-black text-sm sm:text-base">
            {question.questionNumber} / {question.totalQuestions}
          </span>
        </div>

        {/* Category Pill */}
        <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r ${categoryStyle}`}>
          <Award className="w-3.5 h-3.5" />
          <span>{question.category}</span>
        </div>

        {/* Live Answer Submissions Counter */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-royale-800/80 border border-purple-500/30 text-xs">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-purple-200">
            Answered:{' '}
            <strong className="text-cyan-300 font-mono">
              {answeredCount}/{connectedPlayers.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Progress Bar & Circular Timer */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5 px-1">
          <span className="text-purple-300 flex items-center gap-1 font-bold">
            <Timer className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
            <span>Time Remaining</span>
          </span>
          <span
            className={`font-black text-base ${
              isUrgent ? 'text-rose-400 animate-pulse' : 'text-cyan-300'
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        {/* Dynamic Animated Bar */}
        <div className="w-full h-3 rounded-full bg-royale-900/90 border border-purple-500/30 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isUrgent
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Main Card */}
      <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-10 mb-6 text-center relative overflow-hidden">
        <div className="sm:hidden mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r ${categoryStyle}`}>
            {question.category}
          </span>
        </div>

        <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Answer Choice Cards (2x2 Grid on desktop, 1 col on mobile) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isLocked = hasLockedAnswer;

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isLocked || timeLeft <= 0}
              className={`answer-btn w-full p-4 sm:p-5 rounded-2xl text-left font-semibold text-base sm:text-lg flex items-center justify-between border-2 transition-all shadow-lg ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-800 to-cyan-800 border-cyan-400 text-white shadow-cyan-500/30 ring-2 ring-cyan-400/50 scale-[1.02]'
                  : isLocked
                  ? 'bg-royale-900/60 border-purple-500/20 text-purple-300/60 opacity-60 cursor-not-allowed'
                  : 'bg-royale-800/80 hover:bg-royale-700 border-purple-500/30 hover:border-purple-300 text-white shadow-purple-500/10 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3.5 pr-2">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm text-white flex-shrink-0 shadow-md ${OPTION_COLORS[idx]}`}
                >
                  {OPTION_BADGES[idx]}
                </span>
                <span className="leading-snug">{optionText}</span>
              </div>

              {isSelected && (
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold flex-shrink-0 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-400/50">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Locked Status Banner */}
      {hasLockedAnswer && (
        <div className="w-full max-w-md p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>Your answer is locked! Waiting for timer or remaining players...</span>
        </div>
      )}
    </div>
  );
};
