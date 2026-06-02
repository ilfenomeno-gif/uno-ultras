import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const base = 'http://127.0.0.1:5174/';
const modes = ['uno', 'ruba', 'scopa', 'briscola', 'scala40', 'burraco', 'poker', 'blackjack', 'millemiglia', 'tressette'];

const click = async (page, selector, timeout = 8000) => {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout });
  await el.click();
};

const setOnlineMode = async (page, mode) => {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await click(page, '[data-action="open-modal"]');
  await click(page, '[data-action="modal-tab"][data-tab="modalita"]');
  await click(page, `[data-action="modal-pick-game"][data-game="${mode}"]`);
  await click(page, '[data-action="modal-tab"][data-tab="giocatori"]');
  await click(page, '[data-action="modal-pick-mode"][data-mode="online"]');
  await click(page, '[data-action="modal-confirm"]');
};

const readState = async (page) =>
  page.evaluate(() => ({
    activeGame: window.__activeGame ?? null,
    isOnlineMatch: Boolean(window.__isOnlineMatch),
    hasSnapshot: Boolean(window.__onlineGameState),
    mainText: document.querySelector('main')?.innerText?.slice(0, 500) ?? ''
  }));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const host = await context.newPage();
const guest = await context.newPage();

const rows = [];
for (const mode of modes) {
  const row = { mode, created: false, joined: false, started: false, host: null, guest: null, error: null };
  try {
    await setOnlineMode(host, mode);
    await click(host, '[data-action="online-create"]');
    row.created = true;

    const code = await host.locator('.fn-lobby-code-box strong').first().innerText({ timeout: 8000 });

    await setOnlineMode(guest, mode);
    await guest.locator('[data-online-field="join-code"]').first().fill(code.replace('-', ''));
    await click(guest, '[data-action="online-join"]');
    row.joined = true;

    await click(host, '[data-action="online-start"]');
    row.started = true;

    await host.waitForTimeout(3500);
    await guest.waitForTimeout(3500);

    row.host = await readState(host);
    row.guest = await readState(guest);

    await host.locator('[data-action="back-to-hub"], [data-action="stop-game"], [data-action="online-leave"]').first().click({ timeout: 1500 }).catch(() => {});
    await guest.locator('[data-action="back-to-hub"], [data-action="stop-game"], [data-action="online-leave"]').first().click({ timeout: 1500 }).catch(() => {});
  } catch (e) {
    row.error = String(e?.message ?? e);
  }
  rows.push(row);
  console.log(`mode ${mode}: created=${row.created} joined=${row.joined} started=${row.started} error=${row.error ? 'yes' : 'no'}`);
}

writeFileSync('docs/reports/online-modes-e2e.json', `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
console.log('saved docs/reports/online-modes-e2e.json');

await browser.close();
