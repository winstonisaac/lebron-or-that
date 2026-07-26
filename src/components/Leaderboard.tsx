import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

interface LeaderboardEntry {
  id: number;
  player_name: string;
  streak: number;
  created_at: string;
}

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .order('streak', { ascending: false })
        .limit(50);
      if (data) setEntries(data);
      setLoading(false);
    };
    fetchScores();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <h2 className="text-4xl font-extrabold text-center mb-8">
          🏆 Leaderboard
        </h2>

        {loading ? (
          <p className="text-center text-sixers-silver">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-sixers-silver/60">No scores yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                  i === 0
                    ? 'bg-sixers-red/20 border border-sixers-red/40'
                    : i === 1
                      ? 'bg-sixers-blue/10 border border-white/10'
                      : i === 2
                        ? 'bg-sixers-blue/5 border border-white/5'
                        : 'bg-white/5 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-sixers-silver/60 w-8">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <span className="text-white font-medium">{entry.player_name}</span>
                </div>
                <span className="text-sixers-red font-bold text-lg">
                  {entry.streak}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={onBack}
            className="text-sixers-blue hover:text-blue-400 font-bold text-lg underline transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
