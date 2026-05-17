import type { Card } from './card';
import type { Player } from './player';

export interface GameState {
  turn: number;
  direction: 1 | -1;
  currentPlayer: number;
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  winnerId: string | null;
}

export interface PlayCardAction {
  type: 'play-card';
  playerId: string;
  cardId: string;
}

export interface DrawCardAction {
  type: 'draw-card';
  playerId: string;
}

export type GameAction = PlayCardAction | DrawCardAction;
