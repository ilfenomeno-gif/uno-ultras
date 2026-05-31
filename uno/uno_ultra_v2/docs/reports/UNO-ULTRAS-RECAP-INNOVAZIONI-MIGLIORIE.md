# UNO ULTRAS — Recap innovazioni e migliorie

## Obiettivo

Questo documento raccoglie il recap tecnico delle innovazioni gia introdotte, delle migliorie ancora aperte e delle priorita consigliate per il progetto UNO ULTRAS nel workspace corrente.

Il progetto reale non e una SPA TypeScript + Vite pura: la shell caricata da `index.html` monta via iframe un runtime legacy che vive in `legacy/index-runtime.html` e `legacy/original-runtime.html`, mentre `data/original-reference.html` resta la sorgente di riferimento per porting e audit.

## Stato attuale reale del progetto

Il motore UNO runtime gia gestisce:

- deck e scarti
- direzione, skip, reverse, draw stack
- wild e wild +4
- AI con logica multi-livello piu solida rispetto alla base casuale
- leaderboard locale ibrida con bot simulati e profili locali salvati
- replay locale e live match log accessibile
- persistenza profili e sessione in localStorage
- shell applicativa con bridge verso il runtime legacy

Sono presenti inoltre piu minigiochi e moduli collaterali gia scaffolati o implementati, incluso Blackjack, quindi le priorita future non devono partire da assunzioni obsolete.

## Recap errori segnalati

Qui sotto i punti emersi nel controllo recente, separati per natura del problema.

### Bug di codice corretti

1. Avvio partita verso versione vecchia: il bootstrap e il routing sono stati riallineati al runtime moderno, con redirect di compatibilita dove serve.
2. Avvio multiplayer incoerente dai due pulsanti principali: i percorsi convergono ora sulla stessa pipeline di start lobby.
3. Possibile caricamento infinito o branch errato in start match: la modalita viene normalizzata in modo esplicito prima del passaggio shell-runtime.
4. Numero giocatori sovrascritto dagli inviti: la selezione manuale 3P o 4P viene preservata e non viene piu sovrascritta in modo automatico.

### Warning di validazione corretti

5. Blocco avvio quando gli inviti sono insufficienti: non e un bug, ma una validazione corretta. Per avviare una lobby multiplayer serve il numero minimo di amici invitati richiesto dalla modalita.

### Problemi di ambiente o test

6. ENOENT su `npm run dev`: il comando era stato lanciato fuori dalla cartella del progetto, quindi senza `package.json` valido nel contesto.
7. EADDRINUSE sulla porta dev: la porta locale era gia occupata da un altro processo.

Questi ultimi due punti non indicano un difetto del gameplay o del runtime, ma solo un problema di esecuzione locale da tenere separato nel report.

## Migliorie gia introdotte

### 1. Runtime reale identificato e documentato

E stato chiarito che il comportamento visibile del gioco dipende dal runtime caricato dalla shell, non dalla sola struttura modulare di superficie.

File chiave:

- `index.html`
- `js/main.js`
- `legacy/index-runtime.html`
- `legacy/original-runtime.html`
- `data/original-reference.html`

### 2. AI UNO piu robusta

L'AI e stata migliorata con euristiche piu coerenti rispetto al puro caso:

- gestione migliore delle carte speciali
- uso piu disciplinato di wild e wild +4
- risposta piu forte alle situazioni di draw stack
- maggiore attenzione agli avversari con poche carte
- supporto a profili decisionali estendibili

### 3. Leaderboard locale ibrida

La leaderboard non e piu solo demo statica: puo aggregare il profilo attuale, bot simulati e profili locali gia salvati nel DB locale.

Questo consente una progressione multi-sessione locale senza backend.

### 4. Accessibilita nel gameplay

Sono stati rafforzati elementi accessibili direttamente nel runtime:

- live log con `aria-live`
- etichette migliori per replay e mosse
- feedback piu leggibili per screen reader
- separazione meno dipendente dal solo colore in punti chiave del flusso

### 5. Replay e log partita

Il runtime mantiene ora un log vivo della partita e salva replay recenti in modo piu leggibile e accessibile.

### 6. Persistenza locale piu resiliente

La lettura del DB locale dei profili non degrada piu automaticamente a un archivio vuoto in caso di JSON corrotto.

Quando e disponibile un auto-backup locale valido, il runtime tenta il ripristino automatico del database profili e della sessione.

### 7. Loop stagionale piu da live service

Il vecchio avviso passivo di fine stagione e stato evoluto in un blocco piu leggibile e piu utile per il giocatore:

- countdown stagionale mostrato come evento reale di chiusura
- snapshot dell'identita del profilo costruita da statistiche e affinita
- tre corsie reward separate per cosmetica, progressione e status
- armadietto usato come vetrina del profilo e non solo come inventario statico

Questo upgrade vive nel runtime reale e ora e stato riallineato anche nel sibling runtime e nel file reference usato per sync e audit.

