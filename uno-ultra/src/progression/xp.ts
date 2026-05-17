export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level));
}

export function addXp(currentXp: number, gain: number): number {
  return Math.max(0, currentXp + gain);
}
