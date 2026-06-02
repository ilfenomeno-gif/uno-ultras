## Sezione A — Singleplayer (vs AI)
- [A1.1] Verificato wiring navigazione e rendering schermate dal listener globale.
- [A2.5/A2.6] Implementato color picker per Wild/Wild4 con dialog ARIA e focus automatico.
- [A2.7] Deck convertito da div a button accessibile; draw action disabilitata fuori turno.
- [A2.8] Migliorato feedback Dichiara UNO e messaggio penalità leggibile.
- [A3.3] Stabilizzato cleanup su uscita da Play per evitare timer AI residui.

## Sezione B — Multiplayer Locale (Hot Seat)
- [B1.1/B1.2] Aggiunto selettore modalità single/local e numero giocatori locali (2-4).
- [B1.3] Start locale con tutti i giocatori umani (isAI=false) e naming Giocatore N.
- [B1.4] Implementata handoff screen Passa il dispositivo con conferma turno.
- [B1.5] Board adattato al giocatore corrente in hot-seat.

## Sezione C — Tutte le Schermate
- [C2.1/C2.2] Shop completamente funzionante: buy-item, costi, deduzione crediti, reward titolo, notifica e credito live.
- [C3.1/C3.2/C3.3] Settings persistenti con apply realtime su body (reduce-motion, colorblind).
- [C4.1/C4.2/C4.3] Profilo: nome editabile, winrate, titoli selezionabili con stato attivo persistente.
- [C5.1/C5.2] Leaderboard su profilo reale locale + sezione I miei record.

## Sezione D — Accessibilità
- [D1] Skip link aggiunto e main-content target.
- [D2] Annuncio turno con sr-only aria-live assertive.
- [D3] Notifiche con role=status e aria-live=polite.
- Migliorata navigabilità tastiera e compatibilità screen reader sul board UNO.

## Bug Fix Additional
- [3.8] Aggiunta guardia su mazzo esaurito in drawFromDeck per evitare edge-case crash.

## Feature Create
- Color picker Jolly completo.
- Multiplayer locale hot-seat con handoff.
- Shop transazionale con rewards.
- Profilo avanzato con titolo attivo.

## Build e Test
- Build: PASS
- Test: 11 test, 0 falliti

## Commit del branch qa/full-feature
- feat: add wild/wild4 color picker modal with ARIA
- fix: deck div→button, disable board during AI turn
- fix: improve say-uno feedback and penalty message
- feat: add local multiplayer hot seat with handoff screen
- feat: wire shop buy-item handler with credits and rewards
- feat: add settings persistence and real-time body classes
- feat: editable profile name, winrate, selectable titles
- feat: leaderboard reads real profile, add personal records
- feat: add skip-link, sr-only, ARIA turn announce
- fix: add deck exhaustion guard in drawFromDeck
- test: add full QA test suite for all new mechanics

## E2E Browser Validation (Playwright su localhost:5174)
- Commit E2E: `18b70b6` (`test: E2E browser tests via playwright on localhost:5174`)
- Suite eseguita su URL reale: `http://localhost:5174`
- Risultato gruppi: **12/12 PASS**
- Console runtime: **0 errori / 0 warning**
- Report dettagliato: `e2e-report.md`
- Screenshot: `e2e/screenshots/` (+ `e2e/screenshots/index.html`)

### Note tecniche E2E
- Runner stabilizzato con timeout globali e log di avanzamento per gruppo.
- Ridotta flaky behavior su click dinamici (retry click su elementi stale).
- Validazione shop resa robusta con verifica coerenza crediti pre/post acquisto.
