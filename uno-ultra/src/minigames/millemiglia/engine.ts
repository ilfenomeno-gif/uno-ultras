import type { MillemigliaState } from './types';

export function createMillemigliaState(): MillemigliaState {
  return { turn: 0, finished: false };
}

export function stepMillemiglia(state: MillemigliaState): MillemigliaState {
  return { ...state, turn: state.turn + 1 };
}
