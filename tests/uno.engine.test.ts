import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnoEngine, createDeck } from '../src/game/uno';

type MemoryRecord = Record<string, string>;

function createStorage(): Storage {
  const memory: MemoryRecord = {};
  return {
    get length() {
      return Object.keys(memory).length;
    },
    clear() {
      Object.keys(memory).forEach((key) => delete memory[key]);
    },
    getItem(key: string) {
      return memory[key] ?? null;
    },
    key(index: number) {
      return Object.keys(memory)[index] ?? null;
    },
    removeItem(key: string) {
      delete memory[key];
    },
    setItem(key: string, value: string) {
      memory[key] = String(value);
    }
  };
}

function installBrowserMocks(): void {
  const storage = createStorage();
  const globalRef = globalThis as typeof globalThis & {
    localStorage?: Storage;
    window?: Window;
    document?: Document;
  };

  Object.defineProperty(globalRef, 'localStorage', {
    value: storage,
    configurable: true
  });

  Object.defineProperty(globalRef, 'window', {
    value: {
      setTimeout,
      clearTimeout,
      requestAnimationFrame: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      }
    },
    configurable: true
  });

  Object.defineProperty(globalRef, 'document', {
    value: {
      querySelector: () => null,
      getElementById: () => null,
      body: {
        classList: {
          toggle: () => undefined
        }
      }
    },
    configurable: true
  });
}

beforeEach(() => {
  vi.resetModules();
  installBrowserMocks();
});

