# UI Nuova Map (Architettura Unificata)

## Scopo
Questo documento descrive la UI nuova in `index.html` come sorgente principale di layout, comportamento, navigazione e collegamenti.

## Entrypoint operativo
- Entrypoint utente: `index.html`
- Shell logica: script inline module in `index.html`
- Bridge runtime interno: iframe `#app-frame` (compatibilita tecnica, non percorso utente)

## Schermate e blocchi principali
- `#screen-mainmenu`
- `#screen-singleplayer`
- `#screen-impostazioni`
- `#screen-multiplayer`
- popup/modali shell: `#play-popup`, `#social-popup`, `#club-create-popup`, `#club-join-popup`
- barra in-game shell: `#ingame-bar`

## Bottoni principali (nuova UI)
- Main menu:
- `#btn-singleplayer`
- `#btn-multiplayer`
- `#btn-impostazioni`
- `#btn-esci-main`
- Singleplayer tabs (`#sp-tabs`):
- `gioca`
- `profilo`
- `targhette`
- `shop`
- `battlepass`
- `sfide`
- `top100`
- `stagione`
- Multiplayer tabs (`#mp-tabs`):
- `gioca`, `profilo`, `sfide`, `top100`, `tornei`, `amici`, `club`

## Funzioni associate (nuova UI)
- Router schermate shell:
- `showScreen(...)`
- `activateTab(...)`
- `activateMPTab(...)`
- CTA gioco:
- `launchGame(...)`
- `startRuntimeModeDirect(...)`
- Rendering contenuti shell:
- `renderBP()`
- `renderSfide()`
- `renderTop100(...)`
- `renderTarghette()`
- `renderShop()`
- Profilo unificato:
- `syncProfile()`
- `projectUnifiedProfileView(...)`
- `ensureRuntimeProfile(...)` (fallback locale per non mostrare login legacy)

## Contenuti mostrati nella nuova UI
- Gioca: selezione modalita, player count, CTA avvio
- Profilo: stats, rank, cosmetici, armadietto
- Targhette: selezione titolo attivo
- Shop: catalogo acquisto/claim integrato in shell
- Battle Pass: track tier/reward
- Sfide: lista sfide con progresso
- Top 100: leaderboard per modalita e player count
- Stagione: stato rank e progressione stagione
- Multiplayer: lobby, inviti, social, tornei, club

## Posizione blocchi (layout)
- Top navigation/tab: header singleplayer e multiplayer
- Content area: `#sp-content`, `#mp-content`
- CTA principali in card centrali (`home-play-card`, `mp-action-row`)
- Dialog di selezione/invito per flussi rapidi

## Mappa collegamenti nuova architettura
- Main menu -> Singleplayer -> tabs interne (`activateTab`)
- Main menu -> Multiplayer -> tabs interne (`activateMPTab`)
- Impostazioni -> Profilo/Shop/Targhette/menu principale sempre in shell
- Locker grid -> tab shell (`targhette` o `profilo`)
- Play popup/quick mode -> `launchGame` (partita), con ritorno a shell via `#ingame-back`
- Tornei/Amici/Club sempre dentro `#screen-multiplayer`

## Equivalenza funzionale legacy -> nuova
- Gioca (`nav-play`, homeStartGame) -> `sptab-gioca` + `#play-cta-btn` + `launchGame`
- Profilo (`nav-profile`) -> `sptab-profilo`
- Targhette (`nav-titles`, locker titles) -> `sptab-targhette`
- Shop (`.rl-shop`, openShopItem) -> `sptab-shop`
- Battle Pass (`nav-pass`) -> `sptab-battlepass`
- Sfide (`nav-challenges`) -> `sptab-sfide`
- Stagione (`nav-season`) -> `sptab-stagione`
- Top 100 (`nav-leaderboard`) -> `sptab-top100`
- Armadietto (`nav-locker`) -> `sptab-profilo` + `sptab-targhette`
- Multiplayer legacy (`openMultiplayer`) -> `screen-multiplayer` + `mptab-*`
- Tornei legacy (`openTournament`) -> `mptab-tornei`

## Collegamenti obbligatori garantiti
- Bottoni/tab/popup/back navigation instradati nella shell nuova
- Profilo, armadietto, lobby, shop, battle pass, sfide, stagione in percorso UI nuova
- Avvio partita da shell nuova con ritorno shell nuova (`#ingame-back`)

## Riferimenti file e asset (nuova architettura)
- HTML: `index.html`
- CSS shell: `css/shell.css`
- CSS runtime storico: `css/styles.css` (compatibilita)
- JS bootstrap iframe: `js/main.js`
- Build: `scripts/build.js`, `scripts/dev.js`
- Audio: `audio/music/manifest.json`, `audio/sfx/manifest.json`
- Photos: `photos/card-fronts/*`, `photos/card-backs/*`

## Stato operativo finale
- La nuova UI e l'unica entrypoint utente.
- La UI legacy non e raggiungibile come percorso normale.
- Runtime legacy mantenuto solo come compatibilita interna temporanea per il motore partita.
