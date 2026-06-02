import './styles/main.scss';
import { notify } from './core/notify';
import { findAccountById, getActiveAccount, getRankLabel, hasActiveAccount, listAccountsWithProfiles, loginAccount, logoutAccount, profile, registerAccount, saveProfile } from './core/store';
import { handlePlayAction, setPlayRenderCallback, setSelectedGame, setSelectedMode, setSelectedPlayers, startMode, stopGame } from './screens/play';
import { handleSettingsInput } from './screens/settings';
import { renderActiveBoard, setBoardRenderCallback, startLoading, isLoading, handleBlackjackAction, handleRubaRuntimeAction } from './screens/render-board';
import { renderLobbyScreen } from './screens/screen-lobby';
import { RULEBOOK } from './game/rulebook';
import type { GameId, GameMode, HubScreen, PlayersMode } from './game/types';
import { createLobbyOnline, initMultiplayerSync, joinLobbyOnline, leaveLobbyOnline, setOnlineReady, startOnlineGame } from './multiplayer/mp-sync';
import { getLobbyState, setLobbyJoinCode, showLobby, hideLobby, subscribeLobbyState, updateLobbyState } from './multiplayer/lobby-state';
import { acceptRequest, declineRequest, friendList, inviteFriendToLobby, loadFriendList, pendingRequests, registerPlayer, renderFriendsPanel, searchPlayers, sendFriendRequest, setFriendsUpdateCallback, setupFriendListeners } from './multiplayer/friends';

type ModalTab = 'modalita' | 'giocatori';

let currentHub: HubScreen = 'gioca';
let modalOpen = false;
let updateOpen = false;
let modalTab: ModalTab = 'modalita';
let selectedGameId: GameId = 'uno';
let selectedPlayersNum: PlayersMode = 2;
let selectedModeStr: GameMode = 'single';
let competitiveEnabled = false;
let authMode: 'login' | 'register' = 'login';
let authOpen = false;
let profilePanelOpen = false;
let profilePanelTab: 'amici' | 'richieste' | 'club' = 'amici';
const BATTLE_CARD_BASE_COST = 950;
const BATTLE_CARD_UPGRADE_COST = 1050;
const BATTLE_CARD_UPGRADE_LEVELS = 5;

// Mappa asset: metti qui i PNG scaricati (es. via script downloader) in /public/assets/ui/
const EMOJI_ASSET_MAP: Record<string, string> = {
  '🎁': '/assets/ui/gift-box.png',
  '👑': '/assets/ui/crown.png',
  '🔥': '/assets/ui/fire.png',
  '⚡': '/assets/ui/lightning.png',
  '🛡️': '/assets/ui/shield.png',
  '🏆': '/assets/ui/trophy.png',
  '🏅': '/assets/ui/medal.png',
  '🏷️': '/assets/ui/tag.png',
  '💛': '/assets/ui/coin-heart.png',
  '✨': '/assets/ui/sparkle.png'
};

function getVisualAssetByEmoji(emoji: string): string | null {
  return EMOJI_ASSET_MAP[emoji] ?? null;
}

function renderVisualToken(emoji: string, label: string, className: string): string {
  const asset = getVisualAssetByEmoji(emoji);
  if (!asset) {
    return `<span class="${className}" aria-label="${escapeHtml(label)}">${escapeHtml(emoji)}</span>`;
  }

  return `
    <span class="${className} fn-visual-token" aria-label="${escapeHtml(label)}">
      <img
        class="fn-visual-token-img"
        src="${asset}"
        alt="${escapeHtml(label)}"
        loading="lazy"
        decoding="async"
        onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}"
      />
      <span class="fn-visual-token-fallback" style="display:none;" aria-hidden="true">${escapeHtml(emoji)}</span>
    </span>
  `;
}

function isOnlineMode(): boolean {
  return String(selectedModeStr).toLowerCase() === 'online';
}

type NewsEntry = {
  id: string;
  tag: string;
  titolo: string;
  desc: string;
  color: string;
  games: Array<GameId | 'all'>;
  modes?: Array<GameMode | 'all'>;
};

type TitleGroup = {
  key: string;
  icon: string;
  name: string;
  titles: string[];
};

type ShopItem = {
  id: string;
  nome: string;
  tipo: string;
  costo: number;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  itemType: 'title-pack' | 'title-single' | 'title-all' | 'bundle' | 'boost' | 'skin' | 'locker-reward';
  itemValue: string;
};

type UnlockSource = 'mission' | 'battlecard' | 'shop';
type LockerRewardCategory = 'targhette' | 'cornici-avatar' | 'stile-carte' | 'avatar-personalizzabile' | 'emoji-centrale' | 'effetti-visivi';

type LockerReward = {
  id: string;
  nome: string;
  emoji: string;
  category: LockerRewardCategory;
  source: UnlockSource;
  levelReq?: number;
  winsReq?: number;
  gamesReq?: number;
  cost?: number;
  titleValue?: string;
};

type LockerCategoryKey = 'targhette' | 'progresso-titoli' | 'cornici-avatar' | 'stile-carte' | 'avatar-personalizzabile' | 'emoji-centrale' | 'effetti-visivi';
type LockerTab = 'unlocked' | 'locked';

type LockerCatalogItem = {
  id: string;
  nome: string;
  emoji: string;
  desc: string;
  minWins?: number;
  minGames?: number;
  minLevel?: number;
  minCredits?: number;
};

type LockerRenderItem = {
  id: string;
  nome: string;
  emoji: string;
  desc: string;
  unlocked: boolean;
  active: boolean;
};

type SfideSectionKey = 'targhette' | 'progressione' | 'requisiti';

const NEWS_LIBRARY: NewsEntry[] = [
  {
    id: 'news-online-mode-switch',
    tag: 'ONLINE',
    titolo: 'CAMBIO MODALITA LIVE',
    desc: 'In lobby online ora puoi cambiare modalita (UNO, Ruba, Scala 40, Blackjack e altre) senza reinvitare.',
    color: '#1fb6ff',
    games: ['all'],
    modes: ['online']
  },
  {
    id: 'news-uno-titles',
    tag: 'UNO',
    titolo: '25 TARGHETTE UNO',
    desc: 'Nuova progressione completa UNO: da Principiante fino a DIVINITA DI UNO.',
    color: '#f5c518',
    games: ['uno'],
    modes: ['all']
  },
  {
    id: 'news-scala40-titles',
    tag: 'SCALA 40',
    titolo: 'SCALATA COMPLETA',
    desc: 'Pacchetto Scala 40 con 25 titoli: dai primi trittici all IMPERATORE DI SCALA.',
    color: '#65d8ff',
    games: ['scala40'],
    modes: ['all']
  },
  {
    id: 'news-ruba-titles',
    tag: 'RUBA',
    titolo: 'LADRI LEGGENDARI',
    desc: 'Progressione Ruba Mazzetto estesa con 25 targhette sbloccabili e bonus torneo 32.',
    color: '#ff6b6b',
    games: ['ruba'],
    modes: ['all']
  },
  {
    id: 'news-blackjack-titles',
    tag: 'BLACKJACK',
    titolo: 'ROAD TO 21',
    desc: 'Titoli blackjack completati: dal Principiante BJ fino al DIO DEL 21.',
    color: '#ff922b',
    games: ['blackjack'],
    modes: ['all']
  },
  {
    id: 'news-shop-title-packs',
    tag: 'SHOP',
    titolo: 'PACK TARGHETTE',
    desc: 'Nuovi pack nello shop per sbloccare blocchi di titoli per ogni modalita.',
    color: '#2ecc71',
    games: ['all'],
    modes: ['all']
  },
  {
    id: 'news-torneo-titles',
    tag: 'TORNEI',
    titolo: 'TITOLI TORNEO',
    desc: 'In tornei ora trovi liste dedicate titoli rank, modalita e UCS.',
    color: '#b197fc',
    games: ['all'],
    modes: ['all']
  }
];

const TITLE_GROUPS: TitleGroup[] = [
  {
    key: 'uno',
    icon: '🎴',
    name: 'UNO',
    titles: [
      'Principiante',
      'S1 - Bronzo',
      'S1 - Argento',
      'S1 - Oro',
      'S1 - Platino',
      'S1 - Diamante',
      'S1 - Campione',
      'S1 - Grande Campione',
      'S1 - Leggenda Supersonica',
      '⚡ Scarto Rapido',
      '➕ Maestro del +2',
      '💀 Incubo del +4',
      '🎨 Muro di Colore',
      '💡 Riflessi di Luce',
      '🎯 Tattico dell Ultima Carta',
      '🛡️ Sentinella del Mazzo',
      '🦅 Predatore di Turni',
      '👻 Ombra del Salto',
      '🔄 Tiranno del Cambio Giro',
      '🏗️ Architetto dello Scarto',
      '🌟 Leggenda dell Uno',
      '🎭 Dominatore Cromatico',
      '🌑 Eclissi di Carte',
      '👑 Sovrano del Tavolo',
      '🃏 DIVINITA DI UNO'
    ]
  },
  {
    key: 'scala40',
    icon: '♠️',
    name: 'Scala 40',
    titles: [
      '🃏 Primo Trittico',
      '🎯 Esperto di Sequenze',
      '🃏 Collezionista di Jolly',
      '🧩 Stratega del Pozzo',
      '🧊 Calcolatore Freddo',
      '🏁 Maestro della Chiusura',
      '👑 Re dei Giochi Aperti',
      '⚗️ Alchimista di Carte',
      '🔮 Visionario del Burraco',
      '📐 Matematico del 40',
      '🏗️ Architetto di Scale',
      '🃏 Custode del Jolly',
      '🐉 Drago delle Sequenze',
      '🧠 Mente Superiore',
      '🎯 Infallibile',
      '🎓 Gran Maestro di Scala',
      '💀 Terrore del Mazzo',
      '🌄 Zenith delle Carte',
      '♾️ Infinito Quadrato',
      '👑 IMPERATORE DI SCALA',
      '🎴 Scalatore',
      '🎴 Re della Scala',
      '🎴 Maestro Scala 40',
      '🏆 Campione Scala 32',
      '👑 Gran Maestro Scala'
    ]
  },
  {
    key: 'ruba',
    icon: '🃏',
    name: 'Ruba Mazzetto',
    titles: [
      '🖐️ Mano Lesta',
      '🃏 Ladro di Mazzi Pro',
      '💎 Rapina Perfetta',
      '🌙 Predatore Notturno',
      '📦 Accumulatore Seriale',
      '💀 Terrore dei Punti',
      '👑 Re del Furto',
      '👤 Ombra Invisibile',
      '💰 Colpo Grosso',
      '🦅 Sguardo d Aquila',
      '🦅 Rapace del Tavolo',
      '🏴‍☠️ Bandito delle Carte',
      '💼 Maestro del Bottino',
      '🌬️ Inafferrabile',
      '👹 Tiranno del Mazzo',
      '🎩 Erede di Lupin',
      '🌟 Dominatore dei Punti',
      '⚡ Leggenda del Furto',
      '👻 Fantasma del Mazzo',
      '👑 RE DEI LADRI',
      '🃏 Ladro di Mazzi',
      '🃏 Re del Furto',
      '🃏 Maestro Ruba',
      '🏆 Campione Ruba 32',
      '🥇 Dominatore Furto'
    ]
  },
  {
    key: 'blackjack',
    icon: '🂡',
    name: 'Black Jack',
    titles: [
      '💸 Scommettitore Audace',
      '🎯 Occhio al 21',
      '🧊 Freddezza del Dealer',
      '🔱 Raddoppio d Oro',
      '📊 Strategia di Base',
      '🏰 Assedio al Banco',
      '🔮 Intuizione Vincente',
      '🎰 Mente da Casino',
      '🦈 Squalo del Blackjack',
      '💎 High Roller',
      '🃏 Asso nella Manica',
      '🎩 Colpo da Maestro',
      '📐 Architetto del 21',
      '💥 Distruttore del Banco',
      '🎰 Leggenda di Vegas',
      '♠️ Re delle Chip',
      '⚡ Sfidante Supremo',
      '🃏 Anima d Azzardo',
      '👑 DIO DEL 21',
      '🂡 Principiante BJ',
      '🂡 Mano Fortunata',
      '🂡 Contatore di Carte',
      '🂡 Il Baro',
      '🂡 Sfida al Banco',
      '🏆 Campione BJ 32'
    ]
  },
  {
    key: 'rank',
    icon: '🏅',
    name: 'Titoli Rank',
    titles: [
      '🥉 Campione Bronzo I',
      '🥉 Campione Bronzo II',
      '🥉 Campione Bronzo III',
      '🥈 Campione Argento I',
      '🥈 Campione Argento II',
      '🥈 Campione Argento III',
      '🥇 Campione Oro I',
      '🥇 Campione Oro II',
      '🥇 Campione Oro III',
      '💠 Campione Platino I',
      '💠 Campione Platino II',
      '💠 Campione Platino III',
      '💎 Campione Diamante I',
      '💎 Campione Diamante II',
      '💎 Campione Diamante III',
      '🏅 Campione Champion I',
      '🏅 Campione Champion II',
      '🏅 Campione Champion III',
      '🔥 Grande Campione I',
      '🔥 Grande Campione II',
      '🔥 Grande Campione III',
      '⚡ Leggenda Supersonica',
      '🏆 Campione del Torneo',
      '⚡ Semidio dell Olimpo',
      '🌌 ENTITA SUPREMA'
    ]
  },
  {
    key: 'scopa',
    icon: '🧹',
    name: 'Scopa - Zero Residuo',
    titles: [
      'Protocollo S',
      'Impulso Primario',
      'Tabula Rasa',
      'Dominio Assoluto',
      'Sovraccarico',
      'Collisione Finale',
      'Catena d Oro',
      'Impulso Cinetico',
      'Nucleo Attivo',
      'Settore Zero',
      'Impulso Secco',
      'Eclissi Totale',
      'Carica d Urto',
      'Oltre il Limite',
      'Zenith',
      'Reazione a Catena',
      'Flusso Costante',
      'Divisione Elite',
      'Incursione',
      'Titanio',
      'Frequenza Alta',
      'Punto di Rottura',
      'Eredita Settebello',
      'Orizzonte Eventi',
      'Architetti del Vuoto'
    ]
  },
  {
    key: 'burraco',
    icon: '🃏',
    name: 'Burraco - Sincronia Perfetta',
    titles: [
      'Flusso Sequenziale',
      'Nucleo Energetico',
      'Sintesi Pura',
      'Moltiplicatore',
      'Architettura Zero',
      'Frequenza Critica',
      'Algoritmo Perfetto',
      'Fase di Carica',
      'Integrazione Totale',
      'Punto d Iniezione',
      'Evoluzione',
      'Cristallo Liquido',
      'Risonanza',
      'Switch Finale',
      'Matrice Punti',
      'Sovratensione',
      'Progetto Infinito',
      'Rientro Orbitale',
      'Connessione Neurale',
      'Frammentazione Zero',
      'Nucleo Magnetico',
      'Punto di Estrazione',
      'Flusso Cobalto',
      'Sovrapposizione',
      'Codice d Onore'
    ]
  },
  {
    key: 'poker',
    icon: '♠️',
    name: 'Poker Texas - Oltre il Bluff',
    titles: [
      'Punto di Non Ritorno',
      'Oltre il Buio',
      'Corrente Letale',
      'Architetto d Ombre',
      'Calcolo a Freddo',
      'Impatto Iniziale',
      'Terrore Psicologico',
      'Sangue Freddo',
      'Verita d Acciaio',
      'Predatore del Piatto',
      'Scacco Matto',
      'Rotazione Critica',
      'Impulso Finale',
      'Visione X',
      'Dominio Totale',
      'Ultima Speranza',
      'Cyber-Bluff',
      'Muro Indistruttibile',
      'Protocollo Ombra',
      'Fuoco Incrociato',
      'Punto Cieco',
      'Detonazione',
      'Mente Alveare',
      'Eredita dei Re',
      'Vuoto d Aria'
    ]
  },
  {
    key: 'millemiglia',
    icon: '🚗',
    name: 'Millemiglia - Velocita Terminale',
    titles: [
      'Oltre la Barriera',
      'Accensione',
      'Resistenza Estrema',
      'Intervento Rapido',
      'Protocollo 1000',
      'Blocco Totale',
      'Corsa Infinita',
      'Conto alla Rovescia',
      'Asfalto Liquido',
      'Spinta Idraulica',
      'Traiettoria Ideale',
      'Backup Energetico',
      'Orizzonte Mille',
      'Iniezione Diretta',
      'Vento di Fuoco',
      'Codice Colore',
      'Meccanica Quantistica',
      'Oltre il Traguardo',
      'Impulso Stradale',
      'Vuoto Aerodinamico',
      'Titanio e Cromo',
      'Reazione Zero',
      'Evoluzione Corsa',
      'Rigenerazione',
      'Ultimo Chilometro'
    ]
  },
  {
    key: 'extra',
    icon: '⭐',
    name: 'Titoli Extra',
    titles: [
      'Fastest Hand S1',
      'No Mercy',
      'Senza Pieta',
      'Instancabile',
      'Veterano di Ultra',
      'Leggenda Vivente',
      'Il Terrore dei +4',
      'Ultima Parola',
      'Fantasma',
      'Il Mago del +4',
      'Pescato dal Destino',
      'Quasi SSL',
      'Creatura del Vuoto',
      'Anomalia',
      '010101',
      'Fortunato',
      'Collezionista',
      'Jolly del Mazzo',
      '🎖️ Il Veterano',
      '💀 Terrore dei Bot',
      '🔥 10 Vittorie di Fila',
      '🌑 Oscurita Totale',
      '👑 Dio di UNO',
      '⚡ Velocista',
      '🌪️ Caos Totale',
      'S1 - Fastest Hand',
      'S1 - World Champion',
      'S1 - Leggenda Senza Tempo',
      '⚡ Iniziato del Pass',
      '🔥 Percorso Acceso',
      '💎 Portatore del Pass',
      '🌟 Veterano della Stagione',
      '👑 SIGNORE DEL PASS'
    ]
  },
  {
    key: 'club',
    icon: '👥',
    name: 'Club',
    titles: [
      '👥 Membro del Club',
      '⚔️ Club Warrior',
      '🏅 Club Champion',
      '🌟 Club Legend',
      '📋 Missione Compiuta',
      '🎖️ Cacciatore di Missioni',
      '⚡ Potenziato dal Club',
      '👑 Fondatore',
      '💎 Membro d Elite',
      '🤝 Socio d Onore',
      '💰 Investitore di Prestigio',
      '🏛️ Pilastro del Club',
      '💎 VIP Platinum',
      '💎 Magnate delle Gemme',
      '🔮 Visionario del Club',
      '🗝️ Custode del Segreto',
      '🌟 Ambasciatore d Oro',
      '🏗️ Architetto dell Ordine',
      '✨ Eletto del Club',
      '🎭 Patrono delle Arti',
      '🌫️ Eminenza Grigia',
      '👑 Sovrano del Circolo',
      '🏋️ Titano del Prestigio',
      '📜 Leggenda del Club',
      '🏰 FONDATORE ETERNO'
    ]
  },
  {
    key: 'multi',
    icon: '🎖️',
    name: 'Multi-Modalita',
    titles: [
      '🧳 Primo Viaggiatore',
      '🗺️ Esploratore di Modalita',
      '🦎 Adattabile',
      '🦎 Camaleonte del Gioco',
      '🔧 Versatile',
      '🌪️ Maestro del Caos',
      '🧿 Onnisciente',
      '💎 Poliedrico',
      '🚶 Viandante dei Mazzi',
      '🔬 Sperimentatore',
      '♾️ Signore delle Varianti',
      '🧬 Genio Multitasking',
      '🌊 Dominatore del Flusso',
      '🌍 Conquistatore Globale',
      '🧠 Mente Universale',
      '💥 Distruttore di Regole',
      '🌌 Viaggiatore Dimensionale',
      '🏗️ Architetto del Multiverso',
      '🎓 Maestro di Ogni Cosa',
      '⚡ Leggenda Ibrida',
      '🎭 Avatar del Gioco',
      '🌐 Onnipresente',
      '📚 Colui che Tutto Sa',
      '🌌 MAESTRO DEL MULTIVERSO',
      '🎖️ Giocatore Totale'
    ]
  },
  {
    key: 'ucs',
    icon: '🌌',
    name: 'UCS - Ultra Champions Series',
    titles: [
      '👑 ELITE UCS',
      '🌌 OLTRE L ULTRA',
      '💎 ETERNO',
      '💠 ARCHITETTO DEL CAOS',
      '🌱 Open Qualifier',
      '🔢 Top 128 Seed',
      '🎯 Top 64 Contender',
      '⚡ Closed Qualifier Finalist',
      '🏟️ Main Event Rookie',
      '🔴 Regional Round 1',
      '⚔️ Regional Quarter-finalist',
      '🥊 Regional Semi-finalist',
      '🏅 Regional Finalist',
      '🏆 Regional Champion',
      '🎟️ Major Qualified',
      '🏛️ Major Group Stage',
      '⚡ Major Playoffs',
      '🥈 Major Finalist',
      '🥇 Major Champion',
      '🌍 World Championship Wildcard',
      '💫 Worlds Group Stage Elite',
      '🏹 Worlds Quarter-finalist',
      '🔥 Worlds Semi-finalist',
      '🌠 Worlds Grand Finalist',
      '👑 World Champion',
      '🌟 Season MVP',
      '🐐 GOAT Contender',
      '🏛️ Hall of Fame',
      '👑 WORLD CHAMPION SUPREME'
    ]
  },
  {
    key: 'legacy-s1',
    icon: '🏆',
    name: 'Stagione 1 - Trofei Legacy',
    titles: [
      'S1 - Bronzo',
      'S1 - Argento',
      'S1 - Oro',
      'S1 - Platino',
      'S1 - Diamante',
      'S1 - Campione',
      'S1 - Grande Campione',
      'S1 - Leggenda Supersonica',
      'S1 - Eredita Settebello',
      'S1 - Orizzonte Mille',
      'S1 - Predatore del Piatto',
      'S1 - Sincronia Eterna',
      'S1 - Fastest Hand',
      'S1 - World Champion',
      'S1 - Leggenda Senza Tempo'
    ]
  }
];

