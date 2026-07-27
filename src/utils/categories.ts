export type Category = 'tech' | 'movies' | 'games' | 'events' | 'culture' | 'tv' | 'music' | 'nba';

export const CATEGORY_EMOJI: Record<Category, string> = {
  tech: '💻',
  movies: '🎬',
  games: '🎮',
  events: '🌍',
  culture: '🎵',
  tv: '📺',
  music: '🎧',
  nba: '🏀',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  tech: 'Technology',
  movies: 'Movies',
  games: 'Games',
  events: 'Events',
  culture: 'Pop Culture',
  tv: 'TV',
  music: 'Music',
  nba: 'NBA',
};
