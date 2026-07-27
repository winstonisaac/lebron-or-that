import { useState, useEffect, useCallback } from 'react';
import type { Question } from '../App';
import { CATEGORY_EMOJI, CATEGORY_LABELS, type Category } from '../utils/categories';
import { useSwipe } from '../hooks/useSwipe';
import { playCorrect, playWrong, playTick, playBuzzer } from '../utils/sounds';

interface GameScreenProps {
  question: Question;
  totalAnswered: number;
  streak: number;
  onAnswer: (correct: boolean) => void;
}

const TIMER_SECONDS = 5;

export default function GameScreen({
  question,
  streak,
  onAnswer,
}: GameScreenProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);

  const handleAnswer = useCallback(
    (playerSaysOlder: boolean) => {
      if (answered) return;
      setSwipeDir(playerSaysOlder ? 'left' : 'right');
      setAnswered(true);
      const isOlderThanLeBron = question.year < 2003;
      const correct = playerSaysOlder === isOlderThanLeBron;
      if (correct) {
        playCorrect();
        setFeedback('correct');
      } else {
        playWrong();
        setFeedback('wrong');
        setShake(true);
      }
      setTimeout(() => {
        onAnswer(correct);
      }, 800);
    },
    [answered, question.year, onAnswer]
  );

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      playBuzzer();
      setFeedback('timeout');
      setTimeout(() => {
        onAnswer(false);
      }, 800);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, onAnswer]);

  useEffect(() => {
    if (answered || timeLeft <= 0) return;
    playTick();
  }, [timeLeft, answered]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleAnswer(true);
      if (e.key === 'ArrowRight') handleAnswer(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleAnswer]);

  const swipeHandlers = useSwipe(
    () => handleAnswer(true),
    () => handleAnswer(false)
  );

  const streakLabel =
    streak >= 30
      ? '🐐 The GOAT!'
      : streak >= 15
        ? '👑 The King!'
        : streak >= 10
          ? '🏀 LeBron Mode!'
          : streak >= 5
            ? '🔥 On Fire!'
            : '';

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 ${shake ? 'animate-shake' : ''}`}
      {...swipeHandlers}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col items-center">
            <span
              className="text-3xl font-bold tracking-[0.2em]"
              style={{
                fontFamily: "'LED Font', monospace",
                color: '#ED174C',
              }}
            >
              {String(streak).padStart(2, '0')}
            </span>
            <span className="text-sixers-silver/50 text-xs uppercase tracking-wider mt-0.5">score</span>
          </div>
          <div className="flex flex-col items-center">
            <span
              className={`text-3xl font-bold tracking-[0.2em] ${timeLeft <= 2 ? 'animate-pulse' : ''}`}
              style={{
                fontFamily: "'LED Font', monospace",
                color: timeLeft <= 2 ? '#FF4444' : '#FF6600',
                textShadow: timeLeft <= 2
                  ? '0 0 12px rgba(255,68,68,0.8), 0 0 30px rgba(255,68,68,0.4)'
                  : '0 0 8px rgba(255,102,0,0.6), 0 0 20px rgba(255,102,0,0.3)',
              }}
            >
              {String(timeLeft).padStart(2, '0')}
            </span>
            <span className="text-sixers-silver/50 text-xs uppercase tracking-wider mt-0.5">timer</span>
          </div>
        </div>

        {streakLabel && (
          <div className="text-center text-lg font-bold text-sixers-red mb-3 animate-pulse">
            {streakLabel}
          </div>
        )}

        <div className={`bg-white/5 border border-white/10 rounded-2xl p-8 mt-6 text-center transition-all duration-500 ${
          swipeDir === 'left'
            ? '-translate-x-[200%] -rotate-[12deg] opacity-0'
            : swipeDir === 'right'
            ? 'translate-x-[200%] rotate-[12deg] opacity-0'
            : ''
        }`}>
          <div className="text-4xl mb-3">
            {CATEGORY_EMOJI[question.category as Category]}
          </div>
          <div className="text-xs text-sixers-silver/50 uppercase tracking-wider mb-2">
            {CATEGORY_LABELS[question.category as Category]}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-slide-up">
            {question.name}
          </h2>
        </div>

        <div className="min-h-[108px] flex flex-col justify-center mt-6">
          {feedback && (
            <div className="text-center animate-slide-up">
              {feedback === 'correct' && (
                <div className="text-2xl font-bold text-green-400">✅ Correct! That was in {question.year}!</div>
              )}
              {feedback === 'wrong' && (
                <div className="text-2xl font-bold text-sixers-red">
                  ❌ Wrong! That was in {question.year}!
                </div>
              )}
              {feedback === 'timeout' && (
                <div className="text-2xl font-bold text-yellow-400">
                  ⏰ Time's up! That was in {question.year}!
                </div>
              )}
            </div>
          )}

          {!answered && (
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 bg-sixers-blue hover:bg-white hover:text-sixers-blue text-white font-bold text-xl py-5 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                ← Older
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 bg-sixers-red hover:bg-white hover:text-sixers-red text-white font-bold text-xl py-5 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                Younger →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
