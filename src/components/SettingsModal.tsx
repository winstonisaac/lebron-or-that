import { useState } from 'react';
import { isSoundEnabled, toggleSound, getVolume, setVolume } from '../utils/sounds';

interface SettingsModalProps {
  theme: string;
  onThemeChange: (theme: 'sixers' | 'cavaliers' | 'lakers' | 'heat') => void;
  onClose: () => void;
}

const THEMES = [
  { id: 'sixers', label: '76ers', colors: ['#002B5C', '#ED174C', '#006BB6'] },
  { id: 'cavaliers', label: 'Cavaliers', colors: ['#860038', '#FFB81C', '#041E42'] },
  { id: 'lakers', label: 'Lakers', colors: ['#552583', '#FDB927', '#000000'] },
  { id: 'heat', label: 'Heat', colors: ['#98002E', '#F9A01B', '#000000'] },
] as const;

export default function SettingsModal({ theme, onThemeChange, onClose }: SettingsModalProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [volume, setVolumeState] = useState(getVolume());

  const handleToggle = () => {
    toggleSound();
    setSoundOn(isSoundEnabled());
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    setVolumeState(v);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-slide-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 bg-sixers-navy border border-white/10 rounded-3xl p-6 pb-10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-sixers-silver hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider text-sixers-silver/60 mb-3">Sound</h3>
          <button
            onClick={handleToggle}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
              soundOn ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-white font-medium">Sound Effects</span>
            <span className={`text-sm font-bold ${soundOn ? 'text-green-400' : 'text-sixers-silver/60'}`}>
              {soundOn ? 'ON' : 'OFF'}
            </span>
          </button>

          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white/70">Volume</span>
              <span className="text-sm text-sixers-silver/60">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(volume * 100)}
              onChange={(e) => handleVolume(Number(e.target.value) / 100)}
              className="w-full accent-sixers-red"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wider text-sixers-silver/60 mb-3">Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  theme === t.id
                    ? 'border-white/40 bg-white/15'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex -space-x-1">
                  {t.colors.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-white text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
