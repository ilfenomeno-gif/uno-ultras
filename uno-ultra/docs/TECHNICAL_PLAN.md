# TECHNICAL PLAN

## Step tecnici
1. Stabilizzare contratti TypeScript in src/types.
2. Portare funzioni pure dal monolite in src/core.
3. Introdurre bridge temporaneo verso funzioni legacy.
4. Spostare rendering in componenti ui dedicati.
5. Migrare protocollo multiplayer con token/seq anti-desync.
6. Migrare mini-giochi uno per volta con test dedicati.

## Quality gates
- npm run typecheck verde.
- npm run test verde.
- Nessun import DOM in core/ai/progression/multiplayer.
