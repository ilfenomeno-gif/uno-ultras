export interface SessionData {
  username: string;
  token: string;
}

const KEY = 'uno-ultra-session-v2';

export function saveSession(data: SessionData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadSession(): SessionData | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  return JSON.parse(raw) as SessionData;
}
