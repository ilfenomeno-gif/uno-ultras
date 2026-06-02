# Multiplayer Online Migration — Phase 1 (2026-05-31)

## Obiettivo fase 1

Portare il multiplayer da trasporto locale-only a un foundation online reale senza regressioni della shell corrente:

- gateway realtime server-side
- stato presenza centralizzato server-side
- inviti/lobby/match lifecycle su protocollo rete
- fallback locale conservato

## Implementazione completata

### 1) Gateway realtime WebSocket

File: `scripts/dev.js`

- Dev server HTTP ora espone WebSocket su `/ws`.
- Stato in-memory introdotto per:
  - sessioni client
  - presence snapshot
  - room/lobby
  - invites
  - matches
- Eventi supportati:
  - `hello`
  - `presence:set`
  - `invite:send`
  - `invite:respond`
  - `room:join`
  - `room:leave`
  - `room:update`
  - `room:event`
  - `match:start`
  - `match:end`
- Broadcast presenza centralizzato con `presence:snapshot`.

### 2) Transport client online + fallback

File: `js/multiplayer/session.js`

- `createTransport(...)` ora usa:
  1. WebSocket transport (`online-websocket`) quando `/ws` è disponibile.
  2. fallback BroadcastChannel (`local-broadcast-channel`) quando WS non disponibile.
- Aggiunto `createPresenceChannel(...)` per gestire presence client dedicata.
- Identità peer persistita via localStorage (`uno-ultra-v2-peer-id`).

### 3) Hook lifecycle shell -> presence online

File: `index.html`

- Importato `createPresenceChannel`.
- Aggiunto canale presenza singleton lato shell.
- Stati inviati al backend:
  - apertura multiplayer -> `in_lobby`
  - avvio match -> `in_match`
  - cleanup/uscita -> `online`
- Hook integrati in:
  - `openMultiplayerV2`
  - `ensureMPLobbyServer`
  - `startMultiplayerMatchFromLobby`
  - `cleanupActiveMatch`
  - `beforeunload`

## Compatibilità e regressioni

- UX shell invariata: nessuna riscrittura dei flussi UI.
- Fallback locale mantenuto: se WS non è disponibile, i flussi continuano a funzionare via BroadcastChannel.

## Validazione eseguita

1. `npm install` (aggiunta dipendenza `ws`) completato.
2. `npm run check` superato.
3. Smoke startup server su porta libera (`PORT=4274`):
   - HTTP attivo
   - gateway WS attivo (`ws://localhost:4274/ws`)

## Limiti residui (dopo fase 1)

- Storage server è in-memory (no persistenza su riavvio).
- Presence/inviti non ancora renderizzati end-to-end cross-client nella UI amici (solo emissione e foundation protocollo).
- Auth/token non ancora introdotti.
- Match authority runtime gameplay resta ancora nel legacy iframe; il server ora copre solo orchestration/state baseline.

## Prossimo step raccomandato (fase 2)

1. Collegare tab `Amici` e popup inviti agli eventi server (`presence:snapshot`, `invite:*`).
2. Introdurre persistenza server (Redis/DB) per sessioni, invites e lobby.
3. Aggiungere auth session token e validazione identità.
4. E2E multi-client automatici (2 browser context) su invite/lobby/start/end/cleanup.

## Aggiornamento strutturale e UX (post-fase1)

Interventi aggiuntivi applicati dopo la fase 1 per coprire criticità di code quality e credibilità prodotto:

1. **Top100 non più placeholder statico**
- Rimossa la base hardcoded (`LB_BASE`) dal rendering shell.
- Nuova pipeline classifica: profili locali reali da runtime DB (`_loadDB`) + profilo shell.

2. **Primo split del monolite shell**
- Estratto modulo dedicato: `js/shell/leaderboard-data.js`.
- `index.html` ora delega la costruzione dati classifica a una funzione pura (`buildTop100FromLocal`).

3. **Accessibilità operativa su navigazione shell**
- Aggiunto focus management automatico su cambi screen/tab (`showScreen`, `activateTab`, `activateMPTab`) con focus su titolo pannello.
- Obiettivo: migliore usabilità tastiera/screen reader e contesto immediato dopo navigazione.

4. **Ulteriore modularizzazione shell**
- Estratto modulo `js/shell/rank-utils.js` per ranking labels/color.
- Ridotta logica inline in `index.html` e migliorata separazione responsabilità.