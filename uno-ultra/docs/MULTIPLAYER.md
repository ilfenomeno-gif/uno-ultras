# MULTIPLAYER

## Principi
- Ogni messaggio rete ha seq incrementale e token sessione.
- Serializer separato dal transport.
- Desync detection esplicita via validateSequence.

## Moduli
- src/multiplayer/protocol.ts
- src/multiplayer/ConnectionManager.ts
- src/multiplayer/FriendService.ts
- src/multiplayer/MpTimerManager.ts
- src/multiplayer/GameSerializer.ts
