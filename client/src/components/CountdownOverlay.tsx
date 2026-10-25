import React, { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { sound } from '../utils/audio';

export const CountdownOverlay: React.FC = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    sound.playTick();
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sound.playCorrect();
          return 0;
        }
        sound.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-royale-900/90 backdrop-blur-lg animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <Crown className="w-16 h-16 text-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] animate-bounce mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-purple-200 uppercase mb-4">
          Prepare for Battle!
        </h2>
        <div className="text-8xl sm:text-9xl font-black font-mono tracking-tight bg-gradient-to-br from-amber-400 via-rose-500 to-cyan-400 bg-clip-text text-transparent transform scale-125 transition-all">
          {count > 0 ? count : 'GO!'}
        </div>
        <p className="text-sm font-semibold text-purple-300/80 mt-6 tracking-wide">
          15 seconds • Max speed bonus for fast correct answers!
        </p>
      </div>
    </div>
  );
};
