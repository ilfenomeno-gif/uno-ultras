import type { PokerState } from './types';

export function choosePokerMove(state: PokerState): string {
  return state.finished ? 'noop' : 'default';
}
