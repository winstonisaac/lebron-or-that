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
        <img src="/lebron-main.png" className="h-28 mx-auto mb-4" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tight">
          <span className="text-title-accent">LeBron</span>{' '}
          <span className="text-white">or</span>{' '}
          <span className="text-title-accent">That</span>
        </h1>
        <p className="text-sixers-silver text-lg md:text-xl mb-2">
          Did LeBron's NBA debut come first or that?
        </p>
        <p className="text-sixers-silver/60 text-sm mb-10">
          LeBron started his NBA career in 2003. Are these things older or younger than his career?
        </p>

        <button
          onClick={onPlay}
          className="bg-sixers-red hover:bg-white hover:text-sixers-red text-white font-bold text-2xl px-12 py-4 rounded-full mb-8 transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
        >
          Play
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={onLeaderboard}
            className="text-sixers-silver hover:text-white text-sm py-2 px-8 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            🏆
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-sixers-silver hover:text-white text-sm py-2 px-8 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            ⚙️
          </button>
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
