import type { Scala40State } from './types';

export function createScala40State(): Scala40State {
  return { turn: 0, finished: false };
}

export function stepScala40(state: Scala40State): Scala40State {
  return { ...state, turn: state.turn + 1 };
}
