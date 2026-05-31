export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardValue =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'skip'
  | 'reverse'
  | 'draw2'
  | 'wild'
  | 'wild4';

export type Card = {
  id: string;
  color: CardColor;
  value: CardValue;
};

export type UnoPlayer = {
  id: string;
  name: string;
  isAI: boolean;
  hand: Card[];
  saidUno: boolean;
};

export type UnoState = {
  players: UnoPlayer[];
  deck: Card[];
  discard: Card[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  activeColor: Exclude<CardColor, 'wild'>;
  drawStack: number;
  winner: string | null;
};

const COLORS: Exclude<CardColor, 'wild'>[] = ['red', 'blue', 'green', 'yellow'];
const NORMAL_VALUES: CardValue[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function nextColor(excluding?: Exclude<CardColor, 'wild'>): Exclude<CardColor, 'wild'> {
  const pool = excluding ? COLORS.filter((c) => c !== excluding) : COLORS;
  return pool[Math.floor(Math.random() * pool.length)] ?? 'red';
}

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const color of COLORS) {
    deck.push({ id: uid(), color, value: '0' });

    for (const value of NORMAL_VALUES) {
      deck.push({ id: uid(), color, value });
      deck.push({ id: uid(), color, value });
    }

    for (let i = 0; i < 2; i += 1) {
      deck.push({ id: uid(), color, value: 'skip' });
      deck.push({ id: uid(), color, value: 'reverse' });
      deck.push({ id: uid(), color, value: 'draw2' });
    }
  }

  for (let i = 0; i < 4; i += 1) {
    deck.push({ id: uid(), color: 'wild', value: 'wild' });
    deck.push({ id: uid(), color: 'wild', value: 'wild4' });
  }

  return shuffle(deck);
}

function drawFromDeck(state: UnoState, count = 1): Card[] {
  const cards: Card[] = [];

  for (let i = 0; i < count; i += 1) {
    if (state.deck.length === 0) {
      if (state.discard.length <= 1) {
        break;
      }

      const topDiscard = state.discard.pop();
      state.deck = shuffle(state.discard);
      state.discard = topDiscard ? [topDiscard] : [];
    }

    const drawn = state.deck.pop();
    if (drawn) cards.push(drawn);
  }

  return cards;
}

function initializeTopCard(state: UnoState): void {
  while (state.deck.length > 0) {
    const card = drawFromDeck(state, 1)[0];
    if (!card) break;

    state.discard.push(card);

    if (card.color !== 'wild') {
      state.activeColor = card.color;
      if (card.value === 'draw2') state.drawStack = 2;
      if (card.value === 'skip') state.currentPlayerIndex = 1 % state.players.length;
      if (card.value === 'reverse' && state.players.length > 2) state.direction = -1;
      return;
    }

    state.activeColor = nextColor();
    return;
  }
}

function getTopCard(state: UnoState): Card {
  const top = state.discard[state.discard.length - 1];
  if (!top) {
    throw new Error('Discard pile vuota');
  }
  return top;
}

function isCardPlayable(state: UnoState, card: Card): boolean {
  const top = getTopCard(state);

  if (state.drawStack > 0) {
    return card.value === 'draw2' || card.value === 'wild4';
  }

  if (card.color === 'wild') return true;
  if (card.color === state.activeColor) return true;
  return card.value === top.value;
}

function stepIndex(state: UnoState, amount = 1): number {
  const total = state.players.length;
  const raw = state.currentPlayerIndex + amount * state.direction;
  return ((raw % total) + total) % total;
}

export class UnoEngine {
  state: UnoState;

  constructor(playerCount: number) {
    const safeCount = Math.max(2, Math.min(4, playerCount));
    const players: UnoPlayer[] = [];

    players.push({ id: 'p0', name: 'Tu', isAI: false, hand: [], saidUno: false });
    for (let i = 1; i < safeCount; i += 1) {
      players.push({ id: `p${i}`, name: `Bot ${i}`, isAI: true, hand: [], saidUno: false });
    }

    this.state = {
      players,
      deck: createDeck(),
      discard: [],
      currentPlayerIndex: 0,
      direction: 1,
      activeColor: 'red',
      drawStack: 0,
      winner: null
    };

    for (const player of this.state.players) {
      player.hand = drawFromDeck(this.state, 7);
    }

    initializeTopCard(this.state);
  }

  getCurrentPlayer(): UnoPlayer {
    return this.state.players[this.state.currentPlayerIndex];
  }

  getPlayableIndicesForCurrent(): number[] {
    const current = this.getCurrentPlayer();
    const result: number[] = [];
    current.hand.forEach((card, index) => {
      if (isCardPlayable(this.state, card)) result.push(index);
    });
    return result;
  }

  sayUno(): void {
    const current = this.getCurrentPlayer();
    current.saidUno = true;
  }

  drawForCurrent(): string {
    if (this.state.winner) return 'Partita terminata';
    const current = this.getCurrentPlayer();

    const amount = this.state.drawStack > 0 ? this.state.drawStack : 1;
    const cards = drawFromDeck(this.state, amount);
    current.hand.push(...cards);
    current.saidUno = false;

    if (this.state.drawStack > 0) {
      this.state.drawStack = 0;
    }

    this.advanceTurn(1);
    return `${current.name} pesca ${amount} carta${amount > 1 ? 'e' : ''}`;
  }

  playFromCurrent(index: number, chosenColor?: Exclude<CardColor, 'wild'>): string {
    if (this.state.winner) return 'Partita terminata';

    const current = this.getCurrentPlayer();
    const card = current.hand[index];
    if (!card) return 'Carta non valida';

    if (!isCardPlayable(this.state, card)) return 'Mossa non valida';

    current.hand.splice(index, 1);
    this.state.discard.push(card);

    if (card.color === 'wild') {
      this.state.activeColor = chosenColor ?? nextColor(this.state.activeColor);
    } else {
      this.state.activeColor = card.color;
    }

    let message = `${current.name} gioca ${card.value}`;
    let turnJump = 1;

    if (card.value === 'skip') turnJump = 2;
    if (card.value === 'reverse') {
      this.state.direction = this.state.direction === 1 ? -1 : 1;
      if (this.state.players.length === 2) turnJump = 2;
    }
    if (card.value === 'draw2') {
      this.state.drawStack += 2;
    }
    if (card.value === 'wild4') {
      this.state.drawStack += 4;
    }

    if (current.hand.length === 1 && !current.saidUno) {
      const penalty = drawFromDeck(this.state, 2);
      current.hand.push(...penalty);
      message += ' (penalita UNO +2)';
    }

    if (current.hand.length === 0) {
      this.state.winner = current.name;
      return `${current.name} vince la partita!`;
    }

    current.saidUno = false;
    this.advanceTurn(turnJump);
    return message;
  }

  runAI(): string {
    const current = this.getCurrentPlayer();
    if (!current.isAI || this.state.winner) return '';

    if (current.hand.length === 2) current.saidUno = true;

    const playable: number[] = [];
    current.hand.forEach((card, index) => {
      if (isCardPlayable(this.state, card)) playable.push(index);
    });

    if (playable.length > 0) {
      const pick = playable[Math.floor(Math.random() * playable.length)] ?? playable[0];
      const card = current.hand[pick];
      const chosen = card?.color === 'wild' ? nextColor(this.state.activeColor) : undefined;
      return this.playFromCurrent(pick, chosen);
    }

    return this.drawForCurrent();
  }

  private advanceTurn(steps: number): void {
    this.state.currentPlayerIndex = stepIndex(this.state, steps);
  }
}
