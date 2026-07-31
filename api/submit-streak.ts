import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const BLOCKLIST = [
  'fuck', 'shit', 'bitch', 'damn', 'crap',
  'dick', 'cock', 'piss', 'slut', 'whore', 'bastard',
  'nigga', 'nigger', 'cunt', 'fag', 'retard',
  'puta', 'nigg3r', 'n1gger', 'nigg@', 'nigg4',
  'biatch', 'biotch', 'chingchong', 'cracker', 'negro',
  'tite', 'titi', 'pussy', 'faggot',
  'bading', 'bakla', 'bayot', 'duterte', 'du30', 'kupal', 'puke',
  'tangina', 'deputa', 'bobo', 'ulol', 'chink', 'wanker', 'wank',
];

function hasProfanity(name: string): boolean {
  const lower = name.toLowerCase();
  return BLOCKLIST.some(word => lower.includes(word));
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MIN_STREAK_TIME = 2000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerName, streak, totalQuestions, timeMs } = req.body;

  if (typeof playerName !== 'string' || playerName.trim().length === 0 || playerName.length > 12) {
    return res.status(400).json({ error: 'Invalid player name' });
  }

  if (hasProfanity(playerName)) {
    return res.status(400).json({ error: 'Name contains inappropriate language' });
  }

  if (typeof streak !== 'number' || streak < 0 || streak > 100) {
    return res.status(400).json({ error: 'Invalid streak' });
  }

  if (typeof totalQuestions !== 'number' || totalQuestions < 1) {
    return res.status(400).json({ error: 'Invalid total questions' });
  }

  if (streak > 0 && typeof timeMs !== 'number') {
    return res.status(400).json({ error: 'Missing timeMs' });
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
