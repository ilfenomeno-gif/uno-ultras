# Mappa Estrazione Monolite -> uno-ultra

## Regole operative
- Uno-ultra e la base viva.
- Nessuna eliminazione distruttiva durante la migrazione.
- Ogni estrazione produce prima servizio puro, poi controller UI, poi bridge legacy.
- Core, AI, multiplayer e progression non devono dipendere da DOM.

## Evidenze principali nel monolite
- Funzioni multiplayer/friends critiche presenti in [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L14475), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L14539), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L15074), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L15181), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L15219), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L15318), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L15345).
- Coupling globale alto su stato shared in [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L9686), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L32723), [uno_ultra_v52 (1) (2).html](../uno_ultra_v52%20(1)%20(2).html#L33530).

## Tabella estrazione prioritaria
| Priorita | Blocco monolite | Destinazione in uno-ultra | Strategia di split |
|---|---|---|---|
| P0 | mpHostInit, mpOnData | src/multiplayer/ConnectionManager.ts, src/multiplayer/protocol.ts, src/multiplayer/GameSerializer.ts | 1) parser messaggi, 2) state transition pure, 3) hook UI separato |
| P0 | frInit, frInviteFriend | src/multiplayer/FriendService.ts | 1) repository amici, 2) invite API, 3) emitter eventi friend:added/invite:received |
| P0 | mp3pHostInit, mp3pJoin, mp3pGuestOnData | src/multiplayer/ConnectionManager.ts, src/multiplayer/MpTimerManager.ts | 1) lobby state machine 3P, 2) guest handshake, 3) timeout/retry policy |
| P1 | join/host UI click handlers | src/ui/ScreenRouter.ts, src/ui/OverlayManager.ts | 1) mapping eventi UI, 2) controller sottile, 3) niente logica rete in UI |
| P1 | inviti da friends list | src/ui/ProfilePanel.ts, src/ui/NotifyToast.ts | 1) render lista, 2) delega a FriendService, 3) notifica asincrona |
| P1 | progressione match online | src/progression/mmr.ts, src/progression/xp.ts, src/progression/seasonpass.ts | 1) calcolo delta puro, 2) applicazione reward, 3) emissione eventi UI |
| P2 | gating mod/queue/timer | src/multiplayer/MpTimerManager.ts, src/ui/TransitionManager.ts | 1) timer di dominio, 2) transizioni schermata, 3) cancellazione job sicura |
| P2 | fallback legacy su variabili globali | src/core/init.ts, src/main.ts | 1) adapter temporaneo window.*, 2) cutover progressivo per modulo |

## Mappa globali legacy -> stato moderno
| Globale legacy | Ruolo attuale | Stato target |
|---|---|---|
| window.G | game state runtime | src/types/gamestate.ts + store centralizzato in core |
| window.P | profilo/progressione | src/auth/profile.ts + src/progression/* |
| window.MP | sessione multiplayer | src/types/mp.ts + ConnectionManager |
| window.FR | friend graph/inviti | FriendService |
| window.LOBBY | roster stanza e stato ready | ConnectionManager + multiplayer room state |
| window.MP2 | stato 2v2 | multiplayer team state dedicato |
| window.MP3 | stato 3P | multiplayer 3P state dedicato |

## Sequenza di lavoro consigliata
1. Estrarre protocollo e onData in puro dominio multiplayer.
2. Estrarre friend system e inviti in FriendService.
3. Portare lobby 3P e 2v2 su state machine modulare.
4. Spostare update MMR/XP/post-match in progression event-driven.
5. Ridurre progressivamente l'uso di window.* con adapter temporaneo.

## Checklist per ogni blocco estratto
- Nuovo modulo senza accesso diretto a document o window.
- Test unit su parser/regole/transizioni.
- Controller UI limita il ruolo a render + dispatch.
- Verifica end-to-end locale: npm run typecheck e npm run test.
