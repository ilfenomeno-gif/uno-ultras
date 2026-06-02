import './styles/main.scss';

type ScreenId = 'play' | 'store' | 'garage' | 'club' | 'profile' | 'settings';

type HeroContent = {
  kicker: string;
  title: string;
  subtitle: string;
  heroValue: string;
  heroLabel: string;
};

type MiniGameId =
  | 'uno'
  | 'ruba'
  | 'scopa'
  | 'poker'
  | 'burraco'
  | 'blackjack'
  | 'millemiglia'
  | 'scala40';

type PlayersMode = '1v1' | '3p' | '4p';
type OnlineView = 'menu' | 'join' | 'room';

type FriendLobby = {
  host: string;
  code: string;
  mode: string;
  players: string;
  open: boolean;
};

const HERO_CONTENT: Record<ScreenId, HeroContent> = {
  play: {
    kicker: 'Hub Modalita',
    title: 'Tutte le modalita pronte da avviare',
    subtitle: 'UNO, Ruba Mazzetto, Scopa, Poker, Burraco, Blackjack, Millemiglia e Scala 40 con lobby 1v1, 3 e 4 giocatori.',
    heroValue: '24',
    heroLabel: 'Combinazioni gioco/modalita'
  },
  store: {
    kicker: 'Shop',
    title: 'Negozio interno completo',
    subtitle: 'Pagina dedicata con sezioni bundle, casse, pass e crediti premium.',
    heroValue: '3',
    heroLabel: 'Categorie principali'
  },
  garage: {
    kicker: 'Garage',
    title: 'Preset, skin e setup partita',
    subtitle: 'Gestione loadout, tavoli, effetti e profili rapidi per ogni modalita.',
    heroValue: '8',
    heroLabel: 'Preset disponibili'
  },
  club: {
    kicker: 'Club',
    title: 'Centro squadra e tornei',
    subtitle: 'Gestione membri, inviti, missioni e calendario eventi del club.',
    heroValue: '12',
    heroLabel: 'Membri online'
  },
  profile: {
    kicker: 'Profilo',
    title: 'Titoli, classifica e storico',
    subtitle: 'Panoramica completa rank, titoli sbloccabili e progressione stagionale.',
    heroValue: '1482',
    heroLabel: 'MMR profilo'
  },
  settings: {
    kicker: 'Impostazioni',
    title: 'Pagina impostazioni dedicata',
    subtitle: 'Audio, grafica, accessibilita, rete e controlli in una schermata completa.',
    heroValue: '16',
    heroLabel: 'Controlli disponibili'
  }
};

const MINI_GAMES: Array<{ id: MiniGameId; label: string; icon: string; desc: string }> = [
  { id: 'uno', label: 'UNO', icon: '🎴', desc: 'Classico competitivo e varianti online.' },
  { id: 'ruba', label: 'Ruba Mazzetto', icon: '🃏', desc: 'Controllo tavolo e furto combinazioni.' },
  { id: 'scopa', label: 'Scopa', icon: '🧹', desc: 'Modalita italiana con conteggio tradizionale.' },
  { id: 'poker', label: 'Poker', icon: '♠️', desc: 'Tavolo texas style con showdown completo.' },
  { id: 'burraco', label: 'Burraco', icon: '🎯', desc: 'Pozzetti, chiusura e gestione combinazioni.' },
  { id: 'blackjack', label: 'Blackjack', icon: '🂡', desc: 'Banco, split, double e serie multi-player.' },
  { id: 'millemiglia', label: 'Millemiglia', icon: '🏁', desc: 'Carte corsa, ostacoli e contromisure.' },
  { id: 'scala40', label: 'Scala 40', icon: '🎴', desc: 'Scale, tris, jolly e regole complete.' }
];

const PLAYERS_MODES: Array<{ id: PlayersMode; label: string }> = [
  { id: '1v1', label: '1v1' },
  { id: '3p', label: '3 giocatori' },
  { id: '4p', label: '4 giocatori' }
];

