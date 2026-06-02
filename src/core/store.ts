import type { DemoProfile, GameId } from '../game/types';
import { notify } from './notify';

export const PROFILE_KEY = 'uno-ultras-definitivo-profile';
const ACCOUNTS_DB_KEY = 'uno-ultras-definitivo-accounts-db';
const ACTIVE_ACCOUNT_KEY = 'uno-ultras-definitivo-active-account';

type AccountProvider = 'local' | 'google';

type StoredAccount = {
  id: string;
  email: string;
  displayName: string;
  provider: AccountProvider;
  passwordHash?: string;
  profile: DemoProfile;
  createdAt: number;
  updatedAt: number;
};

type AccountsDb = {
  version: 1;
  activeAccountId: string | null;
  accounts: StoredAccount[];
};

export const GAME_LABELS: Record<GameId, string> = {
  uno: 'UNO',
  ruba: 'Ruba Mazzetto',
  scopa: 'Scopa',
  poker: 'Poker',
  burraco: 'Burraco',
  blackjack: 'Blackjack',
  millemiglia: 'Millemiglia',
  scala40: 'Scala 40',
  briscola: 'Briscola',
  tressette: 'Tressette'
};

export const RANKS = [
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

export const TITLES = [
  'Architetto del Caos',
  'Creatura del Vuoto',
  'Jolly del Mazzo',
  'Leggenda di UNO',
  'Maestro di Scala 40',
  'Re dei Ladri',
  'Dio del 21',
  'World Champion Supreme'
];

const defaultProfile: DemoProfile = {
  version: 1,
  name: 'Giocatore',
  wins: 0,
  losses: 0,
  games: 0,
  mmr: 200,
  credits: 1000,
  titles: ['Architetto del Caos'],
  activeTitle: 'Architetto del Caos',
  activeTitleIndex: 0
};

function createDefaultProfile(name?: string): DemoProfile {
  return {
    ...defaultProfile,
    name: name?.trim() || defaultProfile.name,
    titles: [...defaultProfile.titles]
  };
}

function createProfileFromSeed(name: string, seedProfile?: Partial<DemoProfile>): DemoProfile {
  const base = createDefaultProfile(name);
  if (!seedProfile) return base;

  const titles = Array.isArray(seedProfile.titles)
    ? seedProfile.titles.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
    : [];
  const safeTitles = titles.length > 0 ? Array.from(new Set(titles)) : [...base.titles];
  const activeTitle =
    typeof seedProfile.activeTitle === 'string' && safeTitles.includes(seedProfile.activeTitle)
      ? seedProfile.activeTitle
      : safeTitles[0] ?? base.activeTitle;

  return {
    version: 1,
    name: name.trim() || base.name,
    wins: Math.max(0, Number(seedProfile.wins ?? base.wins) || 0),
    losses: Math.max(0, Number(seedProfile.losses ?? base.losses) || 0),
    games: Math.max(0, Number(seedProfile.games ?? base.games) || 0),
    mmr: Math.max(0, Number(seedProfile.mmr ?? base.mmr) || 0),
    credits: Math.max(0, Number(seedProfile.credits ?? base.credits) || 0),
    titles: safeTitles,
    activeTitle,
    activeTitleIndex: Math.max(0, safeTitles.indexOf(activeTitle))
  };
}

function cloneProfile(source: DemoProfile): DemoProfile {
  return JSON.parse(JSON.stringify(source)) as DemoProfile;
}

function hashPassword(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `h${(hash >>> 0).toString(16)}`;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function loadLegacyProfile(): DemoProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoProfile>;
    if (parsed.version !== 1) return null;

    const titles = Array.isArray(parsed.titles) && parsed.titles.length > 0 ? parsed.titles : [...defaultProfile.titles];
    const activeTitle = parsed.activeTitle && titles.includes(parsed.activeTitle) ? parsed.activeTitle : titles[0];
    const activeTitleIndex = Math.max(0, titles.indexOf(activeTitle));

    return {
      version: 1,
      name: parsed.name || defaultProfile.name,
      wins: parsed.wins || defaultProfile.wins,
      losses: parsed.losses || defaultProfile.losses,
      games: parsed.games || defaultProfile.games,
      mmr: parsed.mmr || defaultProfile.mmr,
      credits: parsed.credits || defaultProfile.credits,
      titles,
      activeTitle,
      activeTitleIndex
    };
  } catch {
    return null;
  }
}

