import type { ScopaState } from './types';

export function createScopaState(): ScopaState {
  return { turn: 0, finished: false };
}

export function stepScopa(state: ScopaState): ScopaState {
  return { ...state, turn: state.turn + 1 };
}
