interface TimerProps {
  timeLeft: number;
}

export default function Timer({ timeLeft }: TimerProps) {
  const urgent = timeLeft <= 2;

  return (
    <div className={`rounded-lg px-4 py-2 text-center border ${urgent ? 'bg-red-900/30 border-red-500/40' : 'bg-black/40 border-white/10'}`}>
      <span
        className="text-5xl font-bold tracking-[0.2em]"
        style={{
          fontFamily: "'DSEG7 Classic', monospace",
          color: urgent ? '#FF4444' : '#FF6600',
          textShadow: urgent
            ? '0 0 12px rgba(255,68,68,0.8), 0 0 30px rgba(255,68,68,0.4)'
            : '0 0 8px rgba(255,102,0,0.6), 0 0 20px rgba(255,102,0,0.3)',
        }}
      >
        {String(timeLeft).padStart(2, '0')}
      </span>
    </div>
  );
}
