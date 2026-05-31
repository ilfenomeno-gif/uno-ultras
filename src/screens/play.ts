import { notify } from '../core/notify';
import { GAME_LABELS, registerWin } from '../core/store';
import { runAiIfNeeded, clearAiTimer } from '../game/ai';
import { UnoEngine, type Card, type CardColor } from '../game/uno';
import type { GameId, GameMode, PlayersMode } from '../game/types';

let selectedGame: GameId = 'uno';
let selectedPlayers: PlayersMode = 2;
let selectedMode: GameMode = 'single';
let engine: UnoEngine | null = null;
let gameLog: string[] = [];
let renderCallback: (() => void) | null = null;
let pendingWildIndex: number | null = null;
let showHandoffScreen = false;
let handoffPlayerName = '';

function scheduleFrame(callback: () => void): void {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => callback());
    return;
  }
  callback();
}

export function setPlayRenderCallback(callback: () => void): void {
  renderCallback = callback;
}

function colorClass(color: CardColor): string {
  if (color === 'wild') return 'wild';
  return color;
}

function cardLabel(card: Card): string {
  if (card.value === 'wild') return 'Jolly';
  if (card.value === 'wild4') return 'Jolly +4';
  if (card.value === 'draw2') return '+2';
  if (card.value === 'reverse') return 'Reverse';
  if (card.value === 'skip') return 'Salta';
  return card.value;
}

function colorLabel(color: CardColor): string {
  if (color === 'red') return 'rosso';
  if (color === 'blue') return 'blu';
  if (color === 'green') return 'verde';
  if (color === 'yellow') return 'giallo';
  return 'jolly';
}

function cardAriaLabel(card: Card, playable: boolean): string {
  return `Carta ${cardLabel(card)} ${colorLabel(card.color)}, ${playable ? 'giocabile' : 'non giocabile'}`;
}

function pushGameplayMessage(message: string): void {
  const penaltyToken = '(penalita UNO +2)';
  if (message.includes(penaltyToken)) {
    gameLog.unshift(message.replace(` ${penaltyToken}`, '').replace(penaltyToken, '').trim());
    gameLog.unshift('Penalita: non hai dichiarato UNO! +2 carte.');
    return;
  }
  gameLog.unshift(message);
}

function focusAfterAction(): void {
  if (typeof document === 'undefined') return;
  scheduleFrame(() => {
    const logEntry = document.querySelector('.log .log-entry') as HTMLElement | null;
    const playableCard = document.querySelector('.hand .card.playable:not([disabled])') as HTMLElement | null;
    (logEntry ?? playableCard)?.focus();
  });
}

export function getPendingWildIndex(): number | null {
  return pendingWildIndex;
}

export function clearPendingWild(): void {
  pendingWildIndex = null;
}

export function setPendingWild(index: number): void {
  pendingWildIndex = index;
}

export function setSelectedGame(game: GameId): void {
  selectedGame = game;
}

export function setSelectedPlayers(players: PlayersMode): void {
  selectedPlayers = players;
}

export function setSelectedMode(mode: GameMode): void {
  selectedMode = mode;
  if (selectedMode === 'single') {
    selectedPlayers = 2;
  }
}

export function getEngineStateForTest(): UnoEngine['state'] | null {
  return engine?.state ?? null;
}

export function isHandoffVisibleForTest(): boolean {
  return showHandoffScreen;
}

function isHumanTurn(state: UnoEngine['state']): boolean {
  return selectedMode === 'local' ? true : state.currentPlayerIndex === 0;
}

function getActivePlayer(state: UnoEngine['state']): UnoEngine['state']['players'][number] {
  return selectedMode === 'local' ? state.players[state.currentPlayerIndex] : state.players[0];
}

