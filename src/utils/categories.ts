export type Category = 'tech' | 'movies' | 'games' | 'events' | 'culture';

export const CATEGORY_EMOJI: Record<Category, string> = {
  tech: '💻',
  movies: '🎬',
  games: '🎮',
  events: '🌍',
  culture: '🎵',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  tech: 'Technology',
  movies: 'Movies',
  games: 'Games',
  events: 'Events',
  culture: 'Pop Culture',
};
