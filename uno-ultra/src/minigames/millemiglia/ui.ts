import type { MillemigliaState } from './types';

export function renderMillemiglia(state: MillemigliaState): string {
  return 'millemiglia turn: ' + String(state.turn);
}
