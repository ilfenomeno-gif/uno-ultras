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

let currentScreen: ScreenId = resolveScreenFromPath(location.pathname);
let selectedGame: MiniGameId = 'uno';
let selectedPlayers: PlayersMode = '1v1';

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

  if (action === 'legacy') {
    window.open('/legacy/uno_ultra_v52.html', '_blank', 'noopener,noreferrer');
    return;
  }

  if (action === 'open-screen' && actionElement.dataset.target) {
    navigateTo(actionElement.dataset.target as ScreenId);
  }
});

window.addEventListener('popstate', () => {
  currentScreen = resolveScreenFromPath(location.pathname);
  render(currentScreen);
});

navigateTo(currentScreen, false);

