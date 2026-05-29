# UNO Ultra v52 — Meccaniche e Funzioni (Censimento Completo)

## Metadati
- File analizzato: uno_ultra_v52 (1) (2).html
- Funzioni censite (occorrenze): 1048
- Nomi funzione unici: 1027
- Metodo: parsing statico di dichiarazioni function/arrow/function expression

## Legenda
- Type: function = function dichiarata; arrow = arrow function assegnata; expr = function expression assegnata
- Input: lista parametri dalla firma
- Output: "return presente" indica che nel blocco vicino alla definizione compaiono return espliciti

## Funzioni Ridefinite (patch/override)
- _uf: 4 occorrenze
- _patch: 3 occorrenze
- openTournament: 3 occorrenze
- startGame: 2 occorrenze
- showScr: 2 occorrenze
- setText: 2 occorrenze
- renderSeasonBanner: 2 occorrenze
- nvdaAnnounce: 2 occorrenze
- launchUnifiedTournament: 2 occorrenze
- getWeekStart: 2 occorrenze
- endRound: 2 occorrenze
- cb: 2 occorrenze
- attach: 2 occorrenze
- aiColFor: 2 occorrenze
- aggiungiTutorialBtn: 2 occorrenze
- startTournament: 2 occorrenze
- startUCS: 2 occorrenze

## Catalogo Funzioni

