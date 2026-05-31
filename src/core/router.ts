import type { ScreenId } from '../game/types';

export let currentScreen: ScreenId = resolveScreenFromPath(location.pathname);

let renderCallback: (() => void) | null = null;

export function setRouterRenderCallback(callback: () => void): void {
  renderCallback = callback;
}

export function resolveScreenFromPath(pathname: string): ScreenId {
  const p = pathname.toLowerCase();
  if (p.endsWith('/play')) return 'play';
  if (p.endsWith('/shop')) return 'shop';
  if (p.endsWith('/settings')) return 'settings';
  if (p.endsWith('/profile')) return 'profile';
  if (p.endsWith('/leaderboard')) return 'leaderboard';
  return 'home';
}

export function pathForScreen(screen: ScreenId): string {
  if (screen === 'home') return '/';
  return `/${screen}`;
}

export function navigateTo(screen: ScreenId, push = true): void {
  currentScreen = screen;
  if (push) history.pushState({ screen }, '', pathForScreen(screen));
  renderCallback?.();
}

window.addEventListener('popstate', () => {
  currentScreen = resolveScreenFromPath(location.pathname);
  renderCallback?.();
});
