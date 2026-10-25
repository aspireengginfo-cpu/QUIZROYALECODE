import React from 'react';
import { X, Award, Zap, Timer, Users, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel-glow rounded-3xl p-6 sm:p-8 text-white border border-purple-400/40 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">How To Play Quiz Royale</h2>
            <p className="text-sm text-purple-300">Rules, scoring breakdown, and royal battle tips</p>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="space-y-4 text-sm">
          {/* Card 1: Fast & Instant */}
          <div className="p-4 rounded-2xl bg-royale-800/60 border border-purple-500/20 flex gap-3.5">
            <Users className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-base mb-1">Instant Multiplayer (2–10 Players)</h3>
              <p className="text-purple-200/90 leading-relaxed">
                No app installation, account, or login required! Share your 6-character room code with friends on phone, tablet, or desktop to battle in real-time.
              </p>
            </div>
          </div>

          {/* Card 2: Timing & Locking */}
          <div className="p-4 rounded-2xl bg-royale-800/60 border border-purple-500/20 flex gap-3.5">
            <Timer className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-base mb-1">15 Seconds per Question</h3>
              <p className="text-purple-200/90 leading-relaxed">
                All players receive questions synchronously. Once you tap your choice, your answer is permanently locked. Choose wisely and quickly!
              </p>
            </div>
          </div>

          {/* Card 3: The Scoring Formula */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-pink-900/40 border border-amber-500/30 flex gap-3.5">
            <Zap className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-300 text-base mb-1">Server-Authoritative Scoring</h3>
              <div className="space-y-1.5 text-purple-100">
                <p>• <strong>Base Reward:</strong> 500 points for every correct answer.</p>
                <p>• <strong>Speed Bonus:</strong> Up to 500 extra points calculated dynamically:</p>
                <div className="bg-black/30 px-3 py-1.5 rounded-lg font-mono text-xs text-amber-200 my-1">
                  Speed Bonus = floor(500 × Remaining Time ÷ 15s)
                </div>
                <p>• <strong>🔥 Streak Multiplier:</strong> Answer consecutively for massive bonuses!</p>
                <div className="bg-purple-950/70 p-2 rounded-xl text-xs space-y-0.5 border border-purple-500/30">
                  <span className="block">• 2 Correct in a row: <strong>🔥 1.2x Boost</strong></span>
                  <span className="block">• 3 Correct in a row: <strong>🔥🔥 1.5x Boost</strong></span>
                  <span className="block">• 4+ Correct in a row: <strong>⚡👑 2.0x DOUBLE POINTS!</strong></span>
                </div>
                <p>• <strong>Wrong or Timeout:</strong> 0 points (Streak resets to 0).</p>
              </div>
            </div>
          </div>

          {/* Card 4: Categories */}
          <div className="p-4 rounded-2xl bg-royale-800/60 border border-purple-500/20 flex gap-3.5">
            <Award className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-base mb-1">7 Knowledge Realms</h3>
              <p className="text-purple-200/90 leading-relaxed">
                Test your intellect across Science, Geography, History, Technology, Nature, Sports, and General Knowledge.
              </p>
            </div>
          </div>

          {/* Card 5: Fair Play */}
          <div className="p-4 rounded-2xl bg-royale-800/60 border border-purple-500/20 flex gap-3.5">
            <ShieldAlert className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-base mb-1">Fair Play & Anti-Cheat</h3>
              <p className="text-purple-200/90 leading-relaxed">
                The correct answer is never delivered to any browser until the server closes the question. No client tampering is possible.
              </p>
            </div>
          </div>
        </div>

        {/* Got it CTA */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-base btn-royale text-white shadow-lg"
          >
            Ready to Battle!
          </button>
        </div>
      </div>
    </div>
  );
};
