import type { BurracoState } from './types';

export function chooseBurracoMove(state: BurracoState): string {
  return state.finished ? 'noop' : 'default';
}
