---
name: openclaw-testing-lite
description: Esegue e ottimizza test OpenClaw con diagnostica veloce, isolamento failure e regressione guard.
---

# openclaw-testing-lite

## Use when
- CI rossa o flaky.
- Test runtime troppo alto.
- Necessita di report failure sintetico e riproducibile.

## Workflow
1. Esegui subset mirato prima del full run.
2. Isola test failing e cattura stack utile.
3. Classifica failure: ambiente, assertion, race, timeout.
4. Applica fix minimo o suggerisci mitigazione.
5. Riesegui test impattati e poi smoke globale.

## Command strategy
- Preferire comandi repository-native (`pnpm test`, script dedicati).
- Evitare full-suite ripetute finche non hai una fix candidate.

## Output template
- Failing tests:
- Root cause hypothesis:
- Fix applied/suggested:
- Re-run result:

## Constraints
- Non ridurre copertura per far passare CI.
- Non silenziare test senza ticket tecnico.
