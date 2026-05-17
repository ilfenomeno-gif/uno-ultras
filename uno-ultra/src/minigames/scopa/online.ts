import type { ScopaState } from './types';

export function serializeScopa(state: ScopaState): string {
  return JSON.stringify(state);
}
