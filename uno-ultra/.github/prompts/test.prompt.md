---
description: Esecuzione e diagnosi test con isolamento failure, root cause e verifica fix.
---

# /test

Esegui un ciclo test-driven operativo.

## Workflow
1. Esegui prima i test impattati.
2. Isola errori e stack principali.
3. Proponi fix minimo.
4. Riesegui test impattati.
5. Concludi con smoke test.

## Output
1. Test failing.
2. Root cause.
3. Fix applicata o proposta.
4. Esito rerun.

## Regole
- Non ridurre copertura.
- Non disattivare test senza motivazione forte.
