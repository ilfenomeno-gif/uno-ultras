import type { BlackjackState } from './types';

export function serializeBlackjack(state: BlackjackState): string {
  return JSON.stringify(state);
}
