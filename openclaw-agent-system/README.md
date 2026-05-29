# OpenClaw Agent System (Starter Pack)

Questo pacchetto crea un sistema di agenti modulare ispirato alla struttura di `openclaw/openclaw`.

## Obiettivo
- Gestire triage PR/Issue
- Eseguire test e performance checks
- Fare security triage con regole conservative
- Fornire orchestrazione con ruoli chiari

## Struttura
- `AGENTS.md`: policy e orchestrazione
- `.agents/skills/*/SKILL.md`: skill specializzate
- `.github/codex/prompts/*.md`: prompt operativi per automazioni CI/maintainer

## Installazione su openclaw/openclaw
1. Copia il contenuto di questa cartella nella root del repository target.
2. Verifica i path e adatta comandi (`pnpm`, script locali, label GitHub).
3. Applica gradualmente: prima `AGENTS.md`, poi una skill alla volta.

## Skill incluse
- `clawdtributor-lite`: triage e review PR/Issue.
- `openclaw-testing-lite`: test runner intelligente con fallback.
- `openclaw-security-triage-lite`: security triage e hardening check.
- `openclaw-release-lite`: checklist release e validazione artifact.

## Note
- Tutte le skill sono conservative: niente merge, publish, o azioni distruttive automatiche.
- I prompt sotto `.github/codex/prompts` sono pronti per pipeline/agent jobs.
