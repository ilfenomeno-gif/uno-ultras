# MIGRATION GUIDE

## Procedura consigliata
1. Copia una funzione dal monolite a un modulo TS puro.
2. Crea test Vitest sul nuovo modulo.
3. Esponi bridge temporaneo per compatibilita:
   window.buildDeck = buildDeck
4. Sostituisci i call site legacy con import modulo.
5. Rimuovi bridge quando non piu usato.

## Regola anti-regressione
Nessun refactor senza test minimo sul comportamento estratto.
