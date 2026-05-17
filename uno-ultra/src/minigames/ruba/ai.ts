import type { RubaState } from './types';

export function chooseRubaMove(state: RubaState): string {
  return state.finished ? 'noop' : 'default';
}
