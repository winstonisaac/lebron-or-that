import { useState, useCallback, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';
import TutorialModal from './components/TutorialModal';
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

const THEMES = ['sixers', 'cavaliers', 'lakers', 'heat'] as const;
type Theme = typeof THEMES[number];

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [prevScreen, setPrevScreen] = useState<Screen>('start');
  const [questions, setQuestions] = useState<Question[]>(() => getQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('lebron-theme') as Theme) || 'sixers'
  );
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('lebron-theme', theme);
  }, [theme]);

  const startGame = () => {
    setQuestions(getQuestions());
    setCurrentIndex(0);
    setStreak(0);
    setTotalAnswered(0);
    setScreen('game');
  };

  const handlePlay = () => {
    if (localStorage.getItem('lebron-tutorial-seen') === 'true') {
      startGame();
    } else {
      setShowTutorial(true);
    }
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
    <div className="min-h-screen bg-sixers-navy flex justify-center relative">
      <div className="w-full max-w-[700px]">
        {screen === 'start' && (
          <StartScreen
            onPlay={handlePlay}
            onLeaderboard={() => { setPrevScreen('start'); setScreen('leaderboard'); }}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}

        {screen === 'game' && currentQuestion && (
          <GameScreen
            key={currentQuestion.id}
            question={currentQuestion}
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
            onLeaderboard={() => { setPrevScreen('result'); setScreen('leaderboard'); }}
            onTitleScreen={() => setScreen('start')}
          />
        )}

        {screen === 'leaderboard' && (
          <Leaderboard onBack={() => setScreen(prevScreen)} />
        )}
      </div>

      {showTutorial && (
        <TutorialModal onStart={() => { setShowTutorial(false); startGame(); }} />
      )}

      <a
        href="https://winstonisaac.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-[18px] left-0 right-0 text-center text-xs text-sixers-silver/30 hover:text-sixers-silver/60 transition-colors"
      >
        vibe coded by Winston
      </a>
    </div>
  );
}
