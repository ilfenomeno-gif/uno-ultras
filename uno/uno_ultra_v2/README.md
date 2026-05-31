# UNO Ultra v2

Refactoring modulare del progetto monolitico `uno_ultra_v52 (1) (2).html`.

## Runtime Reale

- La shell caricata da `index.html` monta il runtime effettivo tramite iframe.
- Il gameplay effettivamente eseguito dal launcher in locale e in produzione risiede in `legacy/index-runtime.html` (compatibilita interna).
- `legacy/original-runtime.html` resta una sorgente legacy di audit/porting, non usata nel routing di avvio partita.
- `data/original-reference.html` resta la sorgente di riferimento usata dagli script di porting e audit.
- Le patch funzionali che devono cambiare il comportamento live del gioco vanno applicate al runtime `legacy/` e poi mantenute allineate con le sorgenti di porting quando necessario.
- La navigazione utente (profilo, targhette, shop, battle pass, sfide, stagione, lobby) e unificata in `index.html`: la UI legacy non e un entrypoint operativo.

## Struttura

- `index.html`: shell applicativa e schermate.
- `css/styles.css`: stile UI responsive.
- `data/cards.json`: definizione canonica del mazzo UNO, scoring e timer base estratti dal monolite.
- `data/ranks.json`: rank tiers completi con soglie intermedie, colori e progressione XP estratti dal monolite.
- `data/playlists.json`: catalogo esteso delle playlist MMR del monolite, incluse varianti team e mini-giochi.
- `js/core/`: superficie architetturale del core (`constants`, `deck`, `state`, `game`).
- `js/systems/`: superficie architetturale dei sistemi (`progression`, `tournaments`, `social`, `audio`, `vfx`, `accessibility`, `persistence`, `multiplayer`, `replay`, `queue`, `ucs`, `grandprix`, `pentathlon`).
- `js/systems/minigames/`: catalogo mini-giochi con alias strutturali come `scala40.js`.
- `js/ui.js`: rendering DOM e interazioni UI.
- `js/main.js`: bridge metadata del porting ad alta fedelta; il runtime estratto resta inline in `index.html`.
- `js/multiplayer/session.js`: trasporto room-based per host/join e messaggi di sync.
- `photos/`: namespace asset grafici per front/back carte.
- `audio/`: namespace asset audio per SFX e music.
- `scripts/dev.js`: server statico locale.
- `scripts/build.js`: controllo struttura + build in `dist/`.
- `scripts/audit-original.js`: audit diff-driven dei marker funzionali principali tra `original.html` e il porting corrente.
- `legacy/index-runtime.html`: runtime usato dal bridge del launcher per avvio partita, minigiochi e meccaniche.
- `legacy/original-runtime.html`: sorgente legacy mantenuta per confronto/audit, non per il bootstrap live.

## Obiettivo fase attuale

- Re-implementazione core UNO in moduli separati.
- Conservazione delle meccaniche chiave: deck standard 108, skip/reverse/d2/w/w4,
  stacking draw, dichiarazione UNO con penalita, scoring round, match a target score.
- Porting multiplayer v2 base: host/join con codice stanza, lobby, sync stato e inoltro azioni guest.
- Hardening multiplayer v2: reconnect guest/spectator, turn token validation, ping/pong latency,
  desync recovery via request_resync, spectator/replay bridge.
- Progressione v2 base: update automatico post-match di XP/MMR/rank e HUD progressione in home.
- Tornei v2 base: creazione bracket classico, simulazione round bot e risoluzione match del player.
- Mini-giochi v2 base: runner modulari, pannello home dedicato, integrazione progressione.
- Sottosistemi estesi v2: persistenza session/settings/replay, audio/vfx, accessibilita, social.

## Stato

- Struttura modulare operativa con sottosistemi separati per core gameplay, UI, AI,
  multiplayer, progressione, tornei, mini-giochi, persistenza, audio, VFX,
  accessibilita e social locale.
- Albero progetto esteso con package Node, dati, script, asset placeholder e cartelle
    `core/` e `systems/` richieste dal piano di modularizzazione.
- Sistemi meta aggiuntivi separati in moduli dedicati per replay, queueing, UCS,
    Grand Prix e Pentathlon.


## Porting ad alta fedelta

- `npm run port:original`: rigenera `index.html`, `css/styles.css`, `data/cards.json`, `data/ranks.json`, `data/playlists.json` e il bridge `js/main.js` dal monolite.
- `npm run audit:original`: rigenera `data/port-audit.json` con i marker funzionali rilevati dal monolite.
- `js/main.js` resta un ponte metadata valido per l'albero modulare richiesto, senza interferire con il runtime estratto.

## Note Operative

- `node_modules/` e `dist/` sono gia esclusi dal versionamento tramite `.gitignore`.
- La leaderboard locale puo aggregare profili salvati nel DB locale (`uno-ultra-profiles-v8`) senza backend.
- Il controllo piu economico dopo patch al runtime e `npm run check`.
- Mapping UI aggiornato:
- `docs/reports/UI-LEGACY-MAP.md`
- `docs/reports/UI-NUOVA-MAP.md`
