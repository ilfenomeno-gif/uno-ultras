import { renderPlayerBadge } from './player-badge';
import { renderGameShell } from './game-shell';
import { formatMilleMigliaFace } from './card-face';

export type MMCard =
  | { type: 'km'; value: 25 | 50 | 75 | 100 | 200; index: number }
  | { type: 'hazard'; name: string; emoji: string; index: number }
  | { type: 'remedy'; name: string; emoji: string; index: number }
  | { type: 'safety'; name: string; emoji: string; index: number }
  | { type: 'extra'; name: string; index: number };

export interface MMPlayerState {
  km: number;
  hazard: string | null;
  safeties: string[];
  hand: MMCard[];
  isActive: boolean;
}

export interface MMViewState {
  player: MMPlayerState;
  opponents: (MMPlayerState & { name: string; position: 'top' | 'left' | 'right'; title?: string; cardCount: number })[];
  deckCount: number;
  discardCount: number;
  isPlayerTurn: boolean;
  target: number;
}

export function renderMMBoard(state: MMViewState): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  const kmBar = (km: number, target: number): string => {
    const pct = Math.min(100, Math.round((km / target) * 100));
    return `<div class="fn-mm-kmbar"><div class="fn-mm-kmfill" style="width:${pct}%"></div><span>${km}/${target} km</span></div>`;
  };

  const centerContent = `
    <div class="fn-table-area">
      <button class="fn-deck-btn ${!state.isPlayerTurn ? 'disabled' : ''}" data-action="draw-card">
        <span class="fn-deck-count">${state.deckCount}</span>
        <span class="fn-deck-label">PESCA</span>
      </button>
      <div class="fn-discard empty">
        <span class="fn-deck-count">${state.discardCount}</span>
        <span class="fn-deck-label">SCARTO</span>
      </div>
    </div>
  `;

  const bottomContent = `
    <div class="fn-player-area">
      <div class="fn-mm-player-status">
        ${kmBar(state.player.km, state.target)}
        ${
          state.player.hazard
            ? `<div class="fn-mm-hazard active">⚠️ ${state.player.hazard}</div>`
            : '<div class="fn-mm-hazard ok">✅ In marcia</div>'
        }
        ${
          state.player.safeties.length > 0
            ? `<div class="fn-mm-safeties">${state.player.safeties.map((s) => `<span class="fn-mm-safety-chip">🛡️ ${s}</span>`).join('')}</div>`
            : ''
        }
      </div>
      <div class="fn-hand" role="list">
        ${state.player.hand
          .map((card, i) => {
            const face = formatMilleMigliaFace(card);
            return `
          <button class="fn-card fn-mm-card type-${card.type}" data-action="${state.isPlayerTurn ? 'play-mm-card' : ''}" data-index="${i}" ${
    !state.isPlayerTurn ? 'disabled' : ''
  } role="listitem" aria-label="${card.type === 'km' ? `${card.value} km` : card.name}">
            <span class="fn-mm-card-label">${face.main}</span>
            ${face.sub ? `<small class="fn-mm-card-sub">${face.sub}</small>` : ''}
          </button>
        `;
          })
          .join('')}
      </div>
    </div>
  `;

  return renderGameShell({
    boardClass: 'fn-board-mm',
    title: 'MILLE MIGLIA',
    subtitle: state.isPlayerTurn ? 'Il tuo turno' : 'Turno avversario',
    topSlot: opponentTop
      ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}${kmBar(opponentTop.km, state.target)}${
          opponentTop.hazard ? `<div class="fn-mm-hazard active">${opponentTop.hazard}</div>` : ''
        }</div>`
      : '',
    leftSlot: opponentLeft ? `${renderPlayerBadge(opponentLeft)}${kmBar(opponentLeft.km, state.target)}` : '',
    rightSlot: opponentRight ? `${renderPlayerBadge(opponentRight)}${kmBar(opponentRight.km, state.target)}` : '',
    centerContent,
    bottomContent
  });
}
