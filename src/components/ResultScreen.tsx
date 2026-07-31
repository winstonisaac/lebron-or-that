import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';

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

interface LBEntry { id: number; player_name: string; streak: number; }

interface ResultScreenProps {
  streak: number;
  totalAnswered: number;
  totalQuestions: number;
  newBest: boolean;
  onSubmit: (name: string) => Promise<number | null>;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
  onTitleScreen: () => void;
}

export default function ResultScreen({
  streak,
  totalAnswered,
  totalQuestions,
  newBest,
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
  const [myEntryId, setMyEntryId] = useState<number | null>(null);
  const [titleImg, setTitleImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const theme = document.documentElement.dataset.theme || 'sixers';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `/lebron-title-${theme}.png`;
    img.onload = () => setTitleImg(img);
  }, []);

  async function generateScoreCard(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const W = 600, H = 600;

    const style = getComputedStyle(document.documentElement);
    const bg1 = style.getPropertyValue('--color-sixers-navy').trim() || '#002B5C';
    const accent = style.getPropertyValue('--color-title-accent').trim() || '#ED174C';
    const accent2 = style.getPropertyValue('--color-sixers-blue').trim() || '#006BB6';

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `#${bg1.replace('#','')}`);
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (titleImg) {
      ctx.save();
      const tw = 360, th = Math.round(360 * 347 / 640);
      ctx.beginPath();
      drawRoundRect(ctx, (W-tw)/2, 15, tw, th, 16);
      ctx.clip();
      ctx.drawImage(titleImg, (W-tw)/2, 15, tw, th);
      ctx.restore();
    }

    // Score container
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    drawRoundRect(ctx, W/2-55, 245, 110, 110, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    drawRoundRect(ctx, W/2-55, 245, 110, 110, 14);
    ctx.stroke();

    await document.fonts.load('bold 50px "LED Font"');

    ctx.shadowColor = `#${accent.replace('#','')}99`;
    ctx.shadowBlur = 20;
    ctx.fillStyle = `#${accent.replace('#','')}`;
    ctx.font = 'bold 50px "LED Font", monospace';
    ctx.fillText(String(streak).padStart(2, '0'), W/2, 280);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '12px sans-serif';
    ctx.fillText('SCORE', W/2, 337);

    // Bottom bar
    ctx.fillStyle = `#${accent2.replace('#','')}`;
    ctx.globalAlpha = 0.15;
    drawRoundRect(ctx, 15, 490, W-30, 100, 14);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = `#${accent2.replace('#','')}40`;
    ctx.lineWidth = 1;
    drawRoundRect(ctx, 15, 490, W-30, 100, 14);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '700 16px sans-serif';
    ctx.fillText('Can you beat my score?', W/2, 530);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '13px sans-serif';
    ctx.fillText('lebron-or-that.vercel.app', W/2, 560);
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
        .select('id, player_name, streak')
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

  const handleSubmit = async () => {
    if (submitted) return;
    const trimmed = name.trim();
    if (trimmed.length < 1) return;
    if (trimmed.length > 12) { setError('Name must be 12 characters or less'); return; }
    if (hasProfanity(trimmed)) { setError('Name contains inappropriate language'); return; }
    setError('');
    setSubmitted(true);
    const id = await onSubmit(trimmed);
    setMyEntryId(id);
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
          {totalAnswered >= totalQuestions
            ? 'You got them ALL right! Perfect game! 🏆'
            : `You got ${totalAnswered - 1} right before getting knocked out!`}
        </p>

        {newBest && (
          <div className="text-lg font-bold text-amber-400 mb-4 animate-slide-up">
            🎉 NEW BEST!
          </div>
        )}

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
                    const isYou = myEntryId !== null && entry.id === myEntryId;
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl transition-all ${
                          isYou
                            ? 'py-4 px-5 text-white'
                            : i === 0
                              ? 'py-4 px-5 text-yellow-900'
                              : i === 1
                                ? 'py-4 px-5 text-gray-800'
                                : i === 2
                                  ? 'py-4 px-5 text-yellow-900'
                                  : 'py-3 px-4 bg-white/5 border border-white/5 text-white'
                        }`}
                        style={
                          isYou
                            ? { background: 'linear-gradient(to right, var(--color-sixers-blue)22, var(--color-sixers-blue)55, var(--color-sixers-blue)22)', border: '2px solid var(--color-sixers-blue)88' }
                            : i === 0
                              ? { background: 'linear-gradient(to right, #B45309, #F59E0B, #B45309)' }
                              : i === 1
                                ? { background: 'linear-gradient(to right, #6B7280, #E5E7EB, #6B7280)' }
                                : i === 2
                                  ? { background: 'linear-gradient(to right, #78350F, #D97706, #78350F)' }
                                  : {}
                        }
                      >
                        <span className={isYou ? 'text-white font-semibold' : 'text-white/80'}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`} {entry.player_name}
                        </span>
                        <span className="text-sixers-blue font-bold">{entry.streak}</span>
                      </div>
                    );
                  })}
                </div>
                {userRank > 20 && (
                  <div className="mt-4 flex justify-between items-center px-5 py-4 rounded-xl text-white scale-105 shadow-lg" style={{ background: 'linear-gradient(to right, var(--color-sixers-blue)22, var(--color-sixers-blue)55, var(--color-sixers-blue)22)', border: '2px solid var(--color-sixers-blue)88' }}>
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
            🔁
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleShare}
              className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              📤
            </button>
            {!submitted && (
              <button
                onClick={onLeaderboard}
                className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
              >
                🏆
              </button>
            )}
            <button
              onClick={onTitleScreen}
              className="flex-1 text-sixers-silver hover:text-white text-sm py-2 px-6 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              🏠
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} width="600" height="600" style={{ display: 'none' }} />
      </div>
    </div>
  );
}
