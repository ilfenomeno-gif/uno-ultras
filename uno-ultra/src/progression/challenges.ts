export interface Challenge {
  id: string;
  target: number;
  progress: number;
}

export function isCompleted(challenge: Challenge): boolean {
  return challenge.progress >= challenge.target;
}
