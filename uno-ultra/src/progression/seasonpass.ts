export interface SeasonTier {
  level: number;
  reward: string;
}

export function unlockableTiers(playerLevel: number, tiers: SeasonTier[]): SeasonTier[] {
  return tiers.filter((t) => t.level <= playerLevel);
}
