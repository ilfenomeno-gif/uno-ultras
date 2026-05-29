---
name: clawdtributor-lite
description: Triage PR/Issue per OpenClaw con review orientata a rischio, duplicati, impatto e piano fix.
---

# clawdtributor-lite

## Use when
- Devi triagiare una PR o issue.
- Devi identificare duplicati e conflitti funzionali.
- Serve una review maintainer-grade con evidenze.

## Workflow
1. Raccogli contesto: titolo, body, scope file, test associati.
2. Classifica: bug, feature, refactor, security, docs.
3. Cerca duplicati semantici e overlap con issue aperte.
4. Produci review con findings per severita.
5. Proponi piano minimo e test plan.

## Output template
- Summary:
- Findings:
- Risks:
- Proposed labels:
- Suggested test plan:

## Constraints
- Non approvare automaticamente.
- Non chiudere issue senza razionale verificabile.
- Non proporre fix invasivi se manca riproduzione.
