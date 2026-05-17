import { store } from './storage.js';

export type Theme = 'default' | 'colorblind' | 'dark-hc';
const THEMES: Theme[] = ['default','colorblind','dark-hc'];

export function applyTheme(t: Theme): void {
  if (!THEMES.includes(t)) t = 'default';
  document.documentElement.setAttribute('data-theme', t);
  store.set('theme', t);
}

export function loadTheme(): void {
  applyTheme((store.get<Theme>('theme')) ?? 'default');
}
