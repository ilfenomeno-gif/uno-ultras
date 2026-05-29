# UNO Ultra v52 — Analisi Progettuale (Architettura)

## 1. Architettura Attuale

### Pattern: Single-File Monolith
Il codice è interamente contenuto in un singolo file HTML di ~35.000 righe. Non esiste separazione tra:
- Struttura (HTML)
- Presentazione (CSS)
- Logica (JavaScript)

Tutti i moduli comunicano tramite **variabili globali** condivise nel window scope.

---

## 2. Variabili Globali Critiche

| Variabile      | Tipo       | Scopo                                                       |
|----------------|------------|-------------------------------------------------------------|
| `G`            | Object     | Stato della partita corrente (mazzo, giocatori, turno, ecc.)|
| `P`            | Object     | Profilo del giocatore attivo (MMR, XP, crediti, titoli)     |
| `MP`           | Object     | Stato connessione multiplayer 1v1                           |
| `MP3`          | Object     | Stato connessione multiplayer 3 giocatori                   |
| `currentMode`  | String     | Modalità corrente: `'ranked'|'casual'|'blitz'|'chaos'`      |
| `AC`           | AudioContext | Context audio WebAudio API                               |
| `sfx`          | Object     | Collezione di sound effects (`sfx.click`, `sfx.draw`, ecc.) |
| `cv`, `ctx2d`  | Canvas     | Canvas particelle (`#fx`) e suo context 2D                 |
| `RANKS`        | Array      | Array di oggetti rank con soglie MMR                        |
| `COLS`         | Array      | `['r','b','g','y']` — colori UNO                           |
| `AI_NAMES`     | Array      | Pool di nomi per i bot AI                                   |
| `BJG`          | Object     | Stato partita BlackJack                                     |
| `SCOPAG`       | Object     | Stato partita Scopa                                         |
| `BRRG`         | Object     | Stato partita Burraco                                       |
| `MMG`          | Object     | Stato partita Millemiglia                                   |
| `playerCanAct` | Boolean    | Se il giocatore può interagire col tavolo                   |
| `unoDeclared`  | Boolean    | Se UNO è stato dichiarato questo turno                      |
| `drawnCardIdx` | Number     | Indice dell'ultima carta pescata (per highlight)            |
| `paused`       | Boolean    | Stato di pausa della partita                               |
| `blitzIv`      | Interval   | Interval ID del timer blitz                                 |
| `FriendService`| Object     | Oggetto singleton per la gestione amici P2P                 |

---

## 3. Oggetto Stato di Gioco `G`

```javascript
G = {
  deck: Card[],           // Mazzo corrente
  discard: Card[],        // Pila degli scarti
  players: Player[],      // Array giocatori (idx 0 = umano)
  current: number,        // Indice giocatore corrente
  direction: 1|-1,        // Direzione di gioco (1=orario, -1=antiorario)
  numAI: number,          // Numero di AI in partita
  nAI: number,            // Alias di numAI
  round: number,          // Numero del round corrente
  pendingDraw: number,    // Carte da pescare accumulate (+2/+4 stacking)
  totalScores: number[],  // Punteggi totali di ogni giocatore
  unoSaid: boolean[],     // Se ogni giocatore ha dichiarato UNO
  roundOver: boolean,     // Flag fine round
  isTourney: boolean,     // Se siamo in un torneo
  eliminated: boolean[],  // Giocatori eliminati
  stallCount: number[],   // Counter di stall per anti-AFK
  diff: string,           // Difficoltà AI: 'easy'|'normal'|'hard'|'ultra'|'ucs'
  isMP: boolean,          // Se è una partita multiplayer
  mpGuestIdx: number,     // Indice del guest nel multiplayer
  is3p: boolean,          // Se è una partita 3 giocatori
  _stackCapShown: boolean // Se il badge cap-stacking è già stato mostrato
}
```

### Oggetto `Player`
```javascript
{
  hand: Card[],        // Carte in mano
  isAI: boolean,       // True se è un bot
  name: string,        // Nome visualizzato
  score: number,       // Punteggio del round corrente
  botMMR: number|undefined // MMR del bot (solo per AI)
}
```

