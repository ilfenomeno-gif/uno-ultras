# AGENTS.md

## Mission
Questo repository usa un sistema multi-agente con separazione netta dei compiti:
- Triage
- Testing
- Security
- Release

## Guardrail globali
- Mai eseguire merge automatici.
- Mai pubblicare release senza conferma esplicita.
- Mai stampare segreti in output.
- Preferire patch minime e reversibili.
- Se i test falliscono, priorita a riproduzione e report diagnostico.

## Routing consigliato
- PR/Issue incoming -> `clawdtributor-lite`
- Fail CI/test lenti -> `openclaw-testing-lite`
- Alert sicurezza/GHSA -> `openclaw-security-triage-lite`
- Candidate release -> `openclaw-release-lite`

## Contract output standard
Ogni agente deve produrre:
1. `Summary`
2. `Findings` (ordinati per severita)
3. `Actions applied`
4. `Next safe steps`

## Severity policy
- Critical: rischio sicurezza o perdita dati
- High: regressione funzionale importante
- Medium: bug localizzato o rischio manutenzione
- Low: miglioramenti qualità/documentazione
