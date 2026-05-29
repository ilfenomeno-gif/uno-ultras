# UNO Ultra v52 — Analisi Strutturale

## Panoramica

- **File sorgente**: `uno_ultra_v52 (1) (2).html`
- **Righe totali**: ~34.961
- **Architettura**: Applicazione SPA (Single Page Application) monolitica, tutto in un singolo file HTML
- **Dipendenze esterne**: PeerJS 1.5.4 (WebRTC P2P), Google Fonts (Syne, DM Sans, DM Mono)

---

## Macro-Sezioni Principali

### Sezione 1 — `<head>` e CSS (righe 1–4885)
Contiene tutti gli stili dell'applicazione (~4.800 righe di CSS puro).
Si divide nelle seguenti sotto-sezioni:

| Sotto-sezione CSS                   | Riga circa | Contenuto                                                         |
|-------------------------------------|------------|-------------------------------------------------------------------|
| Temi mini-giochi (table themes)     | 18–34      | `.bg-cyber-blue`, `.bg-lava-red`, ecc.                            |
| Root tokens (variabili CSS)         | 35–73      | `--bg`, `--gold`, `--teal`, `--card-w`, rank colors, ecc.        |
| Reset globale                       | 74–96      | `*, body, html` reset + background gradient                       |
| Tutorial universale                 | 75–143     | `.modal-tutorial`, `.modal-tutorial-inner`, ecc.                  |
| Sistema Lobby v39                   | 146–218    | `.mp-slot`, ping badge, ready-up styles                           |
| Particle Canvas                     | 219–221    | `#fx` canvas fisso                                                |
| NVDA Accessibility Dialog           | 222–320    | `.nvda-panel`, dialogo step 1 e step 2                            |
| Screen System                       | 321–326    | `.scr`, `.scr.on`                                                 |
| Shared Components                   | 327–374    | `#notif`, `#msg`, admin badge, rank colors                        |
| Multi-mode Leaderboard Tabs         | 375–438    | `.lb-mtab`, `.lb-stab`, mode accent colors                        |
| Splash Screen                       | 439–755    | `.logo`, `.profile-widget`, `.splash-tabs`, Season Pass           |
| Profile Widget / MMR               | 500–620    | `.pw-avatar`, `.xpbar`, `.rank-progress`, `.hud-rank-pill`        |
| Leaderboard Mode Banner             | 620–755    | `.lb-mode-banner`, `.lb-mode-badge`                               |
| Loading Screen                      | 756–902    | `.loading-logo`, `.loading-spinner`, `.loading-status`            |
| Login Screen                        | 903–1560   | `.login-glass`, `.login-input`, `.pin-dots`, `.lmt-btn`           |
| Home Screen                         | 1561–1877  | `.home-layout`, `.mode-card`, `.player-count-selector`            |
| Game Screen (tavolo di gioco)       | 1878–2031  | `.game-screen`, `.hand`, `.discard-pile`, `.draw-pile`, `.card`   |
| AI Panel                            | 2032–2113  | `.ai-panel`, `.ai-card-back`, `.bot-profile`                      |
| HUD (Heads-Up Display)              | 2114–2228  | `.hud`, `.hud-rank-pill`, `.blitz-timer-wrap`, `.turn-timer`      |
| Overlay Pause / End                 | 2229–2485  | `.pause-panel`, `.end-screen`, score rows, MMR delta              |
| Online Multiplayer / Lobby          | 2486–2679  | `.mp-screen`, `.ol-*`, `.mp-opp-panel`                            |
| UCS Panel                           | 2680–2983  | `.ucs-panel`, `.ucs-tier`, `.ucs-access-row`                      |
| Tournament Screen                   | 2984–3124  | `.tournament-layout`, `.t-bracket`, `.t-match`                    |
| Sidebar                             | 2994–3124  | `.sidebar`, `.nav-btn`, `.nav-icon`                               |
| Main Content                        | 3125–3155  | `.main-content`, `.home-hero`                                     |
| Play Panel Hero                     | 3156–3207  | `.play-hero`, `.ph-title`, `.ph-sub`                              |
| Mode Cards (RL Style)               | 3208–3485  | `.mode-card`, `.mc-icon`, `.mc-label`, `.mc-badge`                |
| Playlist Selector                   | 3486–3537  | `.s-select`, `.playlist-table`                                    |
| Difficulty Row                      | 3574–3596  | `.diff-row`, `.diff-chip`                                         |
| Shop Section                        | 3597–3629  | `.shop-row`, `.shop-item`, `.crate-card`                          |
| Season Banner                       | 3630–3640  | `.season-banner`                                                  |
| Profile Panel                       | 3641–3675  | `.profile-panel`, `.stat-row`                                     |
| Mobile Responsive                   | 3676–3707  | `@media` queries per small screens                                |
| Grand Prix Screen                   | 3708–3971  | `.gp-*`, division cards, pips                                     |
| Tournament Mode Cards v47           | 4006–4054  | `.tourney-mode-card`                                              |
| Mini-Game Online Lobby              | 4055–4126  | `.mglob-*`, online lobby per mini-giochi                          |
| Mini-Giochi Schermate               | 4127–4425  | Scopa, Scala 40, Burraco, Poker, Millemiglia CSS                  |
| Locker / Cosmetics                  | 4426–4617  | `.locker-panel`, `.locker-item`, card back styles                 |
| Stats Panel / Lab                   | 4618–4859  | `.stats-panel`, `.lab-stat-row`, chart canvas                     |
| Particlari extra                    | 4860–4885  | `.replay-player`, `.bond-panel`, `.custom-game-lobby`             |

