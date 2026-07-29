import { useState, useEffect, useRef } from 'react';
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
  const [lebronImg, setLebronImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/lebron-main.png';
    img.onload = () => setLebronImg(img);
  }, []);

  async function generateScoreCard(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const W = 600, H = 600;

    await document.fonts.load('bold 80px "LED Font"');

    const style = getComputedStyle(document.documentElement);
    const bg1 = style.getPropertyValue('--color-sixers-navy').trim() || '#002B5C';
    const accent = style.getPropertyValue('--color-title-accent').trim() || '#ED174C';

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `#${bg1.replace('#','')}`);
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    drawRoundRect(ctx, 10, 10, W-20, H-20, 10);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = `#${accent.replace('#','')}`;
    ctx.fillText('LeBron', W/2 - 80, 48);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('or', W/2, 48);
    ctx.fillStyle = `#${accent.replace('#','')}`;
    ctx.fillText('That', W/2 + 85, 48);

    ctx.font = '28px sans-serif';
    ctx.fillText('🏀', W/2, 92);

    if (lebronImg) {
      ctx.save();
      drawRoundRect(ctx, W/2-75, 120, 150, 150, 24);
      ctx.clip();
      ctx.drawImage(lebronImg, W/2-75, 120, 150, 150);
      ctx.restore();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    drawRoundRect(ctx, W/2-75, 120, 150, 150, 24);
    ctx.stroke();

    ctx.shadowColor = `#${accent.replace('#','')}99`;
    ctx.shadowBlur = 25;
    ctx.fillStyle = `#${accent.replace('#','')}`;
    ctx.font = 'bold 80px "LED Font", monospace';
    ctx.fillText(String(streak).padStart(2, '0'), W/2, 385);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '13px sans-serif';
    ctx.fillText('SCORE', W/2, 430);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(200, 470);
    ctx.lineTo(400, 470);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '700 17px sans-serif';
    ctx.fillText('Can you beat my score?', W/2, 510);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '13px sans-serif';
    ctx.fillText('lebron-or-that.vercel.app', W/2, 540);

    ctx.fillStyle = `#${accent.replace('#','')}40`;
    drawRoundRect(ctx, W/2-60, H-8, 120, 3, 4);
    ctx.fill();
  }

  function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    await generateScoreCard(canvas);
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!), 'image/png'));
    if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'score.png', { type: 'image/png' })] })) {
      navigator.share({
        title: 'LeBron or That Score',
        text: `I scored ${streak} on LeBron or That! 🏀`,
        files: [new File([blob], 'score.png', { type: 'image/png' })],
      }).catch(() => {});
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `lebron-or-that-${streak}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };

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
    streak === 0 ? '😂'
    : streak <= 5 ? '🤷'
    : streak <= 9 ? '💪'
    : streak <= 14 ? '🔥'
    : streak <= 29 ? '👑'
    : '🐐';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-16">
      <div className="text-center animate-slide-up">
        <div className="text-6xl mb-4">{streakEmoji}</div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-2">
          Score: <span className="text-sixers-red">{streak}</span>
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
              className="mt-4 bg-sixers-red hover:bg-white hover:text-sixers-red disabled:bg-white/20 disabled:text-white/40 text-white font-bold text-lg px-10 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Submit Score
            </button>
            <button
              onClick={handleShare}
              className="mt-2 text-sixers-silver/50 hover:text-sixers-silver text-xs underline transition-colors"
            >
              Nah, just share instead
            </button>
          </div>
        ) : (
          <div className="mb-8">
            {loadingLB ? (
              <p className="text-sixers-silver/60 text-sm">Loading leaderboard...</p>
            ) : (
              <>
                {userRank > 0 && userRank <= 20 && (
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
                            : i === 0
                              ? 'bg-amber-400/20 border border-amber-400/40'
                              : i === 1
                                ? 'bg-gray-300/20 border border-gray-300/30'
                                : i === 2
                                  ? 'bg-amber-700/20 border border-amber-700/30'
                                  : 'bg-white/5'
                        }`}
                      >
                        <span className="text-white/80">
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`} {entry.player_name}
                        </span>
                        <span className="text-sixers-blue font-bold">{entry.streak}</span>
                      </div>
                    );
                  })}
                </div>
                {userRank > 20 && (
                  <div className="mt-4 flex justify-between items-center px-4 py-3 rounded-xl bg-sixers-blue/20 border border-sixers-blue/40 scale-105 shadow-lg">
                    <span className="text-white font-semibold text-base">#{userRank}: {name.trim()}</span>
                    <span className="text-sixers-blue font-bold text-lg">{streak}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="bg-sixers-red hover:bg-white hover:text-sixers-red text-white font-bold text-lg px-10 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            🔁 Play Again
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleShare}
              className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              📤 Share
            </button>
            {!submitted && (
              <button
                onClick={onLeaderboard}
                className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
              >
                🏆 Leaderboard
              </button>
            )}
            <button
              onClick={onTitleScreen}
              className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              🏠 Title Screen
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} width="600" height="600" style={{ display: 'none' }} />
      </div>
    </div>
  );
}
