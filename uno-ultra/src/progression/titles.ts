export interface TitleUnlock {
  id: string;
  winsRequired: number;
}

export function unlockedTitles(totalWins: number, titles: TitleUnlock[]): string[] {
  return titles.filter((t) => totalWins >= t.winsRequired).map((t) => t.id);
}
