import type { Scala40State } from './types';

export function serializeScala40(state: Scala40State): string {
  return JSON.stringify(state);
}