const LEGACY_MECHANICS = [
  'Multiplayer Lobby',
  'Friends & Inviti',
  'Grand Prix',
  'Torneo 32',
  'Season Pass',
  'Challenges',
  'MMR Progressione',
  'Titoli Sbloccabili',
  'Replay Viewer',
  'The Lab',
  'Spectator Mode',
  'Quick Chat',
  'Profile Publico',
  'Queue Matchmaking',
  'Crate System',
  'Settings Avanzate'
];

const RANKS = [
  'Bronzo I',
  'Bronzo II',
  'Bronzo III',
  'Argento I',
  'Argento II',
  'Argento III',
  'Oro I',
  'Oro II',
  'Oro III',
  'Platino I',
  'Platino II',
  'Platino III',
  'Diamante I',
  'Diamante II',
  'Diamante III',
  'Campione I',
  'Campione II',
  'Campione III',
  'Grande Campione',
  'SSL'
];

const TITLES = [
  'Architetto del Caos',
  'Creatura del Vuoto',
  'Jolly del Mazzo',
  'Leggenda di UNO',
  'Maestro di Scala 40',
  'Re dei Ladri',
  'Dio del 21',
  'World Champion Supreme'
];

const FRIEND_LOBBIES: FriendLobby[] = [
  { host: 'Luca', code: 'UNO-42A9', mode: 'UNO · 1v1', players: '1/2', open: true },
  { host: 'Nina', code: 'RUBA-91QX', mode: 'Ruba · 4P', players: '3/4', open: true },
  { host: 'Marco', code: 'SCOPA-7PK2', mode: 'Scopa · 1v1', players: '2/2', open: false }
];

let currentScreen: ScreenId = resolveScreenFromPath(location.pathname);
let selectedGame: MiniGameId = 'uno';
let selectedPlayers: PlayersMode = '1v1';
let onlineView: OnlineView = 'menu';
let joinCode = '';
let joinError = '';
let activeLobbyCode = '';
let lobbyPlayers = ['Giocatore (Host)'];

