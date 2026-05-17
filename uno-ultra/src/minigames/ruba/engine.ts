import type { RubaState } from './types';

export function createRubaState(): RubaState {
  return { turn: 0, finished: false };
}

export function stepRuba(state: RubaState): RubaState {
  return { ...state, turn: state.turn + 1 };
}
