# UNO Ultra v52 — Analisi Logico-Tecnica

## 1. Regole Base di UNO implementate

### 1.1 Mazzo
- **108 carte standard** costruite da `buildDeck()`:
  - 4 colori (rosso `r`, blu `b`, verde `g`, giallo `y`)
  - Per ogni colore: 1× zero, 2× da 1 a 9, 2× Skip, 2× Reverse, 2× Draw Two
  - 4× Wild (cambio colore), 4× Wild Draw Four
- Il mazzo viene mescolato con l'algoritmo **Fisher-Yates** in `shuf()`
- Ogni giocatore riceve **7 carte** all'inizio di ogni round

### 1.2 Condizioni di giocabilità
La funzione `canPlay(card, currentColor)` determina se una carta è giocabile:
- Stessa **col** (colore) della carta in cima agli scarti
- Stesso **val** (valore/tipo) della carta in cima agli scarti
- La carta è un **Wild** (`col === 'w'`) → sempre giocabile
- In modalità **blitz**: qualsiasi carta è giocabile nei primi 2 turni

### 1.3 Effetti speciali delle carte (`applyFX`)
| Valore carta | Effetto                                                     |
|--------------|-------------------------------------------------------------|
| `skip`       | Il prossimo giocatore salta il turno (`advance()`)          |
| `rev`        | Inverte la direzione (`G.direction *= -1`)                  |
| `d2`         | Aggiunge 2 al `pendingDraw`, il prossimo pesca obbligato    |
| `w`          | Apre il color picker, il giocatore/AI sceglie colore        |
| `w4`         | Aggiunge 4 al `pendingDraw` + color picker                  |

### 1.4 Stacking Draw
- Le carte `d2` e `w4` si **accumulano**: se il prossimo ha un'altra `d2`/`w4`, può giocarla invece di pescare → `G.pendingDraw` aumenta
- Il cap di stacking è **12 carte** (dopo mostrato un badge, `_stackCapShown`)

### 1.5 Dichiarazione UNO
- Quando un giocatore scende a 1 carta, deve dichiarare UNO (`declareUno()`)
- Se non lo fa e viene "colto" dall'avversario, pesca 2 carte come penalità
- Le AI dichiarano UNO automaticamente con probabilità dipendente dal loro MMR (`botShouldSayUNO`)

### 1.6 Fine Round e Punteggio
La funzione `endRound(winIdx)` calcola i punti rimasti in mano agli altri:
- Carte numeriche: valore facciale
- Skip, Reverse, Draw Two: 20 punti
- Wild, Wild Draw Four: 50 punti
- Chi vince il round ottiene i punti degli altri come score
- La partita termina quando un giocatore raggiunge il **punteggio soglia** (di solito 500)

---

## 2. Modalità di Gioco

### 2.1 Ranked (Classificata)
- Usa un sistema MMR ELO-like (`eloMMRDelta`)
- Delta MMR dipende dalla differenza di MMR tra giocatore e avversari
- I bot vengono selezionati dinamicamente vicini al MMR del giocatore
- Playlist separate: 1v1 (`p1`), 3 giocatori (`p3`), 4 giocatori (`p4`)

### 2.2 Casual
- Stessa logica ranked ma i risultati vanno in playlist `p1_casual`, `p3_casual`, `p4_casual`
- Meno impatto sull'MMR principale

### 2.3 Blitz ⚡
- **Timer di turno ridotto** (pochi secondi per giocare)
- Al countdown zero viene giocata/pescata automaticamente una carta
- Playlist separata: `p1_blitz`, ecc.
- HUD speciale con countdown animato

### 2.4 Chaos 🌀
- Regole modificate (mazzo alterato, eventi random)
- Playlist `p1_chaos`, ecc.

### 2.5 Multiplayer Online (PeerJS/WebRTC)
| Modalità      | Giocatori | Sistema                            |
|---------------|-----------|------------------------------------|
| 1v1           | 2         | Host-Guest con token turn-based    |
| 3P (triello)  | 3         | Host + 2 Guest                     |
| 2v2 Teams     | 4         | 2 squadre, punteggi condivisi      |
| 3v3 Teams     | 6         | 3 squadre                          |

La sincronizzazione avviene tramite **serializzazione dello stato di gioco** (`mpSerializeState`) inviato via PeerJS DataConnection ad ogni mossa.

---

## 3. Sistema AI (Intelligenza Artificiale)

