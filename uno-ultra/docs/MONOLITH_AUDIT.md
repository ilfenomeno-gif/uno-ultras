# Monolith Audit (uno_ultra_v52)

## Scope
Source analizzato: file HTML monolitico con CSS, markup e logica JS nello stesso artefatto.

## Stato Riversamento
- Riversamento completo effettuato in [public/legacy/uno_ultra_v52.html](../public/legacy/uno_ultra_v52.html).
- Il file e stato verificato byte a byte rispetto all'originale esterno.
- Sorgente canonica per la migrazione: [public/legacy/uno_ultra_v52.html](../public/legacy/uno_ultra_v52.html).

## Evidenze principali
- Dominio molto ampio: UNO + mini-giochi multipli (Scopa, Poker, Burraco, Millemiglia, Ruba, Scala, Blackjack).
- Multiplayer esteso: lobby 1v1, 3P, 4P, 2v2, 3v3 con friend/invite flow.
- Progressione avanzata: MMR multipli per modalità, rank, season overlay, challenges, GP.
- Accessibilità reale: regioni aria-live, toggle NVDA, riduzione motion via prefers-reduced-motion.
- Persistenza locale strutturata: profili, sessione, backup export/import, pruning per quota localStorage.

## Punti di coupling rilevati
- Forte uso di funzioni globali e onclick inline nel markup.
- UI e game logic coesistono nello stesso scope con dipendenze implicite su stato globale.
- Sezioni legacy/ridondanti nel mezzo del documento aumentano il rischio di regressione.

## Opportunity di refactor
- Estrarre subito un core puro (state + rules + reducers) senza DOM.
- Spostare persistenza in adapter dedicato (storage service).
- Introdurre router UI esplicito e mappa eventi centralizzata.
- Isolare multiplayer protocol da rendering.
- Migrare mini-giochi a plugin indipendenti con contratto comune.
