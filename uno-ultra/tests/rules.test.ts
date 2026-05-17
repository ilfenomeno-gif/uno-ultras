import { describe, expect, it } from 'vitest';
import { isPlayableCard } from '../src/core/rules';

describe('rules', () => {
  it('allows same color', () => {
    expect(isPlayableCard({ id: '1', color: 'red', value: 7 }, { id: '2', color: 'red', value: 2 })).toBe(true);
  });

  it('allows wild cards', () => {
    expect(isPlayableCard({ id: '1', color: 'wild', value: 'wild' }, { id: '2', color: 'green', value: 2 })).toBe(true);
  });
});
