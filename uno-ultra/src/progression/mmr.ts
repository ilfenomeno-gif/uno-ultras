export function calcMmrDelta(playerMmr: number, opponentMmr: number, won: boolean): number {
  const expected = 1 / (1 + 10 ** ((opponentMmr - playerMmr) / 400));
  const score = won ? 1 : 0;
  const k = 24;
  return Math.round(k * (score - expected));
}
