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

let loading = false;
let renderCallback: (() => void) | null = null;

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

  switch (gameId) {
    case 'uno': {
      const raw = getUnoRuntimeState();
      if (!raw) {
        return renderUnoBoard({
          playerHand: [
            { color: 'red', value: '7', playable: true },
            { color: 'blue', value: '3', playable: false },
            { color: 'green', value: 'Skip', playable: true }
          ],
          discardTop: { color: 'red', value: '7' },
          deckCount: 42,
          opponents: stubOpponents(1, 0),
          currentPlayerIndex: 0,
          isPlayerTurn: true,
          canDraw: true,
          unoAlert: false
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
        unoAlert: raw.isPlayerTurn && raw.playerHand.length === 1
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
      return renderRubaBoard({
        playerHand: [
          { color: 'red', value: '3', playable: true },
          { color: 'blue', value: '7', playable: true },
          { color: 'green', value: 'K', playable: false }
        ],
        tableCards: [
          { color: 'red', value: '5', playable: false },
          { color: 'blue', value: '3', playable: false },
          { color: 'green', value: '8', playable: false }
        ],
        deckCount: 40,
        isPlayerTurn: true,
        opponents: stubOpponents(1, 0)
      });

    case 'blackjack': {
      const bjPhase = ((window as any).__bjPhase ?? 'bet') as 'bet' | 'play' | 'result';
      return renderBlackjackBoard({
        phase: bjPhase,
        playerHand: bjPhase === 'bet' ? [] : [{ suit: '♥', value: 'A' }, { suit: '♠', value: 'K' }],
        playerScore: bjPhase === 'bet' ? 0 : 21,
        playerBet: (window as any).__bjBet ?? 10,
        playerBalance: 800,
        dealerHand: bjPhase === 'bet' ? [] : [{ suit: '♦', value: '8' }, { suit: '♣', value: '?', hidden: true }],
        dealerScore: bjPhase === 'bet' ? 0 : 8,
        canDouble: bjPhase === 'play',
        canSplit: false,
        result: bjPhase === 'result' ? 'blackjack' : undefined,
        opponents: [],
        betOptions: [10, 25, 50, 100, 250],
        customBet: (window as any).__bjBet ?? 10
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
            { type: 'remedy', name: 'Riparazione', emoji: '🔧', index: 2 },
            { type: 'hazard', name: 'Incidente', emoji: '💥', index: 3 }
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
      return renderScopaBoard({
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
      });

    case 'briscola':
      return renderRubaBoard({
        playerHand: [
          { color: 'red', value: 'A', playable: true },
          { color: 'yellow', value: '3', playable: true },
          { color: 'blue', value: 'R', playable: true }
        ],
        tableCards: [],
        deckCount: 32,
        isPlayerTurn: true,
        opponents: stubOpponents(1, 0)
      });

    default:
      return `<div class="fn-board"><div class="fn-board-center" style="align-items:center;justify-content:center;"><p style="color:var(--fn-muted);font-size:18px;font-family:Barlow Condensed;">⚠️ Board non implementata.</p><button class="btn-ghost" data-action="back-to-hub" style="margin-top:16px">TORNA AL MENU</button></div></div>`;
  }
}