function createLobbyCode(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

function validateJoinCode(code: string): string {
  if (!code) return 'Inserisci un codice lobby.';
  if (!/^[A-Z0-9]{3,12}-[A-Z0-9]{3,12}$/.test(code)) {
    return 'Formato codice non valido. Esempio: UNO-42A9';
  }
  return '';
}

function findLobbyByCode(code: string): FriendLobby | undefined {
  const normalized = code.trim().toUpperCase();
  return FRIEND_LOBBIES.find((lobby) => lobby.code === normalized);
}

function renderOnlineMenu(): string {
  return `
    <section class="online-tour" aria-label="Tour multiplayer online">
      <header class="online-head">
        <p class="online-kicker">Multiplayer Experience</p>
        <h2>Menu Online</h2>
        <p>Accesso immediato: crea una lobby o unisciti in pochi secondi.</p>
      </header>
      <div class="online-big-cta-row">
        <button class="online-big-cta" data-action="online-menu-create">CREA LOBBY</button>
        <button class="online-big-cta" data-action="online-menu-join">UNISCITI</button>
      </div>
    </section>
  `;
}

function renderOnlineJoin(): string {
  const friendRows = FRIEND_LOBBIES.map((lobby) => {
    const stateClass = lobby.open ? 'is-open' : 'is-closed';
    const stateLabel = lobby.open ? 'Aperta' : 'Chiusa';
    const action = lobby.open
      ? `<button class="inline-btn" data-action="online-join" data-code="${lobby.code}">Entra</button>`
      : '<span class="inline-link" aria-disabled="true">Non disponibile</span>';

    return `
      <li class="online-friend-row ${stateClass}">
        <div>
          <strong>${lobby.host}</strong>
          <small>${lobby.mode} · ${lobby.players}</small>
        </div>
        <div class="online-friend-actions">
          <span class="online-state">${stateLabel}</span>
          ${action}
        </div>
      </li>
    `;
  }).join('');

  return `
    <section class="online-tour" aria-label="Join lobby online">
      <header class="online-head">
        <p class="online-kicker">Join</p>
        <h2>Unisciti alla Lobby</h2>
      </header>
      <div class="online-join-tools">
        <input
          class="online-code-input"
          type="text"
          value="${joinCode}"
          placeholder="Inserisci codice (es. UNO-42A9)"
          autocomplete="off"
          data-online-code="true"
          aria-label="Codice lobby"
        />
        <button class="inline-btn" data-action="online-join">Entra con codice</button>
        <button class="inline-btn" data-action="online-quick-join">Quick Join</button>
        <button class="inline-link" data-action="online-back-menu">Indietro</button>
      </div>
      <p class="online-join-feedback ${joinError ? 'is-error' : 'is-ok'}">${joinError || 'Inserisci codice o usa Quick Join.'}</p>
      <ul class="online-friend-list" aria-label="Lobby amici">${friendRows}</ul>
    </section>
  `;
}

function renderOnlineRoom(): string {
  const players = lobbyPlayers
    .map((player, index) => `<li class="online-player ${index === 0 ? 'is-host' : ''}">${player}</li>`)
    .join('');

  return `
    <section class="online-tour" aria-label="Lobby room">
      <div class="online-room-top">
        <div class="online-room-code">Codice: <strong>${activeLobbyCode || '----'}</strong></div>
        <div class="online-room-top-actions">
          <button class="inline-btn" data-action="online-copy-code">Copia</button>
          <button class="inline-link" data-action="online-leave">Esci</button>
        </div>
      </div>

      <div class="online-room-split">
        <div class="online-room-left">
          <h3>Gestione Lobby</h3>
          <div class="online-room-controls">
            <label>
              Modalita
              <select data-action="online-select-game">
                ${MINI_GAMES.map((game) => `<option value="${game.id}" ${game.id === selectedGame ? 'selected' : ''}>${game.label}</option>`).join('')}
              </select>
            </label>
            <label>
              Giocatori
              <select data-action="online-select-players">
                ${PLAYERS_MODES.map((mode) => `<option value="${mode.id}" ${mode.id === selectedPlayers ? 'selected' : ''}>${mode.label}</option>`).join('')}
              </select>
            </label>
          </div>
          <button class="online-big-cta" data-action="legacy">AVVIA PARTITA</button>
        </div>

        <div class="online-room-right">
          <h3>Partecipanti</h3>
          <ul class="online-players-list">${players}</ul>
          <button class="inline-link" data-action="online-back-menu">Torna al menu online</button>
        </div>
      </div>
    </section>
  `;
}

function renderOnlineTour(): string {
  if (onlineView === 'join') return renderOnlineJoin();
  if (onlineView === 'room') return renderOnlineRoom();
  return renderOnlineMenu();
}

function resolveScreenFromPath(pathname: string): ScreenId {
  const path = pathname.toLowerCase();
  if (path.endsWith('/store')) return 'store';
  if (path.endsWith('/garage')) return 'garage';
  if (path.endsWith('/club')) return 'club';
  if (path.endsWith('/profile')) return 'profile';
  if (path.endsWith('/settings')) return 'settings';
  return 'play';
}

function pathForScreen(screen: ScreenId): string {
  if (screen === 'play') return '/';
  return `/${screen}`;
}

function getScreenLabel(screen: ScreenId): string {
  switch (screen) {
    case 'play':
      return 'Gioca';
    case 'store':
      return 'Negozio';
    case 'garage':
      return 'Garage';
    case 'club':
      return 'Club';
    case 'profile':
      return 'Profilo';
    case 'settings':
      return 'Impostazioni';
  }
}

function renderGameMatrix(): string {
  return MINI_GAMES.map((game) => {
    const active = game.id === selectedGame;
    const rows = PLAYERS_MODES.map((mode) => {
      const isSelectedMode = selectedPlayers === mode.id;
      const matchupLabel = `${game.label} - ${mode.label}`;
      return `
        <div class="mode-row ${isSelectedMode ? 'mode-row-active' : ''}">
          <div class="mode-row-label">${matchupLabel}</div>
          <div class="mode-row-actions">
            <button class="inline-btn" data-action="open-mode" data-game="${game.id}" data-mode="${mode.id}">Apri pagina</button>
            <a class="inline-link" href="/legacy/uno_ultra_v52.html" target="_blank" rel="noopener noreferrer">Legacy</a>
          </div>
        </div>
      `;
    }).join('');

    return `
      <article class="mode-card ${active ? 'mode-card-active' : ''}">
        <button class="mode-card-head" data-action="pick-game" data-game="${game.id}">
          <span class="mode-card-icon">${game.icon}</span>
          <span>
            <strong>${game.label}</strong>
            <small>${game.desc}</small>
          </span>
        </button>
        <div class="mode-card-body">
          ${rows}
        </div>
      </article>
    `;
  }).join('');
}

function renderPlaySection(): string {
  return `
    ${renderOnlineTour()}

    <section class="content-block">
      <div class="section-head">
        <h2>Modalita complete</h2>
        <div class="chip-row">
          ${PLAYERS_MODES.map(
            (mode) =>
              `<button class="chip-btn ${mode.id === selectedPlayers ? 'chip-btn-active' : ''}" data-action="pick-players" data-mode="${mode.id}">${mode.label}</button>`
          ).join('')}
        </div>
      </div>
      <div class="mode-grid">
        ${renderGameMatrix()}
      </div>
    </section>

    <section class="content-block">
      <div class="section-head">
        <h2>Meccaniche e bottoni legacy</h2>
        <a class="inline-link" href="/legacy/uno_ultra_v52.html" target="_blank" rel="noopener noreferrer">Apri monolite completo</a>
      </div>
      <div class="legacy-buttons">
        ${LEGACY_MECHANICS.map(
          (item) =>
            `<a class="legacy-btn" href="/legacy/uno_ultra_v52.html" target="_blank" rel="noopener noreferrer">${item}</a>`
        ).join('')}
      </div>
    </section>
  `;
}

function renderStoreSection(): string {
  return `
    <section class="content-block three-cols">
      <article class="feature-card feature-card-teal">
        <h2>Bundle Settimanali</h2>
        <p>Rotazione articoli premium e offerte tempo limitato.</p>
        <button class="inline-btn" data-action="legacy">Apri bundle</button>
      </article>
      <article class="feature-card feature-card-amber">
        <h2>Casse e Drop</h2>
        <p>Crate comuni, rare e leggendarie con effetti esclusivi.</p>
        <button class="inline-btn" data-action="legacy">Apri casse</button>
      </article>
      <article class="feature-card feature-card-rose">
        <h2>Season Pass</h2>
        <p>Progressione premium con titoli, avatar e ricompense.</p>
        <button class="inline-btn" data-action="legacy">Apri pass</button>
      </article>
    </section>
  `;
}

function renderGarageSection(): string {
  return `
    <section class="content-block two-cols">
      <article class="panel-card">
        <h2>Preset tavolo</h2>
        <p>Configura temi, mazzi, animazioni e effetti sonori per partita.</p>
      </article>
      <article class="panel-card">
        <h2>Setup rapido</h2>
        <p>Profili separati per 1v1, 3 giocatori e 4 giocatori.</p>
      </article>
    </section>
  `;
}

function renderClubSection(): string {
  return `
    <section class="content-block two-cols">
      <article class="panel-card">
        <h2>Roster club</h2>
        <p>Gestione membri, inviti, online status e ruoli squadra.</p>
      </article>
      <article class="panel-card">
        <h2>Tornei e missioni</h2>
        <p>Calendario tornei interni e progressione cooperativa.</p>
      </article>
    </section>
  `;
}

function renderProfileSection(): string {
  return `
    <section class="content-block two-cols">
      <article class="panel-card">
        <h2>Classifica rank</h2>
        <ul class="clean-list">
          ${RANKS.map((rank) => `<li>${rank}</li>`).join('')}
        </ul>
      </article>
      <article class="panel-card">
        <h2>Titoli principali</h2>
        <ul class="clean-list">
          ${TITLES.map((title) => `<li>${title}</li>`).join('')}
        </ul>
      </article>
    </section>
  `;
}

function renderSettingsSection(): string {
  return `
    <section class="content-block two-cols">
      <article class="panel-card">
        <h2>Audio e grafica</h2>
        <p>Controlli rapidi per volume, effetti, contrasto e performance.</p>
        <div class="toggle-row"><span>Riduzione motion</span><span class="toggle-pill">On</span></div>
        <div class="toggle-row"><span>Modalita colorblind</span><span class="toggle-pill">Off</span></div>
      </article>
      <article class="panel-card">
        <h2>Rete e accessibilita</h2>
        <p>Profilo connessione, ping, input assistito e annunci vocali.</p>
        <div class="toggle-row"><span>NVDA assist</span><span class="toggle-pill">On</span></div>
        <div class="toggle-row"><span>Input semplificato</span><span class="toggle-pill">Off</span></div>
      </article>
    </section>
  `;
}

function renderScreenContent(screen: ScreenId): string {
  switch (screen) {
    case 'play':
      return renderPlaySection();
    case 'store':
      return renderStoreSection();
    case 'garage':
      return renderGarageSection();
    case 'club':
      return renderClubSection();
    case 'profile':
      return renderProfileSection();
    case 'settings':
      return renderSettingsSection();
  }
}

function renderAppShell(activeScreen: ScreenId): string {
  const content = HERO_CONTENT[activeScreen];
  return `
    <main class="app-shell" data-current-screen="${activeScreen}">
      <div id="live-announcer" class="sr-only" role="status" aria-live="polite">Schermata attiva: ${getScreenLabel(activeScreen)}</div>
      <header class="hero-panel" aria-label="Panoramica schermata">
        <div class="hero-copy">
          <p class="hero-kicker">${content.kicker}</p>
          <h1>${content.title}</h1>
          <p class="hero-sub">${content.subtitle}</p>
          <div class="hero-actions">
            <button class="action-btn action-btn-primary" data-action="open-screen" data-target="${activeScreen}">Apri pagina ${getScreenLabel(activeScreen)}</button>
            <a class="action-btn action-btn-ghost" href="/legacy/uno_ultra_v52.html" target="_blank" rel="noopener noreferrer">Apri Legacy</a>
          </div>
        </div>
        <aside class="hero-metric" aria-label="Metrica principale">
          <div class="hero-metric-value">${content.heroValue}</div>
          <div class="hero-metric-label">${content.heroLabel}</div>
          <div class="hero-metric-pulse" aria-hidden="true"></div>
        </aside>
      </header>
      ${renderScreenContent(activeScreen)}
    </main>
  `;
}

function updateMenuState(screen: ScreenId): void {
  document.querySelectorAll('.menu-btn').forEach((button) => {
    const element = button as HTMLButtonElement;
    const isActive = element.dataset.screen === screen;
    element.classList.toggle('is-active', isActive);
    element.setAttribute('aria-pressed', String(isActive));
  });
}

function render(screen: ScreenId): void {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = renderAppShell(screen);
  updateMenuState(screen);
}

function navigateTo(screen: ScreenId, pushHistory = true): void {
  currentScreen = screen;
  if (pushHistory) {
    history.pushState({ screen }, '', pathForScreen(screen));
  }
  render(screen);
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const menuButton = target.closest('.menu-btn') as HTMLButtonElement | null;
  if (menuButton?.dataset.screen) {
    navigateTo(menuButton.dataset.screen as ScreenId);
    return;
  }

  const actionElement = target.closest('[data-action]') as HTMLElement | null;
  const action = actionElement?.dataset.action;

  if (action === 'pick-game' && actionElement.dataset.game) {
    selectedGame = actionElement.dataset.game as MiniGameId;
    render(currentScreen);
    return;
  }

  if (action === 'pick-players' && actionElement.dataset.mode) {
    selectedPlayers = actionElement.dataset.mode as PlayersMode;
    render(currentScreen);
    return;
  }

  if (action === 'open-mode' && actionElement.dataset.game && actionElement.dataset.mode) {
    selectedGame = actionElement.dataset.game as MiniGameId;
    selectedPlayers = actionElement.dataset.mode as PlayersMode;
    const announcer = document.getElementById('live-announcer');
    if (announcer) {
      announcer.textContent = `Modalita selezionata: ${selectedGame} ${selectedPlayers}`;
    }
    window.open('/legacy/uno_ultra_v52.html', '_blank', 'noopener,noreferrer');
    return;
  }

  if (action === 'online-menu-create' || action === 'online-create') {
    activeLobbyCode = createLobbyCode(selectedGame.toUpperCase());
    lobbyPlayers = ['Giocatore (Host)'];
    joinError = '';
    onlineView = 'room';
    render(currentScreen);
    return;
  }

  if (action === 'online-menu-join') {
    joinError = '';
    onlineView = 'join';
    render(currentScreen);
    return;
  }

  if (action === 'online-back-menu') {
    joinError = '';
    onlineView = 'menu';
    render(currentScreen);
    return;
  }

  if (action === 'online-quick-join') {
    const openLobby = FRIEND_LOBBIES.find((lobby) => lobby.open);
    if (!openLobby) {
      joinError = 'Nessuna lobby aperta al momento.';
      render(currentScreen);
      return;
    }
    activeLobbyCode = openLobby.code;
    lobbyPlayers = [`${openLobby.host} (Host)`, 'Giocatore'];
    joinError = '';
    onlineView = 'room';
    render(currentScreen);
    return;
  }

  if (action === 'online-join') {
    const codeFromButton = actionElement.dataset.code || joinCode;
    const normalizedCode = codeFromButton.trim().toUpperCase();
    const validationError = validateJoinCode(normalizedCode);
    if (validationError) {
      joinError = validationError;
      render(currentScreen);
      return;
    }

    const lobby = findLobbyByCode(normalizedCode);
    if (!lobby) {
      joinError = 'Lobby non trovata.';
      render(currentScreen);
      return;
    }

    if (!lobby.open) {
      joinError = 'Lobby chiusa.';
      render(currentScreen);
      return;
    }

    activeLobbyCode = lobby.code;
    lobbyPlayers = [`${lobby.host} (Host)`, 'Giocatore'];
    joinError = '';
    onlineView = 'room';
    render(currentScreen);
    return;
  }

  if (action === 'online-copy-code') {
    if (activeLobbyCode) {
      navigator.clipboard?.writeText(activeLobbyCode).catch(() => {
        // Fallback silenzioso: in ambienti non sicuri la clipboard puo fallire.
      });
    }
    return;
  }

  if (action === 'online-leave' || action === 'online-leave-room') {
    onlineView = 'menu';
    activeLobbyCode = '';
    joinError = '';
    lobbyPlayers = ['Giocatore (Host)'];
    render(currentScreen);
    return;
  }

  if (action === 'legacy') {
    window.open('/legacy/uno_ultra_v52.html', '_blank', 'noopener,noreferrer');
    return;
  }

  if (action === 'open-screen' && actionElement.dataset.target) {
    navigateTo(actionElement.dataset.target as ScreenId);
  }
});

