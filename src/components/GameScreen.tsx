import { useState, useEffect, useCallback } from 'react';
import type { Question } from '../App';
import { CATEGORY_EMOJI, CATEGORY_LABELS, type Category } from '../utils/categories';
import { useSwipe } from '../hooks/useSwipe';
import Timer from './Timer';
import { playCorrect, playWrong, playTimeout } from '../utils/sounds';

interface GameScreenProps {
  question: Question;
  questionIndex: number;
  totalAnswered: number;
  streak: number;
  onAnswer: (correct: boolean) => void;
}

const TIMER_SECONDS = 3;

export default function GameScreen({
  question,
  questionIndex,
  streak,
  onAnswer,
}: GameScreenProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAnswer = useCallback(
    (playerSaysOlder: boolean) => {
      if (answered) return;
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
      playTimeout();
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
    streak >= 15
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-sixers-silver/60 text-sm">#{questionIndex + 1}</span>
          <span className="text-sixers-silver/60 text-sm">
            Streak: <span className="text-white font-bold">{streak}</span>
          </span>
        </div>

        {streakLabel && (
          <div className="text-center text-lg font-bold text-sixers-red mb-3 animate-pulse">
            {streakLabel}
          </div>
        )}

        <Timer timeLeft={timeLeft} maxTime={TIMER_SECONDS} />

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-6 text-center">
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
