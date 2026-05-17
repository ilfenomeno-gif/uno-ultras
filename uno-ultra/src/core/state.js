export function createInitialState() {
  return {
    meta: {
      version: '0.1.0',
      mode: 'offline'
    },
    players: [],
    currentPlayer: 0,
    discardPile: [],
    drawPile: []
  };
}

export function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

export function validateState(state) {
  return Boolean(
    state &&
    Array.isArray(state.players) &&
    Number.isInteger(state.currentPlayer) &&
    Array.isArray(state.discardPile) &&
    Array.isArray(state.drawPile)
  );
}