### Oggetto `Card`
```javascript
{
  col: 'r'|'b'|'g'|'y'|'w', // Colore
  val: string,                // Valore: '0'-'9', 'skip', 'rev', 'd2', 'w', 'w4'
  _cc: string|undefined       // Colore scelto per le Wild card
}
```

---

## 4. Oggetto Profilo `P`

```javascript
P = {
  name: string,           // Username
  level: number,          // Livello
  xp: number,             // XP totale
  mmr: number,            // MMR principale (deprecated, ora in mmrP)
  credits: number,        // Valuta in-game
  games: number,          // Partite totali
  wins: number,           // Vittorie totali
  winStreak: number,      // Streak vittorie attuale
  maxWinStreak: number,   // Streak massima storica
  
  mmrP: {                 // MMR per playlist
    p1: number,           // Ranked 1v1
    p3: number,           // Ranked 3P
    p4: number,           // Ranked 4P
    p1_casual: number,
    p1_blitz: number,
    p1_chaos: number,
    p_2v2: number,
    p_3v3: number,
    p_ruba: number,       // Ruba Mazzetto
    p_scala: number,      // Scala 40
    p_bj1: number,        // BlackJack 1v1
    p_poker: number,
    p_scopa: number,
    p_burraco: number,
    p_mille: number,
    // ... altre playlist per dimensioni AI
  },
  
  feats: string[],          // Achievement sbloccati
  unlockedTitles: string[], // Titoli sbloccati
  selectedTitle: string,    // Titolo attivo
  
  locker: {
    border: string,         // Bordo carta cosmetic
    cardback: string,       // Retro carta cosmetic
    effect: string          // Effetto particelle
  },
  
  tourneyWins: {},          // Vittorie per tipo torneo
  matchHistory: Match[],    // Storico ultime partite
  winsAtRank: {},           // Vittorie per ogni rank (per promozione)
  
  // Statistiche mini-giochi
  scopaS: {wins, settebello, primiera, napola, scope10t},
  burracoS: {wins, burracos, cleanBurracos, pinelle, pozzetti},
  pokerS: {wins, streak, allins, bluffs, rivers, fh, sf},
  milleS: {wins, greens, remedies, safeties, redlights, hazardTypes},
  
  // Sistemi v52
  botBond: {},              // Bond/Affinity con i bot
  opponentMemory: [],       // Memoria delle abitudini degli avversari
  mmrHistoryFull: [],       // Storico MMR completo
  notifEnabled: boolean,    // Push notifications
  ultraChips: number,       // Valuta premium
  trustScore: number,       // Punteggio affidabilità (0-100)
  circuitPoints: number,    // Punti circuito
  trophies: {gold, silver, bronze}
}
```

---

## 5. Flusso di Esecuzione Principale

```
index.html caricato
  └→ PeerJS CDN loaded (con fallback)
  └→ DOMContentLoaded
      └→ loadSession() → verifica localStorage
          ├→ Se sessione trovata → cloudLoadPlayer() → P = profilo
          │   └→ showScr('splash') / showScr('home')
          └→ Se non trovata → showScr('login')
              └→ submitLogin() / cloudRegister()
                  └→ P = profilo → showScr('home')

Partita locale:
  startGame() / homeStartGame()
    └→ G = nuovo stato gioco
    └→ dealRound()
        └→ buildDeck() → shuf() → deal 7 carte per giocatore
        └→ placeFirstDiscard() — evita W4 come prima carta
        └→ nextTurn()
            ├→ AI: setTimeout(aiTurn, thinkMs)
            └→ Human: enablePlayer() → startTimer()
                ├→ playerPlayCard(ci) → doPlay() → applyFX() → checkWin()
                │   └→ afterPlayer() → nextTurn()
                └→ playerDraw() → afterPlayer() → nextTurn()

endRound(winIdx):
  └→ calcola punteggi → totalScores aggiornati
  └→ se qualcuno ha raggiunto 500+ → showEndScreen()
      └→ addMMR() → addXP() → saveP()
  └→ altrimenti → dealRound() (nuovo round)
```

---

## 6. Sistema di Persistenza