const TOURNAMENT_GROUP_KEYS = ['rank', 'uno', 'ruba', 'scala40', 'blackjack', 'ucs'];
const TITLE_GROUP_MAP = new Map(TITLE_GROUPS.map((group) => [group.key, group]));
const ALL_TITLES = TITLE_GROUPS.flatMap((group) => group.titles);
const NON_TOURNAMENT_TITLE_GROUP_KEYS = TITLE_GROUPS.map((group) => group.key).filter((key) => !TOURNAMENT_GROUP_KEYS.includes(key) && key !== 'rank' && key !== 'ucs');
const NON_TOURNAMENT_TITLES = TITLE_GROUPS.filter((group) => NON_TOURNAMENT_TITLE_GROUP_KEYS.includes(group.key)).flatMap((group) => group.titles);
let selectedTournamentGroup = 'rank';

const RANK_LADDER = [
  { title: '🥉 Campione Bronzo I', mmrMin: 0, mmrMax: 133 },
  { title: '🥉 Campione Bronzo II', mmrMin: 133, mmrMax: 266 },
  { title: '🥉 Campione Bronzo III', mmrMin: 266, mmrMax: 400 },
  { title: '🥈 Campione Argento I', mmrMin: 400, mmrMax: 466 },
  { title: '🥈 Campione Argento II', mmrMin: 466, mmrMax: 533 },
  { title: '🥈 Campione Argento III', mmrMin: 533, mmrMax: 600 },
  { title: '🥇 Campione Oro I', mmrMin: 600, mmrMax: 666 },
  { title: '🥇 Campione Oro II', mmrMin: 666, mmrMax: 733 },
  { title: '🥇 Campione Oro III', mmrMin: 733, mmrMax: 800 },
  { title: '💠 Campione Platino I', mmrMin: 800, mmrMax: 866 },
  { title: '💠 Campione Platino II', mmrMin: 866, mmrMax: 933 },
  { title: '💠 Campione Platino III', mmrMin: 933, mmrMax: 1000 },
  { title: '💎 Campione Diamante I', mmrMin: 1000, mmrMax: 1066 },
  { title: '💎 Campione Diamante II', mmrMin: 1066, mmrMax: 1133 },
  { title: '💎 Campione Diamante III', mmrMin: 1133, mmrMax: 1200 },
  { title: '🏅 Campione Champion I', mmrMin: 1200, mmrMax: 1266 },
  { title: '🏅 Campione Champion II', mmrMin: 1266, mmrMax: 1333 },
  { title: '🏅 Campione Champion III', mmrMin: 1333, mmrMax: 1400 },
  { title: '🔥 Grande Campione I', mmrMin: 1400, mmrMax: 1466 },
  { title: '🔥 Grande Campione II', mmrMin: 1466, mmrMax: 1533 },
  { title: '🔥 Grande Campione III', mmrMin: 1533, mmrMax: 1600 },
  { title: '⚡ Leggenda Supersonica', mmrMin: 1600, mmrMax: null }
];

const S1_LADDER = ['S1 - Bronzo', 'S1 - Argento', 'S1 - Oro', 'S1 - Platino', 'S1 - Diamante', 'S1 - Campione', 'S1 - Grande Campione', 'S1 - Leggenda Supersonica'];
const SSL_MMR_THRESHOLD = 1600;
const BATTLE_CARD_LEVELS = 100;
const BATTLE_CARD_VCARD_AMOUNT = 50;
const BATTLE_CARD_STATE_KEY = 'uno-ultras-battlecard-state-v1';

type BattleCardState = {
  owned: boolean;
  upgraded: boolean;
};

function loadBattleCardState(): BattleCardState {
  try {
    const raw = localStorage.getItem(BATTLE_CARD_STATE_KEY);
    if (!raw) {
      return { owned: false, upgraded: false };
    }

    const parsed = JSON.parse(raw) as Partial<BattleCardState>;
    return {
      owned: Boolean(parsed.owned),
      upgraded: Boolean(parsed.upgraded)
    };
  } catch {
    return { owned: false, upgraded: false };
  }
}

function persistBattleCardState(state: BattleCardState): void {
  localStorage.setItem(BATTLE_CARD_STATE_KEY, JSON.stringify(state));
}

const battleCardState = loadBattleCardState();

function getBattleCardMaxLevels(): number {
  return BATTLE_CARD_LEVELS + (battleCardState.upgraded ? BATTLE_CARD_UPGRADE_LEVELS : 0);
}

function hasBattleCardPass(): boolean {
  return battleCardState.owned;
}

function buyBattleCardPass(): { ok: boolean; message: string } {
  if (battleCardState.owned) {
    return { ok: true, message: 'Battle Card già acquistato.' };
  }
  if ((profile.credits ?? 0) < BATTLE_CARD_BASE_COST) {
    return { ok: false, message: `Servono ${BATTLE_CARD_BASE_COST} crediti per il Battle Card.` };
  }

  profile.credits -= BATTLE_CARD_BASE_COST;
  battleCardState.owned = true;
  persistBattleCardState(battleCardState);
  saveProfile();
  return { ok: true, message: `Battle Card acquistato per ${BATTLE_CARD_BASE_COST} crediti.` };
}

function upgradeBattleCardPass(): { ok: boolean; message: string } {
  if (!battleCardState.owned) {
    return { ok: false, message: 'Compra prima il Battle Card base.' };
  }
  if (battleCardState.upgraded) {
    return { ok: true, message: 'Battle Card già potenziato.' };
  }
  if ((profile.credits ?? 0) < BATTLE_CARD_UPGRADE_COST) {
    return { ok: false, message: `Servono ${BATTLE_CARD_UPGRADE_COST} crediti per il potenziamento.` };
  }

  profile.credits -= BATTLE_CARD_UPGRADE_COST;
  battleCardState.upgraded = true;
  persistBattleCardState(battleCardState);
  saveProfile();
  return { ok: true, message: `Potenziamento attivato: +${BATTLE_CARD_UPGRADE_LEVELS} livelli e sfide extra.` };
}

const TITLE_REQUIREMENTS_BY_GROUP: Record<string, TitleRequirement[]> = {
  rank: RANK_LADDER.map((tier, idx) => ({
    label: `${tier.title} · ${((idx + 1) * 10).toString()}/10 vittorie rank · MMR ${tier.mmrMax === null ? `${tier.mmrMin}+` : `${tier.mmrMin}-${tier.mmrMax}`}`,
    metric: 'wins',
    value: (idx + 1) * 10
  })),
  uno: [
    { label: 'Vinci 50 partite di UNO', metric: 'wins', value: 50 },
    { label: 'Gioca 100 carte +2 in totale', metric: 'none' },
    { label: 'Gioca 50 carte +4 in totale', metric: 'none' },
    { label: 'Vinci 100 partite di UNO', metric: 'wins', value: 100 },
    { label: 'Vinci 150 partite di UNO', metric: 'wins', value: 150 },
    { label: 'Di UNO e vinci 30 volte', metric: 'none' },
    { label: 'Vinci 200 partite di UNO', metric: 'wins', value: 200 },
    { label: 'Vinci 300 partite di UNO', metric: 'wins', value: 300 },
    { label: 'Usa 200 carte Skip in totale', metric: 'none' },
    { label: 'Usa 200 carte Reverse in totale', metric: 'none' },
    { label: 'Vinci 500 partite di UNO', metric: 'wins', value: 500 },
    { label: 'Vinci 750 partite di UNO', metric: 'wins', value: 750 },
    { label: 'Vinci 1000 partite di UNO', metric: 'wins', value: 1000 },
    { label: 'Vinci 1500 partite di UNO', metric: 'wins', value: 1500 },
    { label: 'Vinci 2000 partite di UNO', metric: 'wins', value: 2000 }
  ],
  scala40: [
    { label: 'Vinci 5 partite di Scala 40', metric: 'wins', value: 5 },
    { label: 'Vinci 15 partite di Scala 40', metric: 'wins', value: 15 },
    { label: 'Completa 20 sequenze con Jolly', metric: 'none' },
    { label: 'Vinci 50 partite di Scala 40', metric: 'wins', value: 50 },
    { label: 'Vinci 120 partite di Scala 40', metric: 'wins', value: 120 },
    { label: 'Usa 50 Jolly in partite di Scala 40', metric: 'none' },
    { label: 'Vinci 500 partite di Scala 40', metric: 'wins', value: 500 },
    { label: 'Vinci 1000 partite di Scala 40', metric: 'wins', value: 1000 },
    { label: 'Vinci 2000 partite di Scala 40', metric: 'wins', value: 2000 },
    { label: 'Raggiungi il massimo di Scala 40 - 3000 vittorie', metric: 'wins', value: 3000 }
  ],
  ruba: [
    { label: 'Vinci 5 partite di Ruba Mazzetto', metric: 'wins', value: 5 },
    { label: 'Vinci 15 partite di Ruba Mazzetto', metric: 'wins', value: 15 },
    { label: 'Ruba 50 mazzetti totali', metric: 'none' },
    { label: 'Vinci 80 partite di Ruba Mazzetto', metric: 'wins', value: 80 },
    { label: 'Vinci 250 partite di Ruba Mazzetto', metric: 'wins', value: 250 },
    { label: 'Ruba 500 mazzetti totali', metric: 'none' },
    { label: 'Vinci 700 partite di Ruba Mazzetto', metric: 'wins', value: 700 },
    { label: 'Vinci 1500 partite di Ruba Mazzetto', metric: 'wins', value: 1500 },
    { label: 'Vinci 2000 partite di Ruba Mazzetto', metric: 'wins', value: 2000 }
  ],
  blackjack: [
    { label: 'Vinci 10 partite di Blackjack', metric: 'wins', value: 10 },
    { label: 'Raggiungi 21 esatto 10 volte', metric: 'none' },
    { label: 'Vinci 50 partite di Blackjack', metric: 'wins', value: 50 },
    { label: 'Batti il banco 30 volte di fila', metric: 'none' },
    { label: 'Vinci 200 partite di Blackjack', metric: 'wins', value: 200 },
    { label: 'Fai 20 Blackjack naturali', metric: 'none' },
    { label: 'Vinci 700 partite di Blackjack', metric: 'wins', value: 700 },
    { label: 'Vinci 1500 partite di Blackjack', metric: 'wins', value: 1500 },
    { label: 'Il vertice assoluto del Blackjack - 2500 vittorie + 50 naturali', metric: 'wins', value: 2500 }
  ]
};

