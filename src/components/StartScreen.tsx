import { useState } from 'react';
import SettingsModal from './SettingsModal';

interface StartScreenProps {
  onPlay: () => void;
  onLeaderboard: () => void;
  theme: string;
  onThemeChange: (theme: 'sixers' | 'cavaliers' | 'lakers' | 'heat') => void;
}

export default function StartScreen({ onPlay, onLeaderboard, theme, onThemeChange }: StartScreenProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center animate-slide-up">
        <div className="text-6xl mb-4">🏀</div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tight">
          <span className="text-sixers-red">LeBron</span>{' '}
          <span className="text-white">or</span>{' '}
          <span className="text-sixers-blue">That</span>
        </h1>
        <p className="text-sixers-silver text-lg md:text-xl mb-2">
          Is it older or younger than LeBron's NBA career?
        </p>
        <p className="text-sixers-silver/60 text-sm mb-10">
          LeBron entered the NBA in 2003. How long can your streak go?
        </p>

        <button
          onClick={onPlay}
          className="bg-sixers-red hover:bg-red-600 text-white font-bold text-2xl px-12 py-4 rounded-full mb-4 transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
        >
          Play
        </button>

        <div className="flex flex-col gap-2">
          <button
            onClick={onLeaderboard}
            className="text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            Leaderboard
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            Settings
          </button>
        </div>

        <div className="mt-8 text-sixers-silver/40 text-xs">
          ← Older &nbsp;|&nbsp; Younger →
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          theme={theme}
          onThemeChange={onThemeChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
