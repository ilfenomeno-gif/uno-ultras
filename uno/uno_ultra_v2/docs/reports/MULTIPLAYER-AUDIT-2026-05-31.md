# Multiplayer Audit — 2026-05-31

## Architettura reale rilevata

- Entry multiplayer: `index.html` (shell) → `#screen-multiplayer`.
- Runtime partita: `legacy/index-runtime.html` dentro iframe (`#app-frame`).
- Transport rete multiplayer: `BroadcastChannel` locale tramite `createTransport` in `js/multiplayer/session.js`.
- Modello reale: simulazione locale peer-like nello stesso browser/device, non backend internet/server-authoritative.

## Mappa multiplayer completa (shell)

- Tab multiplayer: `Gioca`, `Profilo`, `Sfide`, `Top100`, `Torneo`, `Amici`, `Club`.
- Flusso lobby: selezione modalita, selezione giocatori, toggle casual/competitivo, inviti su 4 slot, start match.
- Flusso social: lista amici (online/offline/stati), ricerca, richieste, bloccati, menu azioni amico.
- Flusso club: crea/unisciti/lascia club (UI shell).
- Cleanup lifecycle: `ingame-back`, `mp-back`, `beforeunload`, `visibilitychange`, ritorno splash runtime.

## Risultati validazione per area

### 1) Entry multiplayer

- Funziona: accesso da menu principale apre `#screen-multiplayer`.
- Funziona: separazione da singleplayer su tab/schermata distinta.
- Coerenza routing: shell corretta, runtime partita via iframe coerente.

### 2) Inviti amici

- Prima della fix: parzialmente funzionante. Bug reale: amico marcato `In partita` invitabile dal popup inviti.
- Dopo la fix: funziona con validazione robusta.
  - `In partita` => invito disabilitato.
  - `In lobby` => invito disabilitato.
  - `Offline` => invito disabilitato.
  - `Online — al menu` => invitabile.

### 3) Stati amici (online / lobby / partita / offline)

- Prima della fix: parziale e incoerente tra tab `Amici` e popup inviti.
- Dopo la fix: funziona e viene sincronizzato in entrambe le UI social.

### 4) Lobby multiplayer

- Funziona: slot invito, modalita, numero giocatori, start.
- Funziona: rimozione invitato da slot con update stato presenza.
- Funziona: prevenzione start con invitati insufficienti per 3P/4P (validazione corretta).

### 5) Cleanup sessioni

- Prima della fix: parzialmente funzionante. Uscita da tab multiplayer senza match attivo lasciava stato lobby non sempre ripulito.
- Dopo la fix: cleanup completo anche senza match attivo.
  - chiusura lobby server
  - reset slot inviti
  - stato amici riallineato da lobby/match a online quando appropriato

### 6) Avvio match

- Funziona: avvio da lobby con configurazione coerente (mode/count/competitive/invitati) inoltrata a `launchGame`.
- Funziona: aggiornamento stato amici invitati a `In partita` in start match shell.

### 7) HTML dedicato multiplayer

- Non necessario nel design corrente: multiplayer stabile nella shell esistente.
- Separazione logica mantenuta a livello di screen/tab/handler.

### 8) Peer-to-peer / modello rete

- Stato reale: trasporto locale `BroadcastChannel`; non e rete internet reale.
- Classificazione: simulazione locale equivalente a multiplayer locale su stessa origin/sessione.
- Residuo architetturale: per vero online serve backend signaling/session authority/state sync.

### 9) Coerenza profilo/social nel multiplayer

- Profilo/targhette/armadietto: coerenti nella shell (sync da profilo runtime/shell).
- Shop/Battle Pass/Sfide/Top100/Stagione in tab multiplayer: presenti, ma parti restano pseudo-live/simulate nella shell.
- Amici/inviti/notifiche social: ora coerenti sugli stati di disponibilita e invito.

## Bug reali trovati e corretti

1. Invito consentito a friend `In partita`.
2. Incoerenza stato presenza tra `Amici` e popup `Invita`.
3. Cleanup lobby incompleto in uscita multiplayer senza match attivo.
4. Context menu `Invita a partita` non allineato alle stesse regole di validazione inviti.

## File modificati

- `index.html`
- `CHANGELOG.md`

## Test eseguiti

- `npm run check` (pass).
- Test UI manuali in browser su:
  - entry multiplayer
  - invito da popup con stati diversi
  - invito da context menu
  - passaggio stati amici `online -> lobby -> online`
  - start match da lobby
  - ritorno menu e cleanup lobby/sessione

## Residui aperti

- Multiplayer non internet-native: manca backend reale (auth condivisa, presenza server, signaling, relay, authoritative state).
- Alcune aree social/gameplay restano simulate lato shell e non collegate a servizi remoti reali.

## Stato finale validazione

- Multiplayer shell: validato e corretto sui flussi core richiesti (entry, inviti, stato amici, lobby, start, cleanup).
- Modello rete: classificato con precisione come locale/simulato; nessuna falsa dichiarazione di online reale.