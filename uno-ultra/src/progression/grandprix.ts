export interface GrandPrixStanding {
  playerId: string;
  points: number;
}

export function sortStandings(rows: GrandPrixStanding[]): GrandPrixStanding[] {
  return [...rows].sort((a, b) => b.points - a.points);
}
