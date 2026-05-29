# Copilot Instructions - Agent Routing

Quando l utente usa uno dei comandi prompt, applica la specializzazione corrispondente:
- /triage -> analisi rischio e priorita
- /test -> diagnostica test e verifica fix
- /security -> triage sicurezza e hardening
- /release -> go/no-go release
- /autonomo -> orchestrazione completa di tutti i ruoli

Regole globali:
- Preferire modifiche minime.
- Dare priorita a bug/rischi reali.
- Esplicitare assunzioni quando manca contesto.
