import { describe, it, expect } from 'vitest';
import { MPMsg, FRMsg } from '@multiplayer/protocol.js';

describe('protocol', () => {
  it('MPMsg è frozen', () => expect(Object.isFrozen(MPMsg)).toBe(true));
  it('FRMsg è frozen', () => expect(Object.isFrozen(FRMsg)).toBe(true));
  it('HELLO presente',  () => expect(MPMsg.HELLO).toBe('hello'));
});
