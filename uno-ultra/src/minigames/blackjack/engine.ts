import type { BlackjackState } from './types';

export function createBlackjackState(): BlackjackState {
  return { turn: 0, finished: false };
}

export function stepBlackjack(state: BlackjackState): BlackjackState {
  return { ...state, turn: state.turn + 1 };
}
