# UNO Ultra v52
## Indice Strutturato dei Contenuti

## 1. Introduzione
### 1.1 Obiettivo del documento
Questo file elenca in modo strutturato i contenuti del monolite `uno_ultra_v52 (1) (2).html`.

### 1.2 Ambito
- Struttura HTML/CSS/JS
- Schermate e componenti UI
- Sistemi gameplay e meta-sistemi
- Multiplayer, tornei, mini-giochi, social, accessibilita

## 2. Architettura generale del file
### 2.1 Sezione Head
- Meta e viewport
- Font e risorse esterne
- Blocco CSS monolitico

### 2.2 Sezione Body
- Schermate applicative
- Overlay e modali
- Canvas effetti

### 2.3 Sezione Script
- Logica di gioco
- Servizi di persistenza
- Flussi online e sistemi avanzati

## 3. Schermate principali
### 3.1 Splash Screen
- Entry point visuale
- Tabs e banner stagionali

### 3.2 Loading Screen
- Stato caricamento
- Indicatori avanzamento

### 3.3 Login Screen
- Accesso profilo locale
- Gestione pin e validazioni

### 3.4 Home Screen
- Selezione modalita
- Configurazione partita
- Accesso rapido a pannelli (rank/stats/shop)

### 3.5 Game Screen
- Tavolo UNO
- Mano giocatore
- HUD partita

### 3.6 Tournament Screen
- Bracket e match state
- Navigazione round

### 3.7 Online Screen
- Lobby host/join
- Stato connessione e player slots

## 4. Componenti UI rilevanti
### 4.1 Splash Tabs
### 4.2 Profile Widget
### 4.3 Rank Badge (SVG-based)
### 4.4 HUD Rank Pill
### 4.5 Leaderboard Banner
### 4.6 Sidebar Navigation
### 4.7 Notification Center
### 4.8 Replay Player
### 4.9 UCS Panel
### 4.10 Locker/Cosmetics Panel
### 4.11 Stats Panel

## 5. Core UNO
### 5.1 Deck System
- Build deck standard 108
- Shuffle
- Refill da discard

### 5.2 Turn System
- Turn order e direction
- Skip e reverse
- Draw chain handling

### 5.3 Card Rules
- canPlay
- applyFX
- Wild color choice

### 5.4 UNO Handling
- Declare UNO
- Penalita mancata dichiarazione

### 5.5 Round e Match End
- Scoring per tipo carta
- Target score

## 6. Sistema AI
### 6.1 Difficolta
- easy
- normal
- hard
- ultra
- ucs

### 6.2 Decision Model
- Selezione carta ottimale
- Scelta colore wild
- Gestione pending draw

### 6.3 Matchmaking bot
- Pool bot per MMR
- Bot identity deterministica

## 7. Progressione e Ranking
### 7.1 XP/Level
### 7.2 Rank Tiers
### 7.3 MMR per playlist
### 7.4 Season reset e premi
### 7.5 Titoli stagionali

## 8. Multiplayer
### 8.1 Trasporto PeerJS/WebRTC
### 8.2 Host/Guest flow
### 8.3 Lobby sync
### 8.4 State sync e action relay
### 8.5 Ping/Pong
### 8.6 Token turno
### 8.7 Reconnect
### 8.8 Spectator
### 8.9 Replay bridge

## 9. Tornei
### 9.1 Torneo classico
### 9.2 Grand Prix
### 9.3 Unified Tournament
### 9.4 UCS
### 9.5 Pentathlon
### 9.6 Double Elimination

## 10. Mini-giochi presenti
### 10.1 Ruba Mazzetto
### 10.2 Scala 40
### 10.3 BlackJack
### 10.4 Scopa
### 10.5 Poker
### 10.6 Burraco
### 10.7 Millemiglia

## 11. Social Systems
### 11.1 Friends
### 11.2 Invite link
### 11.3 Club
### 11.4 Quick chat
### 11.5 Emote bar
### 11.6 Bond/Affinity
### 11.7 Opponent memory

## 12. Accessibilita
### 12.1 NVDA support
### 12.2 ARIA patches
### 12.3 Focus trap
### 12.4 Keyboard flows
### 12.5 Colorblind helpers

## 13. Audio, VFX, Animazioni
### 13.1 AudioContext e SFX
### 13.2 Music player
### 13.3 Particle engine
### 13.4 Screen shake
### 13.5 Card animations
### 13.6 End transitions

## 14. Persistenza dati
### 14.1 localStorage profili
### 14.2 session storage
### 14.3 backup/export/import
### 14.4 replay store
### 14.5 season store

## 15. Utility e patching
### 15.1 Utility DOM
- showScr
- showOv/hideOv
- setText/setStyle

### 15.2 safePatch system
- override runtime selettivo
- compatibilita con fix versionati

## 16. Riferimenti documentazione
- 01_Analisi_Strutturale.md
- 02_Analisi_Logico_Tecnica.md
- 03_Analisi_Progettuale.md
- 04_Meccaniche_e_Funzioni.md
- 05_Cross_Reference_v52_to_v2.md
- 06_Porting_Minigiochi_v2.md
- 00_Indice_Contenuti_v52.md
