const SESSION_KEY = "uno-ultra-v2-session";
const SETTINGS_KEY = "uno-ultra-v2-settings";
const REPLAYS_KEY = "uno-ultra-v2-replays";

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : { username: "Player" };
  } catch {
    return { username: "Player" };
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session || {}));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      music: parsed.music ?? true,
      sfx: parsed.sfx ?? true,
      vfx: parsed.vfx ?? true,
      volume: Number(parsed.volume ?? 0.6),
      colorblind: parsed.colorblind ?? false,
      nvda: parsed.nvda ?? false,
    };
  } catch {
    return { music: true, sfx: true, vfx: true, volume: 0.6, colorblind: false, nvda: false };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings || {}));
}

export function loadReplays() {
  try {
    const raw = localStorage.getItem(REPLAYS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendReplay(entry) {
  const current = loadReplays();
  current.unshift({
    id: `rp-${Date.now()}`,
    ts: Date.now(),
    ...entry,
  });
  const trimmed = current.slice(0, 50);
  localStorage.setItem(REPLAYS_KEY, JSON.stringify(trimmed));
  return trimmed;
}
