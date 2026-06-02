export interface PlayerIntent {
  action: string;
  payload?: Record<string, unknown>;
}

export function validateIntent(intent: PlayerIntent): { ok: true } | { ok: false; reason: string } {
  if (!intent || typeof intent.action !== 'string' || intent.action.length === 0) {
    return { ok: false, reason: 'Intent non valido' };
  }

  // Placeholder for per-game hard validation (turn ownership, card ownership, legal move checks).
  return { ok: true };
}
