import type { BlackjackState } from './types';

export function chooseBlackjackMove(state: BlackjackState): string {
  return state.finished ? 'noop' : 'default';
}
