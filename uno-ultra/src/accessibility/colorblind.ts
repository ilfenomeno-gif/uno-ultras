export interface ColorblindPrefs {
  enabled: boolean;
}

export function applyColorblindMode(root: HTMLElement, prefs: ColorblindPrefs): void {
  root.dataset.colorblind = prefs.enabled ? 'on' : 'off';
}
