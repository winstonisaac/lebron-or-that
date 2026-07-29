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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-sixers-silver hover:text-white text-sm py-2 px-8 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
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
