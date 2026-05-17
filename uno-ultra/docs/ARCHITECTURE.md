# ARCHITECTURE

## Obiettivo
Separare logica di dominio, interfaccia, multiplayer e mini-giochi con dipendenze unidirezionali.

## Regole base
- ui puo importare core.
- core non deve importare DOM, window o document.
- ai usa solo contratti types e funzioni pure di core.
- multiplayer non manipola UI, emette solo eventi e stati.

## Layer
- src/types: contratti forti TypeScript.
- src/core: deck, rules, game loop puro.
- src/ai: strategie CPU.
- src/multiplayer: protocollo, connessioni, serializzazione.
- src/progression: mmr/xp/season/challenges.
- src/minigames: plugin isolati per gioco.
- src/ui: router, HUD, renderer, audio.
