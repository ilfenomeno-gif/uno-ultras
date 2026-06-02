# Changelog

## 2026-05-29

- migliorata l'AI UNO nel runtime legacy con euristiche piu coerenti tra `easy`, `normal`, `hard` e `ultra`
- corretto il percorso UCS nella scelta AI evitando riferimenti fragili al punteggio carta fuori scope
- aggiunto un log partita accessibile nel tavolo con `role="log"` e aggiornamenti `aria-live`
- rese piu leggibili e accessibili le voci del replay log con etichette testuali delle carte
- estesa la leaderboard locale per includere anche i profili salvati nel DB locale multi-sessione
- irrobustita la persistenza locale: se il DB profili e corrotto, il runtime tenta il recupero dall'auto-backup locale invece di azzerarsi in silenzio
- documentato nel README il confine tra shell modulare e runtime legacy
- trasformato il banner `TEST MODE` in una card evento stagionale piu esplicita con countdown, snapshot identita, focus reward e preview del reset
- collegati statistiche, affinita e armadietto con una nuova vetrina identitaria e con riepiloghi coerenti tra stagione, leaderboard e pannello bond
- riallineati `legacy/index-runtime.html`, `legacy/original-runtime.html` e `data/original-reference.html` anche su questo nuovo flusso live-service
- rese effettive le reward stagionali al soft reset: payout in crediti e XP, sblocco cosmetico nel locker e titolo status stagionale basato sul profilo di gioco
- aggiunta nel pannello stagione una card che mostra le reward reali dell'ultima stagione, non solo la preview del reward track

## 2026-05-30

- unificato il bootstrap runtime: tutti gli entry point shell ora caricano `legacy/index-runtime.html`
- rimosso il ramo di fallback che su `original.html` caricava `legacy/original-runtime.html`
- trasformato `original.html` in redirect compatibile verso `index.html` per eliminare avvii su UI legacy da bookmark/URL storici
- aggiornato README per chiarire che `legacy/original-runtime.html` resta riferimento di audit e non percorso live di avvio partita
- aggiunto hard-guard in `legacy/original-runtime.html`: se aperto senza `?allowLegacy=1`, reindirizza automaticamente alla nuova UI `index.html`
- multiplayer shell aggiornato con pipeline lobby/server: mode + numero giocatori + inviti vengono validati e serializzati in una lobby dedicata prima dell'avvio match
- avvio multiplayer ora parte solo da configurazione lobby coerente e inoltra al runtime la configurazione completa (`roomCode`, host, modalità, players, competitiva, invitati)

## 2026-05-31