---

### Sezione 2 — HTML `<body>` (righe 4887–7394)
Contiene tutta la struttura DOM statica dell'applicazione.

| Componente HTML                     | Riga circa | ID / Classe principale                                            |
|-------------------------------------|------------|-------------------------------------------------------------------|
| Pentathlon Modal                    | 4888–4905  | `#pentathlon-modal`                                               |
| Ultra Watch HUD                     | 4906–4918  | `#ultra-watch-hud`                                                |
| Nemesi Widget                       | 4919–4924  | `#nemesi-hud`                                                     |
| News Feed                           | 4925       | `#news-feed`                                                      |
| Tournament Lobby HUD                | 4960–4975  | `#tournament-lobby-hud`                                           |
| Tournament Accept Modal             | 4976–4990  | `#tournament-accept-modal`                                        |
| Skip Link (accessibilità)           | 5010       | `.skip-link`                                                      |
| Particle Canvas                     | 5012       | `#fx`                                                             |
| Notifica globale                    | 5013–5014  | `#notif`, `#msg`                                                  |
| Club Modal                          | 5019–5036  | `#club-modal-overlay`                                             |
| Loading Screen                      | 5037–5047  | `#loading`                                                        |
| Login Screen                        | 5048–5161  | `#login`                                                          |
| Logout Confirm                      | (in body)  | `#ov-logout`                                                      |
| NVDA Dialog Step 1                  | (in body)  | `#ov-nvda-ask`                                                    |
| NVDA Dialog Step 2                  | (in body)  | `#ov-nvda-confirm`                                                |
| Primo blocco `<script>`             | 5162–5744  | Router, Tournament, Pentathlon, NVDA announce                     |
| Splash Screen                       | 5745–5836  | `#splash`                                                         |
| Home Screen                         | 5837–6425  | `#home`                                                           |
| Game Screen                         | 6426–6533  | `#game`                                                           |
| Tournament Screen                   | 6534–6797  | `#tournament`                                                     |
| Online Multiplayer Screen           | 6798–7060  | `#online` (con left drawer, center, right drawer)                 |
| Game Mode Modal (host/join)         | 7061–7304  | `#ov-mode`                                                        |
| Friend Request Popup                | 7305–7314  | `#ov-fr-request`                                                  |
| Friend Invite Popup                 | 7315–7322  | `#ov-fr-invite`                                                   |
| Overlay vari (pause, end, locker)   | 7323–7393  | `#ov-pause`, `#ov-end`, `#ov-locker`, ecc.                        |

---

### Sezione 3 — JavaScript principale (righe 7394–34961)
Contiene tutta la logica applicativa, suddivisibile in questi macro-blocchi:

