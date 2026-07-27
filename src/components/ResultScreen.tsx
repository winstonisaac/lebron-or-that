import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

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

interface LBEntry { player_name: string; streak: number; }

interface ResultScreenProps {
  streak: number;
  totalAnswered: number;
  onSubmit: (name: string) => void;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
  onTitleScreen: () => void;
}

export default function ResultScreen({
  streak,
  totalAnswered,
  onSubmit,
  onPlayAgain,
  onLeaderboard,
  onTitleScreen,
}: ResultScreenProps) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [topScores, setTopScores] = useState<LBEntry[]>([]);
  const [userRank, setUserRank] = useState(0);
  const [loadingLB, setLoadingLB] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(async () => {
      setLoadingLB(true);
      const { data: top } = await supabase
        .from('leaderboard')
        .select('player_name, streak')
        .order('streak', { ascending: false })
        .limit(20);
      if (top) setTopScores(top as LBEntry[]);
      const { count } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .gte('streak', streak);
      if (count !== null) setUserRank(count);
      setLoadingLB(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [submitted, streak]);

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

        {streak === 0 ? (
          <div className="mb-8">
            <p className="text-sixers-silver text-lg">You didn't even get one right!</p>
            <p className="text-sixers-silver/60 text-sm mt-2">Fun fact: LeBron James never scored 0 points in his NBA career.</p>
          </div>
        ) : !submitted ? (
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
            <p className="text-sixers-silver/50 text-xs mt-1">12 characters max</p>
            <button
              onClick={handleSubmit}
              disabled={name.trim().length < 1}
              className="mt-4 bg-sixers-red hover:bg-red-600 disabled:bg-white/20 disabled:text-white/40 text-white font-bold text-lg px-10 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Submit Score
            </button>
          </div>
        ) : (
          <div className="mb-8">
            {loadingLB ? (
              <p className="text-sixers-silver/60 text-sm">Loading leaderboard...</p>
            ) : (
              <>
                {userRank <= 20 && (
                  <p className="text-green-400 font-bold text-lg mb-3 animate-slide-up">✨ You're Top {userRank}!</p>
                )}
                <div className="space-y-1.5 text-left">
                  {topScores.map((entry, i) => {
                    const isYou = entry.player_name === name.trim() && entry.streak === streak;
                    return (
                      <div
                        key={i}
                        className={`flex justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          isYou
                            ? 'bg-sixers-blue/20 border border-sixers-blue/40'
                            : 'bg-white/5'
                        }`}
                      >
                        <span className="text-white/80">
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`} {entry.player_name}
                        </span>
                        <span className="text-sixers-red font-bold">{entry.streak}</span>
                      </div>
                    );
                  })}
                </div>
                {userRank > 20 && (
                  <p className="mt-3 text-sixers-silver/80 text-sm font-medium">
                    #{userRank}: {name.trim()} ({streak})
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="bg-sixers-red hover:bg-red-600 text-white font-bold text-lg px-10 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            🔁 Play Again
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onLeaderboard}
              className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={onTitleScreen}
              className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              🏠 Title Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
