import { useState, useRef, useEffect } from 'react';
import SettingsModal from './SettingsModal';

interface StartScreenProps {
  onPlay: () => void;
  onLeaderboard: () => void;
  theme: string;
  onThemeChange: (theme: 'sixers' | 'cavaliers' | 'lakers' | 'heat') => void;
}

export default function StartScreen({ onPlay, onLeaderboard, theme, onThemeChange }: StartScreenProps) {
  const [showSettings, setShowSettings] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.transform = `perspective(500px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg)`;
    };

    const onLeave = () => {
      el.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)';
    };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (el) el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center animate-slide-up">
        <img
          ref={imgRef}
          src="/lebron-main.png"
          className="h-28 mx-auto mb-4 transition-transform duration-150 ease-out"
          style={{ transform: 'perspective(500px) rotateX(0deg) rotateY(0deg)' }}
        />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tight">
          <span className="text-sixers-red">LeBron</span>{' '}
          <span className="text-white">or</span>{' '}
          <span className="text-sixers-red">That</span>
        </h1>
        <p className="text-sixers-silver text-lg md:text-xl mb-2">
          Did LeBron's NBA debut come first or that?
        </p>
        <p className="text-sixers-silver/60 text-sm mb-10">
          LeBron started his NBA career in 2003. Are these things older or younger than his career?
        </p>

        <button
          onClick={onPlay}
          className="bg-sixers-red hover:bg-white hover:text-sixers-red text-white font-bold text-2xl px-12 py-4 rounded-full mb-4 transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
        >
          Play
        </button>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onLeaderboard}
            className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            ⚙️ Settings
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