### 8. Reward stagionali realmente assegnate

Le tre corsie reward non sono piu solo descrittive nella UI:

- la progressione assegna crediti e XP al soft reset
- la cosmetica sblocca un cardback premium nel locker in base al profilo stagionale
- lo status sblocca un titolo stagionale dedicato al tipo di identita del giocatore

Il riepilogo delle reward viene anche persistito nello storico stagione e mostrato nel pannello stagione della stagione successiva.

## Problemi o gap ancora prioritari

1. La coerenza tra `legacy/index-runtime.html`, `legacy/original-runtime.html` e `data/original-reference.html` va mantenuta attivamente ad ogni patch rilevante.
2. Alcune aree UI shell e runtime restano fortemente accoppiate e richiedono ancora consolidamento architetturale.
3. L'accessibilita e migliorata, ma non ancora uniforme in tutte le schermate secondarie e in tutti i minigiochi.
4. La leaderboard locale e utile, ma puo essere raffinata con metriche e filtri piu chiari.
5. La documentazione tecnica e presente ma puo essere ancora resa piu orientata ai flussi reali di manutenzione.

## Bug ancora aperti

Al momento non risultano bug di codice confermati tra quelli segnalati nel recap recente.

Resta aperta solo l'attenzione operativa su tre aree:

- regressioni di sync tra runtime reale e reference source
- validazioni lobby da non confondere con bug di avvio
- problemi di ambiente locale, come porta occupata o cartella di lavoro errata

## Priorita tecniche consigliate

### Priorita 1 — Allineamento sorgenti e runtime

Ogni cambiamento funzionale che tocca il gameplay reale deve seguire questo ordine:

1. `legacy/index-runtime.html`
2. `legacy/original-runtime.html`
3. `data/original-reference.html`
4. documentazione e changelog

Questa e la priorita piu importante per evitare regressioni silenziose o divergenze tra sorgente di riferimento e runtime caricato.

### Priorita 2 — Rafforzamento AI per archetipi espliciti

L'AI puo essere ulteriormente estesa con profili piu dichiarativi e meno impliciti, ad esempio:

- rookie
- tactician
- pressure
- legend

Ogni profilo dovrebbe controllare:

- aggressivita stack
- conservazione wild +4
- priorita blocco avversario
- rumorosita decisionale
- rischio su mano corta

### Priorita 3 — Leaderboard e profili piu chiari

La classifica puo essere migliorata ulteriormente con:

- distinzione visiva piu forte tra `BOT`, `PROFILO` e `TU`
- ordinamenti alternativi per MMR, winrate e streak
- schede profilo piu credibili per i bot simulati
- filtri per modalita o playlist

### Priorita 4 — Accessibilita estesa

Le aree successive da rinforzare sono:

- shell esterna al runtime
- overlay e modali secondarie
- minigiochi
- navigazione tastiera in aree dense
- descrizioni non cromatiche nei punti critici

### Priorita 5 — Replay e osservabilita locale

Possibili miglioramenti:

- eventi piu ricchi nel log
- snapshot stato turno
- filtri replay per vittoria/sconfitta
- esportazione locale in JSON
- strumenti di debug piu espliciti per audit regressivi

## Migliorie tecniche suggerite

### Refactoring mirato

Continuare con refactor incrementali, non distruttivi, privilegiando:

- funzioni piu piccole nelle aree AI e replay
- helper riusabili per leaderboard e badge
- riduzione del codice duplicato tra i runtime legacy

### Tipizzazione concettuale piu forte

Anche in un progetto non TypeScript puro, conviene standardizzare meglio i contratti dati di:

- player profile
- leaderboard entry
- replay move
- stato partita
- decision profile AI

### Test e validazione

Le verifiche minime da mantenere sempre attive:

- `npm run check`
- controllo browser su `http://localhost:4173/`
- verifica DOM del runtime reale dentro iframe
- confronto rapido tra runtime e reference source quando la patch e importante

### Persistenza

La persistenza locale puo essere ulteriormente rafforzata con:

- versionamento piu esplicito dei dati
- funzioni di migrazione
- fallback su payload corrotti
- export/import del profilo

## Roadmap consigliata

### Fase 1

- consolidare AI profiles espliciti
- rifinire badge e chiarezza leaderboard
- estendere l'accessibilita shell + runtime

### Fase 2

- ridurre divergenze tra i tre file sorgente/runtime
- migliorare replay e storico partita
- introdurre note architetturali piu operative

### Fase 3

- rifinire minigiochi gia presenti
- consolidare progressione e statistiche
- aggiungere strumenti di validazione piu automatici

### Fase 4

- eventuale sync remoto della leaderboard
- strumenti di esportazione/importazione
- multiplayer o telemetria piu robusti dove coerente col progetto

## Nota finale

Questo documento non e una specifica rigida ma un recap operativo aderente allo stato reale del repository.

Ogni intervento futuro deve partire dalla struttura concreta del workspace e non da descrizioni obsolete o idealizzate dell'architettura.
