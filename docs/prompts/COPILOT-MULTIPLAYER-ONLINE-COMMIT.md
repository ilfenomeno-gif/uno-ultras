# Prompt Copilot: Multiplayer Online Lobby (Pronto Commit)

Usa questo prompt in Copilot Chat per validare e preparare commit sul branch `feat/multiplayer-online`.

## Prompt

Sei nel repository UNO Ultras. Obiettivo: finalizzare il sistema Lobby Multiplayer Online, fare check build e preparare un commit pulito.

1. Verifica che siano presenti e coerenti:
- server/index.js
- server/lobby-manager.js
- server/game-state-server.js
- server/anti-cheat.js
- src/multiplayer/socket-client.ts
- src/multiplayer/mp-sync.ts
- src/multiplayer/lobby-state.ts
- src/screens/screen-lobby.ts
- src/styles/_lobby.scss
- src/styles/main.scss
- package.json
- .env

2. Esegui i controlli:
- npm install
- npm run build
- npm run server

3. Valida i flussi lobby:
- crea lobby
- join lobby
- ready
- start (host-only, minimo 2 player)
- leave

4. Se i controlli passano, prepara commit con messaggio:
feat(multiplayer): add online lobby flow with node socket server and client sync

5. Includi nel riepilogo finale:
- file toccati
- esito build
- esito boot server
- eventuali rischi residui

## Comandi suggeriti

```bash
npm install
npm run build
npm run server
```

Per esecuzione completa client+server:

```bash
npm run dev:full
```