- corretto il resolver del runtime shell su apertura `file://`: il launcher ora usa un path relativo robusto verso `legacy/index-runtime.html`
- disattivato il bootstrap multiplayer sperimentale `MP2` in favore della schermata multiplayer stabile e completa (tab Torneo/Amici/Club)
- aggiunto controllo di autenticazione prima dell'avvio partita: se il profilo runtime non e disponibile, il launcher non tenta lo start e mostra il flusso login/registrazione
- aggiornato il pulsante impostazioni `Gestione account / Login`: apre direttamente il runtime per completare accesso o registrazione
- aggiunto bridge esplicito launcher → runtime per forzare la schermata `login` quando richiesto da Impostazioni
- esposto lo `Shop` reale del runtime nella schermata Impostazioni del launcher (`Shop (runtime)`), con fallback automatico al login se l'utente non e autenticato
- unificata la navigazione singleplayer con nuovi tab shell `Targhette` e `Shop`, eliminando il routing utente verso pannelli runtime legacy
- riallineati i pulsanti Impostazioni (`Profilo`, `Shop`, `Targhette`) a routing interno nuova UI
- aggiunto fallback profilo locale shell (`ensureRuntimeProfile`) per evitare atterraggi su login legacy durante l'avvio partita
- aggiunto hard-guard su `legacy/index-runtime.html`: accesso top-level reindirizzato a `index.html` salvo `?allowLegacy=1`
- aggiunti i documenti di mapping completo UI: `docs/reports/UI-LEGACY-MAP.md` e `docs/reports/UI-NUOVA-MAP.md`
- corretto residuo runtime legacy non bloccante su `notifEnabled`: init v52 ora usa riferimento coerente a `window.P` (evitato mismatch con binding locale `P`)
- completato audit QA esteso shell + runtime con copertura automatizzata di avvio per 10 modalita x 3 conteggi giocatori (30/30 avvii + ritorno shell)
- validata coerenza singleplayer su aree `Profilo`, `Targhette`, `Shop`, `Battle Pass`, `Sfide`, `Top100`, `Stagione`
- validata coerenza multiplayer su `Gioca`, `Profilo`, `Sfide`, `Top100`, `Torneo`, `Amici`, `Club` con test inviti, start lobby e social flow
- confermata persistenza profilo/cosmetici acquisti su reload completo pagina e sincronizzazione shell <-> runtime iframe
- aggiunto report tecnico dettagliato: `docs/reports/QA-EXHAUSTIVE-2026-05-31.md`
- introdotto lifecycle match unificato shell (`start/end log`) con cleanup robusto su `ingame-back`, ritorno splash runtime, `beforeunload` e `visibilitychange`
- chiuso il gap match fantasma multiplayer: su fine match viene inviato `match:end`, chiusa la lobby (`lobby:closed`) e resettata la squadra invitata
- flusso `Gioca` aggiornato: il bottone principale avvia direttamente la modalita gia selezionata senza popup ridondante
- armadietto nuova UI reso operativo con popup categorie equipaggiabili (`targhette`, `cornici`, `carte`, `avatar`, `bordo`, `cornice-animata`, `effetti`)
- sfide migrate a ciclo account `v2` con progress reali e riscossione reward (`XP` + crediti)
- notifiche/news centralizzate in un `News Hub` unico dalla schermata `Gioca`
- introdotto uno stato presenza amici centralizzato (`online` / `in lobby` / `in partita` / `offline`) con sincronizzazione coerente tra tab `Amici` e popup `Invita`
- bloccati gli inviti non validi verso amici già occupati (`in partita` o `in lobby`) con feedback esplicito in UI e controlli lato handler
- aggiornato il context menu amici: `Invita a partita` usa ora la stessa validazione robusta del popup lobby
- completato il cleanup lobby anche senza match attivo: uscita dal tab multiplayer / unload / hidden ora chiude server lobby e resetta gli slot invitati
- avviata migrazione multiplayer online (fase 1): `scripts/dev.js` include ora gateway WebSocket realtime (`/ws`) con servizi in-memory per presenza, inviti, lobby e lifecycle match
- `createTransport` ora prova modalità online via WebSocket e mantiene fallback automatico BroadcastChannel locale, senza rompere i flussi shell esistenti
- aggiunto canale presenza client (`createPresenceChannel`) e hook shell di transizione stato (`online`/`in_lobby`/`in_match`) su entry multiplayer, start match e cleanup
- irrobustita la persistenza profilo shell con migrazione schema/versioning (`profileSchemaVersion`) e normalizzazione dati in load/save
- aggiunto tracciamento rank persistente con notifica automatica `rank up`/`rank aggiornato` al cambio fascia MMR
- iniziato lo split del monolite shell: estratta logica classifica nel modulo `js/shell/leaderboard-data.js`
- rimossa Top100 finta basata su bot statici (`LB_BASE`): la classifica shell usa ora profili locali reali (`_loadDB` runtime + profilo shell)
- migliorata accessibilità shell con focus management automatico su titolo pannello durante cambi screen/tab
- secondo split del monolite shell: estratti helper rank in `js/shell/rank-utils.js` e rimossa duplicazione inline in `index.html`
- contenimento feature-creep: card `Torneo` multiplayer rese esplicitamente preview-only (niente falsa navigazione/azione)

## Snapshot v-current

Stato attuale del repo.

### Bug corretti

- Avvio partita reindirizzato verso runtime legacy invece del flusso aggiornato: risolto con unificazione bootstrap.
- Avvio multiplayer incoerente tra popup inviti e start lobby: pipeline unificata.
- Caricamento infinito in start match per modalità non valorizzata: aggiunta assegnazione esplicita e normalizzazione.
- Numero giocatori sovrascritto dagli inviti: la selezione manuale ora viene preservata.

### Validazioni corrette (non bug)

- Blocco avvio quando inviti insufficienti per 3P/4P: comportamento atteso, validazione corretta.

### Warning ambientali (non codice di gioco)

- `ENOENT` su `npm run dev`: causato da avvio nella cartella errata.
- `EADDRINUSE` sulla porta dev: porta occupata da processo precedente.

## Backlog

### Priorità 1 - Critico

- Implementare modal selezione colore per `wild` e `wild4` lato giocatore umano.
- Aggiungere `aria-live` al log di gioco e label accessibili alle carte.

### Priorità 2 - Alto

- Refactoring AI con livelli `easy` / `medium` / `hard`.
- Leaderboard persistente da localStorage con storico partite reale.
- Separare il motore UNO in moduli indipendenti per gioco.

### Priorità 3 - Medio

- Implementare Blackjack completo come secondo gioco.
- Aggiungere test automatici per engine UNO.
- Rafforzare persistenza con versioning dati e fallback.

### Priorità 4 - Futuro

- Sistema di progressione e shop con oggetti cosmetici reali.
- Replay delle partite.
- Statistiche dettagliate per sessione.
- Supporto multiplayer locale o remoto.
- Versione mobile-friendly.