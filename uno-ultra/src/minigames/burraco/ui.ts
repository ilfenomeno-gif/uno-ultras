import type { BurracoState } from './types';

export function renderBurraco(state: BurracoState): string {
  return 'burraco turn: ' + String(state.turn);
}
