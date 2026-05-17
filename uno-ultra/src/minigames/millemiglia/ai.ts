import type { MillemigliaState } from './types';

export function chooseMillemigliaMove(state: MillemigliaState): string {
  return state.finished ? 'noop' : 'default';
}
