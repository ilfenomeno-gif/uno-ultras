import type { BlackjackState } from './types';

export function renderBlackjack(state: BlackjackState): string {
  return 'blackjack turn: ' + String(state.turn);
}
