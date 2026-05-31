type UiSettings = {
  audioFx: number;
  music: number;
  reduceMotion: boolean;
  colorblind: boolean;
  nvdaAssist: boolean;
};

const SETTINGS_KEY = 'uno-ultras-settings';

const defaultSettings: UiSettings = {
  audioFx: 80,
  music: 55,
  reduceMotion: false,
  colorblind: false,
  nvdaAssist: true
};

let settings = loadSettings();

function loadSettings(): UiSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw) as Partial<UiSettings>;
    return {
      audioFx: Number.isFinite(parsed.audioFx) ? Number(parsed.audioFx) : defaultSettings.audioFx,
      music: Number.isFinite(parsed.music) ? Number(parsed.music) : defaultSettings.music,
      reduceMotion: Boolean(parsed.reduceMotion),
      colorblind: Boolean(parsed.colorblind),
      nvdaAssist: parsed.nvdaAssist === undefined ? defaultSettings.nvdaAssist : Boolean(parsed.nvdaAssist)
    };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySettingsToBody(): void {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('reduce-motion', settings.reduceMotion);
  document.body.classList.toggle('colorblind', settings.colorblind);
}

export function handleSettingsInput(target: HTMLElement): boolean {
  const key = target.getAttribute('data-setting');
  if (!key) return false;

  const input = target as HTMLInputElement;
  if (key === 'audioFx') settings.audioFx = Number(input.value);
  if (key === 'music') settings.music = Number(input.value);
  if (key === 'reduceMotion') settings.reduceMotion = input.checked;
  if (key === 'colorblind') settings.colorblind = input.checked;
  if (key === 'nvdaAssist') settings.nvdaAssist = input.checked;

  saveSettings();
  applySettingsToBody();
  return true;
}

export function renderSettings(): string {
  settings = loadSettings();
  applySettingsToBody();

  return `
    <section class="panel">
      <h2>Impostazioni</h2>
      <div class="setting-row"><span>Audio FX</span><input type="range" min="0" max="100" value="${settings.audioFx}" data-setting="audioFx" aria-label="Audio FX" /></div>
      <div class="setting-row"><span>Musica</span><input type="range" min="0" max="100" value="${settings.music}" data-setting="music" aria-label="Musica" /></div>
      <div class="setting-row"><span>Riduzione Motion</span><input type="checkbox" ${settings.reduceMotion ? 'checked' : ''} data-setting="reduceMotion" aria-label="Riduzione Motion" /></div>
      <div class="setting-row"><span>Colorblind Mode</span><input type="checkbox" ${settings.colorblind ? 'checked' : ''} data-setting="colorblind" aria-label="Colorblind Mode" /></div>
      <div class="setting-row"><span>NVDA Assist</span><input type="checkbox" ${settings.nvdaAssist ? 'checked' : ''} data-setting="nvdaAssist" aria-label="NVDA Assist" /></div>
    </section>
  `;
}
