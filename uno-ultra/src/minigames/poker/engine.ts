import type { PokerState } from './types';

export function createPokerState(): PokerState {
  return { turn: 0, finished: false };
}

export function stepPoker(state: PokerState): PokerState {
  return { ...state, turn: state.turn + 1 };
}
