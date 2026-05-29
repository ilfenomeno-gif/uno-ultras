# Cross Reference v52 -> v2

## Scope

Mappatura delle macro-funzionalita del monolite `uno_ultra_v52 (1) (2).html` verso la struttura modulare `uno_ultra_v2`.

## Mapping Funzionale

| Area v52 | v2 Modulare | Copertura |
|---|---|---|
| Shell schermate e overlay principali | `index.html` | Home, gioco, lobby online, progressione, tornei, mini-giochi, dialog wild |
| Tema e componenti visual | `css/styles.css` | Sistema panel, HUD, hand/cards, lobby, log mini-giochi, responsive |
| Costanti dominio | `js/core/constants.js` + `data/cards.json` + `data/ranks.json` | Colori, valori carte, limiti gameplay, parametri diff AI, definizioni dati |
| Utility generiche | `js/utils.js` | Random, shuffle helper, clamp, wait/delay, helper di flusso |
| Stato partita | `js/core/state.js` | Factory stato, player bootstrap, setup round/match |
| Mazzo UNO | `js/core/deck.js` | Build deck 108, refill da scarti, shuffle |
| Regole UNO | `js/rules.js` | `canPlay`, effetti speciali, stack draw, scoring mano |
| Loop partita | `js/core/game.js` | Start match, turn loop, draw/play/uno, fine round/match |
| Rendering e interazioni UI | `js/ui.js` | Render stato, mano giocatore, opponents, HUD, scoreboard, dialog colore |
| AI bot | `js/systems/ai.js` | Decision policy per difficolta, scelta wildcard color, draw strategy |
| Bootstrap applicazione | `js/main.js` | Event binding, orchestrazione sistemi, bridge multiplayer/progressione/tornei |
| Multiplayer transport | `js/multiplayer/session.js` | Room lifecycle, host/join/spectator, messaggistica sync |
| Facade multiplayer | `js/systems/multiplayer.js` | Export superficie pubblica multiplayer |
| Persistenza locale | `js/systems/persistence.js` | Session, settings, replay log storage |
| Progressione e ranking | `js/systems/progression.js` | XP/level, elo-like mmr, playlist rank, history |
| Tornei | `js/systems/tournaments.js` | Bracket classico, round progression, risoluzione match |
| Mini-giochi registry | `js/systems/minigames/registry.js` | Router modulare dei runner mini-game |
| Scopa | `js/systems/minigames/scopa.js` | Regole base, turni, risultato |
| Ruba Mazzetto | `js/systems/minigames/ruba.js` | Setup, loop, scoring |
| Scala 40 | `js/systems/minigames/scala40.js` | Alias strutturale verso il runner Scala |
| BlackJack | `js/systems/minigames/blackjack.js` | Deal/hit/stand, risoluzione mano |
| Poker | `js/systems/minigames/poker.js` | Deal semplificato, valutazione risultato |
| Burraco | `js/systems/minigames/burraco.js` | Loop semplificato e scoring round |
| Millemiglia | `js/systems/minigames/millemiglia.js` | Progress distanza, hazard/remedy flow |
| Shared mini-game helpers | `js/systems/minigames/shared.js` | Utility comuni ai runner mini-game |
| Accessibilita | `js/systems/accessibility.js` | Live region announce e hook colorblind |
| Audio | `js/systems/audio.js` | SFX/UI cue, hook risultato |
| VFX | `js/systems/vfx.js` | Burst/shake effects e trigger UI |
| Social locale | `js/systems/social.js` | Friends/club abstraction locale |

## Vincolo di Coerenza

La baseline progettuale resta la documentazione analitica:

- `Documentazione_UnoUltra/01_Analisi_Strutturale.md`
- `Documentazione_UnoUltra/02_Analisi_Logico_Tecnica.md`
- `Documentazione_UnoUltra/03_Analisi_Progettuale.md`
- `Documentazione_UnoUltra/04_Meccaniche_e_Funzioni.md`
