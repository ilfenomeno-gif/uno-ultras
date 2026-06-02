import { chromium } from 'playwright';

const base = 'http://127.0.0.1:5174/';

const click = async (page, selector) => {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 8000 });
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

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const host = await context.newPage();
const guest = await context.newPage();

await setOnlineMode(host, 'uno');
await click(host, '[data-action="online-create"]');
const code = await host.locator('.fn-lobby-code-box strong').first().innerText({ timeout: 8000 });

await setOnlineMode(guest, 'uno');
await guest.locator('[data-online-field="join-code"]').first().fill(code.replace('-', ''));
await click(guest, '[data-action="online-join"]');
await click(host, '[data-action="online-start"]');

await host.waitForTimeout(3500);
await guest.waitForTimeout(3500);

const readState = async (page) =>
  page.evaluate(() => ({
    activeGame: window.__activeGame ?? null,
    isOnlineMatch: Boolean(window.__isOnlineMatch),
    hasSnapshot: Boolean(window.__onlineGameState),
    syncStartedAt: Number(window.__onlineSyncStartedAt ?? 0),
    selectedMode: document.querySelector('#fn-mode-display')?.textContent?.trim() ?? null,
    mainText: document.querySelector('main')?.innerText?.slice(0, 320) ?? ''
  }));

const hostState = await readState(host);
const guestState = await readState(guest);

console.log(JSON.stringify({ code, hostState, guestState }, null, 2));

await browser.close();