### 3.1 Livelli di Difficoltà
| Livello  | Think time   | Comportamento                                              |
|----------|--------------|------------------------------------------------------------|
| `easy`   | 400–800ms    | Gioca casualmente, errori frequenti, pesca spesso inutilmente |
| `normal` | 700–1300ms   | Segue priorità base (speciali > colori abbondanti)         |
| `hard`   | 900–1700ms   | Legge la mano, tiene memoria dei colori mancanti           |
| `ultra`  | 1100–2100ms  | Gioca ottimalmente, bluffa UNO, usa speciali strategicamente |
| `ucs`    | ~280ms       | Massimo: nessun errore, valutazione punteggio avanzata     |

### 3.2 Logica AI (`aiTurn`, `aiChoose`)
1. Calcola le carte giocabili con `playable(idx)`
2. Sceglie la carta ottimale con `aiChoose(plays, idx)`:
   - Priorità: Draw4 > Draw2 > Skip > Reverse > Wild > colori abbondanti
   - In `hard`/`ultra`: evita di giocare Wild se ha carte del colore corrente
   - Tiene memoria dei colori che l'avversario non ha più (`colorOpponentLacks`)
3. Se non può giocare, pesca con `playerDraw(auto=true)`
4. Sceglie il colore con `aiPickColor` (colore più abbondante in mano)

### 3.3 Bot MMR e Selezione
- Il pool di bot è costruito con `_buildRankedPool(playerMMR)`
- Si selezionano bot con MMR vicino al giocatore (±300 MMR di default)
- Ogni bot ha nome, MMR e avatar pseudo-randomici ma **deterministici** (basati su hash del nome)
- I bot hanno `fluctuation`: il loro MMR nella classifica oscilla naturalmente

---

## 4. Sistema di Progressione

### 4.1 MMR (Matchmaking Rating)
- Base: **200 MMR** per nuovi account
- Calcolo delta con `eloMMRDelta(playerMMR, opponentMMR, won)`:
  ```
  K = 32 (fattore K standard)
  expected = 1 / (1 + 10^((opp - player) / 400))
  delta = K * (result - expected)
  ```
- Bonus streak: +5/+10/+15 MMR per win streak 3/5/10+
- MMR separato per ogni playlist e modalità

### 4.2 Rank System
I rank sono definiti nell'array `RANKS` con soglie MMR:

| Rank        | MMR minimo | Colore      |
|-------------|------------|-------------|
| Bronze      | 0          | #CD7F32     |
| Silver      | 400        | #C0C0C0     |
| Gold        | 800        | #D39940     |
| Platinum    | 1200       | #D2E4E3     |
| Diamond     | 1600       | #7EE4F8     |
| Champion    | 2000       | #4A9CE1     |
| GrandChamp  | 2400       | #FF4081     |
| SSL         | 2800+      | #FFFFFF     |

### 4.3 XP e Livelli
- XP guadagnata per ogni partita
- Formula: `xpForLv(l) = floor(100 * 1.35^l)`
- Level-up mostra un popup animato (`showLU`)
- XP bonus da Double XP (`activateDoubleXP`)

### 4.4 Season Pass
- Ogni stagione ha N livelli con ricompense (titoli, crediti, cosmetics)
- Progress visivo con `renderSeasonPass()` e `renderSeasonPassV51()`
- Reset stagionale con `_seasonMomentoZero()` e `applySoftReset()`
- Peak MMR salvato → titoli stagionali assegnati con `grantSeasonTitles()`

---

## 5. Mini-Giochi

### 5.1 Ruba Mazzetto (Rubamazzo)
- Mazzo da 40 carte (carte napoletane simulate)
- Obiettivo: catturare più carte possibili dal tavolo
- Il giocatore gioca una carta; se c'è una carta con lo stesso valore sul tavolo, la cattura
- L'AI (facile/normale/hard/ultra) usa strategie di cattura differenziate
- Fine partita: chi ha più carte vince

### 5.2 Scala 40
- Mazzo da 108 carte (2 mazzi standard)
- Obiettivo: scendere con combinazioni (tris/scale) per almeno 40 punti
- Mechanic "Tallone": doppio mazzo con una carta scoperta disponibile
- Combo valide: tris (3+ carte stesso valore), scale (3+ carte stesso colore in sequenza)
- Il primo a scendere tutte le carte vince

