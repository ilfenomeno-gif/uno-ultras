import type { RubaState } from './types';

export function renderRuba(state: RubaState): string {
  return 'ruba turn: ' + String(state.turn);
}
