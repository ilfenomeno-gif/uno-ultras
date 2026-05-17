# Fusione controllata: uno-ultra base viva

## Regole non negoziabili
1. Non cancellare mai file dentro uno-ultra.
2. Uno-ultra-professional e solo sorgente di integrazione selettiva.
3. Prima si aggiunge, poi si unifica; solo dopo si valuta deprecazione esplicita.
4. Ogni integrazione deve lasciare typecheck e test verdi.

## Snapshot confronto (solo codice/progetto)
- Base: uno-ultra
- Blueprint: uno-ultra-professional
- File comuni: 85
- File comuni ma diversi: 85
- File mancanti in base da blueprint: 32

Nota: il confronto grezzo include node_modules nel base; qui sotto sono riportati solo file di progetto utili.

## Mantieni (autorevole in base)
Questi moduli restano la linea principale e non vanno rimossi:
- src/types/
- src/core/
- src/ai/
- src/multiplayer/
- src/progression/
- src/minigames/
- src/ui/
- src/accessibility/
- src/auth/
- src/styles/
- docs/
- tests/

## Aggiungi dal blueprint (mancano in base)
Aggiunta consigliata senza sostituzione distruttiva:
- .eslintrc.json
- .gitignore
- server/api-stub.js
- server/peerjs-server.js
- src/core/GameState.ts
- src/core/init.ts
- src/minigames/registry.ts
- src/multiplayer/iceServers.ts
- src/settings/storage.ts
- src/settings/themes.ts
- src/styles/_animations.scss
- src/styles/_layout.scss
- src/styles/_themes.scss
- src/styles/_hud.scss
- src/styles/_overlays.scss
- src/styles/_minigames.scss
- src/ui/NotifyToast.ts
- src/ui/OverlayManager.ts
- src/ui/TransitionManager.ts
- src/ui/ProfilePanel.ts
- src/ui/particles.ts
- src/utils/dom.ts
- src/utils/math.ts
- src/utils/codegen.ts
- tests/core/deck.test.ts
- tests/core/rules.test.ts
- tests/minigames/ruba.test.ts
- tests/multiplayer/protocol.test.ts
- tests/progression/mmr.test.ts
- tests/progression/xp.test.ts
- vitest.config.ts
- README.md

## Unifica (esistono in entrambi ma differiscono)
Unificazione a priorita alta:
- package.json
- index.html
- tsconfig.json
- vite.config.ts
- src/main.ts
- docs/ARCHITECTURE.md
- docs/TECHNICAL_PLAN.md
- docs/PROJECT_PLAN.md
- docs/MIGRATION_GUIDE.md
- docs/ACCESSIBILITY.md
- docs/MULTIPLAYER.md
- docs/MINIGAMES.md

Unificazione core/domain:
- src/core/constants.ts
- src/core/deck.ts
- src/core/GameLoop.ts
- src/core/rules.ts
- src/ai/AIEngine.ts
- src/ai/AITracking.ts
- src/multiplayer/protocol.ts
- src/multiplayer/ConnectionManager.ts
- src/multiplayer/FriendService.ts
- src/multiplayer/MpTimerManager.ts
- src/multiplayer/GameSerializer.ts
- src/progression/mmr.ts
- src/progression/xp.ts
- src/progression/seasonpass.ts
- src/progression/challenges.ts
- src/progression/grandprix.ts
- src/progression/titles.ts

Unificazione UI/accessibility:
- src/ui/Site.ts
- src/ui/ScreenRouter.ts
- src/ui/HUD.ts
- src/ui/CardRenderer.ts
- src/ui/SfxManager.ts
- src/accessibility/nvda.ts
- src/accessibility/keyboardNav.ts
- src/accessibility/colorblind.ts

Unificazione mini-giochi plugin:
- src/minigames/ruba/*
- src/minigames/scopa/*
- src/minigames/poker/*
- src/minigames/burraco/*
- src/minigames/blackjack/*
- src/minigames/millemiglia/*
- src/minigames/scala40/*

Unificazione stili:
- src/styles/_tokens.scss
- src/styles/_reset.scss
- src/styles/_cards.scss
- src/styles/_accessibility.scss
- src/styles/main.scss

## Sequenza operativa consigliata (safe merge)
1. Aggiungere solo file mancanti (nessuna sovrascrittura).
2. Unificare tooling (package, tsconfig, vite, vitest) e verificare.
3. Unificare core + test.
4. Unificare multiplayer/progression + test.
5. Unificare ui/accessibility + smoke test manuale.
6. Integrare moduli server e settings.
7. Allineare docs finali.

## Gate di qualità per ogni step
- npm run typecheck
- npm run test
- smoke test UI su index.html
