import { useState } from 'react';

interface TutorialModalProps {
  onStart: () => void;
}

export default function TutorialModal({ onStart }: TutorialModalProps) {
  const [dontShow, setDontShow] = useState(false);

  const handleStart = () => {
    if (dontShow) localStorage.setItem('lebron-tutorial-seen', 'true');
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-slide-up">
      <div className="w-full max-w-sm mx-4 bg-sixers-navy border border-white/10 rounded-3xl p-6 text-center animate-slide-up">
        <img src="/lebron-main.png" className="h-24 mx-auto mb-4" />

        <h2 className="text-2xl font-extrabold text-white mb-3">
          Which came first?
        </h2>

        <p className="text-sixers-silver text-sm leading-relaxed mb-4">
          Did LeBron's NBA debut happen before or after this item?
        </p>

        <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 text-left space-y-2">
          <p className="text-sm text-sixers-silver">
            <span className="text-sixers-blue font-bold">← Press Older</span> if the item came <span className="text-white font-medium">before</span> LeBron entered the NBA (2003).
          </p>
          <p className="text-sm text-sixers-silver">
            <span className="text-sixers-red font-bold">→ Press Younger</span> if it came <span className="text-white font-medium">after</span>.
          </p>
        </div>

        <p className="text-xs text-sixers-silver/60 mb-5">
          You have 3 seconds per question. How long can your streak go?
        </p>

        <label className="flex items-center justify-center gap-2 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
            className="accent-sixers-red w-4 h-4"
          />
          <span className="text-xs text-sixers-silver/70">Don't show again</span>
        </label>

        <button
          onClick={handleStart}
          className="bg-sixers-red hover:bg-white hover:text-sixers-red text-white font-bold text-lg px-10 py-3 rounded-full transition-all hover:scale-105 active:scale-95 w-full"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
