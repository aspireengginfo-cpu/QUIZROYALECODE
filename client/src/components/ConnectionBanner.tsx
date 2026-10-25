import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { socket } from '../utils/socket';
import { sound } from '../utils/audio';

interface ConnectionBannerProps {
  isConnected: boolean;
}

export const ConnectionBanner: React.FC<ConnectionBannerProps> = ({ isConnected }) => {
  if (isConnected) return null;

  const handleManualReconnect = () => {
    sound.playClick();
    socket.connect();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-rose-950/95 border-b border-rose-500/50 px-4 py-2.5 text-white flex items-center justify-between text-xs sm:text-sm backdrop-blur-md animate-bounce-subtle">
      <div className="flex items-center gap-2 max-w-2xl mx-auto flex-1">
        <WifiOff className="w-4 h-4 text-rose-400 animate-pulse flex-shrink-0" />
        <span className="font-semibold text-rose-200">
          Connection lost. Reconnecting to the Quiz Royale multiplayer server...
        </span>
      </div>
      <button
        onClick={handleManualReconnect}
        className="ml-3 px-3 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all flex-shrink-0"
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Retry</span>
      </button>
    </div>
  );
};