function loadAccountsDb(): AccountsDb {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AccountsDb>;
      if (parsed.version === 1 && Array.isArray(parsed.accounts)) {
        return {
          version: 1,
          activeAccountId: typeof parsed.activeAccountId === 'string' ? parsed.activeAccountId : null,
          accounts: parsed.accounts as StoredAccount[]
        };
      }
    }
  } catch {
    // fallback below
  }

  const legacyProfile = loadLegacyProfile();
  if (legacyProfile) {
    const migrated: StoredAccount = {
      id: 'guest',
      email: 'guest@local',
      displayName: legacyProfile.name,
      provider: 'local',
      passwordHash: undefined,
      profile: legacyProfile,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const db: AccountsDb = { version: 1, activeAccountId: migrated.id, accounts: [migrated] };
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(db));
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, migrated.id);
    return db;
  }

  return { version: 1, activeAccountId: null, accounts: [] };
}

let accountsDb = loadAccountsDb();

function persistAccountsDb(): void {
  localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accountsDb));
  if (accountsDb.activeAccountId) {
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, accountsDb.activeAccountId);
  } else {
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  }
}

const RANK_THRESHOLDS = [
  270,
  340,
  410,
  480,
  550,
  620,
  690,
  760,
  830,
  900,
  970,
  1040,
  1110,
  1180,
  1250,
  1320,
  1390,
  1460,
  1530
];

export let profile = loadProfile();

export function loadProfile(): DemoProfile {
  accountsDb = loadAccountsDb();
  const activeAccount = accountsDb.accounts.find((entry) => entry.id === accountsDb.activeAccountId);
  return activeAccount ? cloneProfile(activeAccount.profile) : createDefaultProfile();
}

export function saveProfile(): void {
  const activeAccount = accountsDb.accounts.find((entry) => entry.id === accountsDb.activeAccountId);
  if (activeAccount) {
    activeAccount.profile = cloneProfile(profile);
    activeAccount.displayName = profile.name;
    activeAccount.updatedAt = Date.now();
    persistAccountsDb();
    return;
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function listAccounts(): Array<{ id: string; email: string; displayName: string; provider: AccountProvider }> {
  return accountsDb.accounts.map((account) => ({
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    provider: account.provider
  }));
}

export function listAccountsWithProfiles(): Array<{
  id: string;
  email: string;
  displayName: string;
  provider: AccountProvider;
  profile: DemoProfile;
}> {
  return accountsDb.accounts.map((account) => ({
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    provider: account.provider,
    profile: cloneProfile(account.profile)
  }));
}

export function findAccountById(accountId: string): {
  id: string;
  email: string;
  displayName: string;
  provider: AccountProvider;
  profile: DemoProfile;
} | null {
  const account = accountsDb.accounts.find((entry) => entry.id === accountId);
  if (!account) return null;
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    provider: account.provider,
    profile: cloneProfile(account.profile)
  };
}

export function getActiveAccount(): { id: string; email: string; displayName: string; provider: AccountProvider } | null {
  const account = accountsDb.accounts.find((entry) => entry.id === accountsDb.activeAccountId);
  if (!account) return null;
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    provider: account.provider
  };
}

export function hasActiveAccount(): boolean {
  return Boolean(accountsDb.activeAccountId && accountsDb.accounts.some((entry) => entry.id === accountsDb.activeAccountId));
}