document.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;
  const codeInput = target.closest('[data-online-code]') as HTMLInputElement | null;
  if (!codeInput) return;
  joinCode = codeInput.value.toUpperCase();
  joinError = validateJoinCode(joinCode);
  const feedback = document.querySelector('.online-join-feedback') as HTMLElement | null;
  if (!feedback) return;
  if (joinError) {
    feedback.textContent = joinError;
    feedback.classList.add('is-error');
    feedback.classList.remove('is-ok');
  } else {
    feedback.textContent = 'Codice valido, puoi entrare.';
    feedback.classList.remove('is-error');
    feedback.classList.add('is-ok');
  }
});

document.addEventListener('change', (event) => {
  const target = event.target as HTMLElement;
  const gameSelect = target.closest('[data-action="online-select-game"]') as HTMLSelectElement | null;
  if (gameSelect) {
    selectedGame = gameSelect.value as MiniGameId;
    return;
  }

  const playersSelect = target.closest('[data-action="online-select-players"]') as HTMLSelectElement | null;
  if (playersSelect) {
    selectedPlayers = playersSelect.value as PlayersMode;
  }
});

window.addEventListener('popstate', () => {
  currentScreen = resolveScreenFromPath(location.pathname);
  render(currentScreen);
});

navigateTo(currentScreen, false);

