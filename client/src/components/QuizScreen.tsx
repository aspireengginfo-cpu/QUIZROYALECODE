import React, { useEffect, useState, useRef } from 'react';
import {
  Timer,
  CheckCircle,
  Lock,
  Award,
  Users,
  Check,
  X,
  Sparkles,
  BookOpen,
  Trophy,
  ArrowRight,
  Clock,
} from 'lucide-react';
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
  const isRevealed = room.status === 'QUESTION_REVEAL';
  const [timeLeft, setTimeLeft] = useState(question.timeLimit || 15);
  const [revealCountdown, setRevealCountdown] = useState(3);
  const startTimeRef = useRef<number>(room.roundStartTime || Date.now());

  // Count answered vs total connected players
  const connectedPlayers = room.players.filter((p) => p.connected);
  const answeredCount = connectedPlayers.filter((p) => p.hasAnsweredCurrent).length;

  // Reveal data
  const correctIndex = room.roundResults?.correctIndex ?? -1;
  const explanation = room.roundResults?.explanation;
  const distributions = room.roundResults?.answerDistributions || [0, 0, 0, 0];

  const userPickIndex = selectedOptionIndex !== undefined ? selectedOptionIndex : currentPlayer.lastAnswerIndex;
  const didAnswer = userPickIndex !== undefined && userPickIndex >= 0;
  const isUserCorrect = didAnswer && userPickIndex === correctIndex;
  const pointsEarned = currentPlayer.lastPointsEarned || 0;

  // Sorted live leaderboard for rank preview
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const userRank = sortedPlayers.findIndex((p) => p.id === currentPlayer.id) + 1;

  // Countdown timer during active round
  useEffect(() => {
    if (isRevealed) return;
    startTimeRef.current = room.roundStartTime || Date.now();
    const durationMs = (question.timeLimit || 15) * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const remainingSec = Math.ceil(remainingMs / 1000);

      setTimeLeft(remainingSec);

      // Warning audio ticks for last 5 seconds
      if (remainingSec <= 5 && remainingSec > 0 && remainingMs % 1000 < 100) {
        sound.playTick();
      }

      if (remainingMs <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [question.questionId, room.roundStartTime, question.timeLimit, isRevealed]);

  // Audio effect and countdown timer when revealed
  useEffect(() => {
    if (!isRevealed) return;

    if (isUserCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    setRevealCountdown(3);
    const interval = setInterval(() => {
      setRevealCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRevealed, isUserCorrect]);

  // Keyboard shortcut listener (1/2/3/4 or A/B/C/D)
  useEffect(() => {
    if (isRevealed || hasLockedAnswer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [hasLockedAnswer, question.options, isRevealed]);

  const handleOptionClick = (idx: number) => {
    if (isRevealed || hasLockedAnswer || timeLeft <= 0) return;
    sound.playClick();
    onSubmitAnswer(idx);
  };

  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / (question.timeLimit || 15)) * 100));
  const isUrgent = timeLeft <= 5 && !isRevealed;
  const categoryStyle = CATEGORY_COLORS[question.category] || CATEGORY_COLORS['General Knowledge'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-5 flex flex-col items-center">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between mb-3 gap-2">
        {/* Left: Question Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-300">
            QUESTION
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-500/40 text-amber-300 font-mono font-black text-sm sm:text-base">
            {question.questionNumber} / {question.totalQuestions}
          </span>
        </div>

        {/* Center: Category Pill */}
        <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r ${categoryStyle}`}>
          <Award className="w-3.5 h-3.5" />
          <span>{question.category}</span>
        </div>

        {/* Right: Live Standings Pill */}
        <div className="flex items-center gap-2 bg-royale-800/90 border border-purple-500/40 rounded-xl px-3 py-1 shadow-inner text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-purple-300 font-semibold">Rank:</span>
          <span className="font-bold text-amber-300 font-mono">#{userRank}</span>
          <span className="text-purple-400">|</span>
          <span className="font-mono font-black text-white">{currentPlayer.score.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Progress / Status Header */}
      {!isRevealed ? (
        /* Active Round: Timer Bar */
        <div className="w-full mb-5">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5 px-1">
            <span className="text-purple-300 flex items-center gap-1 font-bold">
              <Timer className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
              <span>Time Remaining</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-purple-300 text-[11px]">
                Answered: <strong className="text-cyan-300 font-mono">{answeredCount}/{connectedPlayers.length}</strong>
              </span>
              <span
                className={`font-black text-base ${
                  isUrgent ? 'text-rose-400 animate-pulse' : 'text-cyan-300'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
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
      ) : (
        /* Revealed: Seamless In-Place Result & Next Round Timer */
        <div className="w-full mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-royale-800 to-purple-950/90 border border-purple-400/40 shadow-xl animate-fade-in">
          {/* Result Tag */}
          <div className="flex items-center gap-2.5">
            {isUserCorrect ? (
              <>
                <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center flex-shrink-0 animate-bounce-subtle">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-300 uppercase tracking-wide">
                    CORRECT CHOICE! +{pointsEarned.toLocaleString()} PTS
                  </div>
                  <div className="text-[11px] text-emerald-200/80">
                    500 Base + {Math.max(0, pointsEarned - 500)} Speed Bonus
                  </div>
                </div>
              </>
            ) : didAnswer ? (
              <>
                <div className="w-8 h-8 rounded-full bg-rose-500/30 border border-rose-400 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-sm font-black text-rose-300 uppercase tracking-wide">
                    INCORRECT (+0 PTS)
                  </div>
                  <div className="text-[11px] text-rose-200/70">
                    Better speed & accuracy on the next one!
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    TIME OUT (+0 PTS)
                  </div>
                  <div className="text-[11px] text-amber-200/70">
                    No answer selected before timer expired.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Next Question Pill */}
          <div className="flex items-center gap-2 bg-royale-900/90 border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-purple-200">
            <span>Next Round:</span>
            <span className="font-mono font-black text-cyan-300 animate-pulse text-sm">
              {revealCountdown > 0 ? `${revealCountdown}s` : 'Starting...'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>
      )}

      {/* Question Main Card */}
      <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-8 mb-5 text-center relative overflow-hidden">
        <div className="sm:hidden mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r ${categoryStyle}`}>
            {question.category}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Answer Choice Cards (In-Place Reveal on the exact same buttons!) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
        {question.options.map((optionText, idx) => {
          const isThisCorrect = isRevealed && idx === correctIndex;
          const isUserPick = userPickIndex === idx;
          const countPicked = distributions[idx] || 0;

          // Compute button styling based on active vs revealed state
          let buttonClasses = '';
          if (isRevealed) {
            if (isThisCorrect) {
              buttonClasses =
                'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-[1.02] border-2';
            } else if (isUserPick) {
              buttonClasses =
                'bg-gradient-to-r from-rose-950 via-rose-900 to-purple-950 border-rose-500 text-rose-100 border-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
            } else {
              buttonClasses =
                'bg-royale-900/40 border-purple-500/15 text-purple-300/40 opacity-40 cursor-default border';
            }
          } else {
            // Active Question State
            if (isUserPick) {
              buttonClasses =
                'bg-gradient-to-r from-purple-800 to-cyan-800 border-cyan-400 text-white shadow-cyan-500/30 ring-2 ring-cyan-400/50 scale-[1.01] border-2';
            } else if (hasLockedAnswer) {
              buttonClasses =
                'bg-royale-900/60 border-purple-500/20 text-purple-300/60 opacity-60 cursor-not-allowed border-2';
            } else {
              buttonClasses =
                'bg-royale-800/80 hover:bg-royale-700 border-purple-500/30 hover:border-purple-300 text-white shadow-purple-500/10 cursor-pointer border-2';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isRevealed || hasLockedAnswer || timeLeft <= 0}
              className={`answer-btn w-full p-4 sm:p-5 rounded-2xl text-left font-semibold text-base sm:text-lg flex items-center justify-between transition-all ${buttonClasses}`}
            >
              <div className="flex items-center gap-3.5 pr-2">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm text-white flex-shrink-0 shadow-md ${
                    isRevealed
                      ? isThisCorrect
                        ? 'bg-emerald-500'
                        : isUserPick
                        ? 'bg-rose-600'
                        : 'bg-purple-950'
                      : OPTION_COLORS[idx]
                  }`}
                >
                  {OPTION_BADGES[idx]}
                </span>
                <div>
                  <span className="leading-snug block">{optionText}</span>
                  {isRevealed && (
                    <span className="text-[11px] text-purple-300/80 font-medium">
                      {countPicked} player{countPicked === 1 ? '' : 's'} chose this
                    </span>
                  )}
                </div>
              </div>

              {/* Status Tags */}
              {isRevealed ? (
                isThisCorrect ? (
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-400/50 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Correct</span>
                  </div>
                ) : isUserPick ? (
                  <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-400/50 flex-shrink-0">
                    <X className="w-3.5 h-3.5 text-rose-400" />
                    <span>Your Pick</span>
                  </div>
                ) : null
              ) : isUserPick ? (
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-400/50 flex-shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked</span>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Did You Know? Trivia Factoid (Smooth In-Place Slide In during reveal) */}
      {isRevealed && explanation && (
        <div className="w-full glass-panel-glow rounded-2xl p-4 sm:p-5 border border-purple-400/30 text-purple-200 text-xs sm:text-sm flex gap-3 shadow-lg animate-fade-in">
          <BookOpen className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Did You Know?</span>
            <p className="text-purple-200/90 leading-relaxed">{explanation}</p>
          </div>
        </div>
      )}

      {/* Answer Locked Status Banner (during active question) */}
      {!isRevealed && hasLockedAnswer && (
        <div className="w-full max-w-md p-3 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>Answer locked! Awaiting countdown or other players...</span>
        </div>
      )}
    </div>
  );
};
