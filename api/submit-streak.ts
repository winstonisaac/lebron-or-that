import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LE_BRON_YEAR = 2003;
const MIN_STREAK_TIME = 2000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerName, streak, totalQuestions, timeMs } = req.body;

  if (!playerName || typeof playerName !== 'string' || playerName.length > 20) {
    return res.status(400).json({ error: 'Invalid player name' });
  }

  if (typeof streak !== 'number' || streak < 0 || streak > 100) {
    return res.status(400).json({ error: 'Invalid streak' });
  }

  if (typeof totalQuestions !== 'number' || totalQuestions < 1) {
    return res.status(400).json({ error: 'Invalid total questions' });
  }

  if (typeof timeMs === 'number' && streak > 0) {
    const minTime = streak * MIN_STREAK_TIME;
    if (timeMs < minTime) {
      return res.status(400).json({ error: 'Answers too fast — suspicious activity' });
    }
  }

  if (streak !== totalQuestions - 1) {
    return res.status(400).json({ error: 'Invalid score: streak and total questions mismatch' });
  }

  const { error } = await supabase.from('leaderboard').insert({
    player_name: playerName.trim(),
    streak,
    total_questions: totalQuestions,
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to save score' });
  }

  return res.status(200).json({ ok: true });
}
