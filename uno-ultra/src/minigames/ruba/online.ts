import type { RubaState } from './types';

export function serializeRuba(state: RubaState): string {
  return JSON.stringify(state);
}
