import type { Card, CardColor } from './uno';

export type { Card, CardColor };

export type ScreenId = 'home' | 'play' | 'shop' | 'settings' | 'profile' | 'leaderboard';
export type PlayersMode = 2 | 3 | 4;
export type GameId = 'uno' | 'ruba' | 'scopa' | 'poker' | 'burraco' | 'blackjack' | 'millemiglia' | 'scala40';
export type GameMode = 'single' | 'local';

export type DemoProfile = {
  version: 1;
  name: string;
  wins: number;
  losses: number;
  games: number;
  mmr: number;
  credits: number;
  titles: string[];
  activeTitle: string;
  activeTitleIndex: number;
};