### Storage Schema
- **Chiave principale**: `uno-ultra-profiles-v8`  
  Formato: `{ [username_lowercase]: { pinHash: string, profile: P } }`
- **Chiave sessione**: `uno-ultra-session-v8`  
  Formato: `{ username: string }`
- **Chiave backup auto**: `uno-ultra-auto-backup`
- **Chiave stagione**: `uno-ultra-season-v8`
- **Chiave replay**: `uno-ultra-replays`
- **Chiave backup meta**: `uno-ultra-backup-meta`

### Sicurezza
- Il PIN è offuscato con `btoa(username + '::' + pin)` (NON crittografia sicura, solo offuscamento)
- Nessun backend reale: tutto localStorage (indicato come "modalità offline")
- Rate limiting login: max 5 tentativi in 5 minuti

---

## 7. Comunicazione Multiplayer (PeerJS)

### Protocollo messaggi
Tutti i messaggi hanno la struttura `{ type: string, ...payload }`:

| type                | Direzione        | Payload                                    |
|---------------------|------------------|--------------------------------------------|
| `game_start`        | Host → Guest     | Stato iniziale serializzato                |
| `state_update`      | Host → Guest     | Stato dopo ogni mossa host                 |
| `play_card`         | Guest → Host     | `{ ci, cc }` (card index, chosen color)    |
| `draw_card`         | Guest → Host     | `{}`                                       |
| `declare_uno`       | Guest → Host     | `{}`                                       |
| `choose_color`      | Guest → Host     | `{ col }`                                  |
| `ping`              | Bidirezionale    | `{ ts }` timestamp                         |
| `pong`              | Bidirezionale    | `{ ts }` risposta ping                     |
| `friend_request`    | Bidirezionale    | `{ name, code }`                           |
| `friend_accept`     | Bidirezionale    | `{ name, code }`                           |
| `friend_invite`     | Bidirezionale    | `{ roomCode, mode }`                       |
| `lobby_update`      | Host → Guest     | Slot info lobby                            |
| `ready`             | Guest → Host     | `{ ready: boolean }`                       |
| `forfeit`           | Guest → Host     | `{}`                                       |

### Sicurezza token
Per prevenire replay attacks, ogni azione del guest include un **turn token** `_mpTurnToken` che viene verificato dall'host.

---

## 8. Problemi Architetturali dell'Originale

1. **Scope globale non protetto**: ~200+ variabili globali, nessun namespace
2. **Nessuna separazione concetti**: UI, logica, dati nello stesso scope
3. **Duplicazione codice**: `getRankSVG` definita due volte, `aiColFor` definita due volte, `showScr` definita 3 volte (con patch successive)
4. **Funzioni con side effects impliciti**: quasi tutte leggono/scrivono direttamente su `G`, `P`, DOM
5. **CSS inline mescolato all'HTML**: style tags dentro il body (linee 4888-5160 contengono mix di HTML, CSS e JS)
6. **`safePatch()` system**: meccanismo di monkey-patching per overridare funzioni già definite → sintomo di refactoring incrementale non pianificato
7. **DOMContentLoaded multipli**: più blocchi `<script>` con init separati (righe 5162, 7394, 34916)
8. **Nomi variabili inconsistenti**: `nAI` e `numAI` usati intercambiabilmente
9. **Commenti di versione**: i fix sono annotati inline (`// FIX v43`, `// FIX A11Y #7`) → storico di sviluppo incorporato nel codice

---

## 9. Dipendenze e Browser API Usate

| API / Libreria      | Scopo                                          |
|---------------------|------------------------------------------------|
| PeerJS 1.5.4        | WebRTC P2P per multiplayer                     |
| localStorage        | Persistenza dati offline                       |
| AudioContext (WebAudio) | Sound effects e musica                     |
| Canvas 2D API       | Particelle e effetti visivi (`#fx`)            |
| Clipboard API       | Copia codici stanza / backup dati              |
| navigator.share     | Condivisione risultati                         |
| Service Worker API  | Push notifications (opzionale)                |
| URL.createObjectURL | Download file backup                           |
| Blob API            | Creazione file download                        |
| Google Fonts CDN    | Syne, DM Sans, DM Mono                        |
