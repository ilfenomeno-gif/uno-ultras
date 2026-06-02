import { chromium, type Page } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type ModeId =
  | 'uno'
  | 'ruba'
  | 'scopa'
  | 'briscola'
  | 'scala40'
  | 'burraco'
  | 'poker'
  | 'blackjack'
  | 'millemiglia'
  | 'tressette';

type TestChannel = 'single' | 'local' | 'online';

type Row = {
  mode: ModeId;
  channel: TestChannel;
  players: string;
  pass: boolean;
  reason: string;
  details: string;
};

const BASE_URL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:5174/';

const MODES: ModeId[] = ['uno', 'ruba', 'scopa', 'briscola', 'scala40', 'burraco', 'poker', 'blackjack', 'millemiglia', 'tressette'];
const LOCAL_PLAYERS = [2, 3, 4] as const;

function nowStamp(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}-${hh}${mm}${ss}`;
}

function csvEscape(value: string): string {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function exists(page: Page, selector: string): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}

async function clickSel(page: Page, selector: string, timeout = 8000): Promise<void> {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout });
  await el.dispatchEvent('click');
}

async function hardReset(page: Page): Promise<void> {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await clickSel(page, '[data-action="switch-hub"][data-hub="gioca"]');
}

async function stopIfRunning(page: Page): Promise<void> {
  if (await exists(page, '[data-action="stop-game"]')) {
    await clickSel(page, '[data-action="stop-game"]');
    await page.waitForTimeout(250);
  }
}

async function openConfigModal(page: Page): Promise<void> {
  if (await exists(page, '[data-action="open-modal"]')) {
    await clickSel(page, '[data-action="open-modal"]');
    return;
  }
  if (await exists(page, '[data-action="online-open-mode-picker"]')) {
    await clickSel(page, '[data-action="online-open-mode-picker"]');
    return;
  }
  throw new Error('config button not found');
}

async function setConfig(page: Page, modeId: ModeId, channel: TestChannel, players?: number): Promise<void> {
  await openConfigModal(page);
  await clickSel(page, '[data-action="modal-tab"][data-tab="modalita"]');
  await clickSel(page, `[data-action="modal-pick-game"][data-game="${modeId}"]`);
  await clickSel(page, '[data-action="modal-tab"][data-tab="giocatori"]');
  await clickSel(page, `[data-action="modal-pick-mode"][data-mode="${channel}"]`);
  if (channel !== 'online' && players) {
    await clickSel(page, `[data-action="modal-pick-players"][data-players="${players}"]`);
  }
  await clickSel(page, '[data-action="modal-confirm"]');
}

async function probeOffline(page: Page): Promise<{ pass: boolean; reason: string; details: string }> {
  if (!(await exists(page, '[data-action="fn-start"]'))) {
    return { pass: false, reason: 'start button missing', details: '' };
  }

  await clickSel(page, '[data-action="fn-start"]');
  await page.waitForTimeout(1600);

  const started = await exists(page, '[data-action="stop-game"]');
  if (!started) {
    return { pass: false, reason: 'game board not started', details: '' };
  }

  const actionableSelectors = ['[data-action="play-card"]', '[data-action="draw-card"]', '[data-action="draw"]', '[data-action="bj-deal"]', '[data-action="poker-check"]'];
  let foundAction = '';
  for (const selector of actionableSelectors) {
    if (await exists(page, selector)) {
      foundAction = selector;
      break;
    }
  }

  await stopIfRunning(page);
  if (!foundAction) {
    return { pass: true, reason: 'board started', details: 'no immediate action selector found in first render' };
  }

  return { pass: true, reason: 'board+action ready', details: foundAction };
}

async function probeOnline(page: Page): Promise<{ pass: boolean; reason: string; details: string }> {
  if (await exists(page, '[data-action="fn-start"]')) {
    await clickSel(page, '[data-action="fn-start"]');
    await page.waitForTimeout(700);
  }

  if (!(await exists(page, '[data-action="online-create"]'))) {
    return { pass: false, reason: 'online create button missing', details: '' };
  }

  await clickSel(page, '[data-action="online-create"]');
  await page.waitForTimeout(1000);

  const inRoom = await exists(page, '[data-action="online-leave"]');
  const modeText = await page.locator('.fn-lobby-room-meta strong').first().innerText().catch(() => '');

  if (inRoom) {
    await clickSel(page, '[data-action="online-leave"]').catch(() => undefined);
  }

  if (!inRoom) {
    return { pass: false, reason: 'failed to enter online room', details: modeText };
  }

  return { pass: true, reason: 'online lobby created', details: modeText };
}

async function run(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const rows: Row[] = [];

  try {
    for (const mode of MODES) {
      await hardReset(page);
      await stopIfRunning(page);
      console.log(`[qa-mode-matrix] single/${mode}`);
      try {
        await setConfig(page, mode, 'single', 2);
        const probe = await probeOffline(page);
        rows.push({ mode, channel: 'single', players: '2', pass: probe.pass, reason: probe.reason, details: probe.details });
      } catch (error) {
        rows.push({ mode, channel: 'single', players: '2', pass: false, reason: 'exception', details: String(error) });
      }
    }

    for (const mode of MODES) {
      for (const players of LOCAL_PLAYERS) {
        await hardReset(page);
        await stopIfRunning(page);
        console.log(`[qa-mode-matrix] local/${mode}/${players}p`);
        try {
          await setConfig(page, mode, 'local', players);
          const probe = await probeOffline(page);
          rows.push({ mode, channel: 'local', players: String(players), pass: probe.pass, reason: probe.reason, details: probe.details });
        } catch (error) {
          rows.push({ mode, channel: 'local', players: String(players), pass: false, reason: 'exception', details: String(error) });
        }
      }
    }

    for (const mode of MODES) {
      await hardReset(page);
      await stopIfRunning(page);
      console.log(`[qa-mode-matrix] online/${mode}`);
      try {
        await setConfig(page, mode, 'online');
        const probe = await probeOnline(page);
        rows.push({ mode, channel: 'online', players: 'lobby', pass: probe.pass, reason: probe.reason, details: probe.details });
      } catch (error) {
        rows.push({ mode, channel: 'online', players: 'lobby', pass: false, reason: 'exception', details: String(error) });
      }
    }
  } finally {
    await browser.close();
  }

  const reportDir = join(process.cwd(), 'docs', 'reports');
  mkdirSync(reportDir, { recursive: true });

  const stamp = nowStamp();
  const csvPath = join(reportDir, `MODE-MATRIX-${stamp}.csv`);
  const headers = ['timestamp', 'mode', 'channel', 'players', 'pass', 'reason', 'details'];
  const lines = [headers.join(',')];

  for (const row of rows) {
    const values = [
      stamp,
      row.mode,
      row.channel,
      row.players,
      row.pass ? 'PASS' : 'FAIL',
      row.reason,
      row.details
    ].map(csvEscape);
    lines.push(values.join(','));
  }

  const summary = {
    total: rows.length,
    pass: rows.filter((r) => r.pass).length,
    fail: rows.filter((r) => !r.pass).length
  };

  writeFileSync(csvPath, `${lines.join('\n')}\n`, 'utf8');

  console.log(`[qa-mode-matrix] Report saved: ${csvPath}`);
  console.log(`[qa-mode-matrix] Summary: ${summary.pass}/${summary.total} PASS, ${summary.fail} FAIL`);
}

run().catch((error) => {
  console.error('[qa-mode-matrix] Fatal error:', error);
  process.exitCode = 1;
});
