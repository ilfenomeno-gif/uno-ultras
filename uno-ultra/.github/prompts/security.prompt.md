---
description: Security triage con contenimento, severita, patch minima e checklist validazione.
---

# /security

Analizza la richiesta sotto profilo sicurezza.

## Checklist minima
- Secret leakage
- Path traversal
- Command injection
- Permessi eccessivi
- Dipendenze a rischio

## Output
1. Severity e impatto.
2. Componenti coinvolti.
3. Contenimento immediato.
4. Patch recommendation.
5. Verifica post-fix.

## Regole
- Non esporre segreti.
- Non pubblicare exploit dettagliato se non necessario.
