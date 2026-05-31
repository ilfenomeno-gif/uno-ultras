import type { DemoProfile, GameId } from '../game/types';
import { notify } from './notify';

export const PROFILE_KEY = 'uno-ultras-definitivo-profile';

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
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw) as Partial<DemoProfile>;
    if (parsed.version !== 1) return { ...defaultProfile };

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
    return { ...defaultProfile };
  }
}

export function saveProfile(): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
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