type BattleCardReward = {
  id: string;
  level: number;
  label: string;
  emoji: string;
  kind: 'vcard' | 'title' | 'locker-item';
  value: string;
  sourceLabel: string;
};

type TitleRequirement = {
  label: string;
  metric: 'wins' | 'mmr' | 'none';
  value?: number;
};

const LOCKER_CATEGORIES: Array<{ key: LockerCategoryKey; label: string; icon: string }> = [
  { key: 'targhette', label: 'Targhette', icon: '🏷️' },
  { key: 'progresso-titoli', label: 'Progresso Titoli', icon: '📈' },
  { key: 'cornici-avatar', label: 'Cornici Avatar', icon: '🖼️' },
  { key: 'stile-carte', label: 'Stile Carte', icon: '🃏' },
  { key: 'avatar-personalizzabile', label: 'Avatar Personalizzabile', icon: '🧑' },
  { key: 'emoji-centrale', label: 'Emoji Centrale', icon: '😎' },
  { key: 'effetti-visivi', label: 'Effetti Visivi', icon: '✨' }
];

const LOCKER_PROGRESS_ITEMS: LockerCatalogItem[] = [
  { id: 'progress-rookie', nome: 'Rookie del Tavolo', emoji: '🌱', desc: 'Gioca 1 partita', minGames: 1 },
  { id: 'progress-first-win', nome: 'Prima Vittoria', emoji: '🥉', desc: 'Vinci 1 partita', minWins: 1 },
  { id: 'progress-fighter', nome: 'Combattente', emoji: '⚔️', desc: 'Gioca 20 partite', minGames: 20 },
  { id: 'progress-streak', nome: 'Dominatore Locale', emoji: '🔥', desc: 'Vinci 10 partite', minWins: 10 },
  { id: 'progress-rank-up', nome: 'Ascesa Classificata', emoji: '📊', desc: 'Raggiungi livello 8', minLevel: 8 },
  { id: 'progress-veteran', nome: 'Veterano', emoji: '🛡️', desc: 'Gioca 75 partite', minGames: 75 },
  { id: 'progress-ultra', nome: 'Ultra Competitor', emoji: '🚀', desc: 'Raggiungi livello 14', minLevel: 14 },
  { id: 'progress-legend', nome: 'Leggenda Totale', emoji: '👑', desc: 'Vinci 50 partite', minWins: 50 }
];

const LOCKER_ITEM_CATALOG: Record<Exclude<LockerCategoryKey, 'targhette' | 'progresso-titoli'>, LockerCatalogItem[]> = {
  'cornici-avatar': [
    { id: 'frame-classic', nome: 'Cornice Classica', emoji: '🟦', desc: 'Disponibile da subito' },
    { id: 'frame-neon', nome: 'Cornice Neon', emoji: '🔷', desc: 'Raggiungi livello 6', minLevel: 6 },
    { id: 'frame-gold', nome: 'Cornice Oro', emoji: '🟨', desc: 'Vinci 15 partite', minWins: 15 },
    { id: 'frame-ucs', nome: 'Cornice UCS', emoji: '🌌', desc: 'Raggiungi livello 16', minLevel: 16 }
  ],
  'stile-carte': [
    { id: 'deck-classic', nome: 'Classico', emoji: '🎴', desc: 'Disponibile da subito' },
    { id: 'deck-carbon', nome: 'Carbon', emoji: '⬛', desc: 'Gioca 25 partite', minGames: 25 },
    { id: 'deck-holo', nome: 'Holo', emoji: '🌈', desc: 'Raggiungi livello 10', minLevel: 10 },
    { id: 'deck-royal', nome: 'Royal', emoji: '👑', desc: 'Vinci 30 partite', minWins: 30 }
  ],
  'avatar-personalizzabile': [
    { id: 'avatar-default', nome: 'Avatar Base', emoji: '🙂', desc: 'Disponibile da subito' },
    { id: 'avatar-pro', nome: 'Avatar Pro', emoji: '😎', desc: 'Gioca 15 partite', minGames: 15 },
    { id: 'avatar-champion', nome: 'Avatar Champion', emoji: '🏆', desc: 'Vinci 20 partite', minWins: 20 },
    { id: 'avatar-mythic', nome: 'Avatar Mythic', emoji: '🦾', desc: 'Raggiungi livello 18', minLevel: 18 }
  ],
  'emoji-centrale': [
    { id: 'emoji-smile', nome: 'Sorriso', emoji: '😄', desc: 'Disponibile da subito' },
    { id: 'emoji-fire', nome: 'Fuoco', emoji: '🔥', desc: 'Vinci 8 partite', minWins: 8 },
    { id: 'emoji-ace', nome: 'Asso', emoji: '🂡', desc: 'Raggiungi livello 9', minLevel: 9 },
    { id: 'emoji-crown', nome: 'Corona', emoji: '👑', desc: 'Raggiungi livello 15', minLevel: 15 }
  ],
  'effetti-visivi': [
    { id: 'fx-soft-glow', nome: 'Bagliore Soft', emoji: '✨', desc: 'Disponibile da subito' },
    { id: 'fx-electric', nome: 'Scintilla Elettrica', emoji: '⚡', desc: 'Raggiungi livello 7', minLevel: 7 },
    { id: 'fx-stardust', nome: 'Stardust', emoji: '🌟', desc: 'Vinci 18 partite', minWins: 18 },
    { id: 'fx-void', nome: 'Void Pulse', emoji: '🌀', desc: 'Raggiungi livello 20', minLevel: 20 }
  ]
};

const LOCKER_REWARDS: LockerReward[] = [
  { id: 'title-fiamma-uno', nome: 'Fiamma UNO', emoji: '🔥', category: 'targhette', source: 'mission', winsReq: 6, titleValue: '🔥 Fiamma UNO' },
  { id: 'frame-neon', nome: 'Cornice Neon', emoji: '🔷', category: 'cornici-avatar', source: 'battlecard', levelReq: 4 },
  { id: 'deck-carbon', nome: 'Stile Carte Carbon', emoji: '⬛', category: 'stile-carte', source: 'shop', cost: 320 },
  { id: 'title-ombra-ruba', nome: 'Ombra di Ruba', emoji: '👻', category: 'targhette', source: 'mission', winsReq: 12, titleValue: '👻 Ombra di Ruba' },
  { id: 'avatar-pro', nome: 'Avatar Pro', emoji: '😎', category: 'avatar-personalizzabile', source: 'battlecard', levelReq: 7 },
  { id: 'emoji-fire', nome: 'Emoji Fuoco', emoji: '🔥', category: 'emoji-centrale', source: 'shop', cost: 180 },
  { id: 'title-asso-21', nome: 'Asso del 21', emoji: '🂡', category: 'targhette', source: 'mission', winsReq: 20, titleValue: '🂡 Asso del 21' },
  { id: 'fx-electric', nome: 'Effetto Electric', emoji: '⚡', category: 'effetti-visivi', source: 'battlecard', levelReq: 10 },
  { id: 'frame-gold', nome: 'Cornice Oro', emoji: '🟨', category: 'cornici-avatar', source: 'shop', cost: 450 },
  { id: 'title-architetto-carte', nome: 'Architetto di Carte', emoji: '🏗️', category: 'targhette', source: 'mission', gamesReq: 40, titleValue: '🏗️ Architetto di Carte' },
  { id: 'deck-royal', nome: 'Stile Carte Royal', emoji: '👑', category: 'stile-carte', source: 'battlecard', levelReq: 14 },
  { id: 'avatar-mythic', nome: 'Avatar Mythic', emoji: '🦾', category: 'avatar-personalizzabile', source: 'shop', cost: 700 }
];

const LOCKER_EXTRA_UNLOCKS_KEY = 'uno-ultras-locker-extra-unlocks';

