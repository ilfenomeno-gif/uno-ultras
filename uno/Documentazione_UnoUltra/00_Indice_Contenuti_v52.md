# UNO Ultra v52 - Indice Contenuti Completo

Questo file e una lista pratica di tutto cio che e presente nel monolite `uno_ultra_v52 (1) (2).html`, organizzata per aree funzionali.

## 1) Struttura generale

- Head + CSS integrato (tema completo e component library)
- Body HTML con tutte le schermate e overlay
- JavaScript monolitico con tutti i sistemi di gioco

## 2) UI/Screen principali

- Splash screen
- Loading screen
- Login screen
- Home screen
- Game screen (tavolo UNO)
- Tournament screen
- Online multiplayer screen
- Overlay modali (pause, end game, locker, logout, conferme)

## 3) Componenti UI evidenti (titoli richiesti + correlati)

- Splash tabs
- Profile Widget
- Rank Badge (SVG-based)
- HUD rank pill
- Leaderboard mode banner
- Difficulty chips
- Playlist selector
- Mode cards (stile RL)
- Sidebar navigation
- Notification center
- Replay player panel
- UCS panel
- Season banner
- Stats panel
- Locker/Cosmetics panel
- Club modal
- Friend request/invite popup
- NVDA accessibility dialogs
- Ultra Watch HUD
- Nemesi widget
- News feed

## 4) Sistemi CSS presenti nel file

- Theme tokens (variabili CSS globali)
- Palette mini-giochi (table themes)
- Reset globale
- Screen system (`.scr`, `.scr.on`)
- Shared components (badge, notifiche, panel)
- Layout responsive mobile
- Stili complete lobby online
- Stili complete tornei/bracket
- Stili complete mini-giochi
- Stili complete locker/profilo/statistiche

## 5) Blocchi HTML principali (DOM statico)

- Canvas particelle (`#fx`)
- Sistema notifiche globale (`#notif`, `#msg`)
- Blocchi schermata login/home/game/tournament/online
- Modalita host/join online
- Overlay di stato partita
- Strutture dedicate a social/friends/club

## 6) Core UNO (logica partita)

- Build deck standard 108 carte
- Shuffle Fisher-Yates
- Deal round e start game
- Turn loop (`nextTurn`, `advance`)
- Play card / draw card / UNO declare
- Effetti carte speciali (`skip`, `rev`, `d2`, `w`, `w4`)
- Stack draw con cap
- Color picker wild
- End round + score accumulation
- End match con target score

## 7) AI e matchmaking bot

- AI multi-difficolta (easy/normal/hard/ultra/ucs)
- Scelta carta strategica
- Scelta colore wild
- Bot pool basato su MMR
- Bot identity deterministica (nomi/avatar)

## 8) Progressione e ranking

- XP + Level system
- Rank tiers
- MMR per playlist/modalita
- Win/loss streak logic
- Season reset logic
- Season titles generation/grant
- Rank badge rendering SVG

## 9) Multiplayer e rete

- PeerJS/WebRTC transport
- Host/guest flows
- Lobby sync
- State serialization/sync
- Turn token validation
- Ping/pong heartbeat
- Reconnect flows
- Spectator mode
- Replay bridge/data

## 10) Tornei

- Torneo classico a eliminazione
- Grand Prix
- Unified Tournament (stile RL)
- UCS (Ultra Championship Series)
- Pentathlon
- Double elimination tournament

## 11) Mini-giochi inclusi nel monolite

- Ruba Mazzetto
- Scala 40
- BlackJack
- Scopa
- Poker
- Burraco
- Millemiglia

## 12) Social e community

- Friends system
- Invite/link system
- Club system
- Quick chat
- Emotes
- Bond/Affinity system
- Opponent memory system

## 13) Accessibilita

- NVDA support
- ARIA patch progressive
- Focus trap e keyboard flows
- Colorblind helpers

## 14) Audio/FX/animazioni

- AudioContext + sfx/music
- Music player integrato
- Particle engine
- Screen shake
- Card animations
- End micro-transition

## 15) Persistenza e dati

- localStorage DB profili
- session storage
- backup/export/import save
- replay storage
- season storage
- login rate-limit locale

## 16) Utility/patching

- Utility DOM (`showScr`, `showOv`, `setText`, ecc.)
- safePatch system per override runtime
- Version fix inline (`FIX v..`, `FIX A11Y ..`)

## 17) Macro-categorie funzione (in sintesi)

- UI rendering e screen routing
- Regole gioco e stato round
- AI decision making
- Persistenza profilo e progressione
- Multiplayer transport/protocol
- Tornei e bracket
- Mini-giochi engines
- Social/friends/club
- Accessibilita e compatibilita
- Audio/visual effects

## 18) Riferimenti documentazione esistente

- 01_Analisi_Strutturale.md: mappa completa sezioni CSS/HTML/JS
- 02_Analisi_Logico_Tecnica.md: regole e sistemi gameplay
- 03_Analisi_Progettuale.md: architettura monolite e stato globale
- 04_Meccaniche_e_Funzioni.md: censimento funzioni completo
- 05_Cross_Reference_v52_to_v2.md: mapping v52 -> moduli v2
- 06_Porting_Minigiochi_v2.md: stato porting mini-giochi v2
