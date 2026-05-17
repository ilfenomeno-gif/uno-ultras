import type { Scala40State } from './types';

export function renderScala40(state: Scala40State): string {
  return 'scala40 turn: ' + String(state.turn);
}
