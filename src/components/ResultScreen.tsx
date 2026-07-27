import { useState } from 'react';

const BLOCKLIST = [
  'fuck', 'shit', 'bitch', 'damn', 'crap',
  'dick', 'cock', 'piss', 'slut', 'whore', 'bastard',
  'nigga', 'nigger', 'cunt', 'fag', 'retard',
  'puta', 'nigg3r', 'n1gger', 'nigg@', 'nigg4',
  'biatch', 'biotch', 'chingchong', 'cracker', 'negro',
  'tite', 'titi', 'pussy', 'faggot',
];

function hasProfanity(name: string): boolean {
  const lower = name.toLowerCase();
  return BLOCKLIST.some(word => lower.includes(word));
}

interface ResultScreenProps {
  streak: number;
  totalAnswered: number;
  onSubmit: (name: string) => void;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  streak,
  totalAnswered,
  onSubmit,
  onPlayAgain,
}: ResultScreenProps) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 1) return;
    if (trimmed.length > 12) { setError('Name must be 12 characters or less'); return; }
    if (hasProfanity(trimmed)) { setError('Name contains inappropriate language'); return; }
    setError('');
    setSubmitted(true);
    onSubmit(trimmed);
  };

  const streakEmoji =
    streak >= 15 ? '👑' : streak >= 10 ? '🏀' : streak >= 5 ? '🔥' : '💪';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center animate-slide-up">
        <div className="text-6xl mb-4">{streakEmoji}</div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-2">
          Streak: <span className="text-sixers-red">{streak}</span>
        </h2>
        <p className="text-sixers-silver text-lg mb-8">
          You got {totalAnswered - 1} right before getting knocked out!
        </p>

        {!submitted ? (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              maxLength={12}
              className="bg-white/10 border border-white/20 text-white text-center text-xl px-6 py-3 rounded-xl w-full max-w-xs focus:outline-none focus:border-sixers-red placeholder:text-white/30"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={name.trim().length < 1}
              className="mt-4 bg-sixers-red hover:bg-red-600 disabled:bg-white/20 disabled:text-white/40 text-white font-bold text-lg px-10 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Submit Score
            </button>
          </div>
        ) : (
          <p className="text-green-400 mb-8">Score submitted! 🏀</p>
        )}

        <div>
          <button
            onClick={onPlayAgain}
            className="text-sixers-blue hover:text-blue-400 font-bold text-lg underline transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
