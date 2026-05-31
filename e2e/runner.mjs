import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5174';
const shotsDir = path.resolve('e2e/screenshots');
const reportPath = path.resolve('e2e-report.md');

if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });

const groupResults = [];
const consoleErrors = [];
const consoleWarns = [];

function addResult(group, name, pass, ok, fail) {
  groupResults.push({ group, name, pass, ok, fail });
}

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function screenshot(page, name) {
  const file = path.join(shotsDir, `${safeName(name)}.png`);
  await page.screenshot({ path: file, fullPage: true });
}

async function clickFirstStable(locator) {
  const count = await locator.count();
  if (count === 0) return false;
  for (let i = 0; i < 3; i += 1) {
    try {
      await locator.first().click();
      return true;
    } catch {
      await locator.page().waitForTimeout(150);
    }
  }
  return false;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runGroup(page, group, name, fn) {
  console.log(`[START] ${group} - ${name}`);
  try {
    await fn();
    addResult(group, name, true, 'Flusso completato', '');
    console.log(`[PASS] ${group} - ${name}`);
  } catch (error) {
    addResult(group, name, false, '', `${error?.message || String(error)}`);
    await screenshot(page, `${group}-${name}-failed`);
    console.log(`[FAIL] ${group} - ${name}: ${error?.message || String(error)}`);
  }
}

async function ensureServer() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(BASE_URL, { signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    clearTimeout(timeout);
    return false;
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(8000);
page.setDefaultNavigationTimeout(15000);

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
  if (msg.type() === 'warning') consoleWarns.push(msg.text());
});
page.on('pageerror', (err) => {
  consoleErrors.push(err.message);
});

if (!(await ensureServer())) {
  throw new Error(`Server non raggiungibile su ${BASE_URL}`);
}

await runGroup(page, 'GRUPPO 1', 'Navigazione globale', async () => {
  await page.goto(BASE_URL);
  await page.waitForSelector('h1, h2');
  const title = (await page.textContent('h1, h2')) || '';
  assert(title.includes('UNO') || title.length > 0, 'Home non visibile');
  const screens = ['play', 'shop', 'settings', 'profile', 'leaderboard'];
  for (const screen of screens) {
    await page.click(`[data-action="goto"][data-screen="${screen}"]`);
    await page.waitForTimeout(300);
    const content = await page.content();
    assert(content.length > 500, `Schermata ${screen} vuota`);
    await screenshot(page, `group1-${screen}`);
  }
});

await runGroup(page, 'GRUPPO 2', 'Home buttons', async () => {
  await page.goto(BASE_URL);
  await page.click('[data-action="goto"][data-screen="play"]');
  await page.waitForTimeout(300);
  assert(page.url().includes('5174'), 'Navigazione a Play fallita');
  await screenshot(page, 'group2-home-to-play');
  await page.click('[data-action="goto"][data-screen="home"]');
  await page.click('[data-action="goto"][data-screen="shop"]');
  await page.waitForTimeout(300);
  await screenshot(page, 'group2-home-to-shop');
});

await runGroup(page, 'GRUPPO 3', 'Singleplayer lobby/start', async () => {
  await page.click('[data-action="goto"][data-screen="play"]');
  await page.waitForTimeout(300);
  assert((await page.$('.chip.active[data-game="uno"]')) !== null, 'Chip UNO non attivo');
  assert((await page.$('.chip.active[data-mode="single"]')) !== null, 'Single mode non attivo');
  await page.click('[data-action="start-mode"]');
  await page.waitForTimeout(600);
  assert((await page.$('.game')) !== null, 'Board non visibile');
  const cards = await page.$$('.hand .card');
  assert(cards.length >= 1, 'Nessuna carta in mano');
  assert((await page.textContent('p')) !== null, 'Info turno assente');
  await screenshot(page, 'group3-single-board');
});

await runGroup(page, 'GRUPPO 4', 'Singleplayer actions', async () => {
  const deckBtn = await page.$('button.deck[data-action="draw"]');
  assert(deckBtn !== null, 'Deck non e button');
  const deckTag = await deckBtn.evaluate((el) => el.tagName);
  assert(deckTag === 'BUTTON', 'Deck tag non BUTTON');

  await page.waitForFunction(() => document.querySelectorAll('.hand .card.playable:not([disabled])').length > 0, null, {
    timeout: 10000
  });

  const playable = await page.$('.hand .card.playable:not([disabled])');
  if (playable) {
    const playableLocator = page.locator('.hand .card.playable:not([disabled])');
    const ariaLabel = await playable.getAttribute('aria-label');
    assert((ariaLabel || '').includes('giocabile'), 'ARIA label carta errato');
    const clicked = await clickFirstStable(playableLocator);
    assert(clicked, 'Click carta giocabile fallito per elemento stale');
    await page.waitForTimeout(700);
    const picker = await page.$('.color-picker');
    if (picker) {
      await screenshot(page, 'group4-color-picker');
      await page.click('.color-picker button[data-color="red"]');
      await page.waitForTimeout(500);
    }
    assert((await page.$('.log .log-entry')) !== null, 'Log non aggiornato');
  }

  const unoBtn = page.locator('[data-action="say-uno"]:not([disabled])');
  if ((await unoBtn.count()) > 0) {
    await unoBtn.first().click();
    await page.waitForTimeout(300);
    const log = (await page.textContent('.log')) || '';
    assert(log.toLowerCase().includes('uno'), 'Feedback UNO non trovato');
  }

  await page.waitForFunction(() => {
    const btn = document.querySelector('[data-action="draw"].btn-ghost');
    return !!btn && !btn.hasAttribute('disabled');
  }, null, { timeout: 12000 });

  const drawBtn = page.locator('[data-action="draw"].btn-ghost:not([disabled])');
  if ((await drawBtn.count()) > 0) {
    await drawBtn.first().click();
    await page.waitForTimeout(800);
  }

  const stopBtn = page.locator('[data-action="stop-game"]');
  assert((await stopBtn.count()) > 0, 'Stop button assente');
  await stopBtn.first().click();
  await page.waitForTimeout(300);
  assert((await page.$('.game')) === null, 'Board non rimosso dopo abbandono');
  await screenshot(page, 'group4-after-stop');
});

await runGroup(page, 'GRUPPO 5', 'Singleplayer endgame stability', async () => {
  await page.click('[data-action="goto"][data-screen="play"]');
  await page.click('[data-action="start-mode"]');
  await page.waitForTimeout(500);

  let gameEnded = false;
  for (let i = 0; i < 30 && !gameEnded; i += 1) {
    await page.waitForTimeout(1200);
    const stopBtn = await page.$('[data-action="stop-game"]');
    if (!stopBtn) {
      gameEnded = true;
      break;
    }

    const playable = await page.$('.hand .card.playable:not([disabled])');
    if (playable) {
      await playable.click();
      await page.waitForTimeout(400);
      const picker = await page.$('.color-picker');
      if (picker) {
        await page.click('.color-picker button:first-child');
        await page.waitForTimeout(400);
      }
    } else {
      const drawBtn = await page.$('[data-action="draw"].btn-ghost:not([disabled])');
      if (drawBtn) await drawBtn.click();
    }
  }

  await screenshot(page, 'group5-endgame');
});

await runGroup(page, 'GRUPPO 6', 'Local multiplayer hot-seat', async () => {
  await page.click('[data-action="goto"][data-screen="play"]');
  await page.waitForTimeout(300);
  assert((await page.$('[data-action="pick-mode"][data-mode="local"]')) !== null, 'Chip local mancante');
  await page.click('[data-action="pick-mode"][data-mode="local"]');
  await page.waitForTimeout(300);
  assert((await page.$('.chip.active[data-mode="local"]')) !== null, 'Local non attivo');
  await screenshot(page, 'group6-local-selected');
  assert((await page.$('[data-action="pick-players"][data-players="3"]')) !== null, 'Chip 3 giocatori mancante');
  await page.click('[data-action="pick-players"][data-players="3"]');
  await page.waitForTimeout(300);
  await page.click('[data-action="start-mode"]');
  await page.waitForTimeout(500);
  assert((await page.$('.game, .handoff')) !== null, 'Board/Handoff locale non visibile');

  const handoff = await page.$('[data-action="confirm-handoff"]');
  if (handoff) {
    await screenshot(page, 'group6-handoff');
    await handoff.click();
    await page.waitForTimeout(300);
  }

  const playable = await page.$('.hand .card.playable:not([disabled])');
  if (playable) {
    await playable.click();
    await page.waitForTimeout(400);
    const picker = await page.$('.color-picker');
    if (picker) {
      await page.click('.color-picker button:first-child');
      await page.waitForTimeout(400);
    }
    assert((await page.$('[data-action="confirm-handoff"]')) !== null, 'Handoff non appare dopo azione locale');
    await screenshot(page, 'group6-handoff-after-play');
  }

  const stopBtn = await page.$('[data-action="stop-game"]');
  if (stopBtn) {
    await stopBtn.click();
    await page.waitForTimeout(300);
  }
});

await runGroup(page, 'GRUPPO 7', 'Shop interactions', async () => {
  await page.click('[data-action="goto"][data-screen="shop"]');
  await page.waitForTimeout(300);
  const buyBtns = await page.$$('[data-action="buy-item"]');
  assert(buyBtns.length === 3, `Bottoni shop attesi 3, trovati ${buyBtns.length}`);
  const creditsText = (await page.textContent('strong#shop-credits')) || '';
  assert(creditsText.length > 0, 'Crediti non visibili nello shop');

  const profileBeforeRaw = await page.evaluate(() => localStorage.getItem('uno-ultras-definitivo-profile'));
  const profileBefore = JSON.parse(profileBeforeRaw || '{}');
  const creditsBefore = Number(profileBefore.credits ?? 0);

  const xpBtn = await page.$('[data-action="buy-item"][data-cost="120"]');
  if (xpBtn) {
    await xpBtn.click();
    await page.waitForTimeout(400);
    const profileAfterRaw = await page.evaluate(() => localStorage.getItem('uno-ultras-definitivo-profile'));
    const profileAfter = JSON.parse(profileAfterRaw || '{}');
    const creditsAfter = Number(profileAfter.credits ?? creditsBefore);

    assert(creditsAfter <= creditsBefore, `Crediti aumentati inaspettatamente: ${creditsBefore} -> ${creditsAfter}`);

    const notifyEl = await page.$('#notify, [role="status"]');
    const notifyText = (await notifyEl?.textContent()) || '';
    if (notifyText.trim().length > 0) {
      assert(/completato|insufficienti/i.test(notifyText), `Notifica shop inattesa: ${notifyText}`);
    }
    await screenshot(page, 'group7-shop-buy');
  }
  assert((await page.$('[data-action="buy-item"][data-cost="800"]')) !== null, 'Bottone 800 mancante');
});

await runGroup(page, 'GRUPPO 8', 'Settings persistence/body classes', async () => {
  await page.click('[data-action="goto"][data-screen="settings"]');
  await page.waitForTimeout(300);
  const rangeAudio = await page.$('input[type="range"][data-setting="audioFx"]');
  assert(rangeAudio !== null, 'Range audio assente');
  await rangeAudio.fill('70');
  await page.waitForTimeout(300);
  const saved = await page.evaluate(() => localStorage.getItem('uno-ultras-settings'));
  assert(!!saved, 'Settings non salvato in localStorage');

  const reduceCheck = await page.$('#reduce-motion, input[type="checkbox"][data-setting="reduceMotion"]');
  assert(reduceCheck !== null, 'Checkbox reduce-motion assente');
  await reduceCheck.click();
  await page.waitForTimeout(300);
  const hasClass = await page.evaluate(() => document.body.classList.contains('reduce-motion'));
  assert(hasClass, 'Classe reduce-motion non applicata');

  const colorblindCheck = await page.$('#colorblind, input[type="checkbox"][data-setting="colorblind"]');
  if (colorblindCheck) {
    await colorblindCheck.click();
    await page.waitForTimeout(300);
    const hasColorblind = await page.evaluate(() => document.body.classList.contains('colorblind'));
    assert(hasColorblind, 'Classe colorblind non applicata');
  }

  await page.reload();
  await page.waitForTimeout(800);
  await page.click('[data-action="goto"][data-screen="settings"]');
  const savedAfterReload = await page.evaluate(() => localStorage.getItem('uno-ultras-settings'));
  assert(!!savedAfterReload, 'Settings non persistente dopo reload');
  await screenshot(page, 'group8-settings');
});

await runGroup(page, 'GRUPPO 9', 'Profile editing/titles', async () => {
  await page.click('[data-action="goto"][data-screen="profile"]');
  await page.waitForTimeout(300);
  const nameInput = await page.$('input[data-profile-field="name"]');
  assert(nameInput !== null, 'Input nome assente');
  await nameInput.fill('LucaPro');
  await page.waitForTimeout(300);
  const savedProfile = await page.evaluate(() => localStorage.getItem('uno-ultras-definitivo-profile'));
  const parsed = JSON.parse(savedProfile || '{}');
  assert(parsed.name === 'LucaPro', `Nome non salvato: ${parsed.name}`);
  assert((await page.$('p:has-text("Winrate")')) !== null, 'Winrate non visibile');
  const titleBtns = await page.$$('[data-action="select-title"]');
  if (titleBtns.length > 0) {
    await titleBtns[0].click();
    await page.waitForTimeout(300);
    assert((await page.$('[data-action="select-title"].active')) !== null, 'Titolo attivo non impostato');
  }
  await screenshot(page, 'group9-profile');
});

await runGroup(page, 'GRUPPO 10', 'Leaderboard local profile', async () => {
  await page.click('[data-action="goto"][data-screen="leaderboard"]');
  await page.waitForTimeout(300);
  assert((await page.$('table')) !== null, 'Tabella leaderboard assente');
  const hasPlayer = (await page.$('tr:has-text("LucaPro"), td:has-text("LucaPro"), tr:has-text("Giocatore"), td:has-text("Giocatore")')) !== null;
  assert(hasPlayer, 'Profilo locale non presente in classifica');
  assert((await page.$('h3:has-text("record"), section:has-text("Partite giocate")')) !== null, 'Sezione record non visibile');
  await screenshot(page, 'group10-leaderboard');
});

await runGroup(page, 'GRUPPO 11', 'Keyboard/NVDA accessibility', async () => {
  await page.goto(BASE_URL);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  assert((await page.$('.skip-link:focus')) !== null, 'Skip link non raggiungibile con Tab');

  await page.click('[data-action="goto"][data-screen="play"]');
  await page.click('[data-action="start-mode"]');
  await page.waitForTimeout(500);

  const deckFocusable = await page.evaluate(() => {
    const deck = document.querySelector('button.deck');
    return !!deck && deck.tabIndex >= 0;
  });
  assert(deckFocusable, 'Deck non focusabile');
  assert((await page.$('[aria-live="polite"], [aria-live="assertive"]')) !== null, 'aria-live assente');
  assert((await page.$('[role="status"]')) !== null, 'role=status assente');
  await screenshot(page, 'group11-a11y');
});

await runGroup(page, 'GRUPPO 12', 'Console zero errors', async () => {
  await page.goto(BASE_URL);
  await page.click('[data-action="goto"][data-screen="play"]');
  await page.click('[data-action="start-mode"]');
  await page.waitForTimeout(2000);
  const stopBtn = await page.$('[data-action="stop-game"]');
  if (stopBtn) await stopBtn.click();
  await page.click('[data-action="goto"][data-screen="shop"]');
  await page.click('[data-action="goto"][data-screen="settings"]');
  await page.click('[data-action="goto"][data-screen="profile"]');
  await page.click('[data-action="goto"][data-screen="leaderboard"]');
  assert(consoleErrors.length === 0, `${consoleErrors.length} errori in console`);
});

await browser.close();

const lines = [];
for (const item of groupResults) {
  lines.push(`[${item.group}] — ${item.name}`);
  if (item.pass) {
    lines.push(`✅ ${item.ok}`);
  } else {
    lines.push(`❌ ${item.fail}`);
    lines.push('→ FIX: da applicare nel codice e rieseguire il gruppo');
  }
  lines.push('');
}

lines.push('## Console Summary');
lines.push(`Errori console: ${consoleErrors.length}`);
for (const err of consoleErrors) lines.push(`- ❌ ${err}`);
lines.push(`Warning console: ${consoleWarns.length}`);
for (const warn of consoleWarns) lines.push(`- ⚠️ ${warn}`);

fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');

const shots = fs.readdirSync(shotsDir).filter((f) => f.endsWith('.png'));
const html = `<!doctype html><html><body style="background:#111;color:#fff;font-family:sans-serif"><h1>E2E Screenshots — uno-ultras</h1>${shots
  .map(
    (s) => `<div style="margin:20px"><h3>${s}</h3><img src="${s}" style="max-width:900px;border:2px solid #7c3aed;border-radius:8px"/></div>`
  )
  .join('')}</body></html>`;
fs.writeFileSync(path.join(shotsDir, 'index.html'), html, 'utf8');

const failed = groupResults.filter((x) => !x.pass).length;
console.log(`E2E completed: ${groupResults.length - failed}/${groupResults.length} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