### 5.3 BlackJack (BJ)
- 2 mazzi da 52 carte con shuffle frequente
- Fase di scommessa → deal → hit/stand/double/split
- Il dealer (AI) gioca con regola "deve stare su 17+"
- Supporto 1v1, 1v2, 1v3 (più dealer AI side)
- Risoluzione split con mani separate

### 5.4 Scopa
- Mazzo da 40 carte napoletane
- Obiettivo: catturare carte il cui totale fa 15 (presa), o catturare tutte (`scopa`)
- Conteggio punti fine partita: carte (1pt), denari (1pt), settebello (1pt), primiera (1pt)
- Napola (asso+2+3 di denari): punto bonus

### 5.5 Poker (Texas Hold'em semplificato)
- Mazzo da 52 carte, 2 hole cards per giocatore, 5 community cards
- Fasi: pre-flop → flop → turn → river → showdown
- Azioni: check, call, raise, fold, all-in
- Valutazione mani con `pokerEvalHand()`: coppia → doppia coppia → tris → scala → colore → full → poker → scala reale

### 5.6 Burraco
- Mazzo doppio + jolly (108+4 carte)
- Obiettivo: formare combinazioni (tris/scale con jolly), pescare il pozzetto
- Burraco "pulito" (senza jolly) vale più di burraco "sporco"
- Punti di penalità per le carte rimaste in mano
- Meccanica pozzetto: stack nascosto di 11 carte disponibile solo dopo aver giocato la prima combinazione

### 5.7 Millemiglia
- Gioco di carte basato sul gioco da tavolo originale
- Carte "Distanza" (25, 50, 75, 100, 200 km), "Pericolo", "Rimedio", "Sicurezza"
- Obiettivo: raggiungere 1000 km prima dell'avversario
- Hazard cards bloccano il giocatore, i rimedi li sboccano
- Safety cards proteggono permanentemente dai pericoli

---

## 6. Sistema Tornei

### 6.1 Torneo Classico
- Eliminazione diretta (bracket 4/8 giocatori)
- Il giocatore affronta bot in sequenza
- Sconfitta = eliminazione

### 6.2 Grand Prix
- Formato a divisioni con pips (punti progressione)
- Il giocatore scala le divisioni vincendo match
- Promozione/retrocessione basata su risultati
- Modalità compatibili: UNO (1v1, 3P, 4P), mini-giochi

### 6.3 Unified Tournament (UT32 — Rocket League Style)
- 32 partecipanti (1 umano + 31 bot)
- Bracket dinamico renderizzato con stile RL
- Simulazione automatica dei match bot-vs-bot
- Il giocatore affronta direttamente il suo match
- Vincitore del torneo ottiene titolo speciale

### 6.4 UCS (Ultra Championship Series)
- Modalità di élite sbloccabile solo ad alto MMR
- Bot di difficoltà massima
- Titoli e reward esclusivi

### 6.5 Pentathlon Multiversus
- Serie di 5 partite in 5 giochi diversi (UNO, Scopa, Burraco, Poker, Millemiglia)
- Vinci tutti e 5 per il trofeo finale

### 6.6 Double Elimination Tournament
- 8 giocatori, bracket doppio (winner/loser bracket)
- Ogni giocatore ha 2 chance prima dell'eliminazione definitiva

---

## 7. Sistema Social

### 7.1 Friends (PeerJS-based)
- Il codice amico è il **PeerJS Peer ID** del giocatore
- Richieste di amicizia tramite connessione P2P diretta
- Ping periodico per mostrare lo stato online
- Inviti a partita diretti dalla lista amici

### 7.2 Club
- Il giocatore può creare/unirsi a un club (nome + TAG)
- Missioni settimanali del club (wins, UNO declarations, W4 plays)
- Level up del club con XP condivisa
- Club Boost: XP bonus temporaneo per tutti i membri

### 7.3 Quick Chat
- Chat rapida in-game con messaggi predefiniti
- Visibile a tutti i giocatori nella partita multiplayer

---

## 8. Sistema Accessibilità

- **NVDA Screen Reader**: supporto completo opzionale
- `nvdaAnnounce(msg, priority)`: annuncia il turno corrente all'AT
- Regioni ARIA live (`role="status"`, `aria-live="polite/assertive"`)
- Focus trap nei modal (`_activateFocusTrap`)
- Skip link (`<a class="skip-link">Salta alla partita</a>`)
- `user-select` limitato agli elementi interattivi
- Colorblind mode (`toggleColorblind`)
