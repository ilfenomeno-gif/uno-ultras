export interface Profile {
  username: string;
  mmr: number;
  xp: number;
}

export function createProfile(username: string): Profile {
  return { username, mmr: 200, xp: 0 };
}
