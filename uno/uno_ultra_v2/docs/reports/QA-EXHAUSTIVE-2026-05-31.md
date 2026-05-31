# QA Esaustivo - Shell + Runtime

Data: 2026-05-31
Scope: verifica completa nuova UI shell, runtime iframe legacy, persistenza, multiplayer, social flow.
Ambiente: `npm run dev` su `http://localhost:4173` con cache-bust (`?ts=...`).

## Sintesi esecutiva

- Stato complessivo: stabile.
- Bug critici di avvio rilevati in sessione: risolti (bridge profilo `window.P` e fix ricorsione mini-difficolta).
- Copertura avvio modalita: 30/30 combinazioni (`10 mode x 3 player-count`) con transizione corretta a runtime e ritorno shell tramite `ingame-back`.
- Nessun crash runtime osservato nel giro finale.

## Matrice risultati per area

### Singleplayer

1. Gioca
- Stato: funziona.
- Evidenza: tutte le modalita avviate da popup con count 1/2/3 e schermata runtime attesa.

2. Profilo
- Stato: funziona + persistente.
- Evidenza: titolo/crediti/cosmetici coerenti con profilo runtime e mantenuti dopo reload.

3. Targhette
- Stato: funziona + persistente.
- Evidenza: selezione targhetta aggiorna `selectedTitle` e riflette in Profilo e Multiplayer Profilo.

4. Shop
- Stato: parziale ma coerente (feature semplificata).
- Classificazione: coerente non persistente giornaliero, persistente per ownership locale.
- Evidenza: claim item gratuito (+200) funziona, ownership salvata, crediti aggiornati e persistiti.
- Nota: catalogo premium bloccato da crediti insufficienti e non include ciclo economico completo in questa build.

5. Battle Pass
- Stato: solo UI (corretto rendering).
- Evidenza: track visualizzato con 15 nodi, tier corrente evidenziato.
- Nota: nessun avanzamento dinamico osservato durante il giro QA (atteso nella build attuale).

6. Sfide
- Stato: solo UI coerente.
- Evidenza: lista e progress bar renderizzate correttamente con valori ARIA.

7. Top100
- Stato: funziona (dataset simulato coerente).
- Evidenza: ordinamento MMR decrescente confermato su righe renderizzate.

8. Stagione
- Stato: funziona (coerenza calcolo rank/next MMR).
- Evidenza: pannello mostra MMR/rank/wins e target successivo coerente con profilo corrente.

### Multiplayer

1. Tab navigation (`Gioca/Profilo/Sfide/Top100/Torneo/Amici/Club`)
- Stato: funziona.
- Evidenza: ogni tab attiva il relativo pannello (`mptab-*`) senza dead route.

2. Lobby + inviti + start
- Stato: funziona.
- Evidenza: avvio con lobby valida porta al runtime; ritorno shell corretto.
- Validazione corretta: blocco start con invitati insufficienti su 4P (`Servono 3 amici invitati...`).

3. Profilo multiplayer
- Stato: funziona + coerente con singleplayer.
- Evidenza: nome/titolo/crediti allineati al profilo shell/runtime.

4. Amici (search + richieste)
- Stato: parziale (flow simulato ma funzionante lato UI/state locale).
- Evidenza: ricerca produce risultati; accettazione richiesta aggiorna badge/lista.

5. Club
- Stato: parziale (flow locale coerente).
- Evidenza: creazione club (`QA Club [QAC]`) e stato membership aggiornato con azione lascia-club disponibile.

## Bug rilevati in questa sessione e stato

1. `notifEnabled` in init runtime legacy
- Tipo: bug reale (runtime init).
- Stato: risolto.

2. `TypeError` su campi profilo (`mmrP`/`name`/`bjBalance`) per mismatch tra shell e scope lessicale runtime
- Tipo: bug reale (integrazione shell->iframe).
- Stato: risolto con bridge `window.P` getter/setter verso `let P` + `ensureFields`.

3. `RangeError: Maximum call stack size exceeded` in selezione mini-difficolta
- Tipo: bug reale (ricorsione).
- Stato: risolto rimuovendo path ricorsivo e normalizzando input in `setMiniDiff`.

## Persistenza e coerenza dati

- Persistenza confermata su reload:
  - `selectedTitle` (es. `t2`)
  - `ownedShopItems` (es. `shop-credits-mini`)
  - `credits` e metadati profilo shell
- Store shell osservato: `uno-ultra-shell-profile-v1`.
- Coerenza shell/runtime: confermata dopo bootstrap iframe.

## Test eseguiti

1. Check progetto
- Comando: `npm run check`
- Esito: passed.

2. Browser audit critico routing
- Esito: passed su Gioca/Profilo/Targhette/Shop/Battle Pass/Sfide/Stagione + impostazioni rilevanti.

3. Launch matrix automatizzata
- Scope: 10 modalita x 3 player-count.
- Esito: 30 launch ok + 30 back ok.

4. Multiplayer deep checks
- Scope: tab coherence, inviti, start constraints, social search/requests, club create.
- Esito: passed con classificazione parziale dove previsto (flow locale/simulato).

## File toccati (sessione QA/fix)

- `legacy/index-runtime.html`
- `legacy/original-runtime.html`
- `data/original-reference.html`
- `index.html`
- `CHANGELOG.md`
- `docs/reports/UI-LEGACY-MAP.md`
- `docs/reports/UI-NUOVA-MAP.md`
- `docs/reports/QA-EXHAUSTIVE-2026-05-31.md`

## Open items residui (non bloccanti)

1. Rendere `Battle Pass` e `Sfide` progressivi su eventi gameplay reali (oggi prevalentemente rappresentazione UI).
2. Decidere se la persistenza lobby multiplayer (inviti pre-esistenti al rientro) e comportamento desiderato o va resettata ad ogni ingresso.
3. Introdurre test end-to-end automatici dedicati a social/club su scenari multi-utente reali.
