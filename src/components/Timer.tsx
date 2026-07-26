interface TimerProps {
  timeLeft: number;
  maxTime: number;
}

export default function Timer({ timeLeft, maxTime }: TimerProps) {
  const pct = (timeLeft / maxTime) * 100;
  const color = pct > 50 ? '#006BB6' : pct > 25 ? '#ED174C' : '#FF4444';

  return (
    <div className="w-full h-3 bg-sixers-navy/50 rounded-full overflow-hidden border border-white/10">
      <div
        className="h-full rounded-full transition-all duration-100 ease-linear"
        style={{
          width: `${pct}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