function loadLockerExtraUnlocks(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCKER_EXTRA_UNLOCKS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

function saveLockerExtraUnlocks(set: Set<string>): void {
  localStorage.setItem(LOCKER_EXTRA_UNLOCKS_KEY, JSON.stringify([...set]));
}

const lockerExtraUnlocks = loadLockerExtraUnlocks();

const DEFAULT_LOCKER_OPEN_STATE: Record<LockerCategoryKey, boolean> = {
  targhette: true,
  'progresso-titoli': false,
  'cornici-avatar': false,
  'stile-carte': false,
  'avatar-personalizzabile': false,
  'emoji-centrale': false,
  'effetti-visivi': false
};

const DEFAULT_LOCKER_TAB_STATE: Record<LockerCategoryKey, LockerTab> = {
  targhette: 'unlocked',
  'progresso-titoli': 'unlocked',
  'cornici-avatar': 'unlocked',
  'stile-carte': 'unlocked',
  'avatar-personalizzabile': 'unlocked',
  'emoji-centrale': 'unlocked',
  'effetti-visivi': 'unlocked'
};

let lockerOpenState: Record<LockerCategoryKey, boolean> = { ...DEFAULT_LOCKER_OPEN_STATE };
let lockerTabState: Record<LockerCategoryKey, LockerTab> = { ...DEFAULT_LOCKER_TAB_STATE };
let lockerSelectionState: Partial<Record<Exclude<LockerCategoryKey, 'targhette'>, string>> = {
  'cornici-avatar': 'frame-classic',
  'stile-carte': 'deck-classic',
  'avatar-personalizzabile': 'avatar-default',
  'emoji-centrale': 'emoji-smile',
  'effetti-visivi': 'fx-soft-glow'
};
const DEFAULT_SFIDE_SECTION_OPEN_STATE: Record<SfideSectionKey, boolean> = {
  targhette: true,
  progressione: false,
  requisiti: false
};
let sfideSectionOpenState: Record<SfideSectionKey, boolean> = { ...DEFAULT_SFIDE_SECTION_OPEN_STATE };

const GAME_MODES: Array<{ id: GameId; label: string; desc: string }> = [
  { id: 'uno', label: 'UNO', desc: '1v1 vs AI o locale' },
  { id: 'ruba', label: 'RUBA MAZZETTO', desc: '2-4 giocatori' },
  { id: 'scopa', label: 'SCOPA', desc: '2 giocatori' },
  { id: 'briscola', label: 'BRISCOLA', desc: '2-4 giocatori' },
  { id: 'scala40', label: 'SCALA 40', desc: '2-4 giocatori' },
  { id: 'burraco', label: 'BURRACO', desc: '2-4 giocatori' },
  { id: 'poker', label: 'POKER', desc: '2-4 giocatori' },
  { id: 'blackjack', label: 'BLACKJACK', desc: 'vs Dealer AI' },
  { id: 'millemiglia', label: 'MILLE MIGLIA', desc: '2-4 giocatori' },
  { id: 'tressette', label: 'TRESSETTE', desc: '2-4 giocatori' }
];

const PLAYERS_OPTIONS = [
  { value: 2 as PlayersMode, label: '1V1', sub: '2 giocatori' },
  { value: 3 as PlayersMode, label: '3 GIOCATORI', sub: 'Hot seat' },
  { value: 4 as PlayersMode, label: '4 GIOCATORI', sub: 'Hot seat' }
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureProfileTitleState(): void {
  const baseUnlocks = ['Principiante', 'Architetto del Caos'];
  if (!Array.isArray(profile.titles)) {
    profile.titles = [...baseUnlocks];
  }
  baseUnlocks.forEach((title) => {
    if (!profile.titles.includes(title)) {
      profile.titles.push(title);
    }
  });
  if (!profile.activeTitle || !profile.titles.includes(profile.activeTitle)) {
    profile.activeTitle = profile.titles[0] ?? 'Principiante';
  }
  profile.activeTitleIndex = Math.max(0, profile.titles.indexOf(profile.activeTitle));
}

function getUnlockedTitles(): Set<string> {
  ensureProfileTitleState();
  return new Set(profile.titles);
}

function unlockTitles(titles: string[]): number {
  ensureProfileTitleState();
  let unlocked = 0;
  titles.forEach((title) => {
    if (!profile.titles.includes(title)) {
      profile.titles.push(title);
      unlocked += 1;
    }
  });
  return unlocked;
}

function getModeNews(gameId: GameId, mode: GameMode): NewsEntry[] {
  const filtered = NEWS_LIBRARY.filter((item) => {
    const matchGame = item.games.includes('all') || item.games.includes(gameId);
    const modeList = item.modes ?? ['all'];
    const matchMode = modeList.includes('all') || modeList.includes(mode);
    return matchGame && matchMode;
  });
  if (filtered.length > 0) {
    return filtered;
  }
  return NEWS_LIBRARY.slice(0, 3);
}

function buildTitlePackShopItems(): ShopItem[] {
  return TITLE_GROUPS.filter((group) => !TOURNAMENT_GROUP_KEYS.includes(group.key) && group.key !== 'rank' && group.key !== 'ucs').map((group) => ({
    id: `title-pack-${group.key}`,
    nome: `Pack ${group.name}`,
    tipo: 'Pack Targhette',
    costo: Math.max(300, group.titles.length * 35),
    emoji: group.icon,
    rarity: group.titles.length >= 29 ? 'legendary' : group.titles.length >= 25 ? 'epic' : 'rare',
    itemType: 'title-pack',
    itemValue: group.key
  }));
}

function unlockLockerReward(rewardId: string): boolean {
  if (lockerExtraUnlocks.has(rewardId)) {
    return false;
  }
  lockerExtraUnlocks.add(rewardId);
  saveLockerExtraUnlocks(lockerExtraUnlocks);
  return true;
}

function hasLockerRewardUnlocked(rewardId: string): boolean {
  return lockerExtraUnlocks.has(rewardId);
}

function isRewardRequirementMet(reward: LockerReward): boolean {
  const level = getLevel();
  if (reward.levelReq && level < reward.levelReq) return false;
  if (reward.winsReq && profile.wins < reward.winsReq) return false;
  if (reward.gamesReq && profile.games < reward.gamesReq) return false;
  return true;
}

function getTournamentMissionRequirement(index: number): { winsReq: number; gamesReq: number; levelReq: number } {
  return {
    winsReq: 2 + index * 2,
    gamesReq: 5 + index * 3,
    levelReq: 2 + Math.floor(index / 2)
  };
}

function isTournamentMissionMet(index: number): boolean {
  const req = getTournamentMissionRequirement(index);
  return profile.wins >= req.winsReq && profile.games >= req.gamesReq && getLevel() >= req.levelReq;
}

function renderRewardReqText(reward: LockerReward): string {
  const reqs: string[] = [];
  if (reward.winsReq) reqs.push(`${reward.winsReq} vittorie`);
  if (reward.gamesReq) reqs.push(`${reward.gamesReq} partite`);
  if (reward.levelReq) reqs.push(`Livello ${reward.levelReq}`);
  return reqs.join(' · ');
}

function getGroupWinsProgress(groupKey: string): number {
  if (groupKey === 'uno') {
    return profile.wins ?? 0;
  }
  if (groupKey === 'rank') {
    return profile.wins ?? 0;
  }
  return 0;
}

function isRequirementUnlocked(groupKey: string, req: TitleRequirement): { unlocked: boolean; progressText: string } {
  if (req.metric === 'none' || req.value === undefined) {
    return { unlocked: false, progressText: 'tracking avanzato in arrivo' };
  }

  if (req.metric === 'wins') {
    const current = getGroupWinsProgress(groupKey);
    const unlocked = current >= req.value;
    return { unlocked, progressText: `${Math.min(current, req.value)}/${req.value}` };
  }

  if (req.metric === 'mmr') {
    const currentMmr = profile.mmr ?? 0;
    const unlocked = currentMmr >= req.value;
    return { unlocked, progressText: `${Math.min(currentMmr, req.value)}/${req.value}` };
  }

  return { unlocked: false, progressText: '-' };
}

function applyAutomaticRankTitleUnlocks(): void {
  const currentWins = profile.wins ?? 0;
  const currentMmr = profile.mmr ?? 0;
  const sslReached = currentMmr >= SSL_MMR_THRESHOLD;
  const unlockList: string[] = ['Principiante'];

  RANK_LADDER.forEach((tier, idx) => {
    const winsRequired = (idx + 1) * 10;
    const winsReady = currentWins >= winsRequired;
    const mmrReady = currentMmr >= tier.mmrMin;
    if (sslReached || (winsReady && mmrReady)) {
      unlockList.push(tier.title);
      if (S1_LADDER[idx]) {
        unlockList.push(S1_LADDER[idx]);
      }
    }
  });

  const newlyUnlocked = unlockTitles(unlockList);
  if (newlyUnlocked > 0) {
    saveProfile();
  }
}

function buildBattleCardRewards(maxLevels: number = BATTLE_CARD_LEVELS): BattleCardReward[] {
  const cosmeticsByCategory: Record<string, LockerCatalogItem[]> = {
    'cornici-avatar': LOCKER_ITEM_CATALOG['cornici-avatar'],
    'stile-carte': LOCKER_ITEM_CATALOG['stile-carte'],
    'avatar-personalizzabile': LOCKER_ITEM_CATALOG['avatar-personalizzabile'],
    'emoji-centrale': LOCKER_ITEM_CATALOG['emoji-centrale'],
    'effetti-visivi': LOCKER_ITEM_CATALOG['effetti-visivi']
  };
  const rotation = ['title', 'cornici-avatar', 'stile-carte', 'avatar-personalizzabile', 'emoji-centrale', 'effetti-visivi'] as const;

  const counters: Record<string, number> = {
    title: 0,
    'cornici-avatar': 0,
    'stile-carte': 0,
    'avatar-personalizzabile': 0,
    'emoji-centrale': 0,
    'effetti-visivi': 0
  };

  const rewards: BattleCardReward[] = [];

  for (let level = 1; level <= maxLevels; level += 1) {
    if (level % 2 === 0) {
      rewards.push({
        id: `bc-vcard-${level}`,
        level,
        label: `${BATTLE_CARD_VCARD_AMOUNT} V-CARD`,
        emoji: '💛',
        kind: 'vcard',
        value: String(BATTLE_CARD_VCARD_AMOUNT),
        sourceLabel: 'V-CARD'
      });
      continue;
    }

    const rotationKey = rotation[((level - 1) / 2) % rotation.length];
    if (rotationKey === 'title') {
      const idx = counters.title % NON_TOURNAMENT_TITLES.length;
      const title = NON_TOURNAMENT_TITLES[idx] ?? `Titolo ${idx + 1}`;
      counters.title += 1;
      rewards.push({
        id: `bc-title-${idx}-${level}`,
        level,
        label: title,
        emoji: '🏷️',
        kind: 'title',
        value: title,
        sourceLabel: 'Targhetta (non torneo)'
      });
      continue;
    }

    const source = cosmeticsByCategory[rotationKey];
    const cosmeticIdx = counters[rotationKey] % source.length;
    const item = source[cosmeticIdx];
    counters[rotationKey] += 1;

    rewards.push({
      id: `bc-${rotationKey}-${item.id}-${level}`,
      level,
      label: item.nome,
      emoji: item.emoji,
      kind: 'locker-item',
      value: item.id,
      sourceLabel: rotationKey.replace(/-/g, ' ')
    });
  }

  return rewards;
}

function isLockerItemUnlocked(item: LockerCatalogItem): boolean {
  if (hasLockerRewardUnlocked(item.id)) return true;
  const level = getLevel();
  if (item.minWins && profile.wins < item.minWins) return false;
  if (item.minGames && profile.games < item.minGames) return false;
  if (item.minLevel && level < item.minLevel) return false;
  if (item.minCredits && profile.credits < item.minCredits) return false;
  return true;
}

function buildLockerItems(category: LockerCategoryKey): LockerRenderItem[] {
  if (category === 'targhette') {
    const unlockedTitles = getUnlockedTitles();
    return ALL_TITLES.map((title, index) => ({
      id: `title-${index}`,
      nome: title,
      emoji: '🏷️',
      desc: 'Titolo da mostrare in partita',
      unlocked: unlockedTitles.has(title),
      active: profile.activeTitle === title
    }));
  }

  if (category === 'progresso-titoli') {
    const unlockedTitles = getUnlockedTitles();
    return RANK_LADDER.map((tier, idx) => {
      const reqWins = (idx + 1) * 10;
      const progressWins = Math.min(reqWins, profile.wins ?? 0);
      const mmrRange = tier.mmrMax === null ? `${tier.mmrMin}+` : `${tier.mmrMin}-${tier.mmrMax}`;
      return {
        id: `rank-progress-${idx}`,
        nome: tier.title,
        emoji: '🏅',
        desc: `${progressWins}/${reqWins} vittorie · MMR ${mmrRange}`,
        unlocked: unlockedTitles.has(tier.title),
        active: false
      };
    });
  }

  const source = LOCKER_ITEM_CATALOG[category];
  return source.map((item) => ({
    id: item.id,
    nome: item.nome,
    emoji: item.emoji,
    desc: item.desc,
    unlocked: isLockerItemUnlocked(item),
    active: lockerSelectionState[category as Exclude<LockerCategoryKey, 'targhette'>] === item.id
  }));
}

function ensureLockerSelection(category: Exclude<LockerCategoryKey, 'targhette'>, items: LockerRenderItem[]): void {
  const current = lockerSelectionState[category];
  const validCurrent = items.find((item) => item.id === current && item.unlocked);
  if (validCurrent) {
    return;
  }
  const fallback = items.find((item) => item.unlocked);
  if (fallback) {
    lockerSelectionState[category] = fallback.id;
  }
}

const HUB_TABS: Array<{ id: HubScreen; label: string }> = [
  { id: 'gioca', label: 'GIOCA' },
  { id: 'negozio', label: 'NEGOZIO' },
  { id: 'armadietto', label: 'ARMADIETTO' },
  { id: 'battle-card', label: 'BATTLE CARD' },
  { id: 'sfide', label: 'SFIDE' },
  { id: 'carriera', label: 'CARRIERA' },
  { id: 'v-card', label: 'V-CARD' }
];

function getLevel(): number {
  return Math.max(1, Math.floor((profile.mmr ?? 200) / 50));
}

function getGameLabel(gameId: GameId): string {
  return RULEBOOK[gameId]?.title ?? GAME_MODES.find((g) => g.id === gameId)?.label ?? gameId.toUpperCase();
}

type DetailedRank = {
  emoji: string;
  name: string;
  division: string;
  min: number;
  max: number | null;
  nextLabel: string;
};

type ClubEntry = {
  id: string;
  name: string;
  tag: string;
  leaderId: string;
  memberIds: string[];
  xp: number;
  level: number;
  wins: number;
  games: number;
};

type ClubDb = {
  version: 1;
  clubs: ClubEntry[];
};

const CLUB_DB_KEY = 'uno-ultras-definitivo-club-db-v1';

const DETAILED_RANKS: Array<Omit<DetailedRank, 'nextLabel'>> = [
  { emoji: '🥉', name: 'Bronzo', division: 'III', min: 0, max: 199 },
  { emoji: '🥉', name: 'Bronzo', division: 'II', min: 200, max: 399 },
  { emoji: '🥉', name: 'Bronzo', division: 'I', min: 400, max: 599 },
  { emoji: '🥈', name: 'Argento', division: 'III', min: 600, max: 699 },
  { emoji: '🥈', name: 'Argento', division: 'II', min: 700, max: 799 },
  { emoji: '🥈', name: 'Argento', division: 'I', min: 800, max: 899 },
  { emoji: '🥇', name: 'Oro', division: 'III', min: 900, max: 999 },
  { emoji: '🥇', name: 'Oro', division: 'II', min: 1000, max: 1099 },
  { emoji: '🥇', name: 'Oro', division: 'I', min: 1100, max: 1199 },
  { emoji: '💠', name: 'Platino', division: 'III', min: 1200, max: 1332 },
  { emoji: '💠', name: 'Platino', division: 'II', min: 1333, max: 1465 },
  { emoji: '💠', name: 'Platino', division: 'I', min: 1466, max: 1599 },
  { emoji: '💎', name: 'Diamante', division: 'III', min: 1600, max: 1732 },
  { emoji: '💎', name: 'Diamante', division: 'II', min: 1733, max: 1865 },
  { emoji: '💎', name: 'Diamante', division: 'I', min: 1866, max: 1999 },
  { emoji: '⚡', name: 'SSL', division: '-', min: 2000, max: null }
];

function getDetailedRankInfo(mmrValue: number): DetailedRank {
  const mmr = Math.max(0, Number(mmrValue) || 0);
  const foundIndex = DETAILED_RANKS.findIndex((rank) => mmr >= rank.min && (rank.max === null || mmr <= rank.max));
  const current = DETAILED_RANKS[Math.max(0, foundIndex)] ?? DETAILED_RANKS[0];
  const next = DETAILED_RANKS[Math.min(DETAILED_RANKS.length - 1, Math.max(0, foundIndex) + 1)] ?? current;
  return {
    ...current,
    nextLabel: next === current ? `${current.emoji} ${current.name} ${current.division}` : `${next.emoji} ${next.name} ${next.division}`
  };
}

function getDivisionProgress(mmrValue: number): { progress: number; text: string } {
  const current = getDetailedRankInfo(mmrValue);
  if (current.max === null) {
    return { progress: 100, text: 'Top rank raggiunto' };
  }
  const span = Math.max(1, current.max - current.min + 1);
  const value = Math.max(0, Math.min(span, (mmrValue - current.min) + 1));
  const pct = Math.round((value / span) * 100);
  return { progress: pct, text: `${value}/${span} MMR divisione` };
}

function loadClubDb(): ClubDb {
  try {
    const raw = localStorage.getItem(CLUB_DB_KEY);
    if (!raw) return { version: 1, clubs: [] };
    const parsed = JSON.parse(raw) as Partial<ClubDb>;
    if (parsed.version !== 1 || !Array.isArray(parsed.clubs)) return { version: 1, clubs: [] };
    return { version: 1, clubs: parsed.clubs as ClubEntry[] };
  } catch {
    return { version: 1, clubs: [] };
  }
}

function saveClubDb(db: ClubDb): void {
  localStorage.setItem(CLUB_DB_KEY, JSON.stringify(db));
}

function getCurrentClub(): ClubEntry | null {
  const activeId = getActiveAccount()?.id;
  if (!activeId) return null;
  const db = loadClubDb();
  return db.clubs.find((club) => club.memberIds.includes(activeId)) ?? null;
}

function createClub(name: string, tag: string): { ok: boolean; message: string } {
  const activeId = getActiveAccount()?.id;
  if (!activeId) return { ok: false, message: 'Accedi prima di creare un club.' };
  const cleanName = name.trim();
  const cleanTag = tag.trim().toUpperCase().slice(0, 6);
  if (cleanName.length < 2) return { ok: false, message: 'Nome club troppo corto.' };
  if (cleanTag.length < 2) return { ok: false, message: 'Sigla club troppo corta.' };

  const db = loadClubDb();
  const alreadyInClub = db.clubs.some((club) => club.memberIds.includes(activeId));
  if (alreadyInClub) return { ok: false, message: 'Sei gia in un club.' };
  if (db.clubs.some((club) => club.tag === cleanTag)) return { ok: false, message: 'Sigla gia usata.' };

  const entry: ClubEntry = {
    id: `club_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: cleanName,
    tag: cleanTag,
    leaderId: activeId,
    memberIds: [activeId],
    xp: 0,
    level: 1,
    wins: 0,
    games: 0
  };
  db.clubs.push(entry);
  saveClubDb(db);
  return { ok: true, message: `Club ${cleanName} creato.` };
}

function joinClubByTag(tag: string): { ok: boolean; message: string } {
  const activeId = getActiveAccount()?.id;
  if (!activeId) return { ok: false, message: 'Accedi prima di unirti a un club.' };
  const cleanTag = tag.trim().toUpperCase();
  if (!cleanTag) return { ok: false, message: 'Inserisci una sigla club valida.' };

  const db = loadClubDb();
  if (db.clubs.some((club) => club.memberIds.includes(activeId))) {
    return { ok: false, message: 'Sei gia in un club.' };
  }

  const club = db.clubs.find((entry) => entry.tag === cleanTag);
  if (!club) return { ok: false, message: 'Club non trovato.' };

  club.memberIds.push(activeId);
  saveClubDb(db);
  return { ok: true, message: `Sei entrato nel club ${club.name}.` };
}

function renderClubPanel(): string {
  const club = getCurrentClub();
  if (!club) {
    return `
      <div class="fn-profile-block">
        <h3>Club</h3>
        <p class="fn-profile-muted">Crea un club o unisciti con sigla.</p>
        <div class="fn-profile-form-row">
          <input class="fn-lobby-code-input" id="fn-club-name" placeholder="Nome club" maxlength="24" />
          <input class="fn-lobby-code-input" id="fn-club-tag" placeholder="Sigla" maxlength="6" />
        </div>
        <div class="fn-profile-btn-row">
          <button class="btn-primary" data-action="club-create">CREA CLUB</button>
          <button class="btn-ghost" data-action="club-join">UNISCITI</button>
        </div>
      </div>
    `;
  }

  const accountById = new Map(listAccountsWithProfiles().map((entry) => [entry.id, entry]));
  const missionWinProgress = Math.min(10, club.wins);
  const missionGameProgress = Math.min(20, club.games);
  const weeklyProgress = Math.min(100, club.games);

  return `
    <div class="fn-profile-block">
      <h3>👥 Club</h3>
      <div class="fn-club-head">
        <div><small>Membro di</small><strong>"${escapeHtml(club.name)}"</strong></div>
        <div class="fn-club-tag">${escapeHtml(club.tag)}</div>
      </div>
      <div class="fn-club-stats-grid">
        <div><strong>${club.wins}</strong><small>Vittorie</small></div>
        <div><strong>Lv.${club.level}</strong><small>Livello</small></div>
        <div><strong>${club.memberIds.length}</strong><small>Membri</small></div>
      </div>
      <div class="fn-club-xp">
        <div><strong>XP Club</strong><span>${club.xp} / 1000</span></div>
        <div class="fn-club-xp-bar"><div class="fn-club-xp-fill" style="width:${Math.min(100, Math.round((club.xp / 1000) * 100))}%"></div></div>
      </div>

      <div class="fn-club-section-title">MISSIONI (0/3)</div>
      <div class="fn-club-mission">🏆 Vittorie Club <small>Vinci 10 partite — ${missionWinProgress}/10 · +500 XP Club</small></div>
      <div class="fn-club-mission">🎮 Maratoneta Club <small>Gioca 20 partite — ${missionGameProgress}/20 · +300 XP Club</small></div>
      <div class="fn-club-mission">💎 Grind Settimanale <small>Gioca 100 partite — ${weeklyProgress}/100 · +2000 XP + Boost MMR 24h</small></div>

      <div class="fn-club-section-title">MEMBRI</div>
      <div class="fn-club-members">
        ${club.memberIds
          .map((memberId) => {
            const account = accountById.get(memberId);
            const name = account?.displayName ?? 'Giocatore';
            const mmr = account?.profile.mmr ?? 200;
            const role = memberId === club.leaderId ? '👑 Leader' : '🎮 Membro';
            return `<div class="fn-club-member"><span>🎮 ${escapeHtml(name)}</span><small>${role} · ${mmr} MMR</small></div>`;
          })
          .join('')}
      </div>
    </div>
  `;
}

function renderProfilePopup(): void {
  const overlay = document.getElementById('fn-profile-overlay');
  const popup = document.getElementById('fn-profile-popup');
  if (!overlay || !popup) return;

  overlay.classList.toggle('open', profilePanelOpen);
  overlay.setAttribute('aria-hidden', profilePanelOpen ? 'false' : 'true');
  if (!profilePanelOpen) return;

  const onlineCount = friendList.filter((friend) => friend.online).length;
  const offlineCount = Math.max(0, friendList.length - onlineCount);

  popup.innerHTML = `
    <header class="fn-profile-popup-head">
      <div>
        <h2>${escapeHtml(profile.name || 'Giocatore')}</h2>
        <p>${getRankLabel(profile.mmr)} · ${profile.mmr} MMR</p>
      </div>
      <button class="fn-profile-popup-close" data-action="close-profile-panel" aria-label="Chiudi">✕</button>
    </header>
    <div class="fn-profile-popup-tabs">
      <button class="${profilePanelTab === 'amici' ? 'active' : ''}" data-action="profile-tab" data-profile-tab="amici">AMICI</button>
      <button class="${profilePanelTab === 'richieste' ? 'active' : ''}" data-action="profile-tab" data-profile-tab="richieste">RICHIESTE ${pendingRequests.length > 0 ? `(${pendingRequests.length})` : ''}</button>
      <button class="${profilePanelTab === 'club' ? 'active' : ''}" data-action="profile-tab" data-profile-tab="club">CLUB</button>
    </div>
    <div class="fn-profile-popup-body">
      ${
        profilePanelTab === 'amici'
          ? `<div class="fn-profile-block"><p class="fn-profile-muted">Amici online: <strong>${onlineCount}</strong> · offline: <strong>${offlineCount}</strong></p>${renderFriendsPanel()}</div>`
          : profilePanelTab === 'richieste'
            ? `<div class="fn-profile-block"><h3>Richieste in arrivo</h3>${pendingRequests.length === 0 ? '<p class="fn-profile-muted">Nessuna richiesta in attesa.</p>' : pendingRequests
                .map(
                  (entry) => `<div class="fn-request-row"><div><strong>${escapeHtml(entry.fromName)}</strong><small>${escapeHtml(entry.fromId)}</small></div><div class="fn-request-actions"><button class="btn-primary" data-action="request-accept" data-from-id="${escapeHtml(entry.fromId)}">ACCETTA</button><button class="btn-ghost" data-action="request-decline" data-from-id="${escapeHtml(entry.fromId)}">RIFIUTA</button></div></div>`
                )
                .join('')}</div>`
            : renderClubPanel()
      }
    </div>
  `;
}

function openProfilePanel(tab: 'amici' | 'richieste' | 'club' = 'amici'): void {
  profilePanelTab = tab;
  profilePanelOpen = true;
  loadFriendList();
  renderProfilePopup();
}

function closeProfilePanel(): void {
  profilePanelOpen = false;
  renderProfilePopup();
}

function renderNavbar(): void {
  const nav = document.getElementById('fn-nav');
  if (!nav) return;
  nav.innerHTML = HUB_TABS.map((t) => `<button class="fn-tab ${currentHub === t.id ? 'active' : ''}" data-action="switch-hub" data-hub="${t.id}" aria-pressed="${currentHub === t.id}">${t.label}</button>`).join('');
}

function renderProfileBadge(): void {
  const username = document.getElementById('fn-username');
  const avatar = document.getElementById('fn-avatar');
  const lvlNum = document.getElementById('fn-level-num');
  if (username) username.textContent = profile.name || 'Giocatore';
  if (avatar) avatar.textContent = (profile.name || 'G').charAt(0).toUpperCase();
  if (lvlNum) lvlNum.textContent = String(getLevel());
}

function renderUpdatePopup(): void {
  const popup = document.getElementById('fn-update-popup');
  if (!popup) return;

  popup.innerHTML = `
    <div class="fn-update-head">
      <h2>REGOLE MODALITA</h2>
      <button class="fn-update-close" data-action="close-update" aria-label="Chiudi">✕</button>
    </div>
    <div class="fn-update-grid">
      ${GAME_MODES.map((g) => {
        const r = RULEBOOK[g.id];
        return `
        <article class="fn-update-card">
          <span class="fn-news-tag">${r.title.toUpperCase()}</span>
          <h3>Mazzo</h3>
          <p>${r.deck}</p>
          <h3>Obiettivo</h3>
          <p>${r.objective}</p>
          <h3>Come si gioca</h3>
          <p>${r.howTo}</p>
          <h3>Meccaniche chiave</h3>
          <p>${r.key}</p>
        </article>
      `;
      }).join('')}
    </div>
  `;
}

function openUpdatePopup(): void {
  const overlay = document.getElementById('fn-update-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  updateOpen = true;
  renderUpdatePopup();
}

function closeUpdatePopup(): void {
  const overlay = document.getElementById('fn-update-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  updateOpen = false;
}

function renderAuthOverlay(): void {
  const overlay = document.getElementById('fn-auth-overlay');
  const panel = document.getElementById('fn-auth-panel');
  if (!overlay || !panel) return;

  overlay.classList.toggle('open', authOpen);
  overlay.setAttribute('aria-hidden', authOpen ? 'false' : 'true');

  panel.innerHTML = `
    <div class="fn-auth-head">
      <div>
        <h2>Accesso e Registrazione</h2>
        <p>Ogni account salva progressi, targhette, Battle Card e crediti separatamente.</p>
      </div>
      <button class="fn-auth-close" data-action="close-login" aria-label="Chiudi accesso">✕</button>
    </div>
    <div class="fn-auth-tabs">
      <button class="fn-auth-tab ${authMode === 'login' ? 'active' : ''}" data-action="auth-switch" data-auth-mode="login">Accedi</button>
      <button class="fn-auth-tab ${authMode === 'register' ? 'active' : ''}" data-action="auth-switch" data-auth-mode="register">Registrati</button>
    </div>
    <div class="fn-auth-grid">
      <form class="fn-auth-form" data-auth-form="${authMode}">
        <label>
          Nome giocatore
          <input type="text" name="username" value="${profile.name ?? 'Giocatore'}" maxlength="20" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        ${authMode === 'register' ? `<label>Conferma password<input type="password" name="confirmPassword" required /></label>` : ''}
        <button type="submit" class="btn-primary">${authMode === 'register' ? 'Crea account' : 'Accedi'}</button>
      </form>
      <div class="fn-auth-side">
        <h3>Come funziona</h3>
        <p class="fn-auth-empty">Usa lo stesso nome per rientrare nel tuo profilo. Niente email, niente Google.</p>
      </div>
    </div>
    <div class="fn-auth-footer">
      ${hasActiveAccount() ? '<button class="fn-auth-guest" data-action="auth-logout">Esci dall account</button>' : ''}
      <span>Accesso locale per nome giocatore e password.</span>
    </div>
  `;
}

function openAuthOverlay(): void {
  authOpen = true;
  renderAuthOverlay();
}

function closeAuthOverlay(): void {
  authOpen = false;
  renderAuthOverlay();
}

function renderGioca(): string {
  const activeGame = (window as any).__activeGame as GameId | null;
  if (activeGame || isLoading()) {
    const gameId = activeGame ?? 'uno';
    return `
      <section class="fn-game-scene">
        <div class="fn-game-scene-top">
          <div class="fn-game-scene-title">PARTITA: ${getGameLabel(gameId)}</div>
          <button class="btn-ghost fn-exit-game" data-action="stop-game">ESCI E TORNA A GIOCA</button>
        </div>
        <div class="fn-game-wrapper">${renderActiveBoard(gameId)}</div>
      </section>
    `;
  }

  const lobbyVisible = getLobbyState().visible;
  const featuredNews = getModeNews(selectedGameId, selectedModeStr)[0];
  const rankInfo = getDetailedRankInfo(profile.mmr ?? 200);
  const divProgress = getDivisionProgress(profile.mmr ?? 200);
  const nextMmrReq = rankInfo.max === null ? null : rankInfo.max + 1;
  const wStreak = Math.max(0, (profile.wins ?? 0) - (profile.losses ?? 0));
  const lStreak = Math.max(0, (profile.losses ?? 0) - (profile.wins ?? 0));
  const mmrValue = profile.mmr ?? 200;
  const levelValue = getLevel();
  const levelFloor = Math.max(0, (levelValue - 1) * 50);
  const levelProgress = Math.max(0, Math.min(100, Math.round(((mmrValue - levelFloor) / 50) * 100)));

  return `
    <div class="fn-gioca-layout ${competitiveEnabled ? 'competitive-open' : ''}">
      <div class="fn-play-panel">
        <div class="fn-play-panel-inner ${lobbyVisible ? '' : 'hud-fullscreen'}">
          ${
            lobbyVisible
              ? `
                <div class="fn-online-mode-quick" role="group" aria-label="Selezione modalita online">
                  ${GAME_MODES.map((mode) => `<button class="fn-online-mode-btn ${selectedGameId === mode.id ? 'active' : ''}" data-action="online-set-game" data-game="${mode.id}">${mode.label}</button>`).join('')}
                </div>
                ${renderLobbyScreen(selectedGameId, profile.name)}
              `
              : `
            <div class="fn-play-top-row">
              ${
                competitiveEnabled
                  ? ''
                  : `<button class="fn-news-square" data-action="open-update" aria-label="Apri news e aggiornamenti modalità">
                      <span class="fn-news-square-title">AGGIORNAMENTI</span>
                      <span class="fn-news-tag" style="background:${featuredNews?.color ?? '#22d3ee'}">${featuredNews?.tag ?? 'NEWS'}</span>
                      <strong>${featuredNews?.titolo ?? 'Novita disponibili'}</strong>
                      <p>${featuredNews?.desc ?? 'Clicca per aprire regole e aggiornamenti modalita.'}</p>
                    </button>`
              }
            </div>

            <div class="fn-play-controls-left">
              <div class="fn-play-mode-label"><span class="fn-play-game-name" id="fn-play-game-name">UNO</span></div>
              <div class="fn-mode-rule-quick" id="fn-mode-rule-quick"></div>
              <button class="fn-mode-selector-btn" data-action="toggle-competitive" aria-pressed="${competitiveEnabled ? 'true' : 'false'}">
                <span class="fn-mode-icon">🏅</span>
                <span>${competitiveEnabled ? 'Modalita competitiva attiva' : 'Attiva modalita competitiva'}</span>
                <span class="fn-mode-arrow">${competitiveEnabled ? '✓' : '›'}</span>
              </button>
              <button class="fn-mode-selector-btn" data-action="open-modal" aria-haspopup="dialog">
                <span class="fn-mode-icon">⊞</span>
                <span id="fn-mode-display">Singleplayer · 1v1</span>
                <span class="fn-mode-arrow">›</span>
              </button>
              <button class="fn-play-btn btn-primary" data-action="fn-start">GIOCA</button>
            </div>

            <div class="fn-play-status-row ${competitiveEnabled ? 'competitive-enabled' : ''}">
              <div class="fn-progress-orb fn-level-orb" style="--orb-progress:${levelProgress}%">
                <small>LIVELLO</small>
                <strong>${levelValue}</strong>
                <span>${Math.max(0, 50 - (mmrValue - levelFloor))} MMR</span>
              </div>
              ${
                competitiveEnabled
                  ? `<div class="fn-progress-orb fn-rank-orb" style="--orb-progress:${divProgress.progress}%">
                      <small>RANK</small>
                      <strong>${rankInfo.emoji}</strong>
                      <span>${rankInfo.name} ${rankInfo.division}</span>
                    </div>`
                  : ''
              }
            </div>
          `
          }
        </div>
      </div>
      ${
        competitiveEnabled
          ? `<aside class="fn-competitive-side">
              <div class="fn-competitive-head">
                <h3>${rankInfo.emoji} ${rankInfo.name} ${rankInfo.division}</h3>
                <p>${profile.mmr} MMR</p>
              </div>
              <div class="fn-competitive-grid">
                <div><strong>${wStreak}</strong><small>Streak W</small></div>
                <div><strong>${lStreak}</strong><small>Streak L</small></div>
                <div><strong>${profile.wins}</strong><small>Vittorie</small></div>
                <div><strong>${profile.losses}</strong><small>Sconfitte</small></div>
                <div><strong>${profile.games}</strong><small>Partite</small></div>
                <div><strong>${rankInfo.nextLabel}</strong><small>Prossima divisione</small></div>
              </div>
              <div class="fn-competitive-progress">
                <div class="fn-competitive-progress-head"><span>${rankInfo.emoji} ${rankInfo.name} ${rankInfo.division}</span><span>${rankInfo.nextLabel}</span></div>
                <div class="fn-competitive-bar"><div class="fn-competitive-fill" style="width:${divProgress.progress}%"></div></div>
                <div class="fn-competitive-progress-foot">
                  <small>${divProgress.text}</small>
                  <small>${nextMmrReq === null ? 'Rank massimo raggiunto' : `${Math.max(0, nextMmrReq - (profile.mmr ?? 0))} MMR al prossimo step`}</small>
                </div>
              </div>
            </aside>`
          : ''
      }
    </div>
  `;
}

function renderNegozio(): string {
  const unlocked = getUnlockedTitles();
  const titlePackItems = buildTitlePackShopItems();
  const rewardShopItems: ShopItem[] = LOCKER_REWARDS.filter((reward) => reward.source === 'shop').map((reward) => ({
    id: `reward-${reward.id}`,
    nome: reward.nome,
    tipo: `Shop ${reward.category.replace(/-/g, ' ')}`,
    costo: reward.cost ?? 250,
    emoji: reward.emoji,
    rarity: (reward.cost ?? 0) >= 650 ? 'legendary' : (reward.cost ?? 0) >= 400 ? 'epic' : 'rare',
    itemType: 'locker-reward',
    itemValue: reward.id
  }));

  const reparti: Array<{ nome: string; items: ShopItem[] }> = [
    {
      nome: 'ARTICOLI IN EVIDENZA',
      items: [
        { id: 'all-titles-collector', nome: 'Pass Collezionista', tipo: 'Targhette Non Torneo', costo: 2400, emoji: '👑', rarity: 'legendary', itemType: 'title-all', itemValue: 'all-non-torneo' }
      ]
    },
    {
      nome: 'PACK TARGHETTE',
      items: titlePackItems
    },
    {
      nome: 'COSMETICI SHOP',
      items: rewardShopItems
    }
  ];

  return `
    <div class="fn-screen fn-negozio">
      <div class="fn-screen-header">
        <h1>NEGOZIO</h1>
        <div class="fn-credits-display"><span class="fn-vcoin">V</span><span>${profile.credits}</span></div>
      </div>
      <div class="fn-shop-body">
        ${reparti
          .map(
            (r) => `
          <section class="fn-shop-reparto">
            <h2 class="fn-reparto-title">${r.nome}</h2>
            <div class="fn-shop-grid">
              ${r.items
                .map(
                  (item) => `
                <div class="fn-shop-card rarity-${item.rarity}">
                  ${renderVisualToken(item.emoji, item.nome, 'fn-shop-emoji')}
                  <div class="fn-shop-info">
                    <span class="fn-shop-tipo">${item.tipo}</span>
                    <strong class="fn-shop-nome">${item.nome}</strong>
                  </div>
                  <button class="fn-shop-buy" data-action="buy-item" data-cost="${item.costo}" data-item-id="${item.id}" data-item-type="${item.itemType}" data-item-value="${item.itemValue}" ${item.itemType === 'title-pack' && unlocked.has(TITLE_GROUP_MAP.get(item.itemValue)?.titles[0] ?? '') ? 'disabled' : ''} ${item.itemType === 'locker-reward' && hasLockerRewardUnlocked(item.itemValue) ? 'disabled' : ''}><span class="fn-vcoin-small">V</span> ${item.costo}</button>
                </div>
              `
                )
                .join('')}
            </div>
          </section>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderArmadietto(): string {
  const sections = LOCKER_CATEGORIES.map((category) => {
    const items = buildLockerItems(category.key);
    if (category.key !== 'targhette' && category.key !== 'progresso-titoli') {
      ensureLockerSelection(category.key, items);
    }
    const unlockedItems = items.filter((item) => item.unlocked);
    const lockedItems = items.filter((item) => !item.unlocked);
    const tab = lockerTabState[category.key];
    const visibleItems = tab === 'unlocked' ? unlockedItems : lockedItems;

    const cards =
      visibleItems.length > 0
        ? visibleItems
            .map((item) => {
              const isTitle = category.key === 'targhette';
              const actionAttrs = isTitle
                ? `data-action="select-title" data-title="${escapeHtml(item.nome)}"`
                : `data-action="locker-select-item" data-locker-cat="${category.key}" data-item-id="${item.id}"`;

              return `
                <button class="fn-locker-item ${item.unlocked ? 'unlocked' : 'locked'} ${item.active ? 'active' : ''}" ${item.unlocked ? actionAttrs : ''} ${item.unlocked ? '' : 'disabled'}>
                  ${renderVisualToken(item.emoji, item.nome, 'fn-locker-item-icon')}
                  <span class="fn-locker-item-name">${escapeHtml(item.nome)}</span>
                  <small class="fn-locker-item-desc">${escapeHtml(item.desc)}</small>
                  <span class="fn-locker-item-state">${item.unlocked ? (item.active ? '✅ Equipaggiato' : 'Seleziona') : '🔒 Bloccato'}</span>
                </button>
              `;
            })
            .join('')
        : '<div class="fn-locker-empty">Nessun elemento in questa tab.</div>';

    return `
      <section class="fn-locker-section ${lockerOpenState[category.key] ? 'open' : ''}">
        <button class="fn-locker-section-head" data-action="locker-toggle-section" data-locker-cat="${category.key}">
          <span>${category.icon} ${category.label}</span>
          <small>${unlockedItems.length}/${items.length}</small>
        </button>
        ${
          lockerOpenState[category.key]
            ? `
          <div class="fn-locker-section-body">
            <div class="fn-locker-tabs">
              <button class="fn-locker-tab ${tab === 'unlocked' ? 'active' : ''}" data-action="locker-set-tab" data-locker-cat="${category.key}" data-locker-tab="unlocked">Sbloccati (${unlockedItems.length})</button>
              <button class="fn-locker-tab ${tab === 'locked' ? 'active' : ''}" data-action="locker-set-tab" data-locker-cat="${category.key}" data-locker-tab="locked">Non sbloccati (${lockedItems.length})</button>
            </div>
            <div class="fn-locker-grid">${cards}</div>
          </div>
        `
            : ''
        }
      </section>
    `;
  }).join('');

  return `
    <div class="fn-screen fn-armadietto">
      <div class="fn-screen-header"><h1>ARMADIETTO</h1></div>
      <div class="fn-armad-body">
        <p class="fn-locker-note">Apri ogni categoria con click, poi scegli la tab Sbloccati o Non sbloccati. Titolo attivo in partita: <strong>${escapeHtml(profile.activeTitle || 'Principiante')}</strong></p>
        ${sections}
      </div>
    </div>
  `;
}

function renderBattleCard(): string {
  const playerLevel = getLevel();
  const battleRewards = hasBattleCardPass() ? buildBattleCardRewards(getBattleCardMaxLevels()) : [];
  const totalLevels = getBattleCardMaxLevels();

  return `
    <div class="fn-screen fn-battlecard">
      <div class="fn-bc-header">
        <div class="fn-bc-title-area">
          <h1>BATTLE CARD</h1>
          <p>Pass base ${BATTLE_CARD_BASE_COST} crediti · upgrade ${BATTLE_CARD_UPGRADE_COST} crediti · +${BATTLE_CARD_UPGRADE_LEVELS} livelli</p>
        </div>
        <div class="fn-bc-level-badge">LVL <strong>${playerLevel}</strong></div>
        <button class="fn-bc-upgrade-btn" data-action="open-battlecard-upgrade">🏆 POTENZIA ${BATTLE_CARD_UPGRADE_COST}</button>
      </div>
      ${
        hasBattleCardPass()
          ? ''
          : `
      <div class="fn-bc-purchase-card">
        <div>
          <strong>Battle Card non attivo</strong>
          <p>Acquista il pass per ${BATTLE_CARD_BASE_COST} crediti e sblocca 100 livelli con ${BATTLE_CARD_VCARD_AMOUNT} V-CARD alternati.</p>
        </div>
        <button class="fn-bc-buy-btn" data-action="buy-battlecard-pass">Compra ora</button>
      </div>
      `
      }
      <div class="fn-bc-progress-area">
        <div class="fn-bc-progress-bar"><div class="fn-bc-progress-fill" style="width:${Math.min(100, (playerLevel / totalLevels) * 100)}%"></div></div>
        <span class="fn-bc-progress-label">${profile.mmr ?? 200} XP</span>
      </div>
      <div class="fn-bc-track-wrap"><div class="fn-bc-track">${battleRewards.length > 0 ? battleRewards
        .map(
          (item) => {
            const unlocked = playerLevel >= item.level;
            const alreadyClaimed = hasLockerRewardUnlocked(item.id);
            const claimable = unlocked && !alreadyClaimed;
            return `
        <div class="fn-bc-item ${unlocked ? 'unlocked' : 'locked'} ${alreadyClaimed ? 'claimed' : ''}">
          ${renderVisualToken(item.emoji, item.label, 'fn-bc-item-icon')}
          <div class="fn-bc-item-name">${item.label}</div>
          <div class="fn-bc-item-lvl">LVL ${item.level}</div>
          <div class="fn-bc-item-src">Battle Card · ${item.sourceLabel}</div>
          <button class="fn-bc-claim" data-action="claim-battlecard-reward" data-reward-id="${item.id}" ${claimable ? '' : 'disabled'}>${alreadyClaimed ? 'Riscattata' : claimable ? 'Riscatta' : 'Bloccata'}</button>
        </div>
      `;
          }
        )
        .join('') : '<div class="fn-bc-empty">Acquista il pass per vedere le ricompense Battle Card.</div>'}</div></div>
    </div>
  `;
}

function renderSfide(): string {
  const missioni = [
    { nome: 'Prima vittoria', req: 1, prog: Math.min(1, profile.wins), xp: 100 },
    { nome: 'Tre vittorie', req: 3, prog: Math.min(3, profile.wins), xp: 200 },
    { nome: 'Dieci partite', req: 10, prog: Math.min(10, profile.games), xp: 150 },
    { nome: 'Cinque vittorie', req: 5, prog: Math.min(5, profile.wins), xp: 300 }
  ];
  const torneoGroup = TITLE_GROUP_MAP.get(selectedTournamentGroup) ?? TITLE_GROUP_MAP.get('rank');
  const unlocked = getUnlockedTitles();
  const sslReached = (profile.mmr ?? 0) >= SSL_MMR_THRESHOLD;
  const requirementRows = (TITLE_REQUIREMENTS_BY_GROUP[selectedTournamentGroup] ?? []).map((req) => {
    const status = isRequirementUnlocked(selectedTournamentGroup, req);
    return `<div class="fn-torneo-row"><span>${status.unlocked ? '✅' : '🔒'} ${escapeHtml(req.label)}</span><small>${status.unlocked ? 'Completata' : status.progressText}</small></div>`;
  }).join('');

  const sectionBlocks: Array<{ key: SfideSectionKey; icon: string; title: string; subtitle: string; body: string }> = [
    {
      key: 'targhette',
      icon: '🏷️',
      title: 'TARGHETTE',
      subtitle: 'Seleziona quella da mostrare in partita',
      body: `
        <div class="fn-torneo-list">
          ${(torneoGroup?.titles ?? []).map((title, idx) => `<div class="fn-torneo-row"><span>${escapeHtml(title)}</span><small>${unlocked.has(title) ? '✅ Sbloccata' : `🔒 Progresso modalita dedicata (${idx + 1}/${(torneoGroup?.titles ?? []).length})`}</small></div>`).join('')}
        </div>
      `
    },
    {
      key: 'progressione',
      icon: '📈',
      title: 'PROGRESSIONE TITOLI RANK',
      subtitle: 'Ogni step richiede 10 vittorie nel rank corrispondente',
      body: `
        <div class="fn-torneo-list">
          ${RANK_LADDER.map((tier, idx) => {
            const requiredWins = (idx + 1) * 10;
            const progress = Math.min(requiredWins, profile.wins ?? 0);
            const tierOpen = unlocked.has(tier.title);
            return `<div class="fn-torneo-row"><span>${escapeHtml(tier.title)}</span><small>${tierOpen ? '✅' : `🔒 ${progress}/${requiredWins} vittorie`}</small></div>`;
          }).join('')}
          <div class="fn-torneo-row"><span>⚡ SSL Unlock Totale</span><small>${sslReached ? '✅ Attivo: tutti i titoli rank inferiori sbloccati' : `🔒 Richiede ${SSL_MMR_THRESHOLD}+ MMR`}</small></div>
        </div>
      `
    },
    {
      key: 'requisiti',
      icon: '🧾',
      title: 'REQUISITI DETTAGLIATI',
      subtitle: 'Missioni da fare e dettagli avanzamento',
      body: `
        <div class="fn-torneo-list">${requirementRows || '<div class="fn-torneo-row"><span>🎯 Impresa speciale</span><small>Sblocco con sistema esteso non ancora tracciato</small></div>'}</div>
      `
    }
  ];

  const accordion = sectionBlocks.map((section) => `
    <section class="fn-sfide-section ${sfideSectionOpenState[section.key] ? 'open' : ''}">
      <button class="fn-sfide-section-head" data-action="sfide-toggle-section" data-sfide-section="${section.key}">
        <span>${section.icon} ${section.title}</span>
        <small>${sfideSectionOpenState[section.key] ? 'Nascondi' : 'Apri'}</small>
      </button>
      ${sfideSectionOpenState[section.key] ? `<div class="fn-sfide-section-body"><p class="fn-sfide-section-subtitle">${section.subtitle}</p>${section.body}</div>` : ''}
    </section>
  `).join('');

  return `
    <div class="fn-screen fn-sfide">
      <div class="fn-screen-header"><h1>SFIDE</h1><p>Completa le missioni per guadagnare XP</p></div>
      <div class="fn-sfide-list">
        ${missioni
          .map((m) => {
            const done = m.prog >= m.req;
            const pct = Math.min(100, (m.prog / m.req) * 100);
            return `
            <div class="fn-missione ${done ? 'done' : ''}">
              <div class="fn-missione-icon">${done ? '✅' : '🎯'}</div>
              <div class="fn-missione-info">
                <strong class="fn-missione-nome">${m.nome}</strong>
                <div class="fn-missione-bar"><div class="fn-missione-fill" style="width:${pct}%"></div></div>
                <span class="fn-missione-prog">${m.prog}/${m.req}</span>
              </div>
              <div class="fn-missione-xp"><span>+${m.xp}</span><small>XP</small></div>
            </div>
          `;
          })
          .join('')}
      </div>
      <div class="fn-sfide-accordion">
        ${accordion}
      </div>
      <section class="fn-torneo-panel">
        <header class="fn-torneo-header">
          <h2>🏆 TORNEI - TARGHETTE</h2>
          <p>Sbloccabili nel percorso torneo competitivo</p>
        </header>
        <div class="fn-torneo-switches">
          ${TOURNAMENT_GROUP_KEYS.map((key) => {
            const group = TITLE_GROUP_MAP.get(key);
            if (!group) return '';
            return `<button class="fn-torneo-switch ${selectedTournamentGroup === key ? 'active' : ''}" data-action="torneo-mode" data-torneo-key="${key}">${group.icon} ${group.name}</button>`;
          }).join('')}
        </div>
      </section>
    </div>
  `;
}

function renderCarriera(): string {
  const winrate = profile.games > 0 ? Math.round((profile.wins / profile.games) * 100) : 0;
  const rankInfo = getDetailedRankInfo(profile.mmr ?? 200);
  const progress = getDivisionProgress(profile.mmr ?? 200);
  const nextReq = rankInfo.max === null ? null : rankInfo.max + 1;

  return `
    <div class="fn-screen fn-carriera">
      <div class="fn-screen-header"><h1>CARRIERA</h1></div>
      <div class="fn-career-stats">
        <div class="fn-career-rank"><span class="fn-rank-emoji">${rankInfo.emoji}</span><span class="fn-rank-nome">${rankInfo.name} ${rankInfo.division}</span><span class="fn-rank-mmr">${profile.mmr} MMR</span></div>
        <div class="fn-career-grid">
          <div class="fn-career-stat"><span class="fn-stat-val">${profile.games}</span><span class="fn-stat-label">PARTITE</span></div>
          <div class="fn-career-stat"><span class="fn-stat-val">${profile.wins}</span><span class="fn-stat-label">VITTORIE</span></div>
          <div class="fn-career-stat"><span class="fn-stat-val">${profile.losses}</span><span class="fn-stat-label">SCONFITTE</span></div>
          <div class="fn-career-stat"><span class="fn-stat-val">${winrate}%</span><span class="fn-stat-label">WINRATE</span></div>
        </div>
        <div class="fn-career-progress-wrap">
          <div class="fn-career-progress-head"><span>Progressione divisione</span><span>${rankInfo.nextLabel}</span></div>
          <div class="fn-competitive-bar"><div class="fn-competitive-fill" style="width:${progress.progress}%"></div></div>
          <div class="fn-career-progress-foot">
            <small>${progress.text}</small>
            <small>${nextReq === null ? 'Sei in SSL' : `${Math.max(0, nextReq - (profile.mmr ?? 0))} MMR alla prossima divisione`}</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderVCard(): string {
  const pacchetti = [
    { id: 'vc-100', label: '100', emoji: '💛', price: '0.99€', popular: false },
    { id: 'vc-500', label: '500', emoji: '💛💛', price: '3.99€', popular: false },
    { id: 'vc-1000', label: '1.000', emoji: '🏆', price: '6.99€', popular: true }
  ];

  return `
    <div class="fn-screen fn-vcard">
      <div class="fn-screen-header"><h1>V-CARD</h1><p>Acquista V-Card per sbloccare contenuti esclusivi nel Negozio</p></div>
      <div class="fn-vc-saldo"><span class="fn-vcoin large">V</span><span class="fn-vc-amount">${profile.credits}</span><span class="fn-vc-label">V-CARD DISPONIBILI</span></div>
      <div class="fn-vc-grid">
        ${pacchetti
          .map(
            (p) => `
          <div class="fn-vc-card ${p.popular ? 'popular' : ''}">
            ${p.popular ? '<div class="fn-vc-popular-tag">PIU POPOLARE</div>' : ''}
            <div class="fn-vc-emoji">${p.emoji}</div>
            <div class="fn-vc-amount-label"><span class="fn-vcoin-sm">V</span><strong>${p.label}</strong></div>
            <button class="fn-vc-buy-btn" data-action="buy-vc" data-vc-id="${p.id}" data-price="${p.price}">${p.price}</button>
          </div>
        `
          )
          .join('')}
      </div>
      <p class="fn-vc-disclaimer">Le V-Card sono valuta di gioco demo. Nessun addebito reale.</p>
    </div>
  `;
}

function updateModeDisplay(): void {
  const modeDisplay = document.getElementById('fn-mode-display');
  if (modeDisplay) {
    const text =
      selectedModeStr === 'single'
        ? 'Singleplayer · 1v1'
        : selectedModeStr === 'local'
          ? `Locale · ${selectedPlayersNum} giocatori`
          : 'Online · lobby';
    modeDisplay.textContent = text;
  }

  const gameName = document.getElementById('fn-play-game-name');
  if (gameName) {
    const current = GAME_MODES.find((mode) => mode.id === selectedGameId);
    gameName.textContent = current?.label ?? selectedGameId.toUpperCase();
  }

  const quickRule = document.getElementById('fn-mode-rule-quick');
  if (quickRule) {
    const rule = RULEBOOK[selectedGameId];
    quickRule.innerHTML = rule ? `<strong>${rule.title}</strong> · ${rule.objective}` : '';
  }
}

function renderHub(): void {
  const main = document.getElementById('fn-main');
  if (!main) return;

  applyAutomaticRankTitleUnlocks();

  renderNavbar();
  renderProfileBadge();

  const topLevelBadge = document.getElementById('fn-level-badge');
  if (topLevelBadge) {
    topLevelBadge.style.display = currentHub === 'gioca' ? 'none' : 'inline-flex';
  }

  if (currentHub === 'gioca') main.innerHTML = renderGioca();
  if (currentHub === 'negozio') main.innerHTML = renderNegozio();
  if (currentHub === 'armadietto') main.innerHTML = renderArmadietto();
  if (currentHub === 'battle-card') main.innerHTML = renderBattleCard();
  if (currentHub === 'sfide') main.innerHTML = renderSfide();
  if (currentHub === 'carriera') main.innerHTML = renderCarriera();
  if (currentHub === 'v-card') main.innerHTML = renderVCard();

  const lobbyHeroActive = currentHub === 'gioca' && !(window as any).__activeGame && !isLoading();
  document.body.classList.toggle('fn-lobby-hero', lobbyHeroActive);

  setPlayRenderCallback(renderHub);
  setBoardRenderCallback(renderHub);
  updateModeDisplay();
  renderAuthOverlay();
  renderProfilePopup();
}

function renderModal(): void {
  const modal = document.getElementById('fn-modal');
  if (!modal) return;

  const isModalita = modalTab === 'modalita';
  modal.innerHTML = `
    <div class="fn-modal-header">
      <h2>SELEZIONA MODALITA</h2>
      <button class="fn-modal-close" data-action="close-modal" aria-label="Chiudi">✕</button>
    </div>
    <div class="fn-modal-tabs">
      <button class="fn-modal-tab ${isModalita ? 'active' : ''}" data-action="modal-tab" data-tab="modalita">MODALITA</button>
      <button class="fn-modal-tab ${!isModalita ? 'active' : ''}" data-action="modal-tab" data-tab="giocatori">GIOCATORI</button>
    </div>
    <div class="fn-modal-body">
      ${
        isModalita
          ? `<div class="fn-modal-modes">${GAME_MODES.map((g) => `<button class="fn-modal-mode-item ${selectedGameId === g.id ? 'active' : ''}" data-action="modal-pick-game" data-game="${g.id}"><strong>${g.label}</strong><span>${g.desc}</span></button>`).join('')}</div>`
          : `<div class="fn-modal-players">${isOnlineMode() ? '<p class="fn-modal-online-note">In online il numero giocatori viene impostato automaticamente in base ai giocatori presenti in lobby.</p>' : PLAYERS_OPTIONS.map((p) => `<button class="fn-modal-player-item ${selectedPlayersNum === p.value ? 'active' : ''}" data-action="modal-pick-players" data-players="${p.value}"><strong>${p.label}</strong><span>${p.sub}</span></button>`).join('')}
              <div class="fn-modal-mode-row">
                <span>Modalita:</span>
                <div class="fn-modal-mode-toggle">
                  <button class="${selectedModeStr === 'single' ? 'active' : ''}" data-action="modal-pick-mode" data-mode="single">VS AI</button>
                  <button class="${selectedModeStr === 'local' ? 'active' : ''}" data-action="modal-pick-mode" data-mode="local">LOCALE</button>
                  <button class="${isOnlineMode() ? 'active' : ''}" data-action="modal-pick-mode" data-mode="online">ONLINE</button>
                </div>
              </div>
            </div>`
      }
    </div>
    <div class="fn-modal-footer"><button class="btn-primary fn-modal-confirm" data-action="modal-confirm">CONFERMA</button></div>
  `;
}

function openModal(): void {
  const overlay = document.getElementById('fn-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  modalOpen = true;
  renderModal();
}

function closeModal(): void {
  const overlay = document.getElementById('fn-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  modalOpen = false;
  updateModeDisplay();
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const actor = target.closest('[data-action]') as HTMLElement | null;
  if (!actor) return;
  const action = actor.dataset.action;
  if (!action) return;

  if (action === 'switch-hub' && actor.dataset.hub) {
    currentHub = actor.dataset.hub as HubScreen;
    renderHub();
    return;
  }

  if (action === 'goto' && actor.dataset.screen === 'profile') {
    openProfilePanel('amici');
    return;
  }

  if (action === 'open-profile-panel') {
    openProfilePanel('amici');
    return;
  }

  if (action === 'close-profile-panel') {
    closeProfilePanel();
    return;
  }

  if (action === 'profile-tab' && actor.dataset.profileTab) {
    const tab = actor.dataset.profileTab;
    if (tab === 'amici' || tab === 'richieste' || tab === 'club') {
      profilePanelTab = tab;
      renderProfilePopup();
    }
    return;
  }

  if (action === 'toggle-competitive') {
    competitiveEnabled = !competitiveEnabled;
    notify(competitiveEnabled ? 'Modalita competitiva attivata.' : 'Modalita competitiva disattivata.');
    renderHub();
    return;
  }

  if (action === 'open-update') {
    openUpdatePopup();
    return;
  }

  if (action === 'close-update') {
    closeUpdatePopup();
    return;
  }

  if (action === 'open-login') {
    authOpen = true;
    renderAuthOverlay();
    return;
  }
  if (action === 'close-login') {
    closeAuthOverlay();
    return;
  }
  if (action === 'auth-logout') {
    logoutAccount();
    authOpen = true;
    renderAuthOverlay();
    renderHub();
    return;
  }
  if (action === 'auth-switch' && actor.dataset.authMode) {
    authMode = actor.dataset.authMode as 'login' | 'register';
    authOpen = true;
    renderAuthOverlay();
    return;
  }


  if (action === 'open-modal') return openModal();
  if (action === 'close-modal') return closeModal();
  if (action === 'modal-tab' && actor.dataset.tab) {
    modalTab = actor.dataset.tab as ModalTab;
    renderModal();
    return;
  }
  if (action === 'modal-pick-game' && actor.dataset.game) {
    selectedGameId = actor.dataset.game as GameId;
    renderModal();
    return;
  }
  if (action === 'modal-pick-players' && actor.dataset.players) {
    selectedPlayersNum = Number(actor.dataset.players) as PlayersMode;
    renderModal();
    return;
  }
  if (action === 'modal-pick-mode' && actor.dataset.mode) {
    const picked = actor.dataset.mode.toLowerCase();
    selectedModeStr = picked === 'local' ? 'local' : picked === 'online' ? 'online' : 'single';
    renderModal();
    return;
  }
  if (action === 'modal-confirm') {
    setSelectedGame(selectedGameId);
    setSelectedMode(selectedModeStr);
    setSelectedPlayers(selectedPlayersNum);
    if (isOnlineMode()) {
      showLobby('menu');
    } else {
      hideLobby();
    }
    closeModal();
    renderHub();
    return;
  }

  if (action === 'fn-start') {
    if (isOnlineMode()) {
      (window as any).__isOnlineMatch = false;
      (window as any).__onlineGameState = null;
      (window as any).__onlineSyncStartedAt = Date.now();
      showLobby('menu');
      renderHub();
      return;
    }
    setSelectedGame(selectedGameId);
    setSelectedMode(selectedModeStr);
    setSelectedPlayers(selectedPlayersNum);
    startMode();
    (window as any).__activeGame = selectedGameId;
    (window as any).__isOnlineMatch = false;
    (window as any).__onlineGameState = null;
    (window as any).__onlineSyncStartedAt = 0;
    (window as any).__bjState = null;
    startLoading(selectedGameId, renderHub);
    renderHub();
    return;
  }

  if (action === 'friends-open-search') {
    const searchDiv = document.getElementById('fn-friends-search');
    if (searchDiv) {
      searchDiv.style.display = searchDiv.style.display === 'none' ? 'flex' : 'none';
    }
    return;
  }

  if (action === 'friends-do-search') {
    const input = document.getElementById('fn-friend-search-input') as HTMLInputElement | null;
    const resultsDiv = document.getElementById('fn-friend-search-results');
    if (!input || !resultsDiv) return;
    const term = input.value.trim();
    if (!term) { notify('Inserisci un nome da cercare.'); return; }

    searchPlayers(term)
      .then((results) => {
        if (results.length === 0) {
          resultsDiv.innerHTML = '<p style="font-size:13px;color:var(--fn-muted);padding:8px 0">Nessun risultato.</p>';
          return;
        }
        resultsDiv.innerHTML = results
          .map(
            (r) => `
          <div class="fn-search-result-row">
            <span class="fn-search-result-name">${r.name}</span>
            <button class="btn-ghost" data-action="friends-add-player" data-target-id="${r.id}"
                    style="font-size:11px;padding:4px 10px">+ AGGIUNGI</button>
          </div>`
          )
          .join('');
      })
      .catch((e: Error) => notify(e.message));
    return;
  }

  if (action === 'friends-add-player' && actor.dataset.targetId) {
    sendFriendRequest(actor.dataset.targetId).catch((e: Error) => notify(e.message));
    renderProfilePopup();
    return;
  }

  if (action === 'request-accept' && actor.dataset.fromId) {
    acceptRequest(actor.dataset.fromId);
    renderProfilePopup();
    return;
  }

  if (action === 'request-decline' && actor.dataset.fromId) {
    declineRequest(actor.dataset.fromId);
    renderProfilePopup();
    return;
  }

  if (action === 'club-create') {
    const nameInput = document.getElementById('fn-club-name') as HTMLInputElement | null;
    const tagInput = document.getElementById('fn-club-tag') as HTMLInputElement | null;
    const result = createClub(nameInput?.value ?? '', tagInput?.value ?? '');
    notify(result.message);
    renderProfilePopup();
    return;
  }

  if (action === 'club-join') {
    const tagInput = document.getElementById('fn-club-tag') as HTMLInputElement | null;
    const result = joinClubByTag(tagInput?.value ?? '');
    notify(result.message);
    renderProfilePopup();
    return;
  }

  if (action === 'friend-invite' && actor.dataset.friendId) {
    if (!isOnlineMode()) {
      selectedModeStr = 'online';
      setSelectedMode('online');
      showLobby('menu');
      notify('Modalita online attivata automaticamente per inviare l invito.');
    }

    const roomCode = getLobbyState().room?.code;
    if (!roomCode) {
      createLobbyOnline({ gameId: selectedGameId, playerName: profile.name || 'Giocatore' })
        .then(() => {
          inviteFriendToLobby(actor.dataset.friendId as string);
          renderHub();
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : 'Errore creazione lobby invito';
          notify(message);
        });
      return;
    }

    inviteFriendToLobby(actor.dataset.friendId);
    return;
  }

  if (action === 'online-open-mode-picker') {
    modalTab = 'modalita';
    openModal();
    return;
  }

  if (action === 'online-menu-create') {
    updateLobbyState({ view: 'create', status: 'Creazione lobby...', error: null });
    createLobbyOnline({
      gameId: selectedGameId,
      playerName: profile.name || 'Giocatore'
    })
      .then(() => notify('Lobby creata. Condividi il codice.'))
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Errore creazione lobby';
        updateLobbyState({ error: message, view: 'menu' });
        notify(message);
      });
    return;
  }

  if (action === 'online-menu-join') {
    updateLobbyState({ view: 'join', error: null });
    renderHub();
    return;
  }

  if (action === 'online-back-menu') {
    updateLobbyState({ view: 'menu', error: null });
    renderHub();
    return;
  }

  if (action === 'online-quick-join' && actor.dataset.code) {
    const code = actor.dataset.code.toUpperCase();
    setLobbyJoinCode(code);
    updateLobbyState({ status: 'Ingresso in lobby...', error: null });
    joinLobbyOnline({ code, playerName: profile.name || 'Giocatore' })
      .then(() => notify('Entrato in lobby.'))
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Errore ingresso lobby';
        updateLobbyState({ error: message });
        notify(message);
      });
    return;
  }

  if (action === 'online-set-game' && actor.dataset.game) {
    selectedGameId = actor.dataset.game as GameId;
    setSelectedGame(selectedGameId);
    renderHub();
    return;
  }

  if (action === 'torneo-mode' && actor.dataset.torneoKey) {
    selectedTournamentGroup = actor.dataset.torneoKey;
    renderHub();
    return;
  }

  if (action === 'sfide-toggle-section' && actor.dataset.sfideSection) {
    const section = actor.dataset.sfideSection as SfideSectionKey;
    sfideSectionOpenState[section] = !sfideSectionOpenState[section];
    renderHub();
    return;
  }

  if (action === 'locker-toggle-section' && actor.dataset.lockerCat) {
    const category = actor.dataset.lockerCat as LockerCategoryKey;
    lockerOpenState[category] = !lockerOpenState[category];
    renderHub();
    return;
  }

  if (action === 'locker-set-tab' && actor.dataset.lockerCat && actor.dataset.lockerTab) {
    const category = actor.dataset.lockerCat as LockerCategoryKey;
    const tab = actor.dataset.lockerTab === 'locked' ? 'locked' : 'unlocked';
    lockerTabState[category] = tab;
    renderHub();
    return;
  }

  if (action === 'locker-select-item' && actor.dataset.lockerCat && actor.dataset.itemId) {
    const category = actor.dataset.lockerCat as Exclude<LockerCategoryKey, 'targhette' | 'progresso-titoli'>;
    const itemId = actor.dataset.itemId;
    const currentItems = buildLockerItems(category);
    const selected = currentItems.find((item) => item.id === itemId);
    if (!selected || !selected.unlocked) {
      notify('Elemento non ancora sbloccato.');
      return;
    }
    lockerSelectionState[category] = itemId;
    notify(`${selected.nome} equipaggiato.`);
    renderHub();
    return;
  }

  if (action === 'select-title' && actor.dataset.title) {
    const titleName = actor.dataset.title;
    if (!titleName) return;
    const unlocked = getUnlockedTitles();
    if (!unlocked.has(titleName)) {
      notify('Targhetta non ancora sbloccata.');
      return;
    }
    profile.activeTitle = titleName;
    profile.activeTitleIndex = profile.titles.indexOf(titleName);
    saveProfile();
    notify(`Targhetta attiva: ${titleName}`);
    renderHub();
    return;
  }

  if (action === 'buy-battlecard-pass') {
    const result = buyBattleCardPass();
    notify(result.message);
    if (result.ok) {
      renderHub();
    }
    return;
  }

  if (action === 'open-battlecard-upgrade') {
    const result = upgradeBattleCardPass();
    notify(result.message);
    if (result.ok) {
      renderHub();
    }
    return;
  }

  if (action === 'claim-battlecard-reward' && actor.dataset.rewardId) {
    const reward = buildBattleCardRewards(getBattleCardMaxLevels()).find((item) => item.id === actor.dataset.rewardId);
    if (!reward) return;
    if (getLevel() < reward.level) {
      notify('Livello Battle Card insufficiente.');
      return;
    }

    if (hasLockerRewardUnlocked(reward.id)) {
      notify('Ricompensa gia riscattata.');
      return;
    }

    if (reward.kind === 'vcard') {
      profile.credits += Number(reward.value);
      saveProfile();
    }

    if (reward.kind === 'title') {
      unlockTitles([reward.value]);
      saveProfile();
    }

    if (reward.kind === 'locker-item') {
      unlockLockerReward(reward.value);
    }

    unlockLockerReward(reward.id);
    notify(`Ricompensa Battle Card riscattata: ${reward.label}`);
    renderHub();
    return;
  }

  if (action === 'online-create') {
    updateLobbyState({ status: 'Creazione lobby...', error: null });
    createLobbyOnline({
      gameId: selectedGameId,
      playerName: profile.name || 'Giocatore'
    })
      .then(() => notify('Lobby creata. Condividi il codice.'))
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Errore creazione lobby';
        updateLobbyState({ error: message });
        notify(message);
      });
    return;
  }

  if (action === 'online-join') {
    const code = getLobbyState().joinCode;
    if (!code || code.length < 6) {
      notify('Inserisci un codice lobby valido (6 caratteri).');
      return;
    }

    updateLobbyState({ status: 'Ingresso in lobby...', error: null });
    joinLobbyOnline({ code, playerName: profile.name || 'Giocatore' })
      .then(() => notify('Entrato in lobby.'))
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Errore ingresso lobby';
        updateLobbyState({ error: message });
        notify(message);
      });
    return;
  }

  if (action === 'online-leave') {
    leaveLobbyOnline()
      .then(() => notify('Sei uscito dalla lobby.'))
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Errore uscita lobby';
        notify(message);
      });
    return;
  }

  if (action === 'online-start') {
    startOnlineGame().catch((error) => {
      const message = error instanceof Error ? error.message : 'Impossibile avviare la partita';
      notify(message);
    });
    return;
  }

  if (action === 'online-ready') {
    setOnlineReady(true)
      .then(() => notify('Stato pronto inviato.'))
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Impossibile impostare pronto';
        notify(message);
      });
    return;
  }

  if (action === 'online-copy-code') {
    const code = actor.dataset.code ?? '';
    if (!code) return;
    navigator.clipboard
      .writeText(code)
      .then(() => notify('Codice lobby copiato.'))
      .catch(() => notify(`Codice lobby: ${code}`));
    return;
  }

  if (action === 'stop-game') {
    stopGame();
    (window as any).__activeGame = null;
    (window as any).__rubaState = null;
    currentHub = 'gioca';
    renderHub();
    return;
  }

  if (action === 'draw-card') {
    const activeGame = (window as any).__activeGame as GameId | null;
    if (activeGame === 'ruba') {
      notify(handleRubaRuntimeAction('draw-card'));
      renderHub();
      return;
    }
    if (handleNonUnoAction(action, actor)) {
      notify('Carta pescata.');
      return;
    }
    handlePlayAction('draw', actor);
    return;
  }
  if (action === 'declare-uno') {
    handlePlayAction('say-uno', actor);
    return;
  }

  if (action === 'bj-set-bet') {
    notify(handleBlackjackAction('set-bet', { amount: Number(actor.dataset.amount ?? 10) }));
    renderHub();
    return;
  }
  if (action === 'bj-bet-half') {
    notify(handleBlackjackAction('bet-half'));
    renderHub();
    return;
  }
  if (action === 'bj-bet-all') {
    notify(handleBlackjackAction('bet-all'));
    renderHub();
    return;
  }
  if (action === 'bj-deal') {
    notify(handleBlackjackAction('deal'));
    renderHub();
    return;
  }
  if (action === 'bj-hit' || action === 'bj-stand' || action === 'bj-double') {
    const actionMap: Record<string, 'hit' | 'stand' | 'double'> = {
      'bj-hit': 'hit',
      'bj-stand': 'stand',
      'bj-double': 'double'
    };
    notify(handleBlackjackAction(actionMap[action]));
    renderHub();
    return;
  }
  if (action === 'bj-restart') {
    notify(handleBlackjackAction('restart'));
    renderHub();
    return;
  }

  if (action === 'sort-hand') {
    notify('Mano riordinata per colore!');
    renderHub();
    return;
  }

  if (action === 'play-ruba-card') {
    const activeGame = (window as any).__activeGame as GameId | null;
    if (activeGame === 'ruba') {
      const handIndex = Number(actor.dataset.index ?? '-1');
      notify(handleRubaRuntimeAction('play-ruba-card', { handIndex }));
      renderHub();
      return;
    }
  }

  if (action === 'capture-stack') {
    const activeGame = (window as any).__activeGame as GameId | null;
    if (activeGame === 'ruba') {
      const tableIndex = Number(actor.dataset.idx ?? '-1');
      notify(handleRubaRuntimeAction('capture-stack', { tableIndex }));
      renderHub();
      return;
    }
  }

  if (handleNonUnoAction(action, actor)) {
    return;
  }

  if (action === 'buy-item') {
    const cost = Number(actor.dataset.cost ?? '0');
    const itemId = actor.dataset.itemId ?? '';
    const itemType = actor.dataset.itemType ?? '';
    const itemValue = actor.dataset.itemValue ?? '';
    if (profile.credits >= cost) {
      profile.credits -= cost;
      let unlockedCount = 0;

      if (itemType === 'title-pack') {
        const group = TITLE_GROUP_MAP.get(itemValue);
        if (group) {
          unlockedCount = unlockTitles(group.titles);
        }
      }

      if (itemType === 'title-all') {
        unlockedCount = itemValue === 'all-non-torneo' ? unlockTitles(NON_TOURNAMENT_TITLES) : unlockTitles(ALL_TITLES);
      }

      if (itemType === 'locker-reward') {
        const reward = LOCKER_REWARDS.find((entry) => entry.id === itemValue && entry.source === 'shop');
        if (reward) {
          const unlockedReward = unlockLockerReward(reward.id);
          if (reward.titleValue) {
            unlockedCount += unlockTitles([reward.titleValue]);
          }
          if (!unlockedReward && unlockedCount === 0) {
            notify('Ricompensa shop gia acquistata in precedenza.');
          }
        }
      }

      saveProfile();
      if (unlockedCount > 0) {
        notify(`Acquisto completato! +${unlockedCount} targhette sbloccate. Crediti rimanenti: ${profile.credits}`);
      } else {
        notify(`Acquisto completato! Crediti rimanenti: ${profile.credits}`);
      }
      renderHub();
      return;
    }
    notify(`Crediti insufficienti! Ti mancano ${Math.max(0, cost - profile.credits)} crediti.`);
    return;
  }

  if (action === 'buy-vc') {
    notify('Acquisto non disponibile in questa build. Le V-Card restano simulate.');
    return;
  }

  if (action === 'back-to-hub') {
    (window as any).__activeGame = null;
    (window as any).__isOnlineMatch = false;
    (window as any).__onlineGameState = null;
    (window as any).__onlineSyncStartedAt = 0;
    (window as any).__bjState = null;
    (window as any).__rubaState = null;
    currentHub = 'gioca';
    renderHub();
    return;
  }

  if (action === 'play-again') {
    const game = ((window as any).__activeGame as GameId) ?? 'uno';
    startLoading(game, renderHub);
    renderHub();
    return;
  }

  if (modalOpen) {
    const overlay = document.getElementById('fn-modal-overlay');
    if (target === overlay) closeModal();
  }

  if (updateOpen) {
    const overlay = document.getElementById('fn-update-overlay');
    if (target === overlay) closeUpdatePopup();
  }

  handlePlayAction(action, actor);
});