| Macro-blocco JS                     | Riga circa | Contenuto                                                         |
|-------------------------------------|------------|-------------------------------------------------------------------|
| Tutorial System                     | 7394–7488  | `apriTutorial`, `chiudiTutorial`, `setupTutorialBtns`            |
| AI Bot Matchmaking (MMR)            | 7489–7594  | `_buildRankedPool`, `_mmPickBots`, `getAIBotsForMMR`              |
| Rank SVG System                     | 7595–7748  | `getRankSVG`, `rankBadgeHTML`                                     |
| Season Titles & Stats               | 7749–7933  | `generateSeasonTitles`, `grantSeasonTitles`, `_stShortRankName`   |
| Season Rank Overlay (SRO)          | 7934–8080  | `_sroTier`, `_sroQueue`, `_sroShowNext`, `_sroClose`              |
| Season Manager                      | 8081–8460  | `_seasonMomentoZero`, `_showSeasonEndPopup`, `checkSeasonReset`   |
| Data Storage / Auth (localStorage) | 8461–9013  | `_loadDB`, `_saveDB`, `cloudLogin`, `cloudRegister`, `saveP`      |
| Rank & XP System                    | 8872–9014  | `getRank`, `addXP`, `addMMR`, `addModeWinLoss`, `unlockFeat`      |
| Audio System                        | 9071–9372  | `ac`, `tone`, `toggleMusic`, `nextTrack`, `_musicScheduleBar`     |
| End Micro-Transition                | 9083–9224  | `showEndMicroTransition`, `hideEndMicroTransition`                |
| Settings                            | 9225–9372  | `loadSettings`, `saveSettings`, `applySettings`, `settSwitchTab`  |
| Share End Screen                    | 9373–9467  | `shareEndScreen`                                                  |
| Card Animations                     | 9468–9542  | `_animateCardDraw`, `_animateCardPlay`, `_showUnoBurst`           |
| Notification Center                 | 9543–9651  | `_ncAdd`, `_ncGuessIcon`, `toggleNotifCenter`, `clearNotifications`|
| Replay Player                       | 9652–9759  | `openReplayPlayer`, `replayStep`, `replayTogglePlay`              |
| Reconnect System                    | 9760–9901  | `_rcSaveState`, `_rcAttemptReconnect`, `_rcShowOverlay`           |
| Spectator Mode                      | 9902–10028 | `spectatorJoin`, `_specOnData`, `spectatorLeave`                  |
| Music Player                        | 10029–10098| `toggleMusic`, `nextTrack`, `setMusicVol`, `toggleMusicPlayer`    |
| Particle Engine                     | 10099–10159| `rsCv`, `burst`, `burstDisc`, `bigWinBurst`, `animPX`, `screenShake`|
| UI Utility Functions                | 10160–10210| `notify`, `showMsg`, `showScr`, `showOv`, `el`, `setText`         |
| Tab/Screen Switching                | 10186–10276| `switchSplashTab`, `switchTourneyTab`, `renderPentathlonPanel`    |
| Profile Rendering                   | 10277–10555| `updateProfile`, `updateDiffBadge`, `updateHUD`, `renderSeasonPass`|
| Title System                        | 10595–10807| `renderTitles`, `selectTitle`, `makeTitleCard`                    |
| Login/Auth UI                       | 10808–11020| `setLoginMode`, `onPinInput`, `onLoginFieldChange`, `submitLogin` |
| NVDA Accessibility                  | 11021–11250| `showNvdaAskDialog`, `nvdaAnnounce`, `_nvdaGlobalKeyHandler`      |
| Locker / Cosmetics                  | 11251–11456| `openLocker`, `renderLockerTitles`, `buyCup`, `applyCardBackToGame`|
| Tournament Initialization           | 11507–11734| `openTournament`, `initTournament`, `renderBracket`, `playTourneyMatch`|
| Core UNO — Deck & Timer             | 11735–11976| `buildDeck`, `shuf`, `dealCard`, `startBlitz`, `startTurnTimer`   |
| Core UNO — Game Loop                | 12070–12313| `startGame`, `dealRound`, `advance`, `nextTurn`, `enablePlayer`   |
| Core UNO — Card Logic               | 12215–12590| `canPlay`, `doPlay`, `applyFX`, `checkWin`, `playerPlayCard`      |
| Core UNO — Player Actions           | 12314–12590| `playerPlayCard`, `afterPlayer`, `playerDraw`, `declareUno`       |
| Color Picker Modal                  | 12434–12624| `chooseColor` (gestione wild card e +4)                           |
| AI System                           | 12625–12995| `initAITracking`, `aiTurn`, `aiChoose`, `aiPickColor`             |
| AI Rendering                        | 12926–12995| `renderAIs`, `openBotProfile`                                     |
| Round End / End Screen              | 12996–13329| `endRound`, `showEndScreen`                                       |
| Game Navigation (End)               | 13330–13498| `endGameMenu`, `endGameNextRound`, `showMpLobbyAfterGame`         |
| Level/Rank Popups                   | 13414–13462| `showLU`, `showRU`                                                |
| Pause / Restart / Quit              | 13463–13496| `togglePause`, `restartRound`, `quitToMenu`                       |
| Card Rendering                      | 13497–13611| `mkCard`, `renderDiscard`, `renderHand`, `renderAll`              |
| Multiplayer P2P Connection          | 13622–14277| PeerJS wiring, `sendConn`, `broadcastConns`, FriendService        |
| Multiplayer — Lobby                 | 14618–14733| `lobbyReset`, `lobbySetState`, `lobbyRenderSlots`                 |
| Friends System                      | 14733–15165| `frInit`, `frSendRequest`, `frAcceptRequest`, `frRenderList`       |
| PeerJS Helpers                      | 15166–15244| `_getIceServers`, `_getPeerConfigs`, `_makePeerWithRetry`         |
| Multiplayer — 1v1                   | 15245–16205| `openMultiplayer`, `mpHostInit`, `mpJoin`, `mpOnData`, `mpSendState`|
| Multiplayer — 3P                    | 16254–16644| `mp3pHostInit`, `mp3pGuestJoin`, `mp3pOnData`                     |
| Multiplayer — 2v2                   | 16648–17447| `mp2v2HostInit`, `start2v2Game`, `mp2v2ApplyAction`               |
| Multiplayer — 3v3                   | 16254–16644| `mp3v3HostCreate`, `mp3v3StartGame`, `mp3v3ApplyAction`           |
| Mode Selection & ELO                | 17778–17845| `selectMode`, `eloMMRDelta`, `applyBotDifficulty`                 |
| Season Data                         | 17846–18161| `getSeasonData`, `checkSeasonReset`, `applySoftReset`             |
| Daily Login / Idle Credits          | 18177–18265| `checkIdleCredits`, `checkDailyLogin`, `claimDailyLogin`          |
| Challenges System                   | 18325–18453| `initWeeklyChallenge`, `updateChallengeProgress`, `renderChallengesPanel`|
| Match History                       | 18446–18453| `addMatchHistory`, `renderHistoryPanel`                           |
| Leaderboard                         | 20681–21400| `buildLeaderboard`, `buildLeaderboardForMode`, `renderLeaderboardTab`|
| God of UNO / Emotes                 | 21400–21500| `checkGodOfUno`, `toggleEmoteBar`, `sendEmote`                    |
| Unified Tournament (RL Bracket)     | 21513–22120| `launchUnifiedTournament`, `renderRLBracket`, `advanceUTRound`    |
| Extra Titles & Achievements          | 22073–22120| `checkExtraTitles`, `tryUnlockTitle`                              |
| Navigation & Profile Panel          | 22121–22260| `switchNav`, `updateProfilePanel`, `renderSeasonBanner`           |
| Queue System (Matchmaking)          | 22260–22430| `startGameWithQueue`, `cancelQueue`                               |
| Placement System                    | 22317–22429| `shouldShowPlacement`, `recordPlacementResult`, `showPlacementReveal`|
| Shop / Crate System                 | 22430–22530| `openShopItem`, `openCrateNow`, `activateDoubleXP`               |
| Title Checker (UCS, Rank, etc.)     | 22532–23226| `checkNewTitles`, `checkUCSRLCSTitles`, `checkRankProgTitles`     |
| Admin System                        | 22605–22670| `elevateToAdmin`, `adminApplyUI`                                  |
| Ultra Chips / Trust Score           | 22661–22680| `addUltraChips`, `getTrustScore`, `penalizeTrust`, `rewardTrust`  |
| Quick Chat                          | 23379–23432| `toggleQuickChat`, `sendQuickChat`, `_showQCIncoming`             |
| Mini-Game MMR                       | 23433–23574| `getMiniMMR`, `addMiniMMR`, `selectMiniPlaylist`                  |
| Mini-Game: Ruba Mazzetto             | 23828–24109| `startRubaGame`, `rubaRender`, `rubaPlayCard`, `rubaAITurn`       |
| Mini-Game: Scala 40                 | 24110–24715| `startScalaGame`, `scalaRender`, `scalaAITurn`, `scalaShowEnd`    |
| Mini-Game: Ruba Tournament          | 24740–24821| `startTournament32Ruba`, `renderTourneyRuba`                      |
| Mini-Game: Scala Tournament         | 24822–24971| `startTournament32Scala`, `renderTourneyScala`                    |
| Home Screen Logic                   | 24972–25090| `homeSelectMode`, `homeRenderPlayerCards`, `homeStartGame`        |
| Online Multi-Game Lobby             | 25198–25450| `olToggleDrawer`, `olStartGame`, `olShowFriendInvitePanel`        |
| Grand Prix Mode                     | 26021–26416| `gpInit`, `gpRenderModeCards`, `gpStartMatch`, `gpResolveMatch`   |
| Trophy Panel                        | 26369–26416| `switchTrophyTab`                                                  |
| Tournament Picker (Classic)         | 26510–26643| `tSelectMode`, `mglobOpen`, `mglobStart`                          |
| Online Ruba                         | 26776–26911| `startRubaGameOnline`, `applyRubaOnlineState`, `_rubaBroadcast`   |
| Online Scala                        | 26912–27075| `startScalaGameOnline`, `applyScalaOnlineState`, `_scalaBroadcast`|
| Mini-Game: BlackJack                | 27076–27728| `bjBuildDeck`, `startBJGame`, `bjHit`, `bjStand`, `bjResolve`    |
| Club System                         | 27729–28017| `getClub`, `initClubMissions`, `onClubWin`, `clubRenderDrawer`    |
| Avatar Editor                       | 28240–28426| `renderAvatarEditor`, `getAvatarStyle`, `applyAvatarEverywhere`   |
| Season Info & Reset                 | 28375–28626| `getSeasonInfo`, `softResetMMR`, `endSeason`, `renderSeasonPanel` |
| Event Cards System                  | 28626–28708| `getActiveEventCards`, `getActiveEventName`                       |
| Missions v51                        | 28709–28900| `ensureMissions`, `updateMissionProgress`, `renderChallengesPanelV51`|
| Battle Pass v51                     | 28900–29290| `addBattlePassXP`, `renderSeasonPassV51`                          |
| Avatar Ownership                    | 29290–29811| `avatarOwned` + ampio array di cosmetics                          |
| Scopa Mini-Game                     | 29921–30366| `startScopaGame`, `scopaRender`, `scopaAITurn`, `scopaEndRound`   |
| Poker Mini-Game                     | 30368–30797| `startPokerGame`, `pokerDealHand`, `pokerAITurn`, `bjResolve`     |
| Burraco Mini-Game                   | 30802–31199| `startBurracoGame`, `burrRender`, `burrAITurn`, `burrEndRound`    |
| Millemiglia Mini-Game               | 31467–31773| `startMMGame`, `mmRender`, `mmAITurn`, `mmEndGame`                |
| Mini-feat Checkers                  | 31200–31466| `checkScopaFeats`, `checkBurracoFeats`, `checkPokerFeats`         |
| Classic Tournament & New MP         | 31775–32075| `openClassicTournament`, `renderClassicTournament`, `newMpHostInit`|
| Accessibility Patches               | 32075–32686| Focus trap, aria-disabled, aria labels per AI panels              |
| Invite Link System                  | 32486–32686| `_buildLink`, `_injectLinkBtn`, `_injectAllLinks`                 |
| safePatch System                    | 32687–32954| `safePatch` + global function patching                            |
| Pentathlon Button                   | 32955–32976| `renderPentathlonBtn`                                             |
| Bot Spawner System                  | 32977–33158| `ensureBotSystem`                                                 |
| Classic Tournament Controller       | 33159–33777| `tcSelectGame`, `tcRenderBracket`, `tcPlayMatch`, `tcCheckRoundEnd`|
| Bond/Affinity System                | 33777–34018| `bondTrack`, `getBondLevel`, `showBondPopup`, `renderBondsPanel`  |
| Custom Game Lobby                   | 34019–34182| `openCustomGameLobby`, `cgSetRule`, `cgStartGame`                 |
| Double Elimination Tournament       | 34183–34499| `launchDoubleElimTournament`, `dePlayMatch`, `deResolveMatch`     |
| Opponent Memory System              | 34500–34638| `_omTrackMove`, `_omGetProfile`                                   |
| Stats Panel                         | 34639–34788| `renderStatsPanel`, `_renderStatsMiniChart`                       |
| Push Notifications                  | 34789–34917| `_pushNotifEnabled`, `togglePushNotif`, `sendPushNotif`           |
| Init v52 Features                   | 34916–34961| `initV52Features` — boot finale                                   |

---

## Riepilogo Macro-Sezioni

| # | Macro-Sezione          | Righe (approx) | % del file |
|---|------------------------|----------------|------------|
| 1 | CSS / Stili            | 1–4885         | ~14%       |
| 2 | HTML Markup (DOM)      | 4886–7394      | ~7%        |
| 3 | Logica JavaScript      | 7394–34961     | ~79%       |

Il file è **79% JavaScript**, distribuito in ~35 sub-sistemi tutti accoppiati in un unico scope globale.