export function logoutAccount(): void {
  accountsDb.activeAccountId = null;
  persistAccountsDb();
  profile = createDefaultProfile();
  saveProfile();
}

export function registerAccount(
  email: string,
  password: string,
  displayName: string,
  provider: AccountProvider = 'local',
  seedProfile?: Partial<DemoProfile>
): { ok: boolean; message: string } {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return { ok: false, message: 'Inserisci un nome giocatore valido.' };
  if (!displayName.trim()) return { ok: false, message: 'Inserisci un nome giocatore.' };

  const existing = accountsDb.accounts.find((entry) => normalizeEmail(entry.email) === normalizedEmail && entry.provider === provider);
  if (existing) return { ok: false, message: 'Account già esistente.' };

  const now = Date.now();
  const account: StoredAccount = {
    id: `acc_${now}_${Math.random().toString(36).slice(2, 8)}`,
    email: normalizedEmail,
    displayName: displayName.trim(),
    provider,
    passwordHash: provider === 'local' ? hashPassword(password) : undefined,
    profile: createProfileFromSeed(displayName.trim(), seedProfile),
    createdAt: now,
    updatedAt: now
  };

  accountsDb.accounts.push(account);
  accountsDb.activeAccountId = account.id;
  persistAccountsDb();
  profile = cloneProfile(account.profile);
  saveProfile();
  return { ok: true, message: 'Account creato.' };
}

export function loginAccount(email: string, password: string, provider: AccountProvider = 'local'): { ok: boolean; message: string } {
  const normalizedEmail = normalizeEmail(email);
  const account = accountsDb.accounts.find((entry) => normalizeEmail(entry.email) === normalizedEmail && entry.provider === provider);
  if (!account) return { ok: false, message: 'Account non trovato.' };
  if (provider === 'local' && account.passwordHash !== hashPassword(password)) return { ok: false, message: 'Password non valida.' };

  accountsDb.activeAccountId = account.id;
  account.updatedAt = Date.now();
  persistAccountsDb();
  profile = cloneProfile(account.profile);
  saveProfile();
  return { ok: true, message: 'Accesso effettuato.' };
}

export function quickGoogleLogin(email: string, displayName?: string): { ok: boolean; message: string } {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return { ok: false, message: 'Inserisci una email Google valida.' };

  const existing = accountsDb.accounts.find((entry) => normalizeEmail(entry.email) === normalizedEmail && entry.provider === 'google');
  if (existing) {
    accountsDb.activeAccountId = existing.id;
    existing.updatedAt = Date.now();
    persistAccountsDb();
    profile = cloneProfile(existing.profile);
    saveProfile();
    return { ok: true, message: 'Accesso Google effettuato.' };
  }

  return registerAccount(normalizedEmail, '', displayName || normalizedEmail.split('@')[0] || 'Giocatore', 'google');
}

export function getRankLabel(mmr: number): string {
  const index = RANK_THRESHOLDS.filter((threshold) => mmr >= threshold).length;
  return RANKS[index] ?? 'Bronzo I';
}

export function registerWin(isWin: boolean): void {
  const previousRank = getRankLabel(profile.mmr);
  profile.games += 1;
  if (isWin) {
    profile.wins += 1;
    profile.mmr += 18;
    profile.credits += 25;
    if (!profile.titles.includes('Leggenda di UNO') && profile.wins >= 5) {
      profile.titles.push('Leggenda di UNO');
      if (!profile.activeTitle) {
        profile.activeTitle = 'Leggenda di UNO';
        profile.activeTitleIndex = profile.titles.indexOf(profile.activeTitle);
      }
    }
  } else {
    profile.losses += 1;
    profile.mmr = Math.max(200, profile.mmr - 8);
  }
  saveProfile();

  if (isWin) {
    const newRank = getRankLabel(profile.mmr);
    if (newRank !== previousRank) {
      notify(`Rank Up! Ora sei ${newRank}`);
    }
  }
}
