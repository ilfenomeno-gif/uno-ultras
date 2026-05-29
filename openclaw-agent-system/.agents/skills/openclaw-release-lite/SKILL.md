---
name: openclaw-release-lite
description: Orchestrazione release OpenClaw: changelog, artefatti, gating CI e checklist publish-safe.
---

# openclaw-release-lite

## Use when
- Stai preparando una beta/stable release.
- Devi validare changelog e artifact consistency.
- Serve checklist pre-publish con blocchi espliciti.

## Workflow
1. Verifica branch/tag policy.
2. Controlla changelog fragments e note release.
3. Valida CI gates obbligatorie.
4. Verifica artifact hash e metadata.
5. Produce go/no-go report.

## Output template
- Release candidate:
- Gates status:
- Artifact checks:
- Blocking issues:
- Go/No-Go:

## Constraints
- Nessun publish automatico.
- Nessun bypass check richiesto.
