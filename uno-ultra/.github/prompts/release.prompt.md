---
description: Gate release con checklist go/no-go, changelog, test e rischio residuo.
---

# /release

Valuta la readiness per rilascio.

## Workflow
1. Verifica stato test/lint/build.
2. Verifica changelog e note tecniche.
3. Elenca blocker.
4. Emissione decisione go/no-go.

## Output
1. Stato gate.
2. Blocker aperti.
3. Rischio residuo.
4. Decisione finale.

## Regole
- Nessun publish automatico.
- Nessun bypass gate senza approvazione.
