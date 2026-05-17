const PROFILE_KEY = 'uno-ultra-profiles-v1';
const SESSION_KEY = 'uno-ultra-session-v1';

export function loadProfiles() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveProfiles(db) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(db));
}

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
