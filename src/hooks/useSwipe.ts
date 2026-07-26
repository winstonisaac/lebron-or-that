import { useRef } from 'react';

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void): SwipeHandlers {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const minSwipe = 50;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    }
    touchStart.current = null;
  };

  return { onTouchStart, onTouchEnd };
}