document.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;
  const onlineField = (target as HTMLInputElement).dataset.onlineField;
  if (onlineField === 'join-code') {
    setLobbyJoinCode((target as HTMLInputElement).value || '');
    return;
  }
  const profileField = (target as HTMLInputElement).dataset.profileField;
  if (profileField === 'name') {
    profile.name = ((target as HTMLInputElement).value || '').trim() || 'Giocatore';
    saveProfile();
    renderProfileBadge();
    return;
  }
  if (handleSettingsInput(target)) renderHub();
});

document.addEventListener('submit', (event) => {
  const form = event.target as HTMLFormElement | null;
  if (!form || form.dataset.authForm === undefined) return;
  event.preventDefault();

  const formData = new FormData(form);
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim();

  if (form.dataset.authForm === 'register') {
    if (!username) {
      notify('Inserisci un nome giocatore valido.');
      return;
    }
    if (!password) {
      notify('Inserisci una password valida.');
      return;
    }
    if (password !== confirmPassword) {
      notify('Le password non coincidono.');
      return;
    }

    const seedProfile = {
      ...profile,
      name: username
    };

    const result = registerAccount(username, password, username, 'local', seedProfile);
    notify(result.message);
    if (result.ok) {
      authOpen = false;
      renderHub();
    }
    renderAuthOverlay();
    return;
  }

  const result = loginAccount(username, password);
  notify(result.message);
  if (result.ok) {
    authOpen = false;
    renderHub();
  }
  renderAuthOverlay();
});

