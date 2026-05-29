import { DEFAULTS } from "./constants.js";

export function createPlayer(name, isAI = false) {
  return {
    name,
    isAI,
    hand: [],
    score: 0,
  };
}

export function createGameState({ aiCount, diff, targetScore, playersConfig = null }) {
  const players = Array.isArray(playersConfig) && playersConfig.length > 0
    ? playersConfig.map((p) => createPlayer(p.name, p.isAI))
    : [createPlayer("Player", false)];

  if (!playersConfig) {
    for (let i = 1; i <= aiCount; i += 1) {
      players.push(createPlayer(`Bot ${i}`, true));
    }
  }

  return {
    players,
    round: 1,
    current: 0,
    direction: 1,
    pendingDraw: 0,
    skipNext: false,
    unoSaid: Array(players.length).fill(false),
    deck: [],
    discard: [],
    currentColor: null,
    targetScore,
    diff,
    started: false,
    ended: false,
    drawnThisTurn: false,
    settings: {
      startHand: DEFAULTS.startHand,
    },
  };
}