describe('uno engine', () => {
  it('creates standard deck size', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(108);
  });

  it('starts with valid player hand size', () => {
    const game = new UnoEngine(4);
    const lengths = game.state.players.map((p) => p.hand.length);
    expect(lengths).toEqual([7, 7, 7, 7]);
  });

  it('deals unique card ids across all players at game start', () => {
    const game = new UnoEngine(4);
    const allIds = game.state.players.flatMap((p) => p.hand.map((card) => card.id));
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('rarely produces identical full starting hands between players', () => {
    const simulations = 1500;
    let sameHandPairs = 0;
    let comparedPairs = 0;

    for (let sim = 0; sim < simulations; sim += 1) {
      const game = new UnoEngine(4);
      const signatures = game.state.players.map((player) =>
        player.hand
          .map((card) => `${card.color}:${card.value}`)
          .sort()
          .join('|')
      );

      for (let i = 0; i < signatures.length; i += 1) {
        for (let j = i + 1; j < signatures.length; j += 1) {
          comparedPairs += 1;
          if (signatures[i] === signatures[j]) {
            sameHandPairs += 1;
          }
        }
      }
    }

    const ratio = sameHandPairs / comparedPairs;
    // Statistical guardrail: full identical 7-card hands must stay extremely rare.
    expect(ratio).toBeLessThan(0.0005);
  });

  it('advances turn when drawing', () => {
    const game = new UnoEngine(2);
    const start = game.state.currentPlayerIndex;
    game.drawForCurrent();
    expect(game.state.currentPlayerIndex).not.toBe(start);
  });

  it('sets pendingWildIndex when player selects a wild card', async () => {
    const play = await import('../src/screens/play');
    play.setPlayRenderCallback(() => undefined);
    play.setSelectedMode('local');
    play.setSelectedPlayers(2);
    play.startMode();

    const state = play.getEngineStateForTest();
    expect(state).not.toBeNull();
    if (!state) return;

    state.currentPlayerIndex = 0;
    state.players[0].isAI = false;
    state.players[0].hand = [{ id: 'wild-card', color: 'wild', value: 'wild' }];

    const actor = { dataset: { index: '0' } } as unknown as HTMLElement;
    const handled = play.handlePlayAction('play-card', actor);

    expect(handled).toBe(true);
    expect(play.getPendingWildIndex()).toBe(0);
  });

  it('applies chosen color after wild selection', async () => {
    const play = await import('../src/screens/play');
    play.setPlayRenderCallback(() => undefined);
    play.setSelectedMode('local');
    play.setSelectedPlayers(2);
    play.startMode();

    const state = play.getEngineStateForTest();
    expect(state).not.toBeNull();
    if (!state) return;

    state.currentPlayerIndex = 0;
    state.players[0].isAI = false;
    state.players[0].hand = [{ id: 'wild-card', color: 'wild', value: 'wild' }];

    play.handlePlayAction('play-card', { dataset: { index: '0' } } as unknown as HTMLElement);
    expect(play.getPendingWildIndex()).toBe(0);

    play.handlePlayAction('choose-color', { dataset: { color: 'red' } } as unknown as HTMLElement);
    expect(play.getPendingWildIndex()).toBeNull();
    expect(state.activeColor).toBe('red');
  });

  it('applies UNO penalty when last card is played without declaration', () => {
    const game = new UnoEngine(2);
    game.state.currentPlayerIndex = 0;
    game.state.activeColor = 'red';
    game.state.drawStack = 0;
    game.state.discard = [{ id: 'top', color: 'red', value: '5' }];
    game.state.players[0].hand = [
      { id: 'playable', color: 'red', value: '7' },
      { id: 'other', color: 'blue', value: '3' }
    ];
    game.state.players[0].saidUno = false;

    const message = game.playFromCurrent(0);
    expect(message).toContain('penalita UNO +2');
    expect(game.state.players[0].hand.length).toBe(3);
  });

  it('does not crash when deck is empty and discard has one card', () => {
    const game = new UnoEngine(2);
    game.state.deck = [];
    game.state.discard = [{ id: 'top', color: 'blue', value: '2' }];
    const before = game.state.players[0].hand.length;

    expect(() => game.drawForCurrent()).not.toThrow();
    expect(game.state.players[0].hand.length).toBe(before);
  });

  it('resets profile to defaults when version is missing', async () => {
    localStorage.setItem('uno-ultras-definitivo-profile', JSON.stringify({ name: 'Test', wins: 99 }));
    const store = await import('../src/core/store');

    const loaded = store.loadProfile();
    expect(loaded.version).toBe(1);
    expect(loaded.name).toBe('Giocatore');
    expect(loaded.wins).toBe(0);
  });

  it('updates profile progression on registerWin true and false', async () => {
    const store = await import('../src/core/store');
    const initialCredits = store.profile.credits;
    const initialMmr = store.profile.mmr;
    const initialWins = store.profile.wins;
    const initialLosses = store.profile.losses;

    store.registerWin(true);
    expect(store.profile.credits).toBe(initialCredits + 25);
    expect(store.profile.wins).toBe(initialWins + 1);
    expect(store.profile.mmr).toBe(initialMmr + 18);

    const mmrBeforeLoss = store.profile.mmr;
    store.registerWin(false);
    expect(store.profile.losses).toBe(initialLosses + 1);
    expect(store.profile.mmr).toBe(Math.max(200, mmrBeforeLoss - 8));
  });

  it('starts local multiplayer with only human players', async () => {
    const play = await import('../src/screens/play');
    play.setPlayRenderCallback(() => undefined);
    play.setSelectedMode('local');
    play.setSelectedPlayers(4);
    play.startMode();

    const state = play.getEngineStateForTest();
    expect(state).not.toBeNull();
    if (!state) return;
    expect(state.players).toHaveLength(4);
    expect(state.players.every((player) => player.isAI === false)).toBe(true);
  });

  it('shows handoff screen after local turn action', async () => {
    const play = await import('../src/screens/play');
    play.setPlayRenderCallback(() => undefined);
    play.setSelectedMode('local');
    play.setSelectedPlayers(2);
    play.startMode();

    expect(play.isHandoffVisibleForTest()).toBe(false);
    play.handlePlayAction('draw', { dataset: {} } as unknown as HTMLElement);
    expect(play.isHandoffVisibleForTest()).toBe(true);
  });
});