document.addEventListener('change', (event) => {
  const target = event.target as HTMLElement;
  if (handleSettingsInput(target)) renderHub();
});

const modalOverlay = document.getElementById('fn-modal-overlay');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
  });
}

const updateOverlay = document.getElementById('fn-update-overlay');
if (updateOverlay) {
  updateOverlay.addEventListener('click', (event) => {
    if (event.target === updateOverlay) closeUpdatePopup();
  });
}

const profileOverlay = document.getElementById('fn-profile-overlay');
if (profileOverlay) {
  profileOverlay.addEventListener('click', (event) => {
    if (event.target === profileOverlay) closeProfilePanel();
  });
}

setPlayRenderCallback(renderHub);
setBoardRenderCallback(renderHub);
(window as any).__activeGame = null;

// Expose profile for lobby invite toasts
(window as any).__profile = profile;

initMultiplayerSync({
  onNotify: notify,
  onGameStart: (gameId, playersCount, initialState) => {
    const normalizedPlayers: PlayersMode = playersCount >= 4 ? 4 : playersCount >= 3 ? 3 : 2;
    selectedPlayersNum = normalizedPlayers;
    setSelectedGame(gameId);
    setSelectedMode('online');
    setSelectedPlayers(normalizedPlayers);
    (window as any).__isOnlineMatch = true;
    (window as any).__onlineGameState = initialState ?? null;
    (window as any).__onlineSyncStartedAt = Date.now();
    (window as any).__activeGame = gameId;
    startLoading(gameId, renderHub);
    renderHub();
  }
});

subscribeLobbyState(() => {
  if (currentHub === 'gioca') {
    renderHub();
  }
});

// ── SISTEMA AMICI ────────────────────────────────────────
setFriendsUpdateCallback(() => {
  if (currentHub === 'carriera') renderHub();
  renderProfilePopup();
});

setupFriendListeners();

// Registra il nome sul server quando la socket si connette
import('./multiplayer/socket-client').then(({ getSocket }) => {
  const s = getSocket();
  const doRegister = () => {
    registerPlayer(profile.name || 'Giocatore');
    loadFriendList();
  };
  if (s.connected) {
    doRegister();
  } else {
    s.once('connect', doRegister);
  }
});

renderHub();
