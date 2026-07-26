CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  streak INT NOT NULL,
  total_questions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_streak ON leaderboard (streak DESC);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON leaderboard
  FOR INSERT
  WITH CHECK (true);
