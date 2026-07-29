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
        .limit(20);
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
                className={`flex items-center justify-between rounded-xl ${
                  i === 0
                    ? 'py-4 px-5 text-yellow-900'
                    : i === 1
                      ? 'py-4 px-5 text-gray-800'
                      : i === 2
                        ? 'py-4 px-5 text-yellow-900'
                        : 'py-3 px-4 bg-white/5 border border-white/5 text-white'
                }`}
                style={
                  i === 0 ? { background: 'linear-gradient(135deg, #F59E0B, #D97706)' }
                  : i === 1 ? { background: 'linear-gradient(135deg, #E5E7EB, #9CA3AF)' }
                  : i === 2 ? { background: 'linear-gradient(135deg, #D97706, #92400E)' }
                  : {}
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-sixers-silver/60 w-8">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <span className="text-white font-medium">{entry.player_name}</span>
                </div>
                <span className="text-sixers-blue font-bold text-lg">
                  {entry.streak}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 mb-10">
          <button
            onClick={onBack}
            className="text-sixers-blue hover:text-blue-400 font-bold text-lg underline transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
