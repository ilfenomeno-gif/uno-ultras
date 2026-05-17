/** Registry plugin-based mini-giochi */
export type MinigameId = 'ruba'|'scala40'|'scopa'|'poker'|'burraco'|'blackjack'|'millemiglia';

export interface MinigameDescriptor {
  id:     MinigameId;
  label:  string;
  icon:   string;
  online: boolean;
  minP:   number;
  maxP:   number;
}

export const MINIGAMES: MinigameDescriptor[] = [
  { id:'ruba',       label:'Ruba Mazzetto', icon:'🃏', online:true,  minP:2, maxP:4 },
  { id:'scala40',    label:'Scala 40',      icon:'🂠',  online:true,  minP:2, maxP:4 },
  { id:'scopa',      label:'Scopa',         icon:'🧹', online:false, minP:2, maxP:4 },
  { id:'poker',      label:'Poker',         icon:'♠️',  online:false, minP:2, maxP:6 },
  { id:'burraco',    label:'Burraco',       icon:'🎴', online:false, minP:2, maxP:4 },
  { id:'blackjack',  label:'Blackjack',     icon:'🃏', online:false, minP:1, maxP:4 },
  { id:'millemiglia',label:'Millemiglia',   icon:'🚗', online:false, minP:2, maxP:4 },
];
