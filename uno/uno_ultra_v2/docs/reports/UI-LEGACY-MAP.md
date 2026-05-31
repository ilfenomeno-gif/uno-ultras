# UI Legacy Map (Runtime Storico)

## Scopo
Questo documento descrive la UI legacy storica ospitata in `legacy/index-runtime.html`.
La UI legacy non e piu entrypoint operativo per l'utente finale.

## Entrypoint e struttura
- Entrypoint file: `legacy/index-runtime.html`
- Bootstrap normale storico: shell `index.html` -> iframe `#app-frame` -> runtime legacy
- Schermate principali legacy (`.scr`):
- `#loading`
- `#login`
- `#splash`
- `#locker`
- `#game`
- `#tournament`

## Bottoni, tab, sottomenu (legacy)
- Navbar laterale in splash:
- `#nav-play` -> `switchNav('play')`
- `#nav-profile` -> `switchNav('profile')`
- `#nav-challenges` -> `switchNav('challenges')`
- `#nav-pass` -> `switchNav('pass')`
- `#nav-titles` -> `switchNav('titles')`
- `#nav-mmr` -> `switchNav('mmr')`
- `#nav-history` -> `switchNav('history')`
- `#nav-leaderboard` -> `switchNav('leaderboard')`
- `#nav-season` -> `switchNav('season')`
- `#nav-locker` -> `openLocker()`
- `#nav-lab` -> `openLab()`
- `#nav-bonds` -> `switchNav('bonds')`
- `#nav-stats` -> `switchNav('stats')`
- Quick actions home:
- `openTournament()`
- `openMultiplayer()`
- `openCustomGameLobby()`
- Locker:
- `closeLocker()`
- griglie `#locker-titles-grid`, `#locker-borders`, `#locker-cardbacks`, `#locker-effects`
- Shop legacy:
- area `.rl-shop`
- item `openShopItem('crate_common'|'crate_rare'|'dxp_token'|'crate_legendary')`

## Funzioni associate (legacy)
- Navigazione interna: `showScr(...)`, `switchNav(...)`, `openLocker()`, `closeLocker()`
- Avvio modalita: `homeStartGame()`, `startRubaGame()`, `startScalaGame()`, `startBJGame()`, `startScopaGame()`, `startPokerGame()`, `startBurracoGame()`, `startMMGame()`
- Social/torneo/multiplayer legacy: `openMultiplayer()`, `openTournament()`, `mpCancel()`
- Stagione/Battle Pass: rendering panel pass/stagione, reward overlay stagionale, reset stagionale

## Contenuti mostrati
- Login/account cloud legacy
- Home splash con feed e pannelli interni
- Shop legacy in splash
- Battle Pass legacy in panel dedicato
- Sfide legacy in panel dedicato
- Top 100 legacy
- Stagione legacy con countdown/reward overlay
- Armadietto legacy (targhette, cornici, cardback, effetti, accessibilita, avatar)

## Posizione blocchi (layout legacy)
- `#splash`: hub con nav laterale e pannelli centrali
- `#locker`: overlay/schermata dedicata customizzazione
- `#game`: tavolo partita e HUD
- `#tournament`: lobby/flow torneo dedicato

## Mappa collegamenti schermate legacy
- `loading -> login -> splash`
- `splash/nav -> panel play/profile/challenges/pass/titles/mmr/history/leaderboard/season/bonds/stats`
- `splash -> locker` via `openLocker()`
- `splash -> game` via start mode functions
- `splash -> tournament` via `openTournament()`
- `tournament -> splash` via `showScr('splash')`
- `game -> pause/locker` via popup e `openLockerFromGame()`

## Riferimenti file e asset legacy
- HTML: `legacy/index-runtime.html`
- CSS: `css/styles.css`
- Build check markers: `scripts/build.js` (requiredLegacyMarkers)
- Audio: `audio/music/manifest.json`, `audio/sfx/manifest.json`
- Photos: `photos/card-fronts/*`, `photos/card-backs/*`

## Stato operativo
- Runtime legacy mantenuto per compatibilita tecnica interna (motore partita e funzioni runtime).
- Accesso diretto utente disabilitato (redirect a nuova UI se aperto top-level senza `?allowLegacy=1`).
- Non deve essere usato come percorso di navigazione principale per profilo/shop/targhette/battle pass/sfide/stagione.
