import type { ScopaState } from './types';

export function renderScopa(state: ScopaState): string {
  return 'scopa turn: ' + String(state.turn);
}
