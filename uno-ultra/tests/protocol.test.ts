import { describe, expect, it } from 'vitest';
import { makeEnvelope, validateSequence } from '../src/multiplayer/protocol';

describe('protocol', () => {
  it('builds envelope with seq', () => {
    const env = makeEnvelope(4, 'tk', 'ping', { ok: true });
    expect(env.seq).toBe(4);
    expect(env.token).toBe('tk');
  });

  it('validates sequence', () => {
    expect(validateSequence(7, 7)).toBe(true);
    expect(validateSequence(7, 8)).toBe(false);
  });
});
