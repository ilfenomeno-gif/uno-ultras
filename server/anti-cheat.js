export function validateIntent(intent) {
  if (!intent || typeof intent.action !== 'string' || intent.action.length === 0) {
    return { ok: false, reason: 'Intent non valido' };
  }

  // Placeholder for per-game validation (turn ownership, legal move checks, etc.).
  return { ok: true };
}
