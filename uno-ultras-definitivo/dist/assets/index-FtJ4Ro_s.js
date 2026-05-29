(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();const b=["red","blue","green","yellow"],N=["1","2","3","4","5","6","7","8","9"];function u(){return Math.random().toString(36).slice(2,10)}function O(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const r=Math.floor(Math.random()*(a+1));[t[a],t[r]]=[t[r],t[a]]}return t}function I(e){const t=e?b.filter(a=>a!==e):b;return t[Math.floor(Math.random()*t.length)]??"red"}function T(){const e=[];for(const t of b){e.push({id:u(),color:t,value:"0"});for(const a of N)e.push({id:u(),color:t,value:a}),e.push({id:u(),color:t,value:a});for(let a=0;a<2;a+=1)e.push({id:u(),color:t,value:"skip"}),e.push({id:u(),color:t,value:"reverse"}),e.push({id:u(),color:t,value:"draw2"})}for(let t=0;t<4;t+=1)e.push({id:u(),color:"wild",value:"wild"}),e.push({id:u(),color:"wild",value:"wild4"});return O(e)}function v(e,t=1){const a=[];for(let r=0;r<t;r+=1){if(e.deck.length===0){const i=e.discard.pop();e.deck=O(e.discard),e.discard=i?[i]:[]}const n=e.deck.pop();n&&a.push(n)}return a}function z(e){for(;e.deck.length>0;){const t=v(e,1)[0];if(!t)break;if(e.discard.push(t),t.color!=="wild"){e.activeColor=t.color,t.value==="draw2"&&(e.drawStack=2),t.value==="skip"&&(e.currentPlayerIndex=1%e.players.length),t.value==="reverse"&&e.players.length>2&&(e.direction=-1);return}e.activeColor=I();return}}function E(e){const t=e.discard[e.discard.length-1];if(!t)throw new Error("Discard pile vuota");return t}function w(e,t){const a=E(e);return e.drawStack>0?t.value==="draw2"||t.value==="wild4":t.color==="wild"||t.color===e.activeColor?!0:t.value===a.value}function x(e,t=1){const a=e.players.length;return((e.currentPlayerIndex+t*e.direction)%a+a)%a}class B{state;constructor(t){const a=Math.max(2,Math.min(4,t)),r=[];r.push({id:"p0",name:"Tu",isAI:!1,hand:[],saidUno:!1});for(let n=1;n<a;n+=1)r.push({id:`p${n}`,name:`Bot ${n}`,isAI:!0,hand:[],saidUno:!1});this.state={players:r,deck:T(),discard:[],currentPlayerIndex:0,direction:1,activeColor:"red",drawStack:0,winner:null};for(const n of this.state.players)n.hand=v(this.state,7);z(this.state)}getCurrentPlayer(){return this.state.players[this.state.currentPlayerIndex]}getPlayableIndicesForCurrent(){const t=this.getCurrentPlayer(),a=[];return t.hand.forEach((r,n)=>{w(this.state,r)&&a.push(n)}),a}sayUno(){const t=this.getCurrentPlayer();t.saidUno=!0}drawForCurrent(){if(this.state.winner)return"Partita terminata";const t=this.getCurrentPlayer(),a=this.state.drawStack>0?this.state.drawStack:1,r=v(this.state,a);return t.hand.push(...r),t.saidUno=!1,this.state.drawStack>0&&(this.state.drawStack=0),this.advanceTurn(1),`${t.name} pesca ${a} carta${a>1?"e":""}`}playFromCurrent(t,a){if(this.state.winner)return"Partita terminata";const r=this.getCurrentPlayer(),n=r.hand[t];if(!n)return"Carta non valida";if(!w(this.state,n))return"Mossa non valida";r.hand.splice(t,1),this.state.discard.push(n),n.color==="wild"?this.state.activeColor=a??I(this.state.activeColor):this.state.activeColor=n.color;let i=`${r.name} gioca ${n.value}`,c=1;if(n.value==="skip"&&(c=2),n.value==="reverse"&&(this.state.direction=this.state.direction===1?-1:1,this.state.players.length===2&&(c=2)),n.value==="draw2"&&(this.state.drawStack+=2),n.value==="wild4"&&(this.state.drawStack+=4),r.hand.length===1&&!r.saidUno){const f=v(this.state,2);r.hand.push(...f),i+=" (penalita UNO +2)"}return r.hand.length===0?(this.state.winner=r.name,`${r.name} vince la partita!`):(r.saidUno=!1,this.advanceTurn(c),i)}runAI(){const t=this.getCurrentPlayer();if(!t.isAI||this.state.winner)return"";t.hand.length===2&&(t.saidUno=!0);const a=[];if(t.hand.forEach((r,n)=>{w(this.state,r)&&a.push(n)}),a.length>0){const r=a[Math.floor(Math.random()*a.length)]??a[0],i=t.hand[r]?.color==="wild"?I(this.state.activeColor):void 0;return this.playFromCurrent(r,i)}return this.drawForCurrent()}advanceTurn(t){this.state.currentPlayerIndex=x(this.state,t)}}const A="uno-ultras-definitivo-profile",$={uno:"UNO",ruba:"Ruba Mazzetto",scopa:"Scopa",poker:"Poker",burraco:"Burraco",blackjack:"Blackjack",millemiglia:"Millemiglia",scala40:"Scala 40"},C=["Bronzo I","Bronzo II","Bronzo III","Argento I","Argento II","Argento III","Oro I","Oro II","Oro III","Platino I","Platino II","Platino III","Diamante I","Diamante II","Diamante III","Campione I","Campione II","Campione III","Grande Campione","SSL"],D=["Architetto del Caos","Creatura del Vuoto","Jolly del Mazzo","Leggenda di UNO","Maestro di Scala 40","Re dei Ladri","Dio del 21","World Champion Supreme"];let d=L(location.pathname),m="uno",p=2,o=null,h=[],g=null,s=F();function F(){try{const e=localStorage.getItem(A);if(!e)throw new Error("empty");const t=JSON.parse(e);return{name:t.name||"Giocatore",wins:t.wins||0,losses:t.losses||0,games:t.games||0,mmr:t.mmr||200,credits:t.credits||1e3,titles:Array.isArray(t.titles)?t.titles:[]}}catch{return{name:"Giocatore",wins:0,losses:0,games:0,mmr:200,credits:1e3,titles:["Architetto del Caos"]}}}function R(){localStorage.setItem(A,JSON.stringify(s))}function L(e){const t=e.toLowerCase();return t.endsWith("/play")?"play":t.endsWith("/shop")?"shop":t.endsWith("/settings")?"settings":t.endsWith("/profile")?"profile":t.endsWith("/leaderboard")?"leaderboard":"home"}function j(e){return e==="home"?"/":`/${e}`}function G(e,t=!0){d=e,t&&history.pushState({screen:e},"",j(e)),l()}function W(e){const t=Math.min(C.length-1,Math.floor(Math.max(0,e-200)/70));return C[t]??"Bronzo I"}function k(e){return e==="wild"?"wild":e}function M(e){return e.value==="wild"?"Jolly":e.value==="wild4"?"Jolly +4":e.value==="draw2"?"+2":e.value==="reverse"?"Reverse":e.value==="skip"?"Salta":e.value}function P(e){const t=document.getElementById("notify");t&&(t.textContent=e,t.classList.add("show"),window.setTimeout(()=>t.classList.remove("show"),1600))}function J(){return`
    <section class="hero">
      <h1>UNO ULTRAS DEFINITIVO</h1>
      <p>Beta demo completa: hub multipagina, modalita complete, progressione locale e gameplay UNO ricreato da zero.</p>
      <div class="hero-actions">
        <button data-action="goto" data-screen="play" class="btn-primary">Inizia a giocare</button>
        <button data-action="goto" data-screen="shop" class="btn-ghost">Apri Shop</button>
      </div>
    </section>
    <section class="grid three">
      <article class="panel"><h3>Modalita</h3><p>UNO, Ruba Mazzetto, Scopa, Poker, Burraco, Blackjack, Millemiglia, Scala 40 in 1v1/3/4.</p></article>
      <article class="panel"><h3>Classifica</h3><p>Sistema rank completo da Bronzo a SSL + MMR demo persistente.</p></article>
      <article class="panel"><h3>Beta pronta</h3><p>Interfaccia moderna, salvataggio locale e struttura pronta per integrazione feature monolite.</p></article>
    </section>
  `}function _(){const e=Object.entries($).map(([a,r])=>`<button class="chip ${m===a?"active":""}" data-action="pick-game" data-game="${a}">${r}</button>`),t=[2,3,4].map(a=>{const r=p===a,n=a===2?"1v1":`${a} giocatori`;return`<button class="chip ${r?"active":""}" data-action="pick-players" data-players="${a}">${n}</button>`});return`
    <section class="panel">
      <h2>Modalita complete</h2>
      <p>Scegli gioco e numero giocatori. UNO e gia giocabile in demo beta.</p>
      <div class="chip-wrap">${e.join("")}</div>
      <div class="chip-wrap">${t.join("")}</div>
      <div class="launch-row">
        <span>${$[m]} - ${p===2?"1v1":`${p} giocatori`}</span>
        <button class="btn-primary" data-action="start-mode">Avvia Modalita</button>
      </div>
    </section>
  `}function H(){if(!o)return"";const e=o.state,t=e.discard[e.discard.length-1],a=e.players[0],r=e.players.slice(1).map((i,c)=>`<div class="opponent ${e.currentPlayerIndex===c+1?"active":""}">${i.name}: ${i.hand.length} carte</div>`).join(""),n=a.hand.map((i,c)=>{const f=e.currentPlayerIndex===0&&o?.getPlayableIndicesForCurrent().includes(c);return`
        <button class="card ${k(i.color)} ${f?"playable":""}" data-action="play-card" data-index="${c}" ${f?"":"disabled"}>
          <span>${M(i)}</span>
        </button>
      `}).join("");return`
    <section class="panel game">
      <div class="game-top">
        <div>
          <h2>Partita UNO Demo</h2>
          <p>Turno: ${e.players[e.currentPlayerIndex]?.name??"?"} • Colore attivo: ${e.activeColor}</p>
        </div>
        <div class="pill">Draw Stack: ${e.drawStack}</div>
      </div>
      <div class="opponents">${r}</div>
      <div class="table-area">
        <div class="deck" data-action="draw">PESCA</div>
        <div class="discard ${k(t.color)}">${M(t)}</div>
      </div>
      <div class="hand">${n}</div>
      <div class="game-actions">
        <button class="btn-ghost" data-action="say-uno">Dichiara UNO</button>
        <button class="btn-ghost" data-action="draw">Pesca Carta</button>
        <button class="btn-ghost" data-action="stop-game">Abbandona Match</button>
      </div>
      <div class="log">${h.slice(0,6).map(i=>`<div>${i}</div>`).join("")}</div>
    </section>
  `}function V(){return`
    ${_()}
    ${o?H():""}
    <section class="panel">
      <h3>Meccaniche reference dal monolite</h3>
      <p>Il file padre rimane intatto. Questa beta e una ricostruzione da zero pronta a integrare progressivamente tutte le meccaniche.</p>
      <a class="inline-link" href="../uno_ultra_v52%20(1)%20(2).html" target="_blank" rel="noopener noreferrer">Apri riferimento monolite</a>
    </section>
  `}function K(){return`
    <section class="panel">
      <h2>Shop</h2>
      <p>Demo shop interna pronta per beta.</p>
      <div class="grid three">
        <article class="panel compact"><h4>Bundle Settimanale</h4><p>Skin tavolo + emote + titolo.</p><button class="btn-primary">Acquista 450</button></article>
        <article class="panel compact"><h4>Cassa Leggendaria</h4><p>Drop titoli premium e FX.</p><button class="btn-primary">Apri 800</button></article>
        <article class="panel compact"><h4>Token XP</h4><p>Boost progressione per 3 match.</p><button class="btn-primary">Attiva 120</button></article>
      </div>
    </section>
  `}function X(){return`
    <section class="panel">
      <h2>Impostazioni</h2>
      <div class="setting-row"><span>Audio FX</span><span>80%</span></div>
      <div class="setting-row"><span>Musica</span><span>55%</span></div>
      <div class="setting-row"><span>Riduzione Motion</span><span>Off</span></div>
      <div class="setting-row"><span>Colorblind Mode</span><span>Off</span></div>
      <div class="setting-row"><span>NVDA Assist</span><span>On</span></div>
    </section>
  `}function q(){return`
    <section class="panel">
      <h2>Profilo</h2>
      <div class="grid three">
        <article class="panel compact"><h4>Giocatore</h4><p>${s.name}</p></article>
        <article class="panel compact"><h4>Partite</h4><p>${s.games}</p></article>
        <article class="panel compact"><h4>Rank</h4><p>${W(s.mmr)} (${s.mmr})</p></article>
      </div>
      <div class="grid two">
        <article class="panel compact"><h4>Win / Loss</h4><p>${s.wins} / ${s.losses}</p></article>
        <article class="panel compact"><h4>Crediti</h4><p>${s.credits}</p></article>
      </div>
      <h4>Titoli</h4>
      <div class="chip-wrap">${s.titles.map(e=>`<span class="chip active">${e}</span>`).join("")}</div>
    </section>
  `}function Q(){return`
    <section class="panel">
      <h2>Classifica Demo</h2>
      <table class="board">
        <thead><tr><th>Pos</th><th>Nome</th><th>Rank</th><th>MMR</th></tr></thead>
        <tbody>${C.slice(0,10).map((t,a)=>`<tr><td>#${a+1}</td><td>Player ${a+1}</td><td>${t}</td><td>${200+a*85}</td></tr>`).join("")}</tbody>
      </table>
      <h4>Titoli principali</h4>
      <div class="chip-wrap">${D.map(t=>`<span class="chip">${t}</span>`).join("")}</div>
    </section>
  `}function Y(){switch(d){case"home":return J();case"play":return V();case"shop":return K();case"settings":return X();case"profile":return q();case"leaderboard":return Q()}}function l(){const e=document.getElementById("app");e&&(e.innerHTML=`
    <div class="layout">
      <aside class="sidebar">
        <h2>UNO ULTRAS</h2>
        <p>DEFINITIVO BETA</p>
        <nav>
          <button class="menu ${d==="home"?"active":""}" data-action="goto" data-screen="home">Home</button>
          <button class="menu ${d==="play"?"active":""}" data-action="goto" data-screen="play">Gioca</button>
          <button class="menu ${d==="shop"?"active":""}" data-action="goto" data-screen="shop">Shop</button>
          <button class="menu ${d==="settings"?"active":""}" data-action="goto" data-screen="settings">Impostazioni</button>
          <button class="menu ${d==="profile"?"active":""}" data-action="goto" data-screen="profile">Profilo</button>
          <button class="menu ${d==="leaderboard"?"active":""}" data-action="goto" data-screen="leaderboard">Classifica</button>
        </nav>
      </aside>
      <main class="content">${Y()}</main>
    </div>
    <div id="notify" class="notify"></div>
  `)}function U(e){s.games+=1,e?(s.wins+=1,s.mmr+=18,s.credits+=25,!s.titles.includes("Leggenda di UNO")&&s.wins>=5&&s.titles.push("Leggenda di UNO")):(s.losses+=1,s.mmr=Math.max(200,s.mmr-8)),R()}function S(){o=null,h=[],g&&(window.clearTimeout(g),g=null),l()}function y(){!o||o.state.winner||o.getCurrentPlayer().isAI&&(g=window.setTimeout(()=>{if(!o)return;const e=o.runAI();if(e&&h.unshift(e),o.state.winner){const t=o.state.winner==="Tu";U(t),P(o.state.winner==="Tu"?"Hai vinto!":`${o.state.winner} vince!`),S();return}l(),y()},850))}function Z(){if(m!=="uno"){P(`${$[m]} pronta come modulo beta UI. Gameplay completo in prossima fase.`);return}o=new B(p),h=[`Partita UNO avviata (${p===2?"1v1":`${p} giocatori`}).`],l(),y()}document.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const r=a.dataset.action;if(r==="goto"&&a.dataset.screen){G(a.dataset.screen);return}if(r==="pick-game"&&a.dataset.game){m=a.dataset.game,l();return}if(r==="pick-players"&&a.dataset.players){p=Number(a.dataset.players),l();return}if(r==="start-mode"){Z();return}if(r==="draw"&&o&&o.state.currentPlayerIndex===0){const n=o.drawForCurrent();h.unshift(n),l(),y();return}if(r==="say-uno"&&o&&o.state.currentPlayerIndex===0){o.sayUno(),h.unshift("UNO dichiarato."),l();return}if(r==="play-card"&&o&&o.state.currentPlayerIndex===0){const n=Number(a.dataset.index??"-1"),i=o.playFromCurrent(n);if(h.unshift(i),o.state.winner){U(o.state.winner==="Tu"),P(o.state.winner==="Tu"?"Hai vinto!":`${o.state.winner} vince!`),S();return}l(),y();return}r==="stop-game"&&S()});window.addEventListener("popstate",()=>{d=L(location.pathname),l()});l();
