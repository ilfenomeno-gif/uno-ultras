import type { ScopaState } from './types';

export function chooseScopaMove(state: ScopaState): string {
  return state.finished ? 'noop' : 'default';
}