function renderModeSelector(): string {
  const singleActive = selectedMode === 'single';
  const localActive = selectedMode === 'local';

  const playersSelector =
    selectedMode === 'local'
      ? `
      <div class="mode-selector">
        <h3>Numero giocatori locali</h3>
        <div class="chip-wrap">
          ${([2, 3, 4] as PlayersMode[])
            .map(
              (value) => `
            <button class="chip ${selectedPlayers === value ? 'active' : ''}" data-action="pick-players" data-players="${value}" aria-pressed="${selectedPlayers === value ? 'true' : 'false'}" type="button">
              ${value} giocatori
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `
      : '';

  return `
    <div class="mode-selector">
      <h3>Modalita di gioco</h3>
      <div class="chip-wrap">
        <button class="chip ${singleActive ? 'active' : ''}" data-action="pick-mode" data-mode="single" aria-pressed="${singleActive ? 'true' : 'false'}" type="button">Singleplayer (vs AI)</button>
        <button class="chip ${localActive ? 'active' : ''}" data-action="pick-mode" data-mode="local" aria-pressed="${localActive ? 'true' : 'false'}" type="button">Multiplayer Locale (Hot Seat)</button>
      </div>
    </div>
    ${playersSelector}
  `;
}

export function renderGameMatrix(): string {
  const games = [`<button class="chip active" data-action="pick-game" data-game="uno" aria-pressed="true">${GAME_LABELS.uno}</button>`];
  const launchText = selectedMode === 'single' ? 'UNO - 1v1 vs AI' : `UNO - ${selectedPlayers} giocatori locali`;

  return `
    <section class="panel">
      <h2>Modalita disponibile</h2>
      <p>In questa build e disponibile UNO in Singleplayer e Multiplayer Locale.</p>
      <div class="chip-wrap">${games.join('')}</div>
      ${renderModeSelector()}
      <div class="launch-row">
        <span>${launchText}</span>
        <button class="btn-primary" data-action="start-mode">Avvia Modalita</button>
      </div>
    </section>
  `;
}

export function renderUnoBoard(): string {
  if (!engine) return '';

  const state = engine.state;
  const topCard = state.discard[state.discard.length - 1];
  const currentPlayer = getActivePlayer(state);

  const opponents = state.players
    .filter((_, index) => (selectedMode === 'local' ? index !== state.currentPlayerIndex : index !== 0))
    .map((p, i) => {
      const active = selectedMode === 'local' ? false : state.currentPlayerIndex === i + 1;
      return `<div class="opponent ${active ? 'active' : ''}">${p.name}: ${p.hand.length} carte</div>`;
    })
    .join('');

  const playableIndices = engine.getPlayableIndicesForCurrent();
  const myTurn = isHumanTurn(state);
  const hand = currentPlayer.hand
    .map((card, idx) => {
      const playable = myTurn && playableIndices.includes(idx);
      return `
        <button class="card ${colorClass(card.color)} ${playable ? 'playable' : ''}" data-action="play-card" data-index="${idx}" aria-label="${cardAriaLabel(card, playable)}" ${playable ? '' : 'disabled'}>
          <span>${cardLabel(card)}</span>
        </button>
      `;
    })
    .join('');

  const colorPicker =
    pendingWildIndex !== null
      ? `
      <div class="color-picker" role="dialog" aria-modal="true" aria-label="Scegli il colore per il Jolly">
        <p>Scegli il colore:</p>
        <div class="color-picker-buttons">
          <button class="card red" data-action="choose-color" data-color="red" aria-label="Rosso" type="button">Rosso</button>
          <button class="card blue" data-action="choose-color" data-color="blue" aria-label="Blu" type="button">Blu</button>
          <button class="card green" data-action="choose-color" data-color="green" aria-label="Verde" type="button">Verde</button>
          <button class="card yellow" data-action="choose-color" data-color="yellow" aria-label="Giallo" type="button">Giallo</button>
        </div>
      </div>
    `
      : '';

  return `
    <section class="panel game">
      <div class="game-top">
        <div>
          <h2 class="current-player-banner">Turno di: ${state.players[state.currentPlayerIndex]?.name ?? '?'}</h2>
          <p>Turno: ${state.players[state.currentPlayerIndex]?.name ?? '?'} • Colore attivo: ${state.activeColor}</p>
        </div>
        <div class="pill">Draw Stack: ${state.drawStack}</div>
      </div>
      <div class="sr-only" aria-live="assertive" aria-atomic="true">
        ${selectedMode === 'single' && state.currentPlayerIndex === 0 ? 'E il tuo turno.' : `Turno di ${state.players[state.currentPlayerIndex]?.name ?? '?'}.`}
      </div>
      <div class="opponents">${opponents}</div>
      <div class="table-area">
        <button class="deck" data-action="draw" aria-label="Pesca carta dal mazzo" type="button" ${myTurn ? '' : 'disabled'}>PESCA</button>
        <div class="discard ${colorClass(topCard.color)}" aria-label="Carta scartata: ${cardLabel(topCard)} ${colorLabel(topCard.color)}">${cardLabel(topCard)}</div>
      </div>
      ${colorPicker}
      <div class="hand">${hand}</div>
      <div class="game-actions">
        <button class="btn-ghost" data-action="say-uno" ${myTurn ? '' : 'disabled'}>Dichiara UNO</button>
        <button class="btn-ghost" data-action="draw" ${myTurn ? '' : 'disabled'}>Pesca Carta</button>
        <button class="btn-ghost" data-action="stop-game">Abbandona Match</button>
      </div>
      <div class="log" aria-live="polite" aria-atomic="false">${gameLog.slice(0, 6).map((x) => `<button type="button" class="log-entry">${x}</button>`).join('')}</div>
    </section>
  `;
}

export function renderPlay(): string {
  const handoffSection =
    engine && showHandoffScreen
      ? `
      <section class="panel handoff">
        <h2>E il turno di ${handoffPlayerName}</h2>
        <p>Passa il dispositivo a ${handoffPlayerName} e premi il bottone quando sei pronto.</p>
        <button class="btn-primary" data-action="confirm-handoff" type="button" aria-label="Conferma passaggio turno a ${handoffPlayerName}">Sono ${handoffPlayerName}, sono pronto!</button>
      </section>
    `
      : '';

  return `
    ${renderGameMatrix()}
    ${engine ? (showHandoffScreen ? handoffSection : renderUnoBoard()) : ''}
  `;
}

export function stopGame(): void {
  engine = null;
  gameLog = [];
  showHandoffScreen = false;
  handoffPlayerName = '';
  clearPendingWild();
  clearAiTimer();
  renderCallback?.();
}

export function startMode(): void {
  selectedGame = 'uno';
  showHandoffScreen = false;
  handoffPlayerName = '';

  if (selectedMode === 'single') {
    selectedPlayers = 2;
    engine = new UnoEngine(2);
  } else {
    engine = new UnoEngine(selectedPlayers);
    engine.state.players.forEach((player, index) => {
      player.isAI = false;
      player.name = `Giocatore ${index + 1}`;
    });
  }

  gameLog = [
    `Partita UNO avviata (${selectedMode === 'single' ? '1v1 vs AI' : `${selectedPlayers} giocatori locali`}).`
  ];
  renderCallback?.();

  if (selectedMode === 'single') {
    triggerAi();
  }
}

function triggerAi(): void {
  if (selectedMode !== 'single') return;
  if (!engine) return;
  runAiIfNeeded({
    engine,
    onMessage: (message) => {
      gameLog.unshift(message);
    },
    onWin: (winner) => {
      const won = winner === 'Tu';
      registerWin(won);
      notify(won ? 'Hai vinto!' : `${winner} vince!`);
      stopGame();
    },
    onRender: () => {
      renderCallback?.();
    }
  });
}

export function handlePlayAction(action: string, actor: HTMLElement): boolean {
  if (action === 'pick-game' && actor.dataset.game === 'uno') {
    selectedGame = 'uno';
    renderCallback?.();
    return true;
  }

  if (action === 'confirm-handoff') {
    showHandoffScreen = false;
    renderCallback?.();
    return true;
  }

  if (action === 'start-mode') {
    startMode();
    return true;
  }

  if (action === 'stop-game') {
    stopGame();
    return true;
  }

  if (action === 'draw' && engine && isHumanTurn(engine.state) && !showHandoffScreen) {
    const previousIndex = engine.state.currentPlayerIndex;
    const message = engine.drawForCurrent();
    pushGameplayMessage(message);

    if (selectedMode === 'local' && previousIndex !== engine.state.currentPlayerIndex) {
      showHandoffScreen = true;
      handoffPlayerName = engine.state.players[engine.state.currentPlayerIndex]?.name ?? 'Giocatore successivo';
    }

    renderCallback?.();
    focusAfterAction();
    triggerAi();
    return true;
  }

  if (action === 'say-uno' && engine && isHumanTurn(engine.state) && !showHandoffScreen) {
    engine.sayUno();
    if (engine.getCurrentPlayer().hand.length === 1) {
      gameLog.unshift('UNO dichiarato! Ora gioca la tua ultima carta.');
    } else {
      gameLog.unshift('UNO dichiarato.');
    }
    renderCallback?.();
    focusAfterAction();
    return true;
  }

  if (action === 'play-card' && engine && isHumanTurn(engine.state) && !showHandoffScreen) {
    const previousIndex = engine.state.currentPlayerIndex;
    const index = Number(actor.dataset.index ?? '-1');
    const card = engine.getCurrentPlayer().hand[index];
    if (card && (card.value === 'wild' || card.value === 'wild4')) {
      setPendingWild(index);
      renderCallback?.();
      scheduleFrame(() => {
        const picker = document.querySelector('.color-picker button') as HTMLElement | null;
        picker?.focus();
      });
      return true;
    }

    const message = engine.playFromCurrent(index);
    pushGameplayMessage(message);

    if (engine.state.winner) {
      const won = engine.state.winner === 'Tu';
      registerWin(won);
      notify(won ? 'Hai vinto!' : `${engine.state.winner} vince!`);
      stopGame();
      return true;
    }

    renderCallback?.();

    if (selectedMode === 'local' && previousIndex !== engine.state.currentPlayerIndex) {
      showHandoffScreen = true;
      handoffPlayerName = engine.state.players[engine.state.currentPlayerIndex]?.name ?? 'Giocatore successivo';
      renderCallback?.();
      return true;
    }

    focusAfterAction();
    triggerAi();
    return true;
  }

  if (action === 'choose-color' && engine && pendingWildIndex !== null && !showHandoffScreen) {
    const previousIndex = engine.state.currentPlayerIndex;
    const color = actor.dataset.color as Exclude<CardColor, 'wild'> | undefined;
    if (!color) return true;

    const index = pendingWildIndex;
    clearPendingWild();
    const message = engine.playFromCurrent(index, color);
    pushGameplayMessage(message);

    if (engine.state.winner) {
      const won = engine.state.winner === 'Tu';
      registerWin(won);
      notify(won ? 'Hai vinto!' : `${engine.state.winner} vince!`);
      stopGame();
      return true;
    }

    renderCallback?.();

    if (selectedMode === 'local' && previousIndex !== engine.state.currentPlayerIndex) {
      showHandoffScreen = true;
      handoffPlayerName = engine.state.players[engine.state.currentPlayerIndex]?.name ?? 'Giocatore successivo';
      renderCallback?.();
      return true;
    }

    focusAfterAction();
    triggerAi();
    return true;
  }

  return false;
}
