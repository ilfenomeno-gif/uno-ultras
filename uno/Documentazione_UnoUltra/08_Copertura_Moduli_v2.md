
# Copertura Moduli v2

## Obiettivo

Mappare le 16 sezioni dell'indice contenuti v52 ai moduli presenti in `uno_ultra_v2`.

## 1. Introduzione / Architettura

- `uno_ultra_v2/index.html`
- `uno_ultra_v2/js/main.js`
- `uno_ultra_v2/js/core/`
- `uno_ultra_v2/js/systems/`
- `uno_ultra_v2/data/`
- `uno_ultra_v2/scripts/port-original.js`
- `uno_ultra_v2/README.md`

## 2. Schermate principali

- Shell ad alta fedelta estratta dal monolite: `index.html`
- Home/Game: `index.html`, `js/ui.js`
- Lobby online host/join/spectator: `index.html`, runtime inline estratto + `js/multiplayer/session.js`
- Overlay colore wild: `index.html`, `js/ui.js`

## 3. Componenti UI

- HUD, hand, scoreboard, opponents: `js/ui.js`
- Panel progressione, tornei, mini-giochi: `index.html`, `js/main.js`
- Stili componenti: `css/styles.css`

## 4. Core UNO

- Stato: `js/core/state.js`
- Regole: `js/rules.js`
- Deck: `js/core/deck.js`
- Loop partita: `js/core/game.js`
- Costanti/dati: `js/core/constants.js`, `data/cards.json` (deck, scoring, timer, stack cap estratti dal monolite)
- Utility: `js/utils.js`

## 5. AI

- Decision engine e timing: `js/systems/ai.js`

## 6. Progressione e ranking

- XP/MMR/rank/history: `js/systems/progression.js`, `data/ranks.json` (tiers completi Bronze I -> Supersonic Legend + formula XP)

## 7. Multiplayer

- Transport + envelope: `js/multiplayer/session.js`
- Facade export: `js/systems/multiplayer.js`
- Orchestrazione online, token, ping/pong, replay bridge: `js/main.js`

## 8. Tornei

- Bracket classico e round progression: `js/systems/tournaments.js`
- Grand Prix: `js/systems/grandprix.js`
- UCS / queue entry: `js/systems/ucs.js`, `js/systems/queue.js`
- Pentathlon orchestration: `js/systems/pentathlon.js`

## 9. Mini-giochi

- Registry: `js/systems/minigames/registry.js`
- Scopa: `js/systems/minigames/scopa.js`
- Ruba Mazzetto: `js/systems/minigames/ruba.js`
- Scala 40: `js/systems/minigames/scala40.js`
- BlackJack: `js/systems/minigames/blackjack.js`
- Poker: `js/systems/minigames/poker.js`
- Burraco: `js/systems/minigames/burraco.js`
- Millemiglia: `js/systems/minigames/millemiglia.js`
- Shared utils: `js/systems/minigames/shared.js`

## 10. Social

- Friends/club locale: `js/systems/social.js`

## 11. Accessibilita

- Live region NVDA-like announcer + colorblind class: `js/systems/accessibility.js`
- Hook UI: `js/main.js`, `css/styles.css`

## 12. Audio / VFX

- Audio: `js/systems/audio.js`, `audio/sfx/manifest.json`, `audio/music/manifest.json`
- VFX: `js/systems/vfx.js`
- Hook runtime: `js/main.js`

## 13. Persistenza

- Session/settings/replays: `js/systems/persistence.js`
- Profilo avanzato: `js/systems/progression.js`
- Replay facade: `js/systems/replay.js`

## 14. Utility / support

- Helpers base: `js/utils.js`
- Costanti dominio: `js/core/constants.js`
- Catalogo playlist: `data/playlists.json` (ranked, casual, blitz, chaos, 2v2, 3v3 e mini-giochi)
- Audit diff-driven: `data/port-audit.json`, `scripts/audit-original.js`
- Script automazione: `scripts/build.js`, `scripts/dev.js`

## 15. Stato porting rispetto al monolite

- Core UNO, UI, AI, multiplayer modulare, progressione, tornei, mini-giochi, social, accessibilita, audio, VFX e persistenza: coperti nella struttura `uno_ultra_v2`.
- Il porting ad alta fedelta attuale mantiene il runtime del monolite inline in `index.html`, con CSS esternalizzato in `css/styles.css` e albero modulare completo disponibile per la rifattorizzazione progressiva dei sottosistemi.
- `scripts/port-original.js` rigenera anche i dataset strutturati obbligatori (`cards.json`, `ranks.json`, `playlists.json`) dai valori canonici del monolite.

## 16. Verifica Tecnica Automatica

Controlli eseguiti su workspace `uno`:

- Presenza file richiesti dal piano di modularizzazione: `OK`.
- Presenza marker schermate/sistemi estratti dal monolite in `index.html`: `OK`.
- Audit marker principali original.html -> porting (`data/port-audit.json`): `OK`, nessun marker mancante.
- Controllo sintassi JavaScript su tutti i moduli in `uno_ultra_v2/js`: `OK`.
- Ricerca marker di implementazione incompleta (`TODO`, `FIXME`, `WIP`, `stub`, `NotImplemented`): nessuna occorrenza di incompletezza operativa.
- Verifica risoluzione import/export relativi tra moduli ES (`./...`): `IMPORT_GRAPH_OK`.

Inventario moduli JS rilevato:

- Totale file JS (`uno_ultra_v2/js`, inclusi sottofolder): 29.
- Entrypoint principale: `js/main.js`.
- Orchestratore gameplay: `js/game.js`.
- Runner mini-giochi: 7 file dedicati + `registry.js` + `shared.js`.

Nota di robustezza:

- In `js/minigames/registry.js` e presente una `throw new Error(...)` difensiva per id mini-gioco non valido; non rappresenta uno stub, ma un controllo runtime intenzionale.
