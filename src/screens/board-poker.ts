import { renderPlayerBadge } from './player-badge';
import { renderGameShell } from './game-shell';
import { formatClassicFace, formatSuitSymbol } from './card-face';

export interface PokerCard {
  suit: string;
  value: string;
  hidden?: boolean;
}

export interface PokerPlayer {
  name: string;
  hand: PokerCard[];
  chips: number;
  bet: number;
  isActive: boolean;
  isFolded: boolean;
  position: 'top' | 'left' | 'right';
  title?: string;
  cardCount: number;
}

export interface PokerViewState {
  phase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'bet';
  playerHand: PokerCard[];
  communityCards: PokerCard[];
  pot: number;
  playerChips: number;
  playerBet: number;
  currentBet: number;
  minRaise: number;
  isPlayerTurn: boolean;
  opponents: PokerPlayer[];
  handRank?: string;
}

export function renderPokerBoard(state: PokerViewState): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  const phaseLabel: Record<PokerViewState['phase'], string> = {
    preflop: 'PRE-FLOP',
    flop: 'FLOP',
    turn: 'TURN',
    river: 'RIVER',
    showdown: 'SHOWDOWN',
    bet: 'PUNTATA'
  };

  const centerContent = `
    <div class="fn-table-area poker-table">
      <div class="fn-poker-phase-label">${phaseLabel[state.phase]}</div>
      <div class="fn-poker-community">
        ${Array.from({ length: 5 })
          .map((_, i) => {
            const card = state.communityCards[i];
            return card ? `<div class="fn-bj-card community">${formatClassicFace(card.value)}${formatSuitSymbol(card.suit)}</div>` : '<div class="fn-bj-card placeholder"></div>';
          })
          .join('')}
      </div>
      <div class="fn-poker-pot"><span class="fn-vcoin-sm">V</span><strong>${state.pot}</strong><small>PIATTO</small></div>
    </div>
  `;

  const bottomContent = `
    <div class="fn-player-area bj-player">
      <div class="fn-poker-player-hand">
        ${state.playerHand.map((c) => `<div class="fn-bj-card player-card">${formatClassicFace(c.value)}${formatSuitSymbol(c.suit)}</div>`).join('')}
        ${state.handRank ? `<div class="fn-poker-rank-label">${state.handRank}</div>` : ''}
      </div>
      <div class="fn-poker-info">
        <span>Chips: <strong>${state.playerChips}V</strong></span>
        <span>Puntata: <strong>${state.playerBet}V</strong></span>
        ${state.currentBet > state.playerBet ? `<span class="fn-poker-call-amount">Da pareggiare: ${state.currentBet - state.playerBet}V</span>` : ''}
      </div>
      ${
        state.isPlayerTurn && state.phase !== 'showdown'
          ? `<div class="fn-bj-actions">
          <button class="btn-ghost" data-action="poker-fold">FOLD</button>
          <button class="btn-ghost" data-action="poker-check" ${state.currentBet > state.playerBet ? 'disabled' : ''}>CHECK</button>
          <button class="btn-ghost" data-action="poker-call" ${state.playerChips < state.currentBet - state.playerBet ? 'disabled' : ''}>CALL</button>
          <button class="btn-ghost" data-action="poker-raise">RAISE</button>
          <button class="btn-ghost fn-allin" data-action="poker-allin">ALL-IN</button>
        </div>`
          : ''
      }
    </div>
  `;

  return renderGameShell({
    boardClass: 'fn-board-poker',
    title: "POKER TEXAS HOLD'EM",
    subtitle: phaseLabel[state.phase],
    topSlot: opponentTop
      ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}<div class="fn-poker-chips">${opponentTop.chips}V</div><div class="fn-poker-hand-hidden"><div class="fn-bj-card hidden">?</div><div class="fn-bj-card hidden">?</div></div></div>`
      : '',
    leftSlot: opponentLeft ? `${renderPlayerBadge(opponentLeft)}<div class="fn-poker-chips">${opponentLeft.chips}V</div>` : '',
    rightSlot: opponentRight ? `${renderPlayerBadge(opponentRight)}<div class="fn-poker-chips">${opponentRight.chips}V</div>` : '',
    centerContent,
    bottomContent
  });
}
