import type { BurracoState } from './types';

export function createBurracoState(): BurracoState {
  return { turn: 0, finished: false };
}

export function stepBurraco(state: BurracoState): BurracoState {
  return { ...state, turn: state.turn + 1 };
}
