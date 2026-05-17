import type { PokerState } from './types';

export function renderPoker(state: PokerState): string {
  return 'poker turn: ' + String(state.turn);
}
