import { renderUnoBoard } from './board-uno';
import { renderScala40Board } from './board-scala40';
import { renderRubaBoard } from './board-ruba';
import { renderBlackjackBoard } from './board-blackjack';
import { renderScopaBoard } from './board-scopa';
import { renderPokerBoard } from './board-poker';
import { renderBurracoBoard } from './board-burraco';
import { renderMMBoard } from './board-millemiglia';
import { renderLoadingScreen } from './loading';
import type { GameId } from '../game/types';
import { getUnoRuntimeState } from './play';

interface RubaRuntimeCard {
  color: string;
  value: string;
  playable: boolean;
}

interface RubaRuntimeState {
  playerHand: RubaRuntimeCard[];
  tableCards: RubaRuntimeCard[];
  deckCount: number;
  isPlayerTurn: boolean;
  opponents: { name: string; cardCount: number; isActive: boolean; position: 'top' | 'left' | 'right'; title?: string }[];
}

type BlackjackResult = 'win' | 'lose' | 'push' | 'blackjack';

interface BlackjackRuntimeState {
  phase: 'bet' | 'play' | 'result';
  deck: { suit: string; value: string }[];
  playerHand: { suit: string; value: string }[];
  dealerHand: { suit: string; value: string }[];
  bet: number;
  balance: number;
  result?: BlackjackResult;
}

interface OnlineGameSnapshot {
  gameId: GameId;
  selfName: string;
  handLabels: string[];
  opponents: { name: string; cardCount: number }[];
  deckCount: number;
  tableLabels: string[];
}

let loading = false;
let renderCallback: (() => void) | null = null;
let onlineSyncRerenderTimer: number | null = null;

function randomRubaCard(): RubaRuntimeCard {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const values = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];
  return {
    color: colors[Math.floor(Math.random() * colors.length)] ?? 'red',
    value: values[Math.floor(Math.random() * values.length)] ?? 'A',
    playable: true
  };
}

