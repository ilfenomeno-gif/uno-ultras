import type { Scala40State } from './types';

export function chooseScala40Move(state: Scala40State): string {
  return state.finished ? 'noop' : 'default';
}
