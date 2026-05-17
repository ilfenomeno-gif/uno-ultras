# Migration Plan (6 fasi)

## Fase 1 (1-2 giorni)
- Estrazione costanti e helper puri.
- Introduzione modulo storage separato.
- Inserimento test di base su stato e serializzazione.

Exit criteria:
- Nessuna dipendenza DOM in core.
- Test base verdi.

## Fase 2 (5-7 giorni)
- Porting deck/rules/game loop UNO in src/core.
- Porting AI baseline in src/ai.
- Snapshot test su turni e validazione mosse.

Exit criteria:
- Partita UNO completa simulabile da Node senza browser.

## Fase 3
- Router UI e overlay con adapter temporaneo per window legacy.
- Rimozione progressiva onclick inline.

Exit criteria:
- Flusso login -> home -> game attivo via router modulare.

## Fase 4
- Progressione completa (MMR, XP, pass, challenges, GP).
- Definizione eventi dominio per update atomici.

Exit criteria:
- MMR e reward parity rispetto al monolite su casi campione.

## Fase 5
- Multiplayer protocol e sequencing anti-desync.
- Connection manager + timer manager + friend service.

Exit criteria:
- Sessioni 1v1 e team stabili con reconciliation deterministica.

## Fase 6 (7-10 giorni)
- Mini-giochi plugin-based, uno alla volta, partendo da Ruba.
- Contratto engine/ui/ai/online per ogni mini-gioco.

Exit criteria:
- Ogni mini-gioco isolato e testabile in autonomia.