function freshBlackjackDeck(): { suit: string; value: string }[] {
  const suits = ['♥', '♦', '♣', '♠'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: { suit: string; value: string }[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffleDeck(deck: { suit: string; value: string }[]): { suit: string; value: string }[] {
  const out = [...deck];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j] as { suit: string; value: string };
    out[j] = tmp as { suit: string; value: string };
  }
  return out;
}

function cardPoints(value: string): number {
  if (value === 'A') return 11;
  if (value === 'K' || value === 'Q' || value === 'J') return 10;
  return Number(value);
}

function blackjackScore(hand: { suit: string; value: string }[]): number {
  let total = hand.reduce((sum, card) => sum + cardPoints(card.value), 0);
  let aces = hand.filter((card) => card.value === 'A').length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function isNaturalBlackjack(hand: { suit: string; value: string }[]): boolean {
  return hand.length === 2 && blackjackScore(hand) === 21;
}

function getOrCreateBlackjackState(): BlackjackRuntimeState {
  const win = window as any;
  if (!win.__bjState) {
    win.__bjState = {
      phase: 'bet',
      deck: shuffleDeck(freshBlackjackDeck()),
      playerHand: [],
      dealerHand: [],
      bet: 10,
      balance: 800,
      result: undefined
    } satisfies BlackjackRuntimeState;
  }

  return win.__bjState as BlackjackRuntimeState;
}

function drawBlackjackCard(state: BlackjackRuntimeState): { suit: string; value: string } {
  if (state.deck.length === 0) {
    state.deck = shuffleDeck(freshBlackjackDeck());
  }
  const card = state.deck.pop();
  if (!card) {
    state.deck = shuffleDeck(freshBlackjackDeck());
    return state.deck.pop() as { suit: string; value: string };
  }
  return card;
}

function settleBlackjack(state: BlackjackRuntimeState, result: BlackjackResult): void {
  state.phase = 'result';
  state.result = result;

  if (result === 'win') {
    state.balance += state.bet * 2;
  } else if (result === 'push') {
    state.balance += state.bet;
  } else if (result === 'blackjack') {
    state.balance += Math.floor((state.bet * 5) / 2);
  }
}

function resolveDealerHand(state: BlackjackRuntimeState): void {
  while (blackjackScore(state.dealerHand) < 17) {
    state.dealerHand.push(drawBlackjackCard(state));
  }

  const player = blackjackScore(state.playerHand);
  const dealer = blackjackScore(state.dealerHand);

  if (dealer > 21) {
    settleBlackjack(state, 'win');
    return;
  }
  if (player > dealer) {
    settleBlackjack(state, 'win');
    return;
  }
  if (player < dealer) {
    settleBlackjack(state, 'lose');
    return;
  }
  settleBlackjack(state, 'push');
}

export function handleBlackjackAction(
  action: 'set-bet' | 'bet-half' | 'bet-all' | 'deal' | 'hit' | 'stand' | 'double' | 'restart',
  payload: { amount?: number } = {}
): string {
  const state = getOrCreateBlackjackState();

  if (action === 'set-bet') {
    if (state.phase !== 'bet') return 'Puntata modificabile solo prima del deal.';
    const amount = Math.max(5, Math.floor(payload.amount ?? 10));
    state.bet = Math.min(amount, state.balance);
    return `Puntata impostata a ${state.bet} V.`;
  }

  if (action === 'bet-half') {
    if (state.phase !== 'bet') return 'Puntata modificabile solo prima del deal.';
    state.bet = Math.max(5, Math.floor(state.balance / 2));
    return `Puntata impostata a ${state.bet} V.`;
  }

  if (action === 'bet-all') {
    if (state.phase !== 'bet') return 'Puntata modificabile solo prima del deal.';
    state.bet = Math.max(5, state.balance);
    return `All-in: ${state.bet} V.`;
  }

  if (action === 'deal') {
    if (state.phase !== 'bet') return 'Mano gia avviata.';
    if (state.bet > state.balance) {
      state.bet = Math.max(5, state.balance);
      return 'Saldo insufficiente per questa puntata.';
    }

    state.balance -= state.bet;
    state.phase = 'play';
    state.result = undefined;
    state.playerHand = [drawBlackjackCard(state), drawBlackjackCard(state)];
    state.dealerHand = [drawBlackjackCard(state), drawBlackjackCard(state)];

    const playerNatural = isNaturalBlackjack(state.playerHand);
    const dealerNatural = isNaturalBlackjack(state.dealerHand);

    if (playerNatural && dealerNatural) {
      settleBlackjack(state, 'push');
      return 'Blackjack per entrambi: pareggio.';
    }
    if (playerNatural) {
      settleBlackjack(state, 'blackjack');
      return 'Blackjack naturale!';
    }
    if (dealerNatural) {
      settleBlackjack(state, 'lose');
      return 'Dealer ha blackjack.';
    }

    return 'Carte distribuite.';
  }

  if (action === 'hit') {
    if (state.phase !== 'play') return 'Nessuna mano in corso.';
    state.playerHand.push(drawBlackjackCard(state));
    if (blackjackScore(state.playerHand) > 21) {
      settleBlackjack(state, 'lose');
      return 'Sballato!';
    }
    return 'Carta pescata.';
  }

  if (action === 'stand') {
    if (state.phase !== 'play') return 'Nessuna mano in corso.';
    resolveDealerHand(state);
    return 'Mano conclusa.';
  }

  if (action === 'double') {
    if (state.phase !== 'play') return 'Nessuna mano in corso.';
    if (state.playerHand.length !== 2) return 'Raddoppio consentito solo sulle prime due carte.';
    if (state.balance < state.bet) return 'Saldo insufficiente per raddoppiare.';

    state.balance -= state.bet;
    state.bet *= 2;
    state.playerHand.push(drawBlackjackCard(state));

    if (blackjackScore(state.playerHand) > 21) {
      settleBlackjack(state, 'lose');
      return 'Raddoppio: sballato!';
    }

    resolveDealerHand(state);
    return 'Raddoppio eseguito.';
  }

  if (action === 'restart') {
    state.phase = 'bet';
    state.playerHand = [];
    state.dealerHand = [];
    state.result = undefined;
    if (state.balance < 5) {
      state.balance = 800;
    }
    state.bet = Math.min(Math.max(5, state.bet), state.balance);
    return 'Nuova mano pronta.';
  }

  return 'Azione non supportata.';
}

function getOrCreateRubaState(): RubaRuntimeState {
  const win = window as any;
  if (!win.__rubaState) {
    win.__rubaState = {
      playerHand: [
        { color: 'red', value: '3', playable: true },
        { color: 'blue', value: '7', playable: true },
        { color: 'green', value: 'K', playable: true }
      ],
      tableCards: [
        { color: 'red', value: '5', playable: false },
        { color: 'blue', value: '3', playable: false },
        { color: 'green', value: '8', playable: false }
      ],
      deckCount: 40,
      isPlayerTurn: true,
      opponents: stubOpponents(1, 0)
    } satisfies RubaRuntimeState;
  }

  return win.__rubaState as RubaRuntimeState;
}

export function handleRubaRuntimeAction(action: 'draw-card' | 'play-ruba-card' | 'capture-stack', payload: { handIndex?: number; tableIndex?: number } = {}): string {
  const state = getOrCreateRubaState();

  if (action === 'draw-card') {
    if (state.deckCount <= 0) {
      return 'Mazzo finito.';
    }
    state.deckCount -= 1;
    state.playerHand.push(randomRubaCard());
    return 'Hai pescato una carta.';
  }

  if (action === 'play-ruba-card') {
    const index = payload.handIndex ?? -1;
    if (index < 0 || index >= state.playerHand.length) {
      return 'Carta non valida.';
    }

    const [card] = state.playerHand.splice(index, 1);
    if (!card) {
      return 'Carta non valida.';
    }

    const matchIdx = state.tableCards.findIndex((t) => t.value === card.value);
    if (matchIdx >= 0) {
      state.tableCards.splice(matchIdx, 1);
      return `Hai catturato con ${card.value}.`;
    }

    state.tableCards.push({ ...card, playable: false });
    return `Hai giocato ${card.value} sul tavolo.`;
  }

  if (action === 'capture-stack') {
    const index = payload.tableIndex ?? -1;
    if (index < 0 || index >= state.tableCards.length) {
      return 'Pila non valida.';
    }
    state.tableCards.splice(index, 1);
    return 'Pila catturata.';
  }

  return 'Azione non supportata.';
}

export function setBoardRenderCallback(cb: () => void): void {
  renderCallback = cb;
}

export function startLoading(gameId: GameId, onDone: () => void): void {
  loading = true;
  window.setTimeout(() => {
    loading = false;
    onDone();
  }, 2200);
}

export function isLoading(): boolean {
  return loading;
}

function stubOpponents(
  count: number,
  active = 0
): { name: string; cardCount: number; isActive: boolean; position: 'top' | 'left' | 'right'; title?: string }[] {
  const positions: ('top' | 'left' | 'right')[] = ['top', 'left', 'right'];
  return Array.from({ length: Math.min(count, 3) }, (_, i) => ({
    name: `CPU ${i + 1}`,
    cardCount: 7,
    isActive: i === active,
    position: positions[i] ?? 'top',
    title: i === 0 ? 'Rookie' : undefined
  }));
}

function renderOnlineSnapshotBoard(gameId: GameId, snapshot: OnlineGameSnapshot): string {
  const labels: Partial<Record<GameId, string>> = {
    uno: 'UNO',
    ruba: 'RUBA MAZZETTO',
    scopa: 'SCOPA',
    briscola: 'BRISCOLA',
    scala40: 'SCALA 40',
    burraco: 'BURRACO',
    poker: 'POKER TEXAS',
    blackjack: 'BLACKJACK',
    millemiglia: 'MILLE MIGLIA',
    tressette: 'TRESSETTE'
  };

  const hand =
    snapshot.handLabels.length > 0
      ? snapshot.handLabels.map((card) => `<span class="fn-mini-card">${card}</span>`).join('')
      : '<span class="fn-table-empty">Nessuna carta in mano.</span>';

  const table =
    snapshot.tableLabels.length > 0
      ? snapshot.tableLabels.map((card) => `<span class="fn-mini-card">${card}</span>`).join('')
      : '<span class="fn-table-empty">Nessuna carta a terra.</span>';

  const opponents =
    snapshot.opponents.length > 0
      ? snapshot.opponents
          .map(
            (player) =>
              `<div class="fn-playlist-item"><span class="fn-playlist-name">${player.name}</span><span class="fn-mini-more">${player.cardCount} carte</span></div>`
          )
          .join('')
      : '<span class="fn-table-empty">Nessun avversario disponibile.</span>';

  return `<div class="fn-board"><div class="fn-board-center" style="align-items:stretch;justify-content:flex-start;max-width:720px;width:100%;margin:0 auto;gap:10px;"><h2 style="margin:0;font-family:Barlow Condensed;letter-spacing:0.08em;">${labels[gameId] ?? gameId.toUpperCase()} ONLINE</h2><p style="margin:0;color:var(--fn-muted);font-size:14px;font-family:Barlow Condensed;">Snapshot sincronizzato server-side per ${snapshot.selfName}. Le mani online sono distinte per ciascun giocatore in tutte le modalita.</p><div class="fn-playlist-panel"><div class="fn-playlist-header"><span class="fn-playlist-label">LE TUE CARTE</span><span class="fn-mini-more">Mazzo ${snapshot.deckCount}</span></div><div class="fn-playlist-cards-mini" style="display:flex;flex-wrap:wrap;gap:6px;">${hand}</div></div><div class="fn-playlist-panel"><div class="fn-playlist-header"><span class="fn-playlist-label">TAVOLO</span></div><div class="fn-playlist-cards-mini" style="display:flex;flex-wrap:wrap;gap:6px;">${table}</div></div><div class="fn-playlist-panel"><div class="fn-playlist-header"><span class="fn-playlist-label">AVVERSARI</span></div><div class="fn-playlist-list">${opponents}</div></div><button class="btn-ghost" data-action="back-to-hub" style="margin-top:8px">TORNA AL MENU</button></div></div>`;
}

function createFallbackOnlineSnapshot(gameId: GameId): OnlineGameSnapshot {
  const labels: Partial<Record<GameId, string[]>> = {
    uno: ['R-7', 'B-2', 'Y-REV', 'WILD'],
    ruba: ['3♥', '7♣', 'K♦'],
    scopa: ['7♦', '1♥', '4♣'],
    briscola: ['A♠', '3♦', 'R♣'],
    scala40: ['A♥', '2♥', '3♥', 'J♣', 'Q♣', 'K♣', '5♠'],
    burraco: ['A♠', '2♠', '7♦', 'J♥', 'Q♣', '4♣', '6♦'],
    poker: ['A♠', 'K♥'],
    blackjack: ['A♣', '9♦'],
    millemiglia: ['100KM', '50KM', 'RIP', 'INC', 'GO', 'STOP'],
    tressette: ['3♦', '2♣', 'A♥', 'F♠']
  };

  const handLabels = [...(labels[gameId] ?? ['A♠', 'K♥'])];
  return {
    gameId,
    selfName: 'Giocatore',
    handLabels,
    opponents: [
      { name: 'Avversario 1', cardCount: handLabels.length },
      { name: 'Avversario 2', cardCount: handLabels.length }
    ],
    deckCount: 60,
    tableLabels: gameId === 'poker' ? ['10♠', 'J♦', 'Q♥'] : gameId === 'blackjack' ? ['8♣', '?'] : []
  };
}

export function renderActiveBoard(gameId: GameId): string {
  if (loading) {
    const labels: Partial<Record<GameId, string>> = {
      uno: 'UNO',
      ruba: 'RUBA MAZZETTO',
      scopa: 'SCOPA',
      briscola: 'BRISCOLA',
      scala40: 'SCALA 40',
      burraco: 'BURRACO',
      poker: 'POKER TEXAS',
      blackjack: 'BLACKJACK',
      millemiglia: 'MILLE MIGLIA',
      tressette: 'TRESSETTE'
    };
    return renderLoadingScreen(labels[gameId] ?? gameId.toUpperCase(), () => {
      loading = false;
      renderCallback?.();
    });
  }

  const isOnlineMatch = Boolean((window as any).__isOnlineMatch);
  if (isOnlineMatch) {
    const snapshot = (window as any).__onlineGameState as OnlineGameSnapshot | null;
    if (!snapshot) {
      const startedAt = Number((window as any).__onlineSyncStartedAt ?? 0);
      const elapsed = startedAt > 0 ? Date.now() - startedAt : 0;
      if (elapsed < 5000) {
        if (onlineSyncRerenderTimer === null) {
          const waitMs = Math.max(200, 5000 - elapsed + 80);
          onlineSyncRerenderTimer = window.setTimeout(() => {
            onlineSyncRerenderTimer = null;
            renderCallback?.();
          }, waitMs);
        }
        return `<div class="fn-board"><div class="fn-board-center" style="align-items:center;justify-content:center;gap:10px;"><p style="color:var(--fn-muted);font-size:18px;font-family:Barlow Condensed;">Sincronizzazione online in corso...</p><button class="btn-ghost" data-action="back-to-hub">TORNA AL MENU</button></div></div>`;
      }

      if (onlineSyncRerenderTimer !== null) {
        window.clearTimeout(onlineSyncRerenderTimer);
        onlineSyncRerenderTimer = null;
      }
      const fallback = createFallbackOnlineSnapshot(gameId);
      (window as any).__onlineGameState = fallback;
      return renderOnlineSnapshotBoard(gameId, fallback);
    }

    if (onlineSyncRerenderTimer !== null) {
      window.clearTimeout(onlineSyncRerenderTimer);
      onlineSyncRerenderTimer = null;
    }

    return renderOnlineSnapshotBoard(gameId, snapshot.gameId === gameId ? snapshot : { ...snapshot, gameId });
  }

  if (onlineSyncRerenderTimer !== null) {
    window.clearTimeout(onlineSyncRerenderTimer);
    onlineSyncRerenderTimer = null;
  }

  switch (gameId) {
    case 'uno': {
      const raw = getUnoRuntimeState();
      if (!raw) {
        return renderUnoBoard({
          playerHand: [
            { color: 'red', value: '7', playable: true },
            { color: 'blue', value: '3', playable: false },
            { color: 'green', value: 'reverse', playable: true }
          ],
          discardTop: { color: 'red', value: '7' },
          deckCount: 42,
          opponents: stubOpponents(1, 0),
          currentPlayerIndex: 0,
          isPlayerTurn: true,
          canDraw: true,
          unoAlert: false,
          log: ['Nessuna mossa registrata']
        });
      }

      return renderUnoBoard({
        playerHand: raw.playerHand.map((c, index) => ({
          color: c.color,
          value: c.value,
          playable: raw.isPlayerTurn ? raw.playableIndices.includes(index) : false
        })),
        discardTop: raw.discardTop ? { color: raw.discardTop.color, value: raw.discardTop.value } : null,
        deckCount: raw.deckCount,
        opponents: raw.opponents,
        currentPlayerIndex: raw.currentPlayer,
        isPlayerTurn: raw.isPlayerTurn,
        canDraw: raw.isPlayerTurn,
        unoAlert: raw.isPlayerTurn && raw.playerHand.length === 1,
        log: raw.log.length > 0 ? raw.log : ['Nessuna mossa registrata']
      });
    }

    case 'scala40':
      return renderScala40Board({
        playerHand: [
          { color: 'red', value: 'A', selected: false },
          { color: 'red', value: '2', selected: false },
          { color: 'red', value: '3', selected: true },
          { color: 'blue', value: 'J', selected: false },
          { color: 'blue', value: 'Q', selected: false },
          { color: 'blue', value: 'K', selected: true },
          { color: 'green', value: '5', selected: false }
        ],
        playlists: [
          {
            id: 'pl1',
            label: 'A-2-3',
            cards: [
              { color: 'red', value: 'A', selected: false },
              { color: 'red', value: '2', selected: false },
              { color: 'red', value: '3', selected: false }
            ]
          }
        ],
        activePlaylistId: 'pl1',
        discardTop: { color: 'yellow', value: '6', selected: false },
        deckCount: 38,
        playerScore: 34,
        opponents: stubOpponents(1, 0).map((o) => ({ ...o, score: 12 })),
        canOpen: false,
        isPlayerTurn: true
      });

    case 'ruba':
      return renderRubaBoard(getOrCreateRubaState());

    case 'blackjack': {
      const state = getOrCreateBlackjackState();
      const dealerScore =
        state.phase === 'play'
          ? blackjackScore(state.dealerHand.slice(0, 1))
          : blackjackScore(state.dealerHand);
      const dealerHand =
        state.phase === 'play' && state.dealerHand.length > 1
          ? state.dealerHand.map((card, index) => (index === 1 ? { ...card, hidden: true } : card))
          : state.dealerHand;

      return renderBlackjackBoard({
        phase: state.phase,
        playerHand: state.playerHand,
        playerScore: blackjackScore(state.playerHand),
        playerBet: state.bet,
        playerBalance: state.balance,
        dealerHand,
        dealerScore,
        canDouble: state.phase === 'play' && state.playerHand.length === 2 && state.balance >= state.bet,
        canSplit: false,
        result: state.result,
        opponents: [],
        betOptions: [10, 25, 50, 100, 250],
        customBet: state.bet
      });
    }

    case 'scopa':
      return renderScopaBoard({
        playerHand: [
          { suit: 'denari', value: 7 },
          { suit: 'coppe', value: 1 },
          { suit: 'bastoni', value: 4 }
        ],
        tableCards: [
          { suit: 'spade', value: 7 },
          { suit: 'denari', value: 3 },
          { suit: 'coppe', value: 4 }
        ],
        deckCount: 28,
        playerScore: 2,
        playerCaptures: 8,
        scopeCount: 1,
        isPlayerTurn: true,
        opponents: [{ name: 'CPU 1', cardCount: 3, isActive: false, position: 'top', score: 1, captures: 6 }],
        selectedHandCard: null,
        selectedTableCards: []
      });

    case 'poker':
      return renderPokerBoard({
        phase: 'flop',
        playerHand: [{ suit: '♥', value: 'A' }, { suit: '♦', value: 'K' }],
        communityCards: [{ suit: '♠', value: '10' }, { suit: '♥', value: 'J' }, { suit: '♦', value: 'Q' }],
        pot: 350,
        playerChips: 1200,
        playerBet: 50,
        currentBet: 100,
        minRaise: 200,
        isPlayerTurn: true,
        opponents: stubOpponents(2, 0).map((o) => ({ ...o, hand: [], chips: 800, bet: 100, isFolded: false })),
        handRank: 'Scala Reale'
      });

    case 'burraco':
      return renderBurracoBoard({
        playerHand: [
          { color: 'red', value: 'A', selected: false },
          { color: 'red', value: '2', selected: true },
          { color: 'blue', value: '7', selected: false },
          { color: 'green', value: 'J', selected: false }
        ],
        melds: [
          {
            id: 'm1',
            isBurraco: false,
            cards: [
              { color: 'red', value: '4' },
              { color: 'red', value: '5' },
              { color: 'red', value: '6' }
            ]
          }
        ],
        pozzetto: [],
        pozzettoPreso: false,
        deckCount: 52,
        discardTop: { color: 'blue', value: '6' },
        isPlayerTurn: true,
        playerScore: 45,
        opponents: stubOpponents(1, 0).map((o) => ({ ...o, score: 30, melds: [] }))
      });

    case 'millemiglia':
      return renderMMBoard({
        player: {
          km: 350,
          hazard: null,
          safeties: ['Asso di Volante'],
          hand: [
            { type: 'km', value: 100, index: 0 },
            { type: 'km', value: 50, index: 1 },
            { type: 'remedy', name: 'RIP', emoji: '🔧', index: 2 },
            { type: 'hazard', name: 'INC', emoji: '💥', index: 3 }
          ],
          isActive: true
        },
        opponents: stubOpponents(1, 0).map((o) => ({
          ...o,
          km: 225,
          hazard: 'Limite Velocita',
          safeties: [],
          hand: [],
          isActive: false,
          cardCount: 6
        })),
        deckCount: 44,
        discardCount: 18,
        isPlayerTurn: true,
        target: 1000
      });

    case 'tressette':
      return renderScopaBoard(
        {
          playerHand: [
            { suit: 'denari', value: 3 },
            { suit: 'coppe', value: 3 },
            { suit: 'bastoni', value: 3 }
          ],
          tableCards: [],
          deckCount: 28,
          playerScore: 0,
          playerCaptures: 0,
          scopeCount: 0,
          isPlayerTurn: true,
          opponents: [{ name: 'CPU 1', cardCount: 4, isActive: false, position: 'top', score: 0, captures: 0 }],
          selectedHandCard: null,
          selectedTableCards: []
        },
        { title: 'TRESSETTE', boardClass: 'fn-board-tressette' }
      );

    case 'briscola':
      return renderRubaBoard(
        {
          playerHand: [
            { color: 'red', value: 'A', playable: true },
            { color: 'yellow', value: '3', playable: true },
            { color: 'blue', value: 'R', playable: true }
          ],
          tableCards: [],
          deckCount: 32,
          isPlayerTurn: true,
          opponents: stubOpponents(1, 0)
        },
        { title: 'BRISCOLA', boardClass: 'fn-board-briscola' }
      );

    default:
      return `<div class="fn-board"><div class="fn-board-center" style="align-items:center;justify-content:center;"><p style="color:var(--fn-muted);font-size:18px;font-family:Barlow Condensed;">⚠️ Board non implementata.</p><button class="btn-ghost" data-action="back-to-hub" style="margin-top:16px">TORNA AL MENU</button></div></div>`;
  }
}
