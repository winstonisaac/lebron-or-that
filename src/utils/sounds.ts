let audioCtx: AudioContext | null = null;
let _soundEnabled = true;
let _volume = 0.5;

function loadSoundPref() {
  try {
    const saved = localStorage.getItem('lebron-sound');
    if (saved !== null) _soundEnabled = saved === 'true';
    const vol = localStorage.getItem('lebron-volume');
    if (vol !== null) _volume = Math.max(0, Math.min(1, Number(vol)));
  } catch {}
}

loadSoundPref();

export function isSoundEnabled(): boolean {
  return _soundEnabled;
}

export function toggleSound(): boolean {
  _soundEnabled = !_soundEnabled;
  try {
    localStorage.setItem('lebron-sound', String(_soundEnabled));
  } catch {}
  return _soundEnabled;
}

export function getVolume(): number {
  return _volume;
}

export function setVolume(v: number): void {
  _volume = Math.max(0, Math.min(1, v));
  try {
    localStorage.setItem('lebron-volume', String(_volume));
  } catch {}
}

function getCtx(): AudioContext | null {
  if (!_soundEnabled) return null;
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCorrect() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, ctx.currentTime);
  osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3 * _volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

export function playWrong() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.3 * _volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

export function playTick() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  gain.gain.setValueAtTime(0.2 * _volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

export function playBuzzer() {
  if (!_soundEnabled) return;
  const a = new Audio('/buzz.mp3');
  a.volume = 0.5 * _volume;
  a.play().catch(() => {});
}
