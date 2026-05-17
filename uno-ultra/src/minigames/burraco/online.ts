import type { BurracoState } from './types';

export function serializeBurraco(state: BurracoState): string {
  return JSON.stringify(state);
}
