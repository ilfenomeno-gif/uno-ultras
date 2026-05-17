import { cloneState, createInitialState, validateState } from '../src/core/state.js';

describe('core state', () => {
  test('initial state has expected shape', () => {
    const state = createInitialState();
    expect(validateState(state)).toBe(true);
  });

  test('cloneState creates a deep copy', () => {
    const state = createInitialState();
    const copy = cloneState(state);
    copy.players.push({ id: 'p1' });
    expect(state.players).toHaveLength(0);
  });
});
