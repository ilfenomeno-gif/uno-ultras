import type { PokerState } from './types';

export function serializePoker(state: PokerState): string {
  return JSON.stringify(state);
}
