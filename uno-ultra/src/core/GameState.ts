import type { GameState, Difficulty } from '@types/gamestate.js';
import type { Player } from '@types/player.js';

export interface CreateGameOpts {
  diff?:    Difficulty;
  isMP?:    boolean;
  is2v2?:   boolean;
  is3p?:    boolean;
  isTourney?:boolean;
  numAI?:   number;
}

export function createGameState(players: Player[], opts: CreateGameOpts = {}): GameState {
  return {
    deck:        [],
    discard:     [],
    players,
    current:     0,
    direction:   1,
    pendingDraw: 0,
    unoSaid:     players.map(() => false),
    round:       1,
    roundOver:   false,
    gameOver:    false,
    totalScores: players.map(() => 0),
    winner:      null,
    isMP:        opts.isMP      ?? false,
    is2v2:       opts.is2v2     ?? false,
    is3p:        opts.is3p      ?? false,
    isTourney:   opts.isTourney ?? false,
    numAI:       opts.numAI     ?? 0,
    diff:        opts.diff      ?? 'normal',
  };
}

export function cloneState(s: GameState): GameState {
  return JSON.parse(JSON.stringify(s)) as GameState;
}
