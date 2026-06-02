const HAND_SIZE_BY_GAME = {
  uno: 7,
  ruba: 3,
  scopa: 3,
  poker: 2,
  burraco: 7,
  blackjack: 2,
  millemiglia: 6,
  scala40: 7,
  briscola: 3,
  tressette: 4
};

const TABLE_SIZE_BY_GAME = {
  uno: 1,
  ruba: 3,
  scopa: 4,
  poker: 3,
  burraco: 1,
  blackjack: 2,
  millemiglia: 0,
  scala40: 1,
  briscola: 0,
  tressette: 0
};

function shuffle(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

function buildClassicDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push(`${value}${suit}`);
    }
  }
  return deck;
}

function buildUnoDeck() {
  const colors = ['R', 'B', 'G', 'Y'];
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', 'SKIP', 'REV'];
  const deck = [];
  for (const color of colors) {
    for (const value of values) {
      deck.push(`${color}-${value}`);
      if (value !== '0') {
        deck.push(`${color}-${value}`);
      }
    }
  }
  for (let i = 0; i < 4; i += 1) {
    deck.push('WILD');
    deck.push('WILD+4');
  }
  return deck;
}

function buildMilleDeck() {
  const base = ['25KM', '50KM', '75KM', '100KM', '200KM', 'STOP', 'GO', 'RIP', 'INC', 'LIM', 'SAFETY'];
  const deck = [];
  for (let i = 0; i < 10; i += 1) {
    for (const card of base) {
      deck.push(card);
    }
  }
  return deck;
}

function buildDeckForGame(gameId) {
  if (gameId === 'uno') return buildUnoDeck();
  if (gameId === 'millemiglia') return buildMilleDeck();
  return [...buildClassicDeck(), ...buildClassicDeck()];
}

function drawMany(deck, count) {
  const out = [];
  for (let i = 0; i < count && deck.length > 0; i += 1) {
    const card = deck.pop();
    if (card) out.push(card);
  }
  return out;
}

export function createInitialServerGameState(gameId, players) {
  const handSize = HAND_SIZE_BY_GAME[gameId] ?? 3;
  const tableSize = TABLE_SIZE_BY_GAME[gameId] ?? 0;
  const deck = shuffle(buildDeckForGame(gameId));
  const handsByPlayer = {};

  for (const player of players) {
    handsByPlayer[player.socketId] = drawMany(deck, handSize);
  }

  const tableLabels = drawMany(deck, tableSize);

  return {
    gameId,
    turn: 0,
    startedAt: Date.now(),
    deckCount: deck.length,
    handsByPlayer,
    tableLabels
  };
}

export function buildClientGameSnapshot(state, selfSocketId, players) {
  const self = players.find((p) => p.socketId === selfSocketId);
  const handLabels = [...(state.handsByPlayer[selfSocketId] ?? [])];

  return {
    gameId: state.gameId,
    selfName: self?.name ?? 'Giocatore',
    handLabels,
    opponents: players
      .filter((p) => p.socketId !== selfSocketId)
      .map((p) => ({
        name: p.name,
        cardCount: state.handsByPlayer[p.socketId]?.length ?? 0
      })),
    deckCount: state.deckCount,
    tableLabels: [...state.tableLabels]
  };
}
