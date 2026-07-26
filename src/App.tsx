import { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';
import questionsData from './data/questions.json';
import { decodeYear } from './utils/decode';

export interface Question {
  id: number;
  name: string;
  category: string;
  year: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQuestions(): Question[] {
  const shuffled = shuffleArray(questionsData);
  return shuffled.map((q) => ({
    id: q.id,
    name: q.q,
    category: q.c,
    year: decodeYear(q.e, q.id, q.c),
  }));
}

type Screen = 'start' | 'game' | 'result' | 'leaderboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [questions, setQuestions] = useState<Question[]>(() => getQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const handlePlay = () => {
    setQuestions(getQuestions());
    setCurrentIndex(0);
    setStreak(0);
    setTotalAnswered(0);
    setScreen('game');
  };

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setTotalAnswered((t) => t + 1);
      if (correct) {
        setStreak((s) => s + 1);
        setCurrentIndex((i) => i + 1);
      } else {
        setScreen('result');
      }
    },
    []
  );

  const handleSubmitScore = async (name: string) => {
    try {
      await fetch('/api/submit-streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: name,
          streak,
          totalQuestions: totalAnswered,
        }),
      });
    } catch {
      console.error('Failed to submit score');
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-sixers-navy">
      {screen === 'start' && (
        <StartScreen onPlay={handlePlay} onLeaderboard={() => setScreen('leaderboard')} />
      )}

      {screen === 'game' && currentQuestion && (
        <GameScreen
          question={currentQuestion}
          questionIndex={currentIndex}
          totalAnswered={totalAnswered}
          streak={streak}
          onAnswer={handleAnswer}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          streak={streak}
          totalAnswered={totalAnswered}
          onSubmit={handleSubmitScore}
          onPlayAgain={handlePlay}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard onBack={() => setScreen('start')} />
      )}
    </div>
  );
}
