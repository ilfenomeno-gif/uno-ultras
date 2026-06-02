import { renderPlayerBadge } from './player-badge';
import { renderGameShell } from './game-shell';
import { formatClassicFace, formatSuitSymbol } from './card-face';

export interface BJCard {
  suit: string;
  value: string;
  hidden?: boolean;
}

export interface BJPlayer {
  name: string;
  hand: BJCard[];
  score: number;
  bet: number;
  isActive: boolean;
  position: 'top' | 'left' | 'right';
  bust: boolean;
  title?: string;
}

export interface BlackjackViewState {
  phase: 'bet' | 'play' | 'result';
  playerHand: BJCard[];
  playerScore: number;
  playerBet: number;
  playerBalance: number;
  dealerHand: BJCard[];
  dealerScore: number;
  result?: 'win' | 'lose' | 'push' | 'blackjack';
  canDouble: boolean;
  canSplit: boolean;
  opponents: BJPlayer[];
  betOptions: number[];
  customBet: number;
}

export function renderBlackjackBoard(state: BlackjackViewState): string {
  if (state.phase === 'bet') {
    return renderGameShell({
      boardClass: 'fn-board-bj',
      title: 'BLACKJACK',
      subtitle: 'Piazza la puntata',
      centerContent: `
        <div class="fn-bj-bet-overlay">
          <div class="fn-bj-bet-panel">
            <h2 class="fn-bj-bet-title">💰 PIAZZA LA PUNTATA</h2>
            <p class="fn-bj-balance">Saldo: <strong>${state.playerBalance} V</strong></p>
            <div class="fn-bj-bet-options">
              ${state.betOptions
                .map(
                  (v) => `
                <button class="fn-bj-chip ${state.customBet === v ? 'active' : ''}" data-action="bj-set-bet" data-amount="${v}">
                  <span class="fn-chip-val">${v}</span>
                </button>
              `
                )
                .join('')}
            </div>
            <div class="fn-bj-bet-presets">
              <button class="btn-ghost" data-action="bj-bet-half">½ SALDO</button>
              <button class="btn-ghost" data-action="bj-bet-all">ALL-IN</button>
            </div>
            <div class="fn-bj-bet-display">Puntata: <strong>${state.customBet} V</strong></div>
            <button class="fn-bj-deal-btn btn-primary" data-action="bj-deal" ${state.customBet < 5 ? 'disabled' : ''}>DEAL</button>
          </div>
        </div>
      `
    });
  }

  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  const resultBanner =
    state.phase === 'result' && state.result
      ? `<div class="fn-result-banner ${state.result}">${
          { win: '🏆 HAI VINTO!', lose: '💀 HAI PERSO', push: '🤝 PAREGGIO', blackjack: '⚡ BLACKJACK!' }[state.result]
        }</div>`
      : '';

  const centerContent = `
    <div class="fn-bj-dealer-area">
      <div class="fn-bj-hand dealer">
        ${state.dealerHand.map((c) => `<div class="fn-bj-card ${c.hidden ? 'hidden' : ''}">${c.hidden ? '?' : `${formatClassicFace(c.value)}${formatSuitSymbol(c.suit)}`}</div>`).join('')}
      </div>
      <div class="fn-bj-score-pill dealer">${state.dealerScore}</div>
    </div>

    <div class="fn-table-area bj-table">
      <div class="fn-bj-pot"><span class="fn-vcoin-sm">V</span><span>${state.playerBet}</span></div>
    </div>
  `;

  const bottomContent = `
    <div class="fn-player-area bj-player">
      <div class="fn-bj-hand player">
        ${state.playerHand.map((c) => `<div class="fn-bj-card player-card">${formatClassicFace(c.value)}${formatSuitSymbol(c.suit)}</div>`).join('')}
        <div class="fn-bj-score-pill player">${state.playerScore}</div>
      </div>
      ${
        state.phase === 'play'
          ? `<div class="fn-bj-actions">
        <button class="btn-ghost" data-action="bj-hit">CARTA</button>
        <button class="btn-ghost" data-action="bj-stand">STAI</button>
        ${state.canDouble ? '<button class="btn-ghost" data-action="bj-double">✕2 RADDOPPIA</button>' : ''}
        ${state.canSplit ? '<button class="btn-ghost" data-action="bj-split">DIVIDI</button>' : ''}
      </div>`
          : state.phase === 'result'
            ? '<div class="fn-bj-actions"><button class="btn-primary" data-action="bj-restart" style="width:auto;padding:12px 32px;">NUOVA MANO</button></div>'
            : ''
      }
    </div>
  `;

  return renderGameShell({
    boardClass: 'fn-board-bj',
    title: 'BLACKJACK',
    subtitle: state.phase === 'play' ? 'Gioca la mano' : 'Risultato mano',
    topSlot: opponentTop ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}</div>` : '',
    leftSlot: opponentLeft ? `${renderPlayerBadge(opponentLeft)}<div class="fn-bj-side-score">${opponentLeft.score}</div>` : '',
    rightSlot: opponentRight ? `${renderPlayerBadge(opponentRight)}<div class="fn-bj-side-score">${opponentRight.score}</div>` : '',
    centerContent,
    bottomContent,
    overlay: resultBanner
  });
}