| # | Nome | Type | Riga | Input | Output | Firma |
|---|---|---|---:|---|---|---|
| 1 | aggiungiTutorialBtn | function | 5164 | game | return presente | function aggiungiTutorialBtn(game) { |
| 2 | startTournament | function | 5169 | type | return presente | function startTournament(type) { |
| 3 | launchMiniGame | function | 5178 | game, callback | return presente | function launchMiniGame(game, callback) { |
| 4 | openTournament | function | 5231 | type | return presente | function openTournament(type) { |
| 5 | startUCS | function | 5237 | (nessuno) | return presente | function startUCS() { if(_realFn) return _realFn('UCS'); _realFn = startUCS; joinTournamentQueue('UCS',90,8); _realFn = null; } |
| 6 | launchUnifiedTournament | function | 5238 | (nessuno) | return presente | function launchUnifiedTournament() { if(_realFn) return _realFn('EVENT'); _realFn = launchUnifiedTournament; joinTournamentQueue('EVENT',45,24); _realFn = null; } |
| 7 | endRound | function | 5245 | (nessuno) | return presente | function endRound() { |
| 8 | endPentathlon | function | 5256 | (nessuno) | return presente | function endPentathlon() { |
| 9 | showScr | function | 5267 | scr | return presente | function showScr(scr) { |
| 10 | startGame | function | 5286 | mode | return presente | function startGame(mode) { |
| 11 | startTournament | function | 5297 | type | return presente | function startTournament(type) { |
| 12 | openTournament | function | 5308 | type | return presente | function openTournament(type) { |
| 13 | openPentathlonModal | function | 5322 | (nessuno) | return presente | function openPentathlonModal() { |
| 14 | closePentathlonModal | function | 5325 | (nessuno) | return presente | function closePentathlonModal() { |
| 15 | confirmPentathlon | function | 5328 | (nessuno) | return presente | function confirmPentathlon() { |
| 16 | getTableTheme | function | 5335 | gameType | return presente | function getTableTheme(gameType) { |
| 17 | applyTableTheme | function | 5348 | gameType | return presente | function applyTableTheme(gameType) { |
| 18 | startUltraWatch | function | 5370 | finalTable, timerSec | return presente | function startUltraWatch(finalTable, timerSec) { |
| 19 | updateUltraWatchUI | function | 5389 | (nessuno) | return presente | function updateUltraWatchUI() { |
| 20 | placeUltraBet | function | 5401 | (nessuno) | return presente | function placeUltraBet() { |
| 21 | resolveUltraBet | function | 5409 | finalTable | return presente | function resolveUltraBet(finalTable) { |
| 22 | updateNemesi | function | 5427 | botName, defeated | return presente | function updateNemesi(botName, defeated) { |
| 23 | showNemesiWidget | function | 5438 | (nessuno) | return presente | function showNemesiWidget() { |
| 24 | hideNemesiWidget | function | 5445 | (nessuno) | return presente | function hideNemesiWidget() { |
| 25 | defeatNemesi | function | 5449 | (nessuno) | return presente | function defeatNemesi() { |
| 26 | startNewsFeed | function | 5467 | (nessuno) | return presente | function startNewsFeed() { |
| 27 | addNewsFeedItem | function | 5477 | item | return presente | function addNewsFeedItem(item) { |
| 28 | selectTableTheme | function | 5485 | mode | return presente | function selectTableTheme(mode) { |
| 29 | testTableContrast | function | 5492 | (nessuno) | return presente | function testTableContrast() { |
| 30 | startPentathlon | function | 5515 | (nessuno) | return presente | function startPentathlon() { |
| 31 | _updatePentathlonHUD | function | 5528 | (nessuno) | return presente | function _updatePentathlonHUD() { |
| 32 | playNextPentathlonGame | function | 5568 | (nessuno) | return presente | function playNextPentathlonGame() { |
| 33 | onPentathlonResult | function | 5582 | win, credits | return presente | function onPentathlonResult(win, credits) { |
| 34 | addCrossCredits | function | 5596 | amount | return presente | function addCrossCredits(amount) { |
| 35 | joinTournamentQueue | function | 5631 | type, durationSeconds, maxPlayers | return presente | function joinTournamentQueue(type, durationSeconds, maxPlayers) { |
| 36 | updateQueueUI | function | 5654 | (nessuno) | return presente | function updateQueueUI() { |
| 37 | cancelTournamentEntry | function | 5661 | (nessuno) | return presente | function cancelTournamentEntry() { |
| 38 | startAcceptPhase | function | 5671 | (nessuno) | return presente | function startAcceptPhase() { |
| 39 | acceptTournamentEntry | function | 5687 | (nessuno) | return presente | function acceptTournamentEntry() { |
| 40 | getTournamentName | function | 5698 | type | return presente | function getTournamentName(type) { |
| 41 | formatTime | function | 5707 | sec | return presente | function formatTime(sec) { |
| 42 | preLoadTournamentBots | function | 5713 | type | return presente | function preLoadTournamentBots(type) { |
| 43 | nvdaAnnounce | function | 5735 | msg, priority | return presente | function nvdaAnnounce(msg, priority){ |
| 44 | apriTutorial | function | 7438 | nomeGioco | return presente | function apriTutorial(nomeGioco) { |
| 45 | chiudiTutorial | function | 7452 | (nessuno) | return presente | function chiudiTutorial() { |
| 46 | aggiungiTutorialBtn | function | 7457 | nomeGioco, containerSelector | return presente | function aggiungiTutorialBtn(nomeGioco, containerSelector) { |
| 47 | setupTutorialBtns | function | 7470 | (nessuno) | return presente | function setupTutorialBtns() { |
| 48 | _buildRankedPool | function | 7496 | playerMMR | return presente | function _buildRankedPool(playerMMR) { |
| 49 | _mmPickBots | function | 7535 | playerMMR, count | return presente | function _mmPickBots(playerMMR, count) { |
| 50 | getAINamesForMMR | function | 7578 | mmr, count | return presente | function getAINamesForMMR(mmr, count) { |
| 51 | getAIBotsForMMR | function | 7582 | mmr, count | return presente | function getAIBotsForMMR(mmr, count) { |
| 52 | getLBFluctuation | function | 7587 | botName, baseMMR | return presente | function getLBFluctuation(botName, baseMMR){ |
| 53 | getRankSVG | function | 7599 | rankName, size=20 | return presente | function getRankSVG(rankName, size=20){ |
| 54 | svg | arrow | 7605 | content,extra='' | return presente | const svg=(content,extra='')=>`<svg width="${s}" height="${h}" viewBox="0 0 ${s} ${h}" aria-hidden="true" focusable="false" ${extra}>${content}</svg>`; |
| 55 | circle | arrow | 7606 | r,fill,stroke,sw=1.2 | return presente | const circle=(r,fill,stroke,sw=1.2)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`; |
| 56 | polygon | arrow | 7607 | pts,fill,stroke,sw=1 | return presente | const polygon=(pts,fill,stroke,sw=1)=>`<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`; |
| 57 | text | arrow | 7608 | t,y,fs,fill,fw=800 | return presente | const text=(t,y,fs,fill,fw=800)=>`<text x="${cx}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-weight="${fw}" fill="${fill}" font-family="Exo 2,sans-serif">${t}</text>`; |
| 58 | glow | arrow | 7609 | color,r=cx*.7 | return presente | const glow=(color,r=cx*.7)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.18"/>`; |
| 59 | rankBadgeHTML | function | 7737 | rank, svgSize=18 | return presente | function rankBadgeHTML(rank, svgSize=18){ |
| 60 | _stShortRankName | function | 7792 | mmr | return presente | function _stShortRankName(mmr){ |
| 61 | _stColorForRank | function | 7797 | mmr | return presente | function _stColorForRank(mmr){ |
| 62 | generateSeasonTitles | function | 7825 | seasonNum | return presente | function generateSeasonTitles(seasonNum){ |
| 63 | getSeasonTitles | function | 7885 | seasonNum | return presente | function getSeasonTitles(seasonNum){ |
| 64 | grantSeasonTitles | function | 7895 | peakMMR, seasonNum | return presente | function grantSeasonTitles(peakMMR, seasonNum){ |
| 65 | _sroTier | function | 7945 | titleObj | return presente | function _sroTier(titleObj){ |
| 66 | _sroQueue | function | 7962 | titleObjs, opts | return presente | function _sroQueue(titleObjs, opts){ |
| 67 | _sroShowNext | function | 7969 | (nessuno) | return presente | function _sroShowNext(){ |
| 68 | _sroStartParticles | function | 8032 | color | return presente | function _sroStartParticles(color){ |
| 69 | loop | function | 8037 | (nessuno) | return presente | function loop(){ |
| 70 | _sroStopParticles | function | 8048 | (nessuno) | return presente | function _sroStopParticles(){ |
| 71 | _sroClose | function | 8052 | (nessuno) | return presente | function _sroClose(){ |
| 72 | _sroEquip | function | 8058 | (nessuno) | return presente | function _sroEquip(){ |
| 73 | _sroClaim | function | 8070 | (nessuno) | return presente | function _sroClaim(){ |
| 74 | _sroNext | function | 8076 | (nessuno) | return presente | function _sroNext(){ |
| 75 | _seasonMomentoZero | function | 8086 | (nessuno) | return presente | function _seasonMomentoZero(){ |
| 76 | _showSeasonEndPopup | function | 8117 | onConfirm | return presente | function _showSeasonEndPopup(onConfirm){ |
| 77 | _cleanSeasonHistory | function | 8259 | (nessuno) | return presente | function _cleanSeasonHistory(){ |
| 78 | _sroCheckPending | function | 8274 | (nessuno) | return presente | function _sroCheckPending(){ |
| 79 | _loadDB | function | 8472 | (nessuno) | return presente | function _loadDB(){ |
| 80 | _saveDB | function | 8475 | db | return presente | function _saveDB(db){ |
| 81 | _hashPin | function | 8509 | u, pin | return presente | function _hashPin(u, pin){ return btoa(u+'::'+pin); } |
| 82 | ensureFields | function | 8512 | p | return presente | function ensureFields(p){ |
| 83 | _checkStorageUsage | function | 8632 | (nessuno) | return presente | function _checkStorageUsage(){ |
| 84 | saveP | function | 8652 | (nessuno) | return presente | function saveP(){ |
| 85 | updateCloudBadge | function | 8658 | (nessuno) | return presente | function updateCloudBadge(){ |
| 86 | _backupChecksum | function | 8677 | db | return presente | function _backupChecksum(db){ |
| 87 | exportSaveDataEnhanced | function | 8685 | (nessuno) | return presente | function exportSaveDataEnhanced(){ |
| 88 | _backupDownload | function | 8708 | json | return presente | function _backupDownload(json){ |
| 89 | _backupSaveMeta | function | 8720 | (nessuno) | return presente | function _backupSaveMeta(){ |
| 90 | _backupUpdateUI | function | 8730 | (nessuno) | return presente | function _backupUpdateUI(){ |
| 91 | importSaveDataEnhanced | function | 8748 | (nessuno) | return presente | function importSaveDataEnhanced(){ |
| 92 | _importFromPaste | function | 8774 | (nessuno) | return presente | function _importFromPaste(){ |
| 93 | exportSaveData | function | 8829 | (nessuno) | return presente | function exportSaveData(){ |
| 94 | importSaveData | function | 8848 | (nessuno) | return presente | function importSaveData(){ |
| 95 | getRank | function | 8872 | mmr | return presente | function getRank(mmr){let r=RANKS[0];for(const x of RANKS){if(mmr>=x.min)r=x;else break;}return r;} |
| 96 | getRankPct | function | 8873 | mmr | return presente | function getRankPct(mmr){const r=getRank(mmr);if(r.next===99999)return 1;return(mmr-r.min)/(r.next-r.min);} |
| 97 | getNextRank | function | 8874 | mmr | return presente | function getNextRank(mmr){const r=getRank(mmr);const i=RANKS.indexOf(r);return i<RANKS.length-1?RANKS[i+1]:null;} |
| 98 | xpForLv | function | 8875 | l | return presente | function xpForLv(l){return Math.floor(100*Math.pow(1.35,l));} |
| 99 | getPlaylistKey | function | 8877 | nAI | return presente | function getPlaylistKey(nAI){return nAI===1?'p1':nAI===2?'p3':'p4';} |
| 100 | getModePlaylistKey | function | 8879 | nAI | return presente | function getModePlaylistKey(nAI){ |
| 101 | getPlaylistMMR | function | 8887 | nAI | return presente | function getPlaylistMMR(nAI){return (P.mmrP//{})[getModePlaylistKey(nAI)]//200;} |
| 102 | getDiffFromMMR | function | 8888 | mmr, botMMR | return presente | function getDiffFromMMR(mmr, botMMR){ |
| 103 | getDiffLabel | function | 8902 | diff | return presente | function getDiffLabel(diff){ |
| 104 | getDiffColor | function | 8905 | diff | return presente | function getDiffColor(diff){ |
| 105 | addXP | function | 8909 | amt | return presente | function addXP(amt){ |
| 106 | addMMRvsOpponent | function | 8918 | won, oppMMR | return presente | function addMMRvsOpponent(won, oppMMR){ |
| 107 | addTeamMMR | function | 8938 | won, mode /* '2v2'/'3v3' */, isCasual | return presente | function addTeamMMR(won, mode /* '2v2'/'3v3' */, isCasual){ |
| 108 | addMMR | function | 8958 | won,nAI | return presente | function addMMR(won,nAI){ |
| 109 | getWinsProgress | function | 9012 | rankName | return presente | function getWinsProgress(rankName){return Math.min(10,(P.winsAtRank//{})[rankName]//0);} |
| 110 | addModeWinLoss | function | 9015 | won | return presente | function addModeWinLoss(won){ |
| 111 | unlockFeat | function | 9037 | feat | return presente | function unlockFeat(feat){ |
| 112 | addCredits | function | 9050 | n | return presente | function addCredits(n){P.credits+=n;saveP();} |
| 113 | getTourneyFeatForMMR | function | 9054 | mmr | return presente | function getTourneyFeatForMMR(mmr){ |
| 114 | getTourneyTitleForMMR | function | 9059 | mmr | return presente | function getTourneyTitleForMMR(mmr){ |
| 115 | getTourneyFeat | function | 9064 | rank | return presente | function getTourneyFeat(rank){return getTourneyFeatForMMR(rank.min);} |
| 116 | getTourneyTitleId | function | 9065 | rank | return presente | function getTourneyTitleId(rank){const t=getTourneyTitleForMMR(rank.min);return t?t.id:null;} |
| 117 | ac | function | 9071 | (nessuno) | return presente | function ac(){if(!AC)try{AC=new(window.AudioContext//window.webkitAudioContext)();}catch(e){}return AC;} |
| 118 | showEndMicroTransition | function | 9083 | youWon, onDone, durationMs | return presente | function showEndMicroTransition(youWon, onDone, durationMs) { |
| 119 | hideEndMicroTransition | function | 9119 | (nessuno) | return presente | function hideEndMicroTransition() { |
| 120 | showTransitionScreen | function | 9154 | statusMsg, onDone, durationMs | return presente | function showTransitionScreen(statusMsg, onDone, durationMs) { |
| 121 | hideTransitionScreen | function | 9197 | (nessuno) | return presente | function hideTransitionScreen() { |
| 122 | _unlockAC | function | 9207 | (nessuno) | side-effect prevalente | function _unlockAC(){ |
| 123 | loadSettings | function | 9225 | (nessuno) | return presente | function loadSettings() { |
| 124 | saveSettings | function | 9245 | (nessuno) | return presente | function saveSettings() { |
| 125 | applySettings | function | 9260 | (nessuno) | return presente | function applySettings() { |
| 126 | settSwitchTab | function | 9278 | tab, btn | return presente | function settSwitchTab(tab, btn){ |
| 127 | openSettings | function | 9286 | (nessuno) | return presente | function openSettings() { |
| 128 | applyTheme | function | 9298 | t | return presente | function applyTheme(t){ |
| 129 | _getMusicAC | function | 9327 | (nessuno) | return presente | function _getMusicAC(){ |
| 130 | _musicNote | function | 9332 | freq, dur, when, vol, wave='sine' | return presente | function _musicNote(freq, dur, when, vol, wave='sine'){ |
| 131 | _musicScheduleBar | function | 9344 | (nessuno) | return presente | function _musicScheduleBar(){ |
| 132 | shareEndScreen | function | 9373 | (nessuno) | return presente | function shareEndScreen(){ |
| 133 | _animateCardDraw | function | 9468 | cardEl | return presente | function _animateCardDraw(cardEl){ |
| 134 | _animateCardPlay | function | 9476 | cardEl | return presente | function _animateCardPlay(cardEl){ |
| 135 | _animateCardDanger | function | 9484 | (nessuno) | return presente | function _animateCardDanger(){ |
| 136 | _showUnoBurst | function | 9494 | (nessuno) | return presente | function _showUnoBurst(){ |
| 137 | _checkDangerState | function | 9504 | (nessuno) | return presente | function _checkDangerState(){ |
| 138 | _ncAdd | function | 9543 | text, icon | return presente | function _ncAdd(text, icon){ |
| 139 | _ncGuessIcon | function | 9552 | t | return presente | function _ncGuessIcon(t){ |
| 140 | _ncUpdateBadge | function | 9567 | (nessuno) | return presente | function _ncUpdateBadge(){ |
| 141 | _ncTimeAgo | function | 9578 | ts | return presente | function _ncTimeAgo(ts){ |
| 142 | _ncRender | function | 9586 | (nessuno) | return presente | function _ncRender(){ |
| 143 | toggleNotifCenter | function | 9603 | (nessuno) | return presente | function toggleNotifCenter(){ |
| 144 | clearNotifications | function | 9621 | (nessuno) | return presente | function clearNotifications(){ |
| 145 | openReplayPlayer | function | 9652 | logIndex | return presente | function openReplayPlayer(logIndex){ |
| 146 | closeReplayPlayer | function | 9666 | (nessuno) | return presente | function closeReplayPlayer(){ |
| 147 | _rpRender | function | 9671 | (nessuno) | return presente | function _rpRender(){ |
| 148 | replayStep | function | 9726 | n | return presente | function replayStep(n){ |
| 149 | replayGoTo | function | 9732 | n | return presente | function replayGoTo(n){ |
| 150 | replayTogglePlay | function | 9738 | (nessuno) | return presente | function replayTogglePlay(){ |
| 151 | _rcSaveState | function | 9760 | (nessuno) | return presente | function _rcSaveState(){ |
| 152 | _rcAttemptReconnect | function | 9775 | (nessuno) | return presente | function _rcAttemptReconnect(){ |
| 153 | _rcShowOverlay | function | 9792 | seconds | return presente | function _rcShowOverlay(seconds){ |
| 154 | _rcHideOverlay | function | 9810 | (nessuno) | return presente | function _rcHideOverlay(){ |
| 155 | mpAbortReconnect | function | 9817 | (nessuno) | return presente | function mpAbortReconnect(){ |
| 156 | spectatorJoin | function | 9902 | code | return presente | function spectatorJoin(code){ |
| 157 | _specOnData | function | 9931 | data | return presente | function _specOnData(data){ |
| 158 | spectatorLeave | function | 9953 | (nessuno) | return presente | function spectatorLeave(){ |
| 159 | _afterPeerOpen | arrow | 9974 | (nessuno) | return presente | const _afterPeerOpen=()=>{ |
| 160 | toggleMusic | function | 10029 | (nessuno) | return presente | function toggleMusic(){ |
| 161 | nextTrack | function | 10049 | (nessuno) | return presente | function nextTrack(){ |
| 162 | setMusicVol | function | 10058 | v | return presente | function setMusicVol(v){ |
| 163 | toggleMusicPlayer | function | 10062 | (nessuno) | return presente | function toggleMusicPlayer(){ |
| 164 | tone | function | 10067 | f,d,t='triangle',v=.13,dl=0 | return presente | function tone(f,d,t='triangle',v=.13,dl=0){ |
| 165 | rsCv | function | 10099 | (nessuno) | return presente | function rsCv(){cv.width=window.innerWidth;cv.height=window.innerHeight;} |
| 166 | burst | function | 10123 | x,y,col,n=28,o={} | return presente | function burst(x,y,col,n=28,o={}){ |
| 167 | burstDisc | function | 10131 | col | return presente | function burstDisc(col){ |
| 168 | bigWinBurst | function | 10136 | (nessuno) | return presente | function bigWinBurst(){ |
| 169 | animPX | function | 10142 | (nessuno) | return presente | function animPX(){ |
| 170 | screenShake | function | 10150 | (nessuno) | return presente | function screenShake(){ |
| 171 | notify | function | 10160 | t | return presente | function notify(t){ |
| 172 | showMsg | function | 10164 | t,d=1400 | return presente | function showMsg(t,d=1400){ |
| 173 | showScr | function | 10168 | id | return presente | function showScr(id){ |
| 174 | showOv | function | 10180 | id | return presente | function showOv(id){document.getElementById(id).classList.add('on');} |
| 175 | hideOv | function | 10181 | id | return presente | function hideOv(id){document.getElementById(id).classList.remove('on');} |
| 176 | el | function | 10182 | id | return presente | function el(id){return document.getElementById(id);} |
| 177 | setText | function | 10183 | id,v | return presente | function setText(id,v){const e=el(id);if(e)e.textContent=v;} |
| 178 | setStyle | function | 10184 | id,p,v | return presente | function setStyle(id,p,v){const e=el(id);if(e)e.style[p]=v;} |
| 179 | switchSplashTab | function | 10186 | id,btn | return presente | function switchSplashTab(id,btn){ |
| 180 | _legacySwitchTab | function | 10191 | id,btn | return presente | function _legacySwitchTab(id,btn){ |
| 181 | switchTourneyTab | function | 10199 | id,btn | return presente | function switchTourneyTab(id,btn){ |
| 182 | renderPentathlonPanel | function | 10211 | (nessuno) | return presente | function renderPentathlonPanel(){ |
| 183 | _trackMiniGame | function | 10276 | mode,won,extraStats | return presente | function _trackMiniGame(mode,won,extraStats){if(!P)return;const k='_mg_'+mode;if(!P[k])P[k]={games:0,wins:0,streak:0,maxStreak:0,maxScore:0};P[k].games++;if(won){P[k].wins++;P[k].streak=(P[k].streak//0)+1;P[k].maxStreak=Math.max(P[k].maxStreak//0,P[k].streak);}else{P[k].streak=0;}if(extraStats){if(extraStats.score!==undefined&&extraStats.score>(P[k].maxScore//0))P[k].maxScore=extraStats.score;}} |
| 184 | renderMiniStats | function | 10277 | (nessuno) | return presente | function renderMiniStats(){const wrap=document.getElementById('mini-stats-panel');if(!wrap//!P)return;const modes=[{key:'scopa',icon:'🧹',label:'Scopa',wK:'scopaS.wins'},{key:'poker',icon:'♠️',label:'Poker',wK:'_mg_poker.wins'},{key:'burraco',icon:'🃏',label:'Burraco',wK:'_mg_burraco.wins'},{key:'millemiglia',icon:'🚗',label:'MM',wK:'_mg_millemiglia.wins'},{key:'bj',icon:'🂡',label:'Blackjack',wK:'bjWins'},{key:'ruba',icon:'🃏',label:'Ruba',wK:'rubaWins'},{key:'scala',icon:'🎴',label:'Scala 40',wK:'scalaWins'}];const gv=(o,p)=>p.split('.').reduce((x,k)=>x?x[k]:undefined,o)//0;wrap.innerHTML=modes.map(m=>{const s=P['_mg_'+m.key]//{};const wins=gv(P,m.wK);const games=s.games//wins//0;const wr=games>0?Math.round(wins/games*100):0;const mmr=(P.mmrP//{})['p_'+m.key]//(m.key==='bj'?(P.mmrP//{}).p_bj1//200:200);return`<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05)"><span style="font-size:18px;width:26px;text-align:center">${m.icon}</span><div style="flex:1"><div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.85)">${m.label}</div><div style="font-size:10px;color:rgba(255,255,255,.35)">${games}G · ${wins}V · ${wr}%</div></div><div style="text-align:right"><div style="font-size:13px;font-weight:900;color:var(--teal)">${mmr}</div><div style="font-size:10px;color:rgba(255,255,255,.3)">🔥${s.streak//0} Max${s.maxStreak//0}</div></div></div>`;}).join('');} |
| 185 | renderMMRChart | function | 10278 | (nessuno) | return presente | function renderMMRChart(){ |
| 186 | toX | arrow | 10297 | i | side-effect prevalente | const toX=(i)=>Math.round(i/(vals.length-1)*(W-8)+4); |
| 187 | toY | arrow | 10298 | v | side-effect prevalente | const toY=(v)=>Math.round(H-4-(v-minV)/range*(H-12)); |
| 188 | updateProfile | function | 10327 | (nessuno) | side-effect prevalente | function updateProfile(){ |
| 189 | updateDiffBadge | function | 10467 | (nessuno) | return presente | function updateDiffBadge(){ |
| 190 | onPlaylistChange | function | 10496 | (nessuno) | return presente | function onPlaylistChange(){ |
| 191 | selectPlaylist | function | 10506 | nAI | return presente | function selectPlaylist(nAI){ |
| 192 | updateHUD | function | 10512 | (nessuno) | return presente | function updateHUD(){ |
| 193 | renderSeasonPass | function | 10552 | (nessuno) | return presente | function renderSeasonPass(){ |
| 194 | renderTitles | function | 10595 | (nessuno) | return presente | function renderTitles(){ |
| 195 | curS | arrow | 10668 | ( | return presente | const curS = (()=>{ try{ const d=JSON.parse(localStorage.getItem('uno-ultra-season-v1')//'{}'); return d.season//1; }catch(e){return 1;} })(); |
| 196 | _getTitleProgress | function | 10685 | t | return presente | function _getTitleProgress(t){ |
| 197 | makeTitleCard | function | 10739 | t | return presente | function makeTitleCard(t){ |
| 198 | selectTitle | function | 10799 | id | return presente | function selectTitle(id){ |
| 199 | setLoginMode | function | 10808 | mode | return presente | function setLoginMode(mode){ |
| 200 | onPinInput | function | 10821 | val | return presente | function onPinInput(val){ |
| 201 | onLoginFieldChange | function | 10838 | (nessuno) | return presente | function onLoginFieldChange(){ |
| 202 | loginKeydown | function | 10869 | e | return presente | function loginKeydown(e){ |
| 203 | setLoginStatus | function | 10875 | type, msg | return presente | function setLoginStatus(type, msg){ |
| 204 | _rlLoad | function | 10898 | (nessuno) | return presente | function _rlLoad(){ |
| 205 | _rlSave | function | 10902 | obj | return presente | function _rlSave(obj){ |
| 206 | _checkLoginRateLimit | function | 10905 | (nessuno) | return presente | function _checkLoginRateLimit(){ |
| 207 | _recordLoginFailure | function | 10914 | (nessuno) | return presente | function _recordLoginFailure(){ |
| 208 | _recordLoginSuccess | function | 10923 | (nessuno) | return presente | function _recordLoginSuccess(){ |
| 209 | showNvdaAskDialog | function | 11021 | (nessuno) | return presente | function showNvdaAskDialog(){ |
| 210 | nvdaAskChoice | function | 11031 | wantsNvda | return presente | function nvdaAskChoice(wantsNvda){ |
| 211 | nvdaConfirm | function | 11048 | confirmed | return presente | function nvdaConfirm(confirmed){ |
| 212 | _nvdaShowActivatedFlash | function | 11065 | cb | return presente | function _nvdaShowActivatedFlash(cb){ |
| 213 | _proceedAfterNvdaChoice | function | 11095 | (nessuno) | return presente | function _proceedAfterNvdaChoice(){ |
| 214 | _activateNvdaSupport | function | 11103 | (nessuno) | return presente | function _activateNvdaSupport(){ |
| 215 | nvdaAnnounce | function | 11126 | text, priority | return presente | function nvdaAnnounce(text, priority){ |
| 216 | _nvdaGlobalKeyHandler | function | 11137 | e | return presente | function _nvdaGlobalKeyHandler(e){ |
| 217 | _nvdaObserveGameState | function | 11146 | (nessuno) | return presente | function _nvdaObserveGameState(){ |
| 218 | nvdaCardLabel | function | 11171 | card | return presente | function nvdaCardLabel(card){ |
| 219 | showLogoutConfirm | function | 11182 | (nessuno) | return presente | function showLogoutConfirm(){ |
| 220 | toggleColorblind | function | 11229 | (nessuno) | return presente | function toggleColorblind(){ |
| 221 | applyColorblind | function | 11240 | on | return presente | function applyColorblind(on){ |
| 222 | syncColorblindUI | function | 11243 | (nessuno) | return presente | function syncColorblindUI(){ |
| 223 | openLocker | function | 11251 | (nessuno) | return presente | function openLocker(){ |
| 224 | openLockerFromGame | function | 11259 | (nessuno) | return presente | function openLockerFromGame(){ |
| 225 | applyCardBackToGame | function | 11337 | (nessuno) | return presente | function applyCardBackToGame(){ |
| 226 | closeLocker | function | 11348 | (nessuno) | return presente | function closeLocker(){ |
| 227 | renderLockerTitles | function | 11356 | (nessuno) | return presente | function renderLockerTitles(){ |
| 228 | renderLockerProgress | function | 11373 | (nessuno) | return presente | function renderLockerProgress(){ |
| 229 | renderLockerBorders | function | 11392 | (nessuno) | return presente | function renderLockerBorders(){ |
| 230 | renderLockerCardbacks | function | 11406 | (nessuno) | return presente | function renderLockerCardbacks(){ |
| 231 | renderLockerEffects | function | 11420 | (nessuno) | return presente | function renderLockerEffects(){ |
| 232 | renderCups | function | 11436 | (nessuno) | return presente | function renderCups(){ |
| 233 | buyCup | function | 11457 | id | return presente | function buyCup(id){ |
| 234 | getTourneyTierKey | function | 11491 | mmr | return presente | function getTourneyTierKey(mmr){ |
| 235 | getTourneyAINames | function | 11501 | mmr | return presente | function getTourneyAINames(mmr){ |
| 236 | openTournament | function | 11507 | (nessuno) | return presente | function openTournament(){ |
| 237 | renderTourneyTitlesList | function | 11541 | (nessuno) | return presente | function renderTourneyTitlesList(){ |
| 238 | initTournament | function | 11572 | (nessuno) | return presente | function initTournament(){ |
| 239 | renderBracket | function | 11599 | (nessuno) | return presente | function renderBracket(){ |
| 240 | mkMatchEl | function | 11674 | match,players | return presente | function mkMatchEl(match,players){ |
| 241 | playTourneyMatch | function | 11692 | match | return presente | function playTourneyMatch(match){ |
| 242 | resolveTourneyMatch | function | 11717 | match,winnerIdx | return presente | function resolveTourneyMatch(match,winnerIdx){ |
| 243 | buildDeck | function | 11735 | (nessuno) | return presente | function buildDeck(){ |
| 244 | shuf | function | 11745 | a | return presente | function shuf(a){ |
| 245 | dealCard | function | 11764 | (nessuno) | return presente | function dealCard(){ |
| 246 | topDisc | function | 11780 | (nessuno) | return presente | function topDisc(){return G.discard[G.discard.length-1];} |
| 247 | curCol | function | 11781 | (nessuno) | return presente | function curCol(){const t=topDisc();return t._cc//t.col;} |
| 248 | startBlitz | function | 11800 | (nessuno) | return presente | function startBlitz(){ |
| 249 | stopBlitz | function | 11808 | (nessuno) | return presente | function stopBlitz(){clearInterval(blitzIv);blitzIv=null;} |
| 250 | startSessionTimer | function | 11814 | (nessuno) | return presente | function startSessionTimer(){ |
| 251 | stopSessionTimer | function | 11831 | (nessuno) | return presente | function stopSessionTimer(){ |
| 252 | hideSessionTimer | function | 11835 | (nessuno) | return presente | function hideSessionTimer(){ |
| 253 | _updSessionTimer | function | 11841 | s | return presente | function _updSessionTimer(s){ |
| 254 | _onSessionExpire | function | 11853 | (nessuno) | return presente | function _onSessionExpire(){ |
| 255 | updBlitz | function | 11862 | s | return presente | function updBlitz(s){ |
| 256 | startTurnTimer | function | 11877 | (nessuno) | return presente | function startTurnTimer(){ |
| 257 | stopTurnTimer | function | 11891 | (nessuno) | return presente | function stopTurnTimer(){ |
| 258 | updTurnTimer | function | 11897 | s | return presente | function updTurnTimer(s){ |
| 259 | hideTurnTimer | function | 11912 | (nessuno) | return presente | function hideTurnTimer(){ |
| 260 | applyForcePlayGlow | function | 11918 | (nessuno) | return presente | function applyForcePlayGlow(){ |
| 261 | clearForcePlayGlow | function | 11926 | (nessuno) | return presente | function clearForcePlayGlow(){ |
| 262 | trackStall | function | 11932 | (nessuno) | return presente | function trackStall(){ |
| 263 | autoTimeout | function | 11946 | (nessuno) | return presente | function autoTimeout(){ |
| 264 | aiColFor | function | 11977 | p | return presente | function aiColFor(p){ |
| 265 | triggerSuddenDeath | function | 11984 | (nessuno) | return presente | function triggerSuddenDeath(){ |
| 266 | hideSuddenDeath | function | 12041 | (nessuno) | return presente | function hideSuddenDeath(){ |
| 267 | checkOverload | function | 12048 | pidx | return presente | function checkOverload(pidx){ |
| 268 | startGame | function | 12070 | (nessuno) | return presente | function startGame(){ |
| 269 | dealRound | function | 12095 | (nessuno) | return presente | function dealRound(){ |
| 270 | advance | function | 12137 | s=1 | return presente | function advance(s=1){const n=G.players.length;G.current=((G.current+G.direction*s)%n+n)%n;} |
| 271 | nextTurn | function | 12139 | (nessuno) | return presente | function nextTurn(){ |
| 272 | enablePlayer | function | 12175 | (nessuno) | return presente | function enablePlayer(){ |
| 273 | disablePlayer | function | 12196 | (nessuno) | return presente | function disablePlayer(){ |
| 274 | startTimer | function | 12204 | (nessuno) | return presente | function startTimer(){ |
| 275 | stopTimer | function | 12209 | (nessuno) | return presente | function stopTimer(){ |
| 276 | updTimer | function | 12212 | s | return presente | function updTimer(s){updTurnTimer(s);} |
| 277 | canPlay | function | 12215 | card,cc | return presente | function canPlay(card,cc){ |
| 278 | playable | function | 12243 | pidx | return presente | function playable(pidx){const cc=curCol();return G.players[pidx].hand.map((c,i)=>({c,i})).filter(({c})=>canPlay(c,cc));} |
| 279 | doPlay | function | 12246 | pidx,ci,cc=null | return presente | function doPlay(pidx,ci,cc=null){ |
| 280 | applyFX | function | 12268 | card,pidx,cc | return presente | function applyFX(card,pidx,cc){ |
| 281 | checkWin | function | 12281 | pidx | return presente | function checkWin(pidx){ |
| 282 | playerPlayCard | function | 12314 | ci | return presente | function playerPlayCard(ci){ |
| 283 | afterPlayer | function | 12333 | (nessuno) | return presente | function afterPlayer(){ |
| 284 | playerDraw | function | 12357 | auto=false | return presente | function playerDraw(auto=false){ |
| 285 | declareUno | function | 12408 | (nessuno) | return presente | function declareUno(){ |
| 286 | sortHand | function | 12423 | (nessuno) | return presente | function sortHand(){ |
| 287 | chooseColor | function | 12434 | col | side-effect prevalente | function chooseColor(col){ |
| 288 | getBotTitlePool | function | 12590 | mmr | return presente | function getBotTitlePool(mmr){ |
| 289 | seedHash | function | 12600 | str | return presente | function seedHash(str){ |
| 290 | initAITracking | function | 12625 | (nessuno) | return presente | function initAITracking(){ |
| 291 | recordColorPlay | function | 12631 | pidx,col | return presente | function recordColorPlay(pidx,col){ |
| 292 | colorOpponentLacks | function | 12638 | idx, memory | return presente | function colorOpponentLacks(idx, memory) { |
| 293 | aiTurn | function | 12648 | (nessuno) | return presente | function aiTurn(){ |
| 294 | aiChoose | function | 12688 | plays,idx | return presente | function aiChoose(plays,idx){ |
| 295 | botShouldSayUNO | function | 12850 | botMMR | return presente | function botShouldSayUNO(botMMR) { |
| 296 | botSeenSpecials | function | 12857 | G, idx | return presente | function botSeenSpecials(G, idx) { |
| 297 | aiPickColor | function | 12867 | p,idx | return presente | function aiPickColor(p,idx){ |
| 298 | aiColFor | function | 12884 | p | return presente | function aiColFor(p){const cnt={r:0,b:0,g:0,y:0};p.hand.forEach(c=>{if(c.col&&c.col!=='w')cnt[c.col]++;});return Object.keys(cnt).reduce((a,b)=>cnt[a]>cnt[b]?a:b,'r');} |
| 299 | aiCol | function | 12885 | p | return presente | function aiCol(p){return aiColFor(p);} |
| 300 | _bh | function | 12891 | s | return presente | function _bh(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i);return Math.abs(h);} |
| 301 | openBotProfile | function | 12892 | panel | return presente | function openBotProfile(panel){ |
| 302 | attach | arrow | 12911 | (nessuno) | return presente | const attach=()=>{ |
| 303 | renderAIs | function | 12926 | (nessuno) | return presente | function renderAIs(){ |
| 304 | endRound | function | 12996 | winIdx | return presente | function endRound(winIdx){ |
| 305 | showEndScreen | function | 13116 | youWon, gameOver, mmrR, xpG | return presente | function showEndScreen(youWon, gameOver, mmrR, xpG){ |
| 306 | _bh2 | function | 13180 | s | return presente | function _bh2(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i);return Math.abs(h);} |
| 307 | endGame | function | 13264 | (nessuno) | return presente | function endGame(){ showEndScreen(undefined, true, {d:_lastMMRDelta}, undefined); } |
| 308 | endGameNextRound | function | 13266 | (nessuno) | return presente | function endGameNextRound(){ |
| 309 | endGameNewMatch | function | 13281 | (nessuno) | return presente | function endGameNewMatch(){ |
| 310 | endGameMenu | function | 13330 | (nessuno) | side-effect prevalente | function endGameMenu(){ |
| 311 | showMpLobbyAfterGame | function | 13358 | (nessuno) | side-effect prevalente | function showMpLobbyAfterGame(){ |
| 312 | nextQueue | function | 13399 | (nessuno) | side-effect prevalente | function nextQueue(){ |
| 313 | showLU | function | 13414 | lv | side-effect prevalente | function showLU(lv){ |
| 314 | showRU | function | 13432 | rk | return presente | function showRU(rk){ |
| 315 | togglePause | function | 13463 | (nessuno) | return presente | function togglePause(){ |
| 316 | restartRound | function | 13470 | (nessuno) | return presente | function restartRound(){sfx.click();hideOv('ov-pause');paused=false;dealRound();} |
| 317 | quitToMenu | function | 13471 | (nessuno) | return presente | function quitToMenu(){ |
| 318 | mkCard | function | 13497 | card,ci,clickable | return presente | function mkCard(card,ci,clickable){ |
| 319 | renderDiscard | function | 13544 | (nessuno) | return presente | function renderDiscard(){ |
| 320 | renderHand | function | 13574 | (nessuno) | return presente | function renderHand(){ |
| 321 | renderAll | function | 13603 | (nessuno) | return presente | function renderAll(){ |
| 322 | renderAllSync | function | 13612 | (nessuno) | return presente | function renderAllSync(){ renderDiscard(); renderAIs(); renderHand(); } // versione sync per casi critici |
| 323 | shakeEl | function | 13614 | e | return presente | function shakeEl(e){if(!e)return;e.classList.remove('shaking');void e.offsetWidth;e.classList.add('shaking');setTimeout(()=>e.classList.remove('shaking'),400);} |
| 324 | setLoadStatus | function | 13622 | txt, sub | return presente | function setLoadStatus(txt, sub){ |
| 325 | sendConn | function | 13734 | conn, type, payload = {} | return presente | function sendConn(conn, type, payload = {}) { |
| 326 | broadcastConns | function | 13749 | conns, type, payload = {} | return presente | function broadcastConns(conns, type, payload = {}) { |
| 327 | MpTimerManager | arrow | 13760 | ( | return presente | const MpTimerManager = (() => { |
| 328 | addTimeout | function | 13764 | label, fn, ms | return presente | function addTimeout(label, fn, ms) { |
| 329 | cancelTimeout | function | 13771 | label | return presente | function cancelTimeout(label) { |
| 330 | addInterval | function | 13775 | label, fn, ms | return presente | function addInterval(label, fn, ms) { |
| 331 | cancelInterval | function | 13782 | label | return presente | function cancelInterval(label) { |
| 332 | cancelAll | function | 13787 | (nessuno) | return presente | function cancelAll() { |
| 333 | hasTimer | function | 13795 | label | return presente | function hasTimer(label) { return _timers.has(label); } |
| 334 | _createEmitter | function | 13804 | (nessuno) | return presente | function _createEmitter() { |
| 335 | GameCore | arrow | 13823 | ( | return presente | const GameCore = (() => { |
| 336 | validateState | function | 13826 | state | return presente | function validateState(state) { |
| 337 | cloneState | function | 13834 | state | return presente | function cloneState(state) { |
| 338 | buildPlayerView | function | 13841 | fullState, playerIdx | return presente | function buildPlayerView(fullState, playerIdx) { |
| 339 | applyAction | function | 13855 | state, action | return presente | function applyAction(state, action) { |
| 340 | FriendService | arrow | 13880 | ( | return presente | const FriendService = (() => { |
| 341 | _getName | function | 13888 | friendCode | return presente | function _getName(friendCode) { |
| 342 | _ensureFriends | function | 13892 | (nessuno) | return presente | function _ensureFriends() { |
| 343 | _ariaAnnounce | function | 13905 | message | return presente | function _ariaAnnounce(message) { |
| 344 | handleIncomingConn | function | 13920 | conn | return presente | function handleIncomingConn(conn) { |
| 345 | _onFriendRequest | function | 13970 | conn, data | return presente | function _onFriendRequest(conn, data) { |
| 346 | _onFriendAccept | function | 13986 | data | return presente | function _onFriendAccept(data) { |
| 347 | _onFriendInvite | function | 13995 | data | return presente | function _onFriendInvite(data) { |
| 348 | _onFriendPong | function | 14012 | data | return presente | function _onFriendPong(data) { |
| 349 | init | function | 14018 | (nessuno) | return presente | function init() { |
| 350 | destroy | function | 14044 | (nessuno) | return presente | function destroy() { |
| 351 | sendRequest | function | 14050 | codeRaw | return presente | function sendRequest(codeRaw) { |
| 352 | acceptRequest | function | 14084 | (nessuno) | return presente | function acceptRequest() { |
| 353 | declineRequest | function | 14099 | (nessuno) | return presente | function declineRequest() { |
| 354 | addFriend | function | 14110 | name, code | return presente | function addFriend(name, code) { |
| 355 | removeFriend | function | 14120 | code | return presente | function removeFriend(code) { |
| 356 | setOnline | function | 14129 | code, online | return presente | function setOnline(code, online) { |
| 357 | pingAll | function | 14140 | (nessuno) | return presente | function pingAll() { |
| 358 | pingFriend | function | 14146 | friendCode | return presente | function pingFriend(friendCode) { |
| 359 | sendInvite | function | 14173 | friendCode, roomCode, mode | return presente | function sendInvite(friendCode, roomCode, mode) { |
| 360 | acceptInboundRequest | function | 14209 | req | return presente | function acceptInboundRequest(req) { |
| 361 | declineInboundRequest | function | 14228 | req | return presente | function declineInboundRequest(req) { |
| 362 | ConnectionManager | arrow | 14267 | ( | return presente | const ConnectionManager = (() => { |
| 363 | getState | function | 14276 | (nessuno) | return presente | function getState() { return _state; } |
| 364 | _setState | function | 14278 | newState | return presente | function _setState(newState) { |
| 365 | _destroyExisting | function | 14285 | (nessuno) | return presente | function _destroyExisting() { |
| 366 | _makePeer | function | 14291 | idOverride | return presente | function _makePeer(idOverride) { |
| 367 | hostRoom | function | 14308 | (nessuno) | return presente | function hostRoom() { |
| 368 | hostRoomForInvite | function | 14361 | friendCode | return presente | function hostRoomForInvite(friendCode) { |
| 369 | joinRoom | function | 14438 | code | return presente | function joinRoom(code) { |
| 370 | _joinInner | function | 14448 | code | return presente | function _joinInner(code) { |
| 371 | beginTransition | function | 14556 | (nessuno) | return presente | function beginTransition() { |
| 372 | disconnect | function | 14571 | (nessuno) | return presente | function disconnect() { |
| 373 | lobbyReset | function | 14618 | (nessuno) | return presente | function lobbyReset(){ |
| 374 | lobbySetState | function | 14626 | s | return presente | function lobbySetState(s){ |
| 375 | lobbySetPlayer | function | 14632 | slot, data | return presente | function lobbySetPlayer(slot, data){ |
| 376 | lobbyRemovePlayer | function | 14639 | slot | return presente | function lobbyRemovePlayer(slot){ |
| 377 | _lobbyStopPing | function | 14644 | (nessuno) | return presente | function _lobbyStopPing(){ |
| 378 | lobbyStartPing | function | 14649 | (nessuno) | return presente | function lobbyStartPing(){ |
| 379 | lobbyReceivePong | function | 14658 | data | return presente | function lobbyReceivePong(data){ |
| 380 | lobbyUpdatePingBadge | function | 14664 | id, rtt | return presente | function lobbyUpdatePingBadge(id, rtt){ |
| 381 | lobbyRenderSlots | function | 14671 | (nessuno) | return presente | function lobbyRenderSlots(){ |
| 382 | ensureFriends | function | 14717 | (nessuno) | return presente | function ensureFriends(){ |
| 383 | frInit | function | 14733 | (nessuno) | return presente | function frInit(){ |
| 384 | frHandleIncomingConn | function | 14741 | conn | return presente | function frHandleIncomingConn(conn){ |
| 385 | frCopyMyCode | function | 14746 | (nessuno) | return presente | function frCopyMyCode(){ |
| 386 | frSendRequest | function | 14758 | (nessuno) | return presente | function frSendRequest(){ |
| 387 | frReceiveRequest | function | 14767 | conn, data | return presente | function frReceiveRequest(conn, data){ FriendService.handleIncomingConn(conn); } |
| 388 | frAcceptRequest | function | 14769 | (nessuno) | return presente | function frAcceptRequest(){ |
| 389 | frDeclineRequest | function | 14773 | (nessuno) | return presente | function frDeclineRequest(){ |
| 390 | frReceiveAccept | function | 14779 | data | return presente | function frReceiveAccept(data){ |
| 391 | frAddFriend | function | 14785 | name, code | return presente | function frAddFriend(name, code){ |
| 392 | frRemoveFriend | function | 14791 | code | return presente | function frRemoveFriend(code){ |
| 393 | frInviteFriend | function | 14797 | friendCode | return presente | function frInviteFriend(friendCode){ |
| 394 | _frCreateHostAndInvite | function | 14803 | friendCode | return presente | function _frCreateHostAndInvite(friendCode){ |
| 395 | _mpRegisterHostConn | function | 14809 | (nessuno) | return presente | function _mpRegisterHostConn(){ |
| 396 | _frDoSendInvite | function | 14849 | friendCode, roomCode | return presente | function _frDoSendInvite(friendCode, roomCode){ |
| 397 | _frFriendName | function | 14853 | friendCode | return presente | function _frFriendName(friendCode){ |
| 398 | frReceiveInvite | function | 14860 | data | return presente | function frReceiveInvite(data){ |
| 399 | frAcceptInvite | function | 14870 | (nessuno) | return presente | function frAcceptInvite(){ |
| 400 | frDeclineInvite | function | 14927 | (nessuno) | return presente | function frDeclineInvite(){ |
| 401 | frPingAllFriends | function | 14934 | (nessuno) | return presente | function frPingAllFriends(){ |
| 402 | frPingFriend | function | 14939 | friendCode | return presente | function frPingFriend(friendCode){ |
| 403 | frReceivePong | function | 14944 | data | return presente | function frReceivePong(data){ |
| 404 | frSetFriendOnline | function | 14949 | code, online | return presente | function frSetFriendOnline(code, online){ |
| 405 | frRenderList | function | 14954 | (nessuno) | return presente | function frRenderList(){ |
| 406 | _frRenderDrawer | function | 14993 | (nessuno) | return presente | function _frRenderDrawer(){ |
| 407 | frAcceptInboundRequest | function | 15070 | req | return presente | function frAcceptInboundRequest(req){ |
| 408 | frDeclineInboundRequest | function | 15075 | req | return presente | function frDeclineInboundRequest(req){ |
| 409 | frTimeAgo | function | 15079 | ts | return presente | function frTimeAgo(ts){ |
| 410 | escHtml | function | 15087 | str | return presente | function escHtml(str){ |
| 411 | _tryFrInit | function | 15104 | attempt | return presente | function _tryFrInit(attempt){ |
| 412 | _getIceServers | function | 15166 | (nessuno) | return presente | function _getIceServers(){ |
| 413 | _getPeerConfigs | function | 15193 | idOverride | return presente | function _getPeerConfigs(idOverride){ |
| 414 | _makePeerWithRetry | function | 15204 | onSuccess, onFail, idOverride, attempts | return presente | function _makePeerWithRetry(onSuccess, onFail, idOverride, attempts){ |
| 415 | genRoomCode | function | 15239 | (nessuno) | return presente | function genRoomCode(){ |
| 416 | openMultiplayer | function | 15245 | (nessuno) | return presente | function openMultiplayer(){ |
| 417 | switchMpTab | function | 15298 | id,btn | return presente | function switchMpTab(id,btn){ |
| 418 | mp3pSwitchTab | function | 15322 | tab,btn | return presente | function mp3pSwitchTab(tab,btn){ |
| 419 | mp3pHostInit | function | 15332 | (nessuno) | return presente | function mp3pHostInit(){ |
| 420 | _mp3pTryHost | function | 15345 | (nessuno) | return presente | function _mp3pTryHost(){ |
| 421 | mp3pRegisterHostConn | function | 15356 | (nessuno) | return presente | function mp3pRegisterHostConn(){ |
| 422 | mp3pOnData | function | 15370 | data,conn | return presente | function mp3pOnData(data,conn){ |
| 423 | mp3pUpdateLobbyUI | function | 15378 | (nessuno) | return presente | function mp3pUpdateLobbyUI(){ |
| 424 | start3pGame | function | 15389 | (nessuno) | return presente | function start3pGame(){ |
| 425 | mp3pSerializeState | function | 15399 | pov | return presente | function mp3pSerializeState(pov){ |
| 426 | mp3pSendStateToAll | function | 15403 | (nessuno) | return presente | function mp3pSendStateToAll(){ |
| 427 | mp3pApplyGuestAction | function | 15408 | action,incomingToken,playerIdx | return presente | function mp3pApplyGuestAction(action,incomingToken,playerIdx){ |
| 428 | checkEndRound3p | function | 15418 | pidx | return presente | function checkEndRound3p(pidx){ |
| 429 | mp3pRenderOpponents | function | 15432 | (nessuno) | return presente | function mp3pRenderOpponents(){ |
| 430 | mp3pJoin | function | 15439 | (nessuno) | return presente | function mp3pJoin(){ const raw=el('mp-3p-join-input')?.value//''; const code=raw.trim().toLowerCase(); if(code.length<4){ notify('Inserisci un codice valido'); return; } sfx.click(); mp3pGuestJoin(code); } |
| 431 | mp3pGuestJoin | function | 15441 | roomCode | return presente | function mp3pGuestJoin(roomCode){ |
| 432 | _mp3pTryJoin | function | 15449 | (nessuno) | return presente | function _mp3pTryJoin(){ |
| 433 | mp3pGuestOnData | function | 15477 | data | return presente | function mp3pGuestOnData(data){ |
| 434 | mp3pGuestReceiveStart | function | 15489 | state,myIdx | return presente | function mp3pGuestReceiveStart(state,myIdx){ |
| 435 | mp3pGuestApplyState | function | 15499 | state | return presente | function mp3pGuestApplyState(state){ |
| 436 | mp3pCopyCode | function | 15518 | (nessuno) | return presente | function mp3pCopyCode(){ const code=el('mp-3p-host-code')?.textContent//''; if(!code//code==='...'){ notify('Codice non ancora pronto'); return; } navigator.clipboard?.writeText(code).then(()=>notify('Codice 3P copiato: '+code)); } |
| 437 | mpSetModeNoInit | function | 15520 | mode | return presente | function mpSetModeNoInit(mode){ |
| 438 | guestToggleReady | function | 15536 | (nessuno) | return presente | function guestToggleReady(){ |
| 439 | _guestStartPing | function | 15556 | (nessuno) | return presente | function _guestStartPing(){ |
| 440 | _guestResetReady | function | 15565 | (nessuno) | return presente | function _guestResetReady(){ |
| 441 | mpHostInit | function | 15576 | (nessuno) | return presente | function mpHostInit(){ |
| 442 | mpJoin | function | 15588 | (nessuno) | return presente | function mpJoin(){ |
| 443 | _mpJoinInner | function | 15598 | code | return presente | function _mpJoinInner(code){ |
| 444 | mpOnData | function | 15603 | data | return presente | function mpOnData(data){ |
| 445 | startMpGame | function | 15812 | (nessuno) | return presente | function startMpGame(){ |
| 446 | mpSerializeState | function | 15863 | pov | return presente | function mpSerializeState(pov){ |
| 447 | mpReceiveGameStart | function | 15886 | state,guestIdx | return presente | function mpReceiveGameStart(state,guestIdx){ |
| 448 | _mpShowDesyncWarning | function | 15924 | (nessuno) | return presente | function _mpShowDesyncWarning(){ |
| 449 | mpApplyState | function | 15951 | state | return presente | function mpApplyState(state){ |
| 450 | mpApplyGuestAction | function | 16035 | action, incomingToken | return presente | function mpApplyGuestAction(action, incomingToken){ |
| 451 | mpSendState | function | 16093 | (nessuno) | return presente | function mpSendState(){ |
| 452 | mpSendStateWithWinner | function | 16100 | winnerIdx | side-effect prevalente | function mpSendStateWithWinner(winnerIdx){ |
| 453 | mpGuestSendPlay | function | 16110 | ci,cc=null | side-effect prevalente | function mpGuestSendPlay(ci,cc=null){ |
| 454 | mpGuestSendDraw | function | 16127 | (nessuno) | side-effect prevalente | function mpGuestSendDraw(){ |
| 455 | mpHideBlitz | function | 16169 | (nessuno) | return presente | function mpHideBlitz(){ |
| 456 | mpSetMode | function | 16206 | mode, btn | return presente | function mpSetMode(mode, btn){ |
| 457 | notifyConnected | arrow | 16217 | newMode | return presente | const notifyConnected = (newMode) => { |
| 458 | showOnly | arrow | 16225 | which | return presente | const showOnly = (which) => { |
| 459 | _mp3v3HostCreate | function | 16254 | (nessuno) | return presente | function _mp3v3HostCreate(){ |
| 460 | mp3v3HostInit | function | 16273 | (nessuno) | return presente | function mp3v3HostInit(){ _mp3v3HostCreate(); } |
| 461 | mp3v3RegisterConn | function | 16275 | (nessuno) | return presente | function mp3v3RegisterConn(){ |
| 462 | mp3v3JoinByCode | function | 16308 | (nessuno) | return presente | function mp3v3JoinByCode(){ |
| 463 | mp3v3CopyCode | function | 16361 | (nessuno) | return presente | function mp3v3CopyCode(){ |
| 464 | mp3v3StartGame | function | 16367 | (nessuno) | return presente | function mp3v3StartGame(){ |
| 465 | mp3v3SerializeState | function | 16409 | pov | return presente | function mp3v3SerializeState(pov){ |
| 466 | mp3v3SendStateToAll | function | 16429 | (nessuno) | return presente | function mp3v3SendStateToAll(){ |
| 467 | mp3v3CheckWin | function | 16436 | playerIdx | return presente | function mp3v3CheckWin(playerIdx){ |
| 468 | mp3v3EndRound | function | 16447 | winnerIdx,winTeam | return presente | function mp3v3EndRound(winnerIdx,winTeam){ |
| 469 | mp3v3ApplyAction | function | 16473 | action,incomingToken,playerIdx | return presente | function mp3v3ApplyAction(action,incomingToken,playerIdx){ |
| 470 | mp3v3OnData | function | 16507 | data,conn | return presente | function mp3v3OnData(data,conn){ |
| 471 | mp3v3GuestReceiveStart | function | 16515 | state,myIdx | return presente | function mp3v3GuestReceiveStart(state,myIdx){ |
| 472 | mp3v3GuestApplyState | function | 16544 | state | return presente | function mp3v3GuestApplyState(state){ |
| 473 | mp3v3GuestOnData | function | 16582 | data | return presente | function mp3v3GuestOnData(data){ |
| 474 | mp3v3RenderAllOpponents | function | 16592 | (nessuno) | return presente | function mp3v3RenderAllOpponents(){ |
| 475 | mp3v3GuestSendAction | function | 16641 | action | return presente | function mp3v3GuestSendAction(action){ |
| 476 | mp3v3JoinExtended | function | 16645 | code | return presente | function mp3v3JoinExtended(code){ document.getElementById('mp-3v3-join-input').value=code.toUpperCase(); mp3v3JoinByCode(); } |
| 477 | mp3v3InviteTeammate | function | 16646 | (nessuno) | return presente | function mp3v3InviteTeammate(){ notify('👑 Invia il codice '+(document.getElementById('mp-3v3-code')?.textContent//'…')+' ai tuoi 5 compagni!'); } |
| 478 | mp2v2HostInit | function | 16648 | (nessuno) | return presente | function mp2v2HostInit(){ |
| 479 | mp2v2UpdateLobbyUI | function | 16730 | (nessuno) | return presente | function mp2v2UpdateLobbyUI(){ |
| 480 | mp2v2InviteTeammate | function | 16757 | (nessuno) | return presente | function mp2v2InviteTeammate(){ |
| 481 | _mp2v2InviteFriendAsTeammate | function | 16785 | friendCode, roomCode | return presente | function _mp2v2InviteFriendAsTeammate(friendCode, roomCode){ |
| 482 | mp2v2CopyCode | function | 16801 | (nessuno) | return presente | function mp2v2CopyCode(){ |
| 483 | mp2v2SwitchTab | function | 16808 | tab, btn | return presente | function mp2v2SwitchTab(tab, btn){ |
| 484 | mp2v2JoinByCode | function | 16829 | (nessuno) | return presente | function mp2v2JoinByCode(){ |
| 485 | mp2v2RenderOnlineFriends | function | 16843 | (nessuno) | return presente | function mp2v2RenderOnlineFriends(){ |
| 486 | mp2v2OnData | function | 16872 | data, conn | return presente | function mp2v2OnData(data, conn){ |
| 487 | start2v2Game | function | 16905 | (nessuno) | return presente | function start2v2Game(){ |
| 488 | mp2v2SerializeState | function | 16972 | pov | return presente | function mp2v2SerializeState(pov){ |
| 489 | mp2v2SendStateToAll | function | 17004 | (nessuno) | return presente | function mp2v2SendStateToAll(){ |
| 490 | mp2v2ApplyAction | function | 17014 | action, incomingToken, playerIdx | return presente | function mp2v2ApplyAction(action, incomingToken, playerIdx){ |
| 491 | mp2v2CheckWin | function | 17054 | playerIdx | return presente | function mp2v2CheckWin(playerIdx){ |
| 492 | mp2v2EndRound | function | 17071 | winnerIdx, winTeam | return presente | function mp2v2EndRound(winnerIdx, winTeam){ |
| 493 | mp2v2GuestReceiveStart | function | 17106 | state, myIdx | return presente | function mp2v2GuestReceiveStart(state, myIdx){ |
| 494 | mp2v2GuestApplyState | function | 17142 | state | return presente | function mp2v2GuestApplyState(state){ |
| 495 | _mp2v2InjectTeamBadge | function | 17192 | team, myIdx | return presente | function _mp2v2InjectTeamBadge(team, myIdx){ |
| 496 | mp2v2RenderAllOpponents | function | 17202 | (nessuno) | return presente | function mp2v2RenderAllOpponents(){ |
| 497 | _cardBg | function | 17288 | col | return presente | function _cardBg(col){ |
| 498 | _cardShortVal | function | 17299 | val | return presente | function _cardShortVal(val){ |
| 499 | mp2v2PlayerDisconnected | function | 17310 | playerIdx | return presente | function mp2v2PlayerDisconnected(playerIdx){ |
| 500 | mp2v2GuestJoin | function | 17328 | roomCode | return presente | function mp2v2GuestJoin(roomCode){ |
| 501 | _mp2v2TryJoin | function | 17336 | (nessuno) | return presente | function _mp2v2TryJoin(){ |
| 502 | mp2v2GuestOnData | function | 17369 | data | return presente | function mp2v2GuestOnData(data){ |
| 503 | mp2v2InviteB2 | function | 17448 | (nessuno) | return presente | function mp2v2InviteB2(){ |
| 504 | mpRestoreTimers | function | 17461 | (nessuno) | return presente | function mpRestoreTimers(){ |
| 505 | attach | arrow | 17469 | (nessuno) | return presente | const attach=()=>{ |
| 506 | mpRenderOpponentPanel | function | 17488 | (nessuno) | return presente | function mpRenderOpponentPanel(){ |
| 507 | mpUpdateOpponentPanel | function | 17538 | (nessuno) | return presente | function mpUpdateOpponentPanel(){ |
| 508 | _mpClearOpponentPanel | function | 17556 | (nessuno) | return presente | function _mpClearOpponentPanel(){ |
| 509 | mpInjectBadge | function | 17563 | (nessuno) | return presente | function mpInjectBadge(){ |
| 510 | mpClearPingInterval | function | 17583 | (nessuno) | return presente | function mpClearPingInterval(){ |
| 511 | mpPatchedPlayCard | function | 17590 | ci | return presente | function mpPatchedPlayCard(ci){ |
| 512 | mpChooseColor | function | 17616 | col | return presente | function mpChooseColor(col){ |
| 513 | mpPatchedDraw | function | 17634 | (nessuno) | return presente | function mpPatchedDraw(){ |
| 514 | mpDisconnected | function | 17644 | (nessuno) | return presente | function mpDisconnected(){ |
| 515 | mpDeclareForfeit | function | 17676 | (nessuno) | return presente | function mpDeclareForfeit(){ |
| 516 | mpError | function | 17710 | msg | return presente | function mpError(msg){ |
| 517 | mpCopyCode | function | 17722 | (nessuno) | return presente | function mpCopyCode(){ |
| 518 | mpCancel | function | 17738 | (nessuno) | return presente | function mpCancel(){ |
| 519 | buildAndShuffleDeck | function | 17749 | (nessuno) | return presente | function buildAndShuffleDeck(){G.deck=shuf(buildDeck());} |
| 520 | dealInitialHands | function | 17750 | (nessuno) | return presente | function dealInitialHands(){G.players.forEach(p=>{p.hand=[];for(let i=0;i<7;i++)p.hand.push(dealCard());});} |
| 521 | placeFirstDiscard | function | 17751 | (nessuno) | return presente | function placeFirstDiscard(){ |
| 522 | selectMode | function | 17778 | mode | return presente | function selectMode(mode){ |
| 523 | eloMMRDelta | function | 17791 | playerMMR, opponentMMR, won | return presente | function eloMMRDelta(playerMMR, opponentMMR, won){ |
| 524 | applyBotDifficulty | function | 17823 | diff, moveFn, context | return presente | function applyBotDifficulty(diff, moveFn, context) { |
| 525 | getSeasonData | function | 17846 | (nessuno) | return presente | function getSeasonData(){ |
| 526 | saveSeasonData | function | 17849 | d | return presente | function saveSeasonData(d){try{localStorage.setItem(SEASON_KEY,JSON.stringify(d))}catch(e){}} |
| 527 | getCurrentSeason | function | 17850 | (nessuno) | return presente | function getCurrentSeason(){ |
| 528 | checkSeasonReset | function | 17856 | (nessuno) | return presente | function checkSeasonReset(){ |
| 529 | _playRewardSound | function | 17897 | tier | return presente | function _playRewardSound(tier){ |
| 530 | note | function | 17900 | f,s,d,v,t | return presente | function note(f,s,d,v,t){const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type=t//'sine';o.frequency.value=f;g.gain.setValueAtTime(0,ctx.currentTime+s);g.gain.linearRampToValueAtTime(v,ctx.currentTime+s+.02);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+s+d);o.start(ctx.currentTime+s);o.stop(ctx.currentTime+s+d+.05);} |
| 531 | noise | function | 17901 | s,d,v | return presente | function noise(s,d,v){const b=ctx.createBuffer(1,ctx.sampleRate*d,ctx.sampleRate),ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=(Math.random()*2-1)*v;const sr=ctx.createBufferSource(),g=ctx.createGain(),fl=ctx.createBiquadFilter();fl.type='bandpass';fl.frequency.value=800;sr.buffer=b;sr.connect(fl);fl.connect(g);g.connect(ctx.destination);g.gain.setValueAtTime(v,ctx.currentTime+s);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+s+d);sr.start(ctx.currentTime+s);} |
| 532 | _patchSeasonData | function | 17911 | (nessuno) | return presente | function _patchSeasonData(){ |
| 533 | _hookSaveP | function | 17922 | (nessuno) | return presente | function _hookSaveP(){ |
| 534 | _unhookSaveP | function | 17934 | (nessuno) | return presente | function _unhookSaveP(){ |
| 535 | _manualReset | function | 17943 | (nessuno) | return presente | function _manualReset(){ |
| 536 | _doReset | function | 17979 | (nessuno) | return presente | function _doReset(){ |
| 537 | applySoftReset | function | 18038 | (nessuno) | return presente | function applySoftReset(){ |
| 538 | _applyBotSeasonReset | function | 18111 | newSeason | return presente | function _applyBotSeasonReset(newSeason){ |
| 539 | checkAndApplySoftReset | function | 18153 | (nessuno) | return presente | function checkAndApplySoftReset(){ |
| 540 | getSeasonTimeLeft | function | 18162 | (nessuno) | return presente | function getSeasonTimeLeft(){ |
| 541 | checkIdleCredits | function | 18177 | (nessuno) | return presente | function checkIdleCredits(){ |
| 542 | checkDailyLogin | function | 18207 | (nessuno) | return presente | function checkDailyLogin(){ |
| 543 | renderDailyLoginOverlay | function | 18243 | streak | return presente | function renderDailyLoginOverlay(streak){ |
| 544 | claimDailyLogin | function | 18266 | (nessuno) | return presente | function claimDailyLogin(){ |
| 545 | getWeekStart | function | 18324 | (nessuno) | return presente | function getWeekStart(){ const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-d.getDay());return d.toDateString(); } |
| 546 | initWeeklyChallenge | function | 18325 | (nessuno) | return presente | function initWeeklyChallenge(){ |
| 547 | updateWeeklyProgress | function | 18341 | stat,amount=1 | return presente | function updateWeeklyProgress(stat,amount=1){ |
| 548 | initChallenges | function | 18364 | (nessuno) | return presente | function initChallenges(){initWeeklyChallenge(); |
| 549 | updateChallengeProgress | function | 18381 | stat,amount=1 | return presente | function updateChallengeProgress(stat,amount=1){ |
| 550 | renderChallengesPanel | function | 18402 | (nessuno) | return presente | function renderChallengesPanel(){ |
| 551 | addMatchHistory | function | 18446 | won,mmrDelta,opponent,mode | return presente | function addMatchHistory(won,mmrDelta,opponent,mode){ |
| 552 | renderHistoryPanel | function | 18454 | (nessuno) | return presente | function renderHistoryPanel(){ |
| 553 | getPlayerLeaderboardPosition | function | 20681 | playerMMR | return presente | function getPlayerLeaderboardPosition(playerMMR) { |
| 554 | getMatchmakingPreview | function | 20693 | playerMMR | return presente | function getMatchmakingPreview(playerMMR) { |
| 555 | buildLeaderboard | function | 20706 | (nessuno) | return presente | function buildLeaderboard(){ |
| 556 | _saveBotDeltas | function | 20883 | (nessuno) | return presente | function _saveBotDeltas(){ |
| 557 | _getBotModeDelta | function | 20888 | botName, modeKey | return presente | function _getBotModeDelta(botName, modeKey){ |
| 558 | _setBotModeDelta | function | 20893 | botName, modeKey, delta | return presente | function _setBotModeDelta(botName, modeKey, delta){ |
| 559 | _checkBotDeltaReset | function | 20900 | (nessuno) | return presente | function _checkBotDeltaReset(){ |
| 560 | _applyBotDeltas | function | 20917 | (nessuno) | return presente | function _applyBotDeltas(){ /* delta gestiti per modalità in _duRawMMR */ } |
| 561 | _mutateBotMMR | function | 20923 | (nessuno) | return presente | function _mutateBotMMR(){ |
| 562 | _duIncrementMC | function | 20992 | triggerMode | return presente | function _duIncrementMC(triggerMode){ |
| 563 | _duHash | function | 21037 | str | return presente | function _duHash(str){ |
| 564 | _duRawMMR | function | 21046 | name, basemmr, mode, size | return presente | function _duRawMMR(name, basemmr, mode, size){ |
| 565 | _duGetPool | function | 21141 | (nessuno) | return presente | function _duGetPool(){ |
| 566 | _duBuildDomMap | function | 21152 | (nessuno) | return presente | function _duBuildDomMap(){ |
| 567 | buildLeaderboardForMode | function | 21193 | mode, size | return presente | function buildLeaderboardForMode(mode, size){ |
| 568 | lbSelectMode | function | 21275 | mode, btn | return presente | function lbSelectMode(mode, btn){ |
| 569 | lbSelectSize | function | 21283 | size, btn | return presente | function lbSelectSize(size, btn){ |
| 570 | renderLeaderboardTab | function | 21290 | (nessuno) | return presente | function renderLeaderboardTab(){ |
| 571 | renderRows | function | 21318 | from, to | return presente | function renderRows(from, to){ |
| 572 | botHash | function | 21333 | s | return presente | function botHash(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i);return Math.abs(h);} |
| 573 | updateLoadMore | function | 21364 | (nessuno) | return presente | function updateLoadMore(){ |
| 574 | checkGodOfUno | function | 21400 | (nessuno) | return presente | function checkGodOfUno(){ |
| 575 | toggleEmoteBar | function | 21427 | (nessuno) | return presente | function toggleEmoteBar(){ |
| 576 | sendEmote | function | 21432 | e | return presente | function sendEmote(e){ |
| 577 | getPlayerAura | function | 21458 | (nessuno) | return presente | function getPlayerAura(){ |
| 578 | getUT32Players | function | 21498 | (nessuno) | return presente | function getUT32Players(){ |
| 579 | launchUnifiedTournament | function | 21513 | type | return presente | function launchUnifiedTournament(type){ |
| 580 | switchToTournamentHub | function | 21547 | (nessuno) | return presente | function switchToTournamentHub(){ |
| 581 | switchToTournamentSelect | function | 21558 | (nessuno) | return presente | function switchToTournamentSelect(){ |
| 582 | abandonTournament | function | 21565 | (nessuno) | return presente | function abandonTournament(){ |
| 583 | renderRLBracket | function | 21572 | (nessuno) | return presente | function renderRLBracket(){ |
| 584 | mkRLSeed | function | 21654 | p, isWin, isLose, isCurrent | return presente | function mkRLSeed(p, isWin, isLose, isCurrent){ |
| 585 | renderTourneyActionBar | function | 21670 | (nessuno) | return presente | function renderTourneyActionBar(){ |
| 586 | startUTMatch | function | 21723 | opponent | return presente | function startUTMatch(opponent){ |
| 587 | resolveUTMatch | function | 21749 | humanWon | return presente | function resolveUTMatch(humanWon){ |
| 588 | recordUTMatchStats | function | 21770 | (nessuno) | return presente | function recordUTMatchStats(){ |
| 589 | advanceUTRound | function | 21786 | humanWon | return presente | function advanceUTRound(humanWon){ |
| 590 | simRemainingUT | function | 21829 | (nessuno) | return presente | function simRemainingUT(){ |
| 591 | simUTRound | function | 21849 | (nessuno) | return presente | function simUTRound(){ |
| 592 | renderTourneyStats | function | 21865 | (nessuno) | return presente | function renderTourneyStats(){ |
| 593 | onUTFinalVictory | function | 21914 | (nessuno) | return presente | function onUTFinalVictory(){ |
| 594 | showTitleUnlockOverlay | function | 21954 | titleObj | return presente | function showTitleUnlockOverlay(titleObj){ |
| 595 | tuoEquip | function | 21966 | (nessuno) | return presente | function tuoEquip(){ |
| 596 | tuoSkip | function | 21976 | (nessuno) | return presente | function tuoSkip(){ |
| 597 | launchTournament32 | function | 21984 | type | return presente | function launchTournament32(type){ |
| 598 | build32Bracket | function | 21993 | (nessuno) | return presente | function build32Bracket(){ |
| 599 | renderTournament32 | function | 22000 | cid | return presente | function renderTournament32(cid){} // no-op, replaced by RL bracket |
| 600 | startTournament32 | function | 22001 | (nessuno) | return presente | function startTournament32(){launchUnifiedTournament(T32_TYPE//'uno1v1');} |
| 601 | utTrackCard | function | 22005 | player, cardVal, cardColor | return presente | function utTrackCard(player, cardVal, cardColor){ |
| 602 | resolveTourney32Match | function | 22019 | humanWon | return presente | function resolveTourney32Match(humanWon){ |
| 603 | checkExtraTitles | function | 22073 | (nessuno) | return presente | function checkExtraTitles(){ |
| 604 | tryUnlockTitle | function | 22080 | feat | return presente | function tryUnlockTitle(feat){ |
| 605 | renderSeasonBanner | function | 22094 | (nessuno) | return presente | function renderSeasonBanner(){ |
| 606 | switchNav | function | 22121 | id, btn | return presente | function switchNav(id, btn){ |
| 607 | updateProfilePanel | function | 22146 | (nessuno) | return presente | function updateProfilePanel(){ |
| 608 | renderSeasonBanner | function | 22160 | (nessuno) | return presente | function renderSeasonBanner(){ |
| 609 | getStreakAura | function | 22175 | (nessuno) | return presente | function getStreakAura(){ |
| 610 | getStreakMMRBonus | function | 22182 | (nessuno) | return presente | function getStreakMMRBonus(){ |
| 611 | renderStreakBadge | function | 22190 | (nessuno) | return presente | function renderStreakBadge(){ |
| 612 | addMMRWithStreakBonus | expr | 22229 | won, nAI | return presente | const addMMRWithStreakBonus=function(won, nAI){ |
| 613 | startGameWithQueue | function | 22260 | (nessuno) | return presente | function startGameWithQueue(){ |
| 614 | cancelQueue | function | 22306 | (nessuno) | return presente | function cancelQueue(){ |
| 615 | getPlacementData | function | 22317 | (nessuno) | return presente | function getPlacementData(){ |
| 616 | savePlacementData | function | 22320 | d | return presente | function savePlacementData(d){try{localStorage.setItem(PLACEMENT_KEY,JSON.stringify(d))}catch(e){}} |
| 617 | shouldShowPlacement | function | 22322 | (nessuno) | return presente | function shouldShowPlacement(){ |
| 618 | recordPlacementResult | function | 22329 | won | return presente | function recordPlacementResult(won){ |
| 619 | showPlacementReveal | function | 22348 | results | return presente | function showPlacementReveal(results){ |
| 620 | hidePlacement | function | 22381 | (nessuno) | return presente | function hidePlacement(){ |
| 621 | openShopItem | function | 22430 | crateId | return presente | function openShopItem(crateId){ |
| 622 | openCrateNow | function | 22447 | (nessuno) | return presente | function openCrateNow(){ |
| 623 | activateDoubleXP | function | 22509 | (nessuno) | return presente | function activateDoubleXP(){ |
| 624 | isDoubleXPActive | function | 22514 | (nessuno) | return presente | function isDoubleXPActive(){ |
| 625 | consumeDoubleXP | function | 22517 | (nessuno) | return presente | function consumeDoubleXP(){ |
| 626 | renderDXPBadge | function | 22521 | (nessuno) | return presente | function renderDXPBadge(){ |
| 627 | checkNewTitles | function | 22532 | gameCtx | return presente | function checkNewTitles(gameCtx){ |
| 628 | elevateToAdmin | function | 22605 | username | return presente | function elevateToAdmin(username){ |
| 629 | addUltraChips | function | 22661 | n | return presente | function addUltraChips(n){if(!P)return;if(!P.ultraChips)P.ultraChips=0;P.ultraChips+=n;saveP();updateProfileExtra();if(n>0)notify(`💠 +${n} Ultra Chips!`);} |
| 630 | getUltraChips | function | 22662 | (nessuno) | return presente | function getUltraChips(){return P?.ultraChips//0;} |
| 631 | getTrustScore | function | 22667 | (nessuno) | return presente | function getTrustScore(){if(!P)return 100;if(!P.trustScore)P.trustScore=100;return P.trustScore;} |
| 632 | penalizeTrust | function | 22668 | reason | return presente | function penalizeTrust(reason){if(!P)return;if(!P.trustScore)P.trustScore=100;P.trustScore=Math.max(0,P.trustScore-15);saveP();updateTrustBadge();notify(`⚠️ Trust Score -15 (${reason})`);} |
| 633 | rewardTrust | function | 22669 | (nessuno) | return presente | function rewardTrust(){if(!P)return;if(!P.trustScore)P.trustScore=100;if(P.trustScore<100)P.trustScore=Math.min(100,P.trustScore+2);saveP();} |
| 634 | updateTrustBadge | function | 22670 | (nessuno) | return presente | function updateTrustBadge(){const score=getTrustScore();const b=el('trust-badge-profile');if(!b)return;if(score>=80){b.className='trust-badge trust-gold';b.textContent='🤝 Affidabile';}else if(score>=50){b.className='trust-badge trust-green';b.textContent='⚡ Neutrale';}else{b.className='trust-badge trust-red';b.textContent=`💀 Sanzionato (${score})`;}} |
| 635 | addCircuitPoints | function | 22677 | n | return presente | function addCircuitPoints(n){if(!P)return;if(!P.circuitPoints)P.circuitPoints=0;P.circuitPoints+=n;saveP();updateProfileExtra();} |
| 636 | addTrophy | function | 22678 | type | return presente | function addTrophy(type){if(!P)return;if(!P.trophies)P.trophies={gold:0,silver:0,bronze:0};P.trophies[type]=(P.trophies[type]//0)+1;saveP();updateProfileExtra();notify(`🏆 Trofeo ${type==='gold'?'Oro 🥇':type==='silver'?'Argento 🥈':'Bronzo 🥉'}!`);} |
| 637 | updateProfileExtra | function | 22679 | (nessuno) | return presente | function updateProfileExtra(){ |
| 638 | getAIThinkTime | function | 22691 | diff | return presente | function getAIThinkTime(diff){return {easy:1400,normal:950,hard:600,ultra:350,ucs:280}[diff]//950;} // FIX FREEZE #8: aumentati minimi per dare respiro al thread |
| 639 | getAIDiffLabel | function | 22692 | diff | return presente | function getAIDiffLabel(diff){return {easy:'IA: Amichevole',normal:'IA: Competitiva',hard:'IA: Lettura Mano',ultra:'IA: Brutale',ucs:'IA: Divina — Nessun errore'}[diff]//'IA';} |
| 640 | getAIDiffDot | function | 22693 | diff | return presente | function getAIDiffDot(diff){return {easy:'#CD7F32',normal:'#C0C0C0',hard:'#7EE4F8',ultra:'#FF4081',ucs:'#c084fc'}[diff]//'#C0C0C0';} |
| 641 | updateAIDiffHUD | function | 22694 | (nessuno) | return presente | function updateAIDiffHUD(){const diff=G?.diff//'normal';const label=el('ai-diff-label');const dot=el('ai-diff-dot');if(label)label.textContent=getAIDiffLabel(diff);if(dot)dot.style.background=getAIDiffDot(diff);} |
| 642 | aiChooseUCS | function | 22721 | plays,idx | return presente | function aiChooseUCS(plays,idx){let best=plays[0],bs=-9999;for(const p of plays){let s=0;const isDraw=p.c.val==='d2'//p.c.val==='w4';const isSpecial=p.c.val==='skip'//p.c.val==='rev';const isWild=p.c.col==='w';if(isDraw)s+=60;if(isSpecial)s+=30;if(isWild&&plays.filter(x=>x.c.col!=='w').length>0)s-=40;if(G.pendingDraw>0&&isDraw)s+=100;s+=(Math.random()-.5)*2;if(s>bs){bs=s;best=p;}}return best;} |
| 643 | aiPickColorSSL | function | 22724 | p,idx | return presente | function aiPickColorSSL(p,idx){const h=G.players[0].hand;const cnt={r:0,b:0,g:0,y:0};h.forEach(c=>{if(c.col&&c.col!=='w')cnt[c.col]++;});return Object.keys(cnt).reduce((a,b)=>cnt[a]<=cnt[b]?a:b,'r');} |
| 644 | logReplayMove | function | 22734 | playerName,card | return presente | function logReplayMove(playerName,card){if(!G//G.roundOver)return;const label=card?`${card.col//''} ${card.val}`:'pesca';_currentReplayLog.push({n:playerName,c:label});} |
| 645 | saveReplayLog | function | 22735 | won | return presente | function saveReplayLog(won){try{const logs=JSON.parse(localStorage.getItem(REPLAY_KEY)//'[]');logs.unshift({date:new Date().toLocaleString('it'),won,moves:_currentReplayLog.slice(0,60),opponent:G.players.find(p=>p.isAI)?.name//'AI',diff:G.diff});if(logs.length>10)logs.pop();localStorage.setItem(REPLAY_KEY,JSON.stringify(logs));_currentReplayLog=[];}catch(e){}} |
| 646 | renderReplayHistory | function | 22738 | (nessuno) | return presente | function renderReplayHistory(){ |
| 647 | openLab | function | 22758 | (nessuno) | return presente | function openLab(){sfx.click();updateLabPanel();showOv('ov-lab');} |
| 648 | updateLabPanel | function | 22759 | (nessuno) | return presente | function updateLabPanel(){ |
| 649 | checkUCSRLCSTitles | function | 22822 | (nessuno) | return presente | function checkUCSRLCSTitles(){ |
| 650 | checkUNOProgTitles | function | 22878 | (nessuno) | return presente | function checkUNOProgTitles(){ |
| 651 | checkScalaProgTitles | function | 22929 | (nessuno) | return presente | function checkScalaProgTitles(){ |
| 652 | checkRubaProgTitles | function | 22983 | (nessuno) | return presente | function checkRubaProgTitles(){ |
| 653 | checkBJProgTitles | function | 23035 | (nessuno) | return presente | function checkBJProgTitles(){ |
| 654 | checkRankProgTitles | function | 23071 | (nessuno) | return presente | function checkRankProgTitles(){ |
| 655 | checkClubProgTitles | function | 23103 | (nessuno) | return presente | function checkClubProgTitles(){ |
| 656 | getMinAcrossAllModes | function | 23157 | (nessuno) | return presente | function getMinAcrossAllModes(){ |
| 657 | getModesWon | function | 23163 | (nessuno) | return presente | function getModesWon(){ |
| 658 | checkMultiProgTitles | function | 23176 | (nessuno) | return presente | function checkMultiProgTitles(){ |
| 659 | checkAllProgressionTitles | function | 23209 | (nessuno) | return presente | function checkAllProgressionTitles(){ |
| 660 | renderUCSPanel | function | 23227 | (nessuno) | return presente | function renderUCSPanel(){ |
| 661 | startUCS | function | 23250 | (nessuno) | return presente | function startUCS(){ |
| 662 | resolveUCSResult | function | 23271 | won | return presente | function resolveUCSResult(won){ |
| 663 | renderUCSAccessCheck | function | 23291 | (nessuno) | return presente | function renderUCSAccessCheck(){ |
| 664 | adminApplyUI | function | 23361 | (nessuno) | return presente | function adminApplyUI(){ |
| 665 | toggleQuickChat | function | 23379 | (nessuno) | return presente | function toggleQuickChat(){ |
| 666 | sendQuickChat | function | 23386 | msg | return presente | function sendQuickChat(msg){ |
| 667 | _showQCIncoming | function | 23399 | name,msg,isSelf | return presente | function _showQCIncoming(name,msg,isSelf){ |
| 668 | _updateQuickChatVisibility | function | 23407 | (nessuno) | return presente | function _updateQuickChatVisibility(){ |
| 669 | dismissQuickChatBtn | function | 23422 | (nessuno) | return presente | function dismissQuickChatBtn(){ |
| 670 | getMiniMMR | function | 23433 | mode, nAI | return presente | function getMiniMMR(mode, nAI){ |
| 671 | addMiniMMR | function | 23453 | mode, won, nAI, overrideDelta | return presente | function addMiniMMR(mode, won, nAI, overrideDelta){ |
| 672 | _switchPlaylistGroups | function | 23549 | isMini, mode | return presente | function _switchPlaylistGroups(isMini, mode){ |
| 673 | selectMiniPlaylist | function | 23565 | mode | return presente | function selectMiniPlaylist(mode){ |
| 674 | _updateHeroBannerForMode | function | 23574 | mode | return presente | function _updateHeroBannerForMode(mode){ |
| 675 | checkMiniTitles | function | 23652 | (nessuno) | return presente | function checkMiniTitles(){ |
| 676 | openTournamentPicker | function | 23675 | (nessuno) | return presente | function openTournamentPicker(){ |
| 677 | closeTournamentPicker | function | 23680 | (nessuno) | return presente | function closeTournamentPicker(){ |
| 678 | buildDeck40 | function | 23695 | (nessuno) | return presente | function buildDeck40(){ |
| 679 | buildDeck52 | function | 23700 | (nessuno) | return presente | function buildDeck52(){ |
| 680 | buildDeck108 | function | 23709 | (nessuno) | return presente | function buildDeck108(){ |
| 681 | shuffleDeck | function | 23715 | d | return presente | function shuffleDeck(d){ |
| 682 | makeMgCard | function | 23719 | c,playable=false,selected=false,extra='' | return presente | function makeMgCard(c,playable=false,selected=false,extra=''){ |
| 683 | mgLog | function | 23739 | id,msg | return presente | function mgLog(id,msg){ |
| 684 | _miniDiffMMRMod | function | 23775 | diff, won | return presente | function _miniDiffMMRMod(diff, won) { |
| 685 | _miniAIThink | function | 23785 | cb | return presente | function _miniAIThink(cb) { |
| 686 | _miniBlunder | function | 23789 | (nessuno) | return presente | function _miniBlunder() { |
| 687 | renderMiniDiffSelector | function | 23794 | containerId, color | return presente | function renderMiniDiffSelector(containerId, color) { |
| 688 | setMiniDiff | function | 23814 | diff | return presente | function setMiniDiff(diff) { |
| 689 | hexToRgb | function | 23823 | hex | return presente | function hexToRgb(hex) { |
| 690 | startRubaGame | function | 23828 | tourneyCallback=null | return presente | function startRubaGame(tourneyCallback=null){ |
| 691 | rubaRender | function | 23859 | (nessuno) | return presente | function rubaRender(){ |
| 692 | rubaPlayCard | function | 23918 | idx | return presente | function rubaPlayCard(idx){ |
| 693 | rubaDrawCard | function | 23966 | (nessuno) | return presente | function rubaDrawCard(){ /* Non usato nelle regole ufficiali */ } |
| 694 | rubaCheckRedeal | function | 23968 | (nessuno) | return presente | function rubaCheckRedeal(){ |
| 695 | rubaAITurn | function | 23979 | (nessuno) | return presente | function rubaAITurn(){ |
| 696 | rubaCheckEnd | function | 24037 | (nessuno) | return presente | function rubaCheckEnd(){ |
| 697 | rubaShowEnd | function | 24048 | (nessuno) | return presente | function rubaShowEnd(){ |
| 698 | rubaBackToMenu | function | 24090 | (nessuno) | return presente | function rubaBackToMenu(){ |
| 699 | startScalaGame | function | 24110 | tourneyCallback=null | return presente | function startScalaGame(tourneyCallback=null){ |
| 700 | scalaHandPoints | function | 24145 | hand, player | return presente | function scalaHandPoints(hand, player){ |
| 701 | scalaComboPoints | function | 24154 | cards | return presente | function scalaComboPoints(cards){ |
| 702 | scalaIsValidScala | function | 24164 | cards | return presente | function scalaIsValidScala(cards){ |
| 703 | scalaIsValidTris | function | 24189 | cards | return presente | function scalaIsValidTris(cards){ |
| 704 | scalaIsValidCombo | function | 24201 | cards | return presente | function scalaIsValidCombo(cards){ |
| 705 | scalaRender | function | 24205 | (nessuno) | side-effect prevalente | function scalaRender(){ |
| 706 | scalaToggleSelect | function | 24347 | i | return presente | function scalaToggleSelect(i){ |
| 707 | scalaTalloneReshuffle | function | 24354 | (nessuno) | return presente | function scalaTalloneReshuffle(){ |
| 708 | scalaDraw | function | 24364 | src | return presente | function scalaDraw(src){ |
| 709 | scalaDiscardSelected | function | 24389 | (nessuno) | return presente | function scalaDiscardSelected(){ |
| 710 | scalaCanAttach | function | 24421 | card, combo | return presente | function scalaCanAttach(card, combo){ |
| 711 | scalaAddPendingCombo | function | 24443 | (nessuno) | return presente | function scalaAddPendingCombo(){ |
| 712 | scalaCancelPending | function | 24465 | (nessuno) | return presente | function scalaCancelPending(){ |
| 713 | scalaScendi | function | 24472 | (nessuno) | return presente | function scalaScendi(){ |
| 714 | scalaAddToCombo | function | 24500 | (nessuno) | return presente | function scalaAddToCombo(){ |
| 715 | scalaCheckWin | function | 24530 | (nessuno) | return presente | function scalaCheckWin(){ |
| 716 | scalaAITurn | function | 24542 | (nessuno) | return presente | function scalaAITurn(){ |
| 717 | scalaShowEnd | function | 24656 | (nessuno) | return presente | function scalaShowEnd(){ |
| 718 | scalaBackToMenu | function | 24701 | (nessuno) | return presente | function scalaBackToMenu(){ |
| 719 | mgEndRematch | function | 24716 | (nessuno) | return presente | function mgEndRematch(){ |
| 720 | mgEndMenu | function | 24721 | (nessuno) | return presente | function mgEndMenu(){ |
| 721 | startTournament32Ruba | function | 24740 | (nessuno) | return presente | function startTournament32Ruba(){ |
| 722 | renderTourneyRuba | function | 24757 | (nessuno) | return presente | function renderTourneyRuba(){ |
| 723 | startTourneyRubaMatch | function | 24773 | opponent | return presente | function startTourneyRubaMatch(opponent){ |
| 724 | resolveTourneyRubaMatch | function | 24780 | humanWon | return presente | function resolveTourneyRubaMatch(humanWon){ |
| 725 | startTournament32Scala | function | 24822 | (nessuno) | return presente | function startTournament32Scala(){ |
| 726 | renderTourneyScala | function | 24839 | (nessuno) | return presente | function renderTourneyScala(){ |
| 727 | startTourneyScalaMatch | function | 24855 | opponent | side-effect prevalente | function startTourneyScalaMatch(opponent){ |
| 728 | resolveTourneyScalaMatch | function | 24862 | humanWon | side-effect prevalente | function resolveTourneyScalaMatch(humanWon){ |
| 729 | homeSelectMode | function | 24972 | mode, btnEl | return presente | function homeSelectMode(mode, btnEl){ |
| 730 | homeRenderPlayerCards | function | 25030 | (nessuno) | return presente | function homeRenderPlayerCards(){ |
| 731 | homeSelectPlayerCount | function | 25073 | nAI | return presente | function homeSelectPlayerCount(nAI){ |
| 732 | homeUpdateRankStrip | function | 25087 | (nessuno) | return presente | function homeUpdateRankStrip(){ |
| 733 | homeStartGame | function | 25124 | (nessuno) | return presente | function homeStartGame(){ |
| 734 | homeRefresh | function | 25143 | (nessuno) | return presente | function homeRefresh(){ |
| 735 | olToggleDrawer | function | 25198 | (nessuno) | return presente | function olToggleDrawer(){ |
| 736 | olSelectCount | function | 25208 | mode, btn | return presente | function olSelectCount(mode, btn){ |
| 737 | olSelectPlaylist | function | 25217 | mode, btn | return presente | function olSelectPlaylist(mode, btn){ |
| 738 | _refreshTeamPlaylistBadges | function | 25225 | (nessuno) | return presente | function _refreshTeamPlaylistBadges(){ |
| 739 | olStartGame | function | 25236 | (nessuno) | return presente | function olStartGame(){ |
| 740 | olShowFriendInvitePanel | function | 25278 | (nessuno) | return presente | function olShowFriendInvitePanel(){ |
| 741 | olCopyInviteLink | function | 25308 | (nessuno) | return presente | function olCopyInviteLink(){ |
| 742 | olModalTab | function | 25322 | tab, btn | return presente | function olModalTab(tab, btn){ |
| 743 | olCloseModal | function | 25350 | (nessuno) | return presente | function olCloseModal(){ |
| 744 | olOpenJoinModal | function | 25362 | (nessuno) | return presente | function olOpenJoinModal(){ |
| 745 | mpOlSyncProfile | function | 25373 | (nessuno) | return presente | function mpOlSyncProfile(){ |
| 746 | st | arrow | 25375 | id,v | return presente | const st = (id,v) => { const e=document.getElementById(id); if(e) e.textContent=v; }; |
| 747 | olRenderFriends | function | 25404 | (nessuno) | return presente | function olRenderFriends(){ |
| 748 | mpOlRenderFriends | function | 25419 | (nessuno) | return presente | function mpOlRenderFriends(){ olRenderFriends(); } |
| 749 | olUpdateSlots | function | 25423 | (nessuno) | return presente | function olUpdateSlots(){ |
| 750 | mpToggleDrawer | function | 25446 | (nessuno) | side-effect prevalente | function mpToggleDrawer(){ olToggleDrawer(); } |
| 751 | mpOlNav | function | 25447 | mode, btn | side-effect prevalente | function mpOlNav(mode, btn){ olSelectCount(mode, btn); } |
| 752 | mpOlMode | function | 25448 | mode, btn | side-effect prevalente | function mpOlMode(mode, btn){ olSelectCount(mode, btn); } |
| 753 | mpOlPlaylist | function | 25450 | mode, btn | side-effect prevalente | function mpOlPlaylist(mode, btn){ olSelectPlaylist(mode, btn); } |
| 754 | gpInit | function | 26021 | (nessuno) | return presente | function gpInit() { |
| 755 | gpRenderModeCards | function | 26027 | (nessuno) | return presente | function gpRenderModeCards() { |
| 756 | _gpPickType | function | 26077 | typeId | return presente | function _gpPickType(typeId) { |
| 757 | _gpPickPlayers | function | 26087 | playerId | return presente | function _gpPickPlayers(playerId) { |
| 758 | _gpTryApplyCombo | function | 26093 | (nessuno) | return presente | function _gpTryApplyCombo() { |
| 759 | gpStartDivFromMMR | function | 26109 | modeId | return presente | function gpStartDivFromMMR(modeId) { |
| 760 | gpModeProgress | function | 26117 | modeId | return presente | function gpModeProgress(modeId) { |
| 761 | gpSelectMode | function | 26124 | modeId | return presente | function gpSelectMode(modeId) { |
| 762 | gpExitSeason | function | 26153 | (nessuno) | return presente | function gpExitSeason() { |
| 763 | gpRenderDivisions | function | 26165 | (nessuno) | return presente | function gpRenderDivisions() { |
| 764 | gpRenderPips | function | 26225 | div | return presente | function gpRenderPips(div) { |
| 765 | gpStartMatch | function | 26236 | (nessuno) | return presente | function gpStartMatch() { |
| 766 | onEnd | arrow | 26241 | humanWon | return presente | const onEnd = (humanWon) => { |
| 767 | gpResolveMatch | function | 26269 | humanWon | return presente | function gpResolveMatch(humanWon) { |
| 768 | countWins | arrow | 26274 | (nessuno) | side-effect prevalente | const countWins = () => GP.streak.filter(r => r === 'win').length; |
| 769 | switchTrophyTab | function | 26369 | tab, btn | side-effect prevalente | function switchTrophyTab(tab, btn) { |
| 770 | setText | function | 26417 | id, val | side-effect prevalente | function setText(id, val) { |
| 771 | tSelectMode | function | 26510 | mode, card | side-effect prevalente | function tSelectMode(mode, card) { |
| 772 | mglobSetCount | function | 26551 | n | return presente | function mglobSetCount(n) { |
| 773 | mglobOpen | function | 26576 | game, presetCount | return presente | function mglobOpen(game, presetCount) { |
| 774 | mglobClose | function | 26605 | (nessuno) | return presente | function mglobClose() { |
| 775 | mglobChoose | function | 26610 | choice | return presente | function mglobChoose(choice) { |
| 776 | mglobTab | function | 26630 | tab, btn | return presente | function mglobTab(tab, btn) { |
| 777 | mglobStart | function | 26640 | (nessuno) | return presente | function mglobStart() { |
| 778 | _mglobHostRoom | function | 26653 | (nessuno) | return presente | function _mglobHostRoom() { |
| 779 | _mglobHostLaunch | function | 26688 | (nessuno) | return presente | function _mglobHostLaunch() { |
| 780 | mglobJoin | function | 26698 | (nessuno) | return presente | function mglobJoin() { |
| 781 | _mglobOnGuestData | function | 26733 | d | return presente | function _mglobOnGuestData(d) { |
| 782 | _mglobOnHostData | function | 26740 | d | return presente | function _mglobOnHostData(d) { |
| 783 | _mglobDestroyPeer | function | 26745 | (nessuno) | return presente | function _mglobDestroyPeer() { |
| 784 | _mglobSetStatus | function | 26751 | panel, msg | return presente | function _mglobSetStatus(panel, msg) { |
| 785 | _mglobShowFriends | function | 26756 | code | return presente | function _mglobShowFriends(code) { |
| 786 | startRubaGameOnline | function | 26776 | role, conn, peer, guestName, nAI=1 | return presente | function startRubaGameOnline(role, conn, peer, guestName, nAI=1) { |
| 787 | receiveStartRubaOnline | function | 26810 | d | return presente | function receiveStartRubaOnline(d) { |
| 788 | _rubaSerializeForGuest | function | 26820 | (nessuno) | return presente | function _rubaSerializeForGuest() { |
| 789 | _rubaSerializeForGuestFull | function | 26833 | (nessuno) | return presente | function _rubaSerializeForGuestFull() { |
| 790 | applyRubaOnlineState | function | 26838 | state | return presente | function applyRubaOnlineState(state) { |
| 791 | _rubaGuestSendAction | function | 26860 | action | return presente | function _rubaGuestSendAction(action) { |
| 792 | handleRubaOnlineGuestAction | function | 26866 | d | return presente | function handleRubaOnlineGuestAction(d) { |
| 793 | _rubaBroadcast | function | 26877 | (nessuno) | return presente | function _rubaBroadcast() { |
| 794 | startScalaGameOnline | function | 26912 | role, conn, peer, guestName, nAI=1 | return presente | function startScalaGameOnline(role, conn, peer, guestName, nAI=1) { |
| 795 | receiveStartScalaOnline | function | 26943 | d | return presente | function receiveStartScalaOnline(d) { |
| 796 | _scalaSerializeForGuest | function | 26953 | (nessuno) | return presente | function _scalaSerializeForGuest() { |
| 797 | applyScalaOnlineState | function | 26970 | state | return presente | function applyScalaOnlineState(state) { |
| 798 | _scalaBroadcast | function | 26994 | (nessuno) | return presente | function _scalaBroadcast() { |
| 799 | _scalaGuestSendAction | function | 27000 | action | return presente | function _scalaGuestSendAction(action) { |
| 800 | handleScalaOnlineGuestAction | function | 27005 | d | return presente | function handleScalaOnlineGuestAction(d) { |
| 801 | _scalaOnlineHandleAITurns | function | 27015 | (nessuno) | return presente | function _scalaOnlineHandleAITurns() { |
| 802 | bjBuildDeck | function | 27076 | numDecks=2 | return presente | function bjBuildDeck(numDecks=2){ |
| 803 | bjShuffle | function | 27084 | d | return presente | function bjShuffle(d){for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;} |
| 804 | bjPop | function | 27085 | (nessuno) | return presente | function bjPop(){ if(!BJG.deck.length)BJG.deck=bjShuffle(bjBuildDeck(2)); return BJG.deck.pop(); } |
| 805 | bjCardVal | function | 27087 | r | return presente | function bjCardVal(r){ |
| 806 | bjHandScore | function | 27092 | hand | return presente | function bjHandScore(hand){ |
| 807 | bjIsBJ | function | 27098 | hand | return presente | function bjIsBJ(hand){ return hand.length===2&&bjHandScore(hand)===21; } |
| 808 | bjIsBust | function | 27099 | hand | return presente | function bjIsBust(hand){ return bjHandScore(hand)>21; } |
| 809 | bjRenderCard | function | 27101 | c | return presente | function bjRenderCard(c){ |
| 810 | bjRenderScore | function | 27113 | hand, dealerPhase | return presente | function bjRenderScore(hand, dealerPhase){ |
| 811 | bjRender | function | 27119 | (nessuno) | return presente | function bjRender(){ |
| 812 | bjRenderAIStrips | function | 27174 | (nessuno) | return presente | function bjRenderAIStrips(){ |
| 813 | bjUpdateActions | function | 27196 | (nessuno) | return presente | function bjUpdateActions(){ |
| 814 | setBtn | arrow | 27207 | id,en | return presente | const setBtn=(id,en)=>{const b=el(id);if(b)b.disabled=!en;}; |
| 815 | startBJGame | function | 27216 | nAI=1, isTourney=false, tMode=null | return presente | function startBJGame(nAI=1, isTourney=false, tMode=null){ |
| 816 | bjShowBetPhase | function | 27254 | (nessuno) | return presente | function bjShowBetPhase(){ |
| 817 | bjAddBet | function | 27271 | amount | return presente | function bjAddBet(amount){ |
| 818 | bjClearBet | function | 27280 | (nessuno) | return presente | function bjClearBet(){ |
| 819 | bjDeal | function | 27285 | (nessuno) | return presente | function bjDeal(){ |
| 820 | bjHit | function | 27327 | (nessuno) | return presente | function bjHit(){ |
| 821 | bjStand | function | 27347 | (nessuno) | return presente | function bjStand(){ |
| 822 | bjDouble | function | 27358 | (nessuno) | return presente | function bjDouble(){ |
| 823 | bjSplit | function | 27371 | (nessuno) | return presente | function bjSplit(){ |
| 824 | bjPlayAI | function | 27388 | (nessuno) | return presente | function bjPlayAI(){ |
| 825 | stepAI | function | 27391 | (nessuno) | return presente | function stepAI(){ |
| 826 | bjDealerPlay | function | 27407 | (nessuno) | side-effect prevalente | function bjDealerPlay(){ |
| 827 | dealerStep | function | 27413 | (nessuno) | side-effect prevalente | function dealerStep(){ |
| 828 | bjResolve | function | 27426 | (nessuno) | side-effect prevalente | function bjResolve(){ |
| 829 | bjSetStatus | function | 27585 | msg | return presente | function bjSetStatus(msg){ |
| 830 | bjNextRound | function | 27589 | (nessuno) | return presente | function bjNextRound(){ |
| 831 | bjBackToMenu | function | 27597 | (nessuno) | return presente | function bjBackToMenu(){ |
| 832 | startBJGameOnline | function | 27611 | role, conn, peer, guestName | return presente | function startBJGameOnline(role, conn, peer, guestName){ |
| 833 | bjOnlineReceive | function | 27618 | d | return presente | function bjOnlineReceive(d){ |
| 834 | launchBJTournament | function | 27628 | mode | return presente | function launchBJTournament(mode){ |
| 835 | getClub | function | 27729 | (nessuno) | return presente | function getClub() { |
| 836 | saveClub | function | 27732 | club | return presente | function saveClub(club) { |
| 837 | getClubMissions | function | 27735 | (nessuno) | return presente | function getClubMissions() { |
| 838 | saveClubMissions | function | 27738 | m | return presente | function saveClubMissions(m) { |
| 839 | initClubMissions | function | 27743 | (nessuno) | return presente | function initClubMissions() { |
| 840 | getWeekStart | function | 27764 | (nessuno) | return presente | function getWeekStart() { |
| 841 | updateClubMission | function | 27771 | stat, amount=1 | return presente | function updateClubMission(stat, amount=1) { |
| 842 | calcClubLevel | function | 27808 | xp | return presente | function calcClubLevel(xp) { |
| 843 | clubXPForNextLevel | function | 27815 | xp | return presente | function clubXPForNextLevel(xp) { |
| 844 | activateClubBoost | function | 27825 | club | return presente | function activateClubBoost(club) { |
| 845 | getClubBoostActive | function | 27832 | (nessuno) | return presente | function getClubBoostActive() { |
| 846 | clubBoostTimeLeft | function | 27836 | (nessuno) | return presente | function clubBoostTimeLeft() { |
| 847 | onClubWin | function | 27843 | (nessuno) | return presente | function onClubWin() { |
| 848 | onClubGame | function | 27858 | (nessuno) | return presente | function onClubGame() { |
| 849 | onClubUno | function | 27863 | (nessuno) | return presente | function onClubUno() { updateClubMission('clubUno'); } |
| 850 | onClubW4 | function | 27864 | (nessuno) | return presente | function onClubW4()  { updateClubMission('clubW4'); } |
| 851 | onClubBJ | function | 27865 | (nessuno) | return presente | function onClubBJ()  { updateClubMission('clubBJ'); } |
| 852 | clubToggleDrawer | function | 27868 | (nessuno) | return presente | function clubToggleDrawer() { |
| 853 | clubRenderDrawer | function | 27885 | (nessuno) | return presente | function clubRenderDrawer() { |
| 854 | clubRenderBadge | function | 27999 | level | return presente | function clubRenderBadge(level) { |
| 855 | clubOpenModal | function | 28017 | mode | return presente | function clubOpenModal(mode) { |
| 856 | clubCloseModal | function | 28048 | (nessuno) | return presente | function clubCloseModal() { |
| 857 | clubModalConfirm | function | 28052 | (nessuno) | return presente | function clubModalConfirm() { |
| 858 | clubLeave | function | 28102 | (nessuno) | return presente | function clubLeave() { |
| 859 | patchUno | arrow | 28122 | (nessuno) | return presente | const patchUno = ()=>{ |
| 860 | renderAvatarEditor | function | 28240 | (nessuno) | return presente | function renderAvatarEditor(){ |
| 861 | renderLock | arrow | 28253 | owned, bpLv | return presente | const renderLock = (owned, bpLv)=> owned ? '' : `<div style="position:absolute;inset:0;border-radius:10px;background:rgba(0,0,0,.65);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:9px;color:rgba(255,255,255,.6);gap:1px;pointer-events:none"><span style="font-size:13px">🔒</span><span>BP Lv.${bpLv}</span></div>`; |
| 862 | getAvatarStyle | function | 28328 | av | return presente | function getAvatarStyle(av){ |
| 863 | applyAvatarEverywhere | function | 28356 | (nessuno) | return presente | function applyAvatarEverywhere(){ |
| 864 | getSeasonInfo | function | 28375 | (nessuno) | return presente | function getSeasonInfo(){ |
| 865 | _formatSeasonLeft | function | 28396 | leftMs | return presente | function _formatSeasonLeft(leftMs){ |
| 866 | softResetMMR | function | 28415 | mmr | return presente | function softResetMMR(mmr){ |
| 867 | endSeason | function | 28433 | (nessuno) | return presente | function endSeason(){ |
| 868 | renderSeasonPanel | function | 28472 | (nessuno) | return presente | function renderSeasonPanel(){ |
| 869 | getActiveEventCards | function | 28626 | (nessuno) | return presente | function getActiveEventCards(){ |
| 870 | getActiveEventName | function | 28635 | (nessuno) | return presente | function getActiveEventName(){ |
| 871 | getDayKey | function | 28706 | (nessuno) | return presente | function getDayKey(){ return new Date().toISOString().slice(0,10); } |
| 872 | getWeekKey | function | 28707 | (nessuno) | return presente | function getWeekKey(){ const d=new Date(); const day=d.getDay(); const diff=d.getDate()-day+(day===0?-6:1); return new Date(d.setDate(diff)).toISOString().slice(0,10); } |
| 873 | ensureMissions | function | 28709 | (nessuno) | return presente | function ensureMissions(){ |
| 874 | updateMissionProgress | function | 28732 | statKey, amount | return presente | function updateMissionProgress(statKey, amount){ |
| 875 | renderChallengesPanelV51 | function | 28784 | (nessuno) | return presente | function renderChallengesPanelV51(){ |
| 876 | missionCard | arrow | 28792 | m, type | return presente | const missionCard = (m, type)=>{ |
| 877 | addBattlePassXP | function | 28856 | amount | return presente | function addBattlePassXP(amount){ |
| 878 | renderSeasonPassV51 | function | 28900 | (nessuno) | return presente | function renderSeasonPassV51(){ |
| 879 | avatarOwned | function | 29290 | type, val | return presente | function avatarOwned(type, val){ |
| 880 | el2 | function | 29812 | id | return presente | function el2(id){return document.getElementById(id);} |
| 881 | notify2 | function | 29813 | msg,col='#fff',dur=2200 | return presente | function notify2(msg,col='#fff',dur=2200){ |
| 882 | rnd | function | 29818 | arr | return presente | function rnd(arr){return arr[Math.floor(Math.random()*arr.length)];} |
| 883 | shuffle | function | 29819 | a | return presente | function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;} |
| 884 | _hmtInit | function | 29858 | (nessuno) | return presente | function _hmtInit(){ |
| 885 | update | function | 29864 | (nessuno) | return presente | function update(){ |
| 886 | makeScopaDeck | function | 29921 | (nessuno) | return presente | function makeScopaDeck(){ |
| 887 | scopaCardHTML | function | 29927 | card,idx,clickFn,sel=false | return presente | function scopaCardHTML(card,idx,clickFn,sel=false){ |
| 888 | startScopaGame | function | 29944 | numAI=1 | return presente | function startScopaGame(numAI=1){ |
| 889 | scopaRender | function | 29979 | (nessuno) | return presente | function scopaRender(){ |
| 890 | scopaSelectHand | function | 30041 | idx | return presente | function scopaSelectHand(idx){ |
| 891 | scopaSelectTable | function | 30047 | idx | return presente | function scopaSelectTable(idx){ |
| 892 | scopaClearSelection | function | 30055 | (nessuno) | return presente | function scopaClearSelection(){SCOPAG.selectedCard=-1;SCOPAG.selectedTable=[];scopaRender();} |
| 893 | scopaPlayCard | function | 30057 | (nessuno) | return presente | function scopaPlayCard(){ |
| 894 | _scopaDoPlay | function | 30073 | playerIdx, cardIdx, tableIdxs | return presente | function _scopaDoPlay(playerIdx, cardIdx, tableIdxs){ |
| 895 | scopaDealHands | function | 30141 | (nessuno) | return presente | function scopaDealHands(){ |
| 896 | scopaEndRound | function | 30156 | (nessuno) | return presente | function scopaEndRound(){ |
| 897 | scopaCalcScores | function | 30218 | (nessuno) | return presente | function scopaCalcScores(){ |
| 898 | scopaAITurn | function | 30248 | (nessuno) | return presente | function scopaAITurn(){ |
| 899 | scopaBackToMenu | function | 30306 | (nessuno) | return presente | function scopaBackToMenu(){ |
| 900 | _scopaFlash | function | 30327 | isHuman | return presente | function _scopaFlash(isHuman){ |
| 901 | startScopaTourn | function | 30351 | numAI | return presente | function startScopaTourn(numAI){ |
| 902 | makePokerDeck | function | 30368 | (nessuno) | return presente | function makePokerDeck(){ |
| 903 | pokerCardHTML | function | 30374 | card,face=true | return presente | function pokerCardHTML(card,face=true){ |
| 904 | startPokerGame | function | 30388 | numAI=1 | return presente | function startPokerGame(numAI=1){ |
| 905 | pokerDealHand | function | 30412 | (nessuno) | return presente | function pokerDealHand(){ |
| 906 | pokerForceBet | function | 30431 | idx,amount | return presente | function pokerForceBet(idx,amount){ |
| 907 | pokerRender | function | 30437 | (nessuno) | return presente | function pokerRender(){ |
| 908 | pkUpdateBetDisplay | function | 30485 | val | return presente | function pkUpdateBetDisplay(val){el2('pk-bet-display').textContent=val;} |
| 909 | pkQuickBet | function | 30486 | type | return presente | function pkQuickBet(type){ |
| 910 | pkAction | function | 30495 | action | return presente | function pkAction(action){ |
| 911 | pokerNextTurn | function | 30514 | (nessuno) | return presente | function pokerNextTurn(){ |
| 912 | pokerNextStage | function | 30533 | (nessuno) | return presente | function pokerNextStage(){ |
| 913 | pokerShowdown | function | 30550 | (nessuno) | return presente | function pokerShowdown(){ |
| 914 | _pokerEndRound | function | 30592 | humanWon | return presente | function _pokerEndRound(humanWon){ |
| 915 | _pokerShowEndOverlay | function | 30631 | humanWon | return presente | function _pokerShowEndOverlay(humanWon){ |
| 916 | pokerAITurn | function | 30672 | (nessuno) | return presente | function pokerAITurn(){ |
| 917 | pokerBestHand | function | 30721 | cards | return presente | function pokerBestHand(cards){ |
| 918 | pokerEvalHand | function | 30727 | cards | return presente | function pokerEvalHand(cards){ |
| 919 | pokerHandName | function | 30756 | cards | return presente | function pokerHandName(cards){ |
| 920 | pokerBackToMenu | function | 30770 | (nessuno) | return presente | function pokerBackToMenu(){ |
| 921 | brrCardPts | function | 30798 | c | return presente | function brrCardPts(c){if(c.wild)return c.v==='joker'?30:20;if(c.v==='A')return 15;if(['J','Q','K'].includes(c.v))return 10;if(parseInt(c.v)>=8)return 10;return 5;} |
| 922 | makeBurrDeck | function | 30802 | (nessuno) | return presente | function makeBurrDeck(){ |
| 923 | brrCardHTML | function | 30812 | card,idx,selected=false,clickFn='burrSelCard' | return presente | function brrCardHTML(card,idx,selected=false,clickFn='burrSelCard'){ |
| 924 | startBurracoGame | function | 30825 | numAI=1 | return presente | function startBurracoGame(numAI=1){ |
| 925 | burrRender | function | 30859 | (nessuno) | return presente | function burrRender(){ |
| 926 | _burrComboHTML | function | 30928 | combo,ci,playerIdx,isAttachMode | return presente | function _burrComboHTML(combo,ci,playerIdx,isAttachMode){ |
| 927 | burrSelCard | function | 30942 | idx | return presente | function burrSelCard(idx){if(BRRG.turn!==0)return;const pos=BRRG.selected.indexOf(idx);if(pos>=0)BRRG.selected.splice(pos,1);else BRRG.selected.push(idx);burrRender();} |
| 928 | burrClearSel | function | 30943 | (nessuno) | return presente | function burrClearSel(){BRRG.selected=[];burrRender();} |
| 929 | burrDraw | function | 30945 | source | return presente | function burrDraw(source){ |
| 930 | burrMeld | function | 30960 | (nessuno) | return presente | function burrMeld(){ |
| 931 | _burrValidateCombo | function | 30985 | cards | return presente | function _burrValidateCombo(cards){ |
| 932 | burrExtend | function | 31008 | (nessuno) | return presente | function burrExtend(){ |
| 933 | burrAttachToCombo | function | 31020 | playerIdx, comboIdx | return presente | function burrAttachToCombo(playerIdx, comboIdx){ |
| 934 | burrDiscardSelected | function | 31047 | (nessuno) | return presente | function burrDiscardSelected(){ |
| 935 | burrAITurn | function | 31067 | (nessuno) | return presente | function burrAITurn(){ |
| 936 | burrEndRound | function | 31130 | winnerIdx | return presente | function burrEndRound(winnerIdx){ |
| 937 | burracoBackToMenu | function | 31179 | (nessuno) | return presente | function burracoBackToMenu(){ |
| 938 | checkScopaFeats | function | 31200 | humanWon | return presente | function checkScopaFeats(humanWon){ |
| 939 | _uf | arrow | 31204 | feat | return presente | const _uf=(feat)=>{const t=unlockFeat(feat);if(t){notify(`🏷️ Titolo sbloccato: "${t.txt}"`);saveP();}}; |
| 940 | checkBurracoFeats | function | 31259 | humanWon | return presente | function checkBurracoFeats(humanWon){ |
| 941 | _uf | arrow | 31263 | feat | return presente | const _uf=(feat)=>{const t=unlockFeat(feat);if(t){notify(`🏷️ Titolo sbloccato: "${t.txt}"`);saveP();}}; |
| 942 | checkPokerFeats | function | 31306 | humanWon | return presente | function checkPokerFeats(humanWon){ |
| 943 | _uf | arrow | 31310 | feat | return presente | const _uf=(feat)=>{const t=unlockFeat(feat);if(t){notify(`🏷️ Titolo sbloccato: "${t.txt}"`);saveP();}}; |
| 944 | checkMMFeats | function | 31353 | humanWon | return presente | function checkMMFeats(humanWon){ |
| 945 | _uf | arrow | 31357 | feat | return presente | const _uf=(feat)=>{const t=unlockFeat(feat);if(t){notify(`🏷️ Titolo sbloccato: "${t.txt}"`);saveP();}}; |
| 946 | _showMiniEndOverlay | function | 31405 | screenId,humanWon,mmrResult,gameLabel,relaunchMode | return presente | function _showMiniEndOverlay(screenId,humanWon,mmrResult,gameLabel,relaunchMode){ |
| 947 | makeMMDeck | function | 31467 | (nessuno) | return presente | function makeMMDeck(){ |
| 948 | mmCardHTML | function | 31473 | card,idx,selected=false | return presente | function mmCardHTML(card,idx,selected=false){ |
| 949 | startMMGame | function | 31484 | numAI=1 | return presente | function startMMGame(numAI=1){ |
| 950 | mmRender | function | 31512 | (nessuno) | return presente | function mmRender(){ |
| 951 | mmSelCard | function | 31550 | idx | return presente | function mmSelCard(idx){if(MMG.turn!==0)return;MMG.selected=MMG.selected===idx?-1:idx;mmRender();} |
| 952 | mmClearSel | function | 31551 | (nessuno) | return presente | function mmClearSel(){MMG.selected=-1;mmRender();} |
| 953 | mmDraw | function | 31553 | (nessuno) | return presente | function mmDraw(){ |
| 954 | mmPlaySelected | function | 31570 | (nessuno) | return presente | function mmPlaySelected(){ |
| 955 | mmDiscardSelected | function | 31579 | (nessuno) | return presente | function mmDiscardSelected(){ |
| 956 | _mmValidatePlay | function | 31592 | player,card,target | return presente | function _mmValidatePlay(player,card,target){ |
| 957 | _mmApplyCard | function | 31609 | playerIdx, cardIdx, targetIdx | return presente | function _mmApplyCard(playerIdx, cardIdx, targetIdx){ |
| 958 | mmEndGame | function | 31648 | winnerIdx | return presente | function mmEndGame(winnerIdx){ |
| 959 | mmAITurn | function | 31672 | (nessuno) | return presente | function mmAITurn(){ |
| 960 | mmHazardFlash | function | 31743 | (nessuno) | return presente | function mmHazardFlash(){const s=document.getElementById('millemiglia-screen');if(!s)return;const f=document.createElement('div');f.style.cssText='position:absolute;inset:0;background:rgba(244,63,94,.2);z-index:500;pointer-events:none;border-radius:inherit';s.style.position='relative';s.appendChild(f);setTimeout(()=>f.remove(),400);} |
| 961 | _mmApplyAI | function | 31744 | playerIdx,cardIdx,targetIdx | return presente | function _mmApplyAI(playerIdx,cardIdx,targetIdx){ |
| 962 | mmBackToMenu | function | 31755 | (nessuno) | return presente | function mmBackToMenu(){ |
| 963 | clTourneySelectGame | function | 31775 | game | return presente | function clTourneySelectGame(game){ |
| 964 | clTourneyBackToPicker | function | 31784 | (nessuno) | return presente | function clTourneyBackToPicker(){ |
| 965 | newMpSelectGame | function | 31792 | game | return presente | function newMpSelectGame(game){ |
| 966 | newMpBackToPicker | function | 31808 | (nessuno) | return presente | function newMpBackToPicker(){ |
| 967 | openClassicTournament | function | 31823 | game | return presente | function openClassicTournament(game){ |
| 968 | _startClassicTournament | function | 31840 | game,numAI | return presente | function _startClassicTournament(game,numAI){ |
| 969 | renderClassicTournament | function | 31853 | (nessuno) | return presente | function renderClassicTournament(){ |
| 970 | playClassicTourneyMatch | function | 31878 | matchIdx | return presente | function playClassicTourneyMatch(matchIdx){ |
| 971 | cb | arrow | 31883 | humanWon | return presente | const cb=(humanWon)=>{ |
| 972 | simClassicMatch | function | 31909 | matchIdx | return presente | function simClassicMatch(matchIdx){ |
| 973 | closeClTourney | function | 31919 | (nessuno) | return presente | function closeClTourney(){ |
| 974 | openNewMpModal | function | 31956 | game | return presente | function openNewMpModal(game){ |
| 975 | closeNewMpModal | function | 31970 | (nessuno) | return presente | function closeNewMpModal(){el2('new-mp-modal').classList.remove('on');} |
| 976 | newMpTab | function | 31972 | tab,el | return presente | function newMpTab(tab,el){ |
| 977 | newMpHostInit | function | 31979 | (nessuno) | return presente | function newMpHostInit(){ |
| 978 | copyNewMpCode | function | 32004 | (nessuno) | return presente | function copyNewMpCode(){ |
| 979 | _newMpRenderSlots | function | 32009 | (nessuno) | return presente | function _newMpRenderSlots(){ |
| 980 | newMpStartGame | function | 32016 | (nessuno) | return presente | function newMpStartGame(){ |
| 981 | newMpJoin | function | 32028 | (nessuno) | return presente | function newMpJoin(){ |
| 982 | newMpGuestReady | function | 32050 | (nessuno) | return presente | function newMpGuestReady(){notify2('✅ Sei pronto! Aspetta che l\'host avvii la partita.','#34D399');} |
| 983 | _newMpHandleData | function | 32052 | data,conn | return presente | function _newMpHandleData(data,conn){ |
| 984 | _activateFocusTrap | function | 32075 | modal | return presente | function _activateFocusTrap(modal){ |
| 985 | _releaseFocusTrap | function | 32084 | (nessuno) | return presente | function _releaseFocusTrap(){ |
| 986 | syncAriaDisabled | function | 32136 | el | return presente | function syncAriaDisabled(el){ |
| 987 | _syncDotAriaLabel | function | 32177 | dotEl | return presente | function _syncDotAriaLabel(dotEl){ |
| 988 | _syncAiPanelLabel | function | 32242 | countBadge | return presente | function _syncAiPanelLabel(countBadge){ |
| 989 | _hmtKeydown | function | 32348 | event, target | return presente | function _hmtKeydown(event, target) { |
| 990 | _injectArrow | function | 32486 | (nessuno) | return presente | function _injectArrow() { |
| 991 | _tick | function | 32501 | (nessuno) | return presente | function _tick() { |
| 992 | _triggerSpot | function | 32524 | (nessuno) | return presente | function _triggerSpot() { |
| 993 | _buildLink | function | 32541 | code, mode | return presente | function _buildLink(code, mode) { |
| 994 | ok | function | 32556 | (nessuno) | return presente | function ok() { |
| 995 | _injectLinkBtn | function | 32570 | containerSel, mode, afterSel | return presente | function _injectLinkBtn(containerSel, mode, afterSel) { |
| 996 | _injectAllLinks | function | 32590 | (nessuno) | return presente | function _injectAllLinks() { |
| 997 | safePatch | function | 32687 | fnName, newFn | return presente | function safePatch(fnName, newFn) { |
| 998 | renderPentathlonBtn | function | 32955 | (nessuno) | return presente | function renderPentathlonBtn() { |
| 999 | ensureBotSystem | function | 32977 | (nessuno) | return presente | function ensureBotSystem() { |
| 1000 | tcSelectGame | function | 33159 | game | return presente | function tcSelectGame(game) { |
| 1001 | tcRenderBracket | function | 33192 | (nessuno) | return presente | function tcRenderBracket() { |
| 1002 | tcSimMatch | function | 33287 | matchIdx | return presente | function tcSimMatch(matchIdx) { |
| 1003 | tcPlayMatch | function | 33300 | matchIdx | return presente | function tcPlayMatch(matchIdx) { |
| 1004 | cb | arrow | 33308 | humanWon | return presente | const cb = (humanWon) => { |
| 1005 | tcCheckRoundEnd | function | 33338 | (nessuno) | return presente | function tcCheckRoundEnd() { |
| 1006 | tcReset | function | 33346 | (nessuno) | return presente | function tcReset() { |
| 1007 | getBondLevel | function | 33777 | xp | return presente | function getBondLevel(xp) { |
| 1008 | getBondXpForNext | function | 33783 | lv | return presente | function getBondXpForNext(lv) { |
| 1009 | bondTrack | function | 33787 | botName, youWon, playedCards, finalHandSize | return presente | function bondTrack(botName, youWon, playedCards, finalHandSize) { |
| 1010 | showBondPopup | function | 33840 | msg, sub | return presente | function showBondPopup(msg, sub) { |
| 1011 | renderBondsPanel | function | 33855 | (nessuno) | return presente | function renderBondsPanel() { |
| 1012 | _cgDefaultRules | function | 34019 | (nessuno) | return presente | function _cgDefaultRules() { |
| 1013 | openCustomGameLobby | function | 34024 | (nessuno) | return presente | function openCustomGameLobby() { |
| 1014 | _cgRenderRules | function | 34032 | (nessuno) | return presente | function _cgRenderRules() { |
| 1015 | cgSetRule | function | 34058 | id, val | return presente | function cgSetRule(id, val) { |
| 1016 | _cgRulesToCode | function | 34063 | rules | return presente | function _cgRulesToCode(rules) { |
| 1017 | _cgCodeToRules | function | 34075 | code | return presente | function _cgCodeToRules(code) { |
| 1018 | _cgUpdateCode | function | 34093 | (nessuno) | return presente | function _cgUpdateCode() { |
| 1019 | cgCopyCode | function | 34097 | (nessuno) | return presente | function cgCopyCode() { |
| 1020 | cgImportCode | function | 34102 | (nessuno) | return presente | function cgImportCode() { |
| 1021 | cgSavePreset | function | 34113 | (nessuno) | return presente | function cgSavePreset() { |
| 1022 | _cgRenderPresets | function | 34125 | (nessuno) | return presente | function _cgRenderPresets() { |
| 1023 | cgLoadPreset | function | 34143 | i | return presente | function cgLoadPreset(i) { |
| 1024 | cgDeletePreset | function | 34149 | i | return presente | function cgDeletePreset(i) { |
| 1025 | cgStartGame | function | 34157 | (nessuno) | return presente | function cgStartGame() { |
| 1026 | launchDoubleElimTournament | function | 34183 | (nessuno) | return presente | function launchDoubleElimTournament() { |
| 1027 | _deIsHuman | function | 34216 | name | return presente | function _deIsHuman(name) { |
| 1028 | _deResolveBotMatch | function | 34220 | match | return presente | function _deResolveBotMatch(match) { |
| 1029 | dePlayMatch | function | 34225 | matchId | return presente | function dePlayMatch(matchId) { |
| 1030 | deResolveMatch | function | 34242 | matchId, winner | return presente | function deResolveMatch(matchId, winner) { |
| 1031 | _deFindMatch | function | 34269 | id | return presente | function _deFindMatch(id) { |
| 1032 | _deAdvanceState | function | 34273 | (nessuno) | return presente | function _deAdvanceState() { |
| 1033 | _deCheckFinale | function | 34303 | (nessuno) | return presente | function _deCheckFinale() { |
| 1034 | renderDETournament | function | 34330 | (nessuno) | return presente | function renderDETournament() { |
| 1035 | renderMatch | arrow | 34334 | m | return presente | const renderMatch = (m) => { |
| 1036 | _omTrackMove | function | 34500 | card, col, turnCount | return presente | function _omTrackMove(card, col, turnCount) { |
| 1037 | _omGetProfile | function | 34514 | (nessuno) | return presente | function _omGetProfile() { |
| 1038 | _patch | function | 34535 | (nessuno) | return presente | function _patch() { |
| 1039 | _patch | function | 34557 | (nessuno) | return presente | function _patch() { |
| 1040 | _patch | function | 34588 | (nessuno) | return presente | function _patch() { |
| 1041 | renderStatsPanel | function | 34639 | (nessuno) | return presente | function renderStatsPanel() { |
| 1042 | bestStreak | arrow | 34649 | ( | return presente | const bestStreak = (() => { |
| 1043 | _renderStatsMiniChart | function | 34743 | canvasId, hist | return presente | function _renderStatsMiniChart(canvasId, hist) { |
| 1044 | _pushNotifEnabled | function | 34785 | (nessuno) | return presente | function _pushNotifEnabled() { |
| 1045 | togglePushNotif | function | 34789 | enabled | return presente | function togglePushNotif(enabled) { |
| 1046 | _updateNotifStatus | function | 34817 | msg | return presente | function _updateNotifStatus(msg) { |
| 1047 | sendPushNotif | function | 34822 | title, body, onClick | return presente | function sendPushNotif(title, body, onClick) { |
| 1048 | _init | function | 34916 | (nessuno) | return presente | function _init() { |
