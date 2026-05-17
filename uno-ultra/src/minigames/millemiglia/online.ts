import type { MillemigliaState } from './types';

export function serializeMillemiglia(state: MillemigliaState): string {
  return JSON.stringify(state);
}
