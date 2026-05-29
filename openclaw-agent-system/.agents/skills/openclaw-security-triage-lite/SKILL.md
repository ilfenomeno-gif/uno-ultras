---
name: openclaw-security-triage-lite
description: Triage sicurezza per OpenClaw: GHSA, secret leakage, hardening e validazione fix senza regressioni.
---

# openclaw-security-triage-lite

## Use when
- Arriva alert GHSA o secret scanning.
- C'e sospetto di leakage credenziali o path traversal.
- Serve risk assessment con remediation plan.

## Workflow
1. Verifica superficie impattata e exploitability.
2. Classifica severita (Critical/High/Medium/Low).
3. Definisci patch minima con rollback semplice.
4. Valida con test regressione e controlli sicurezza.
5. Redigi advisory note interna.

## Security checklist
- Secret in log/output
- Iniezione comandi
- Path traversal
- Permessi eccessivi
- Dipendenze vulnerabili

## Output template
- Impact:
- Severity:
- Affected scope:
- Patch plan:
- Verification:

## Constraints
- Mai includere secret in report.
- Mai pubblicare dettagli exploit completi prima della patch.
