import type { GameId } from './types';

export interface GameRule {
  title: string;
  deck: string;
  objective: string;
  howTo: string;
  key: string;
}

export const RULEBOOK: Record<GameId, GameRule> = {
  uno: {
    title: 'UNO',
    deck: '108 carte dedicate (colori + azioni)',
    objective: 'Rimanere senza carte in mano',
    howTo: 'Scarti una carta a turno. Deve combaciare con la cima degli scarti per colore, numero o simbolo.',
    key: 'Carte azione +2, cambio giro, salto, jolly, jolly +4. Con una sola carta devi dichiarare UNO, altrimenti penalita di 2 carte.'
  },
  ruba: {
    title: 'Ruba Mazzetto',
    deck: '40 carte piacentine/napoletane',
    objective: 'Chiudere con il mazzetto piu grande',
    howTo: 'Con una carta dello stesso valore di una sul tavolo prendi la coppia e la metti nel tuo mazzetto.',
    key: 'La cima del mazzetto e visibile. Se un avversario gioca lo stesso valore della tua cima, ruba l intero mazzetto.'
  },
  scopa: {
    title: 'Scopa',
    deck: '40 carte piacentine/napoletane',
    objective: 'Raggiungere 11 punti',
    howTo: 'A turno giochi una carta e prendi dal tavolo una carta uguale o una combinazione che somma lo stesso valore.',
    key: 'Se svuoti il tavolo fai Scopa. Punti da settebello, primiera, carte e denari.'
  },
  briscola: {
    title: 'Briscola',
    deck: '40 carte piacentine/napoletane',
    objective: 'Fare piu di 60 punti su 120',
    howTo: 'Una carta scoperta determina il seme di briscola. Vince la mano la carta piu alta del seme di mano, salvo briscola.',
    key: 'Valori principali: Asso 11, 3 vale 10, Re 4, Cavallo 3, Fante 2.'
  },
  scala40: {
    title: 'Scala 40',
    deck: '2 mazzi francesi, 108 carte con jolly',
    objective: 'Chiudere calando tutte le carte',
    howTo: 'Peschi, cali combinazioni (tris/scale) e scarti una carta a fine turno.',
    key: 'Prima apertura minima da 40 punti. Prima di aprire non puoi attaccare ai giochi altrui.'
  },
  burraco: {
    title: 'Burraco',
    deck: '2 mazzi francesi, 108 carte',
    objective: 'Prendere pozzetto, fare almeno un burraco e chiudere',
    howTo: 'Si calano tris e scale. Pinelle (2) e jolly funzionano da matti.',
    key: 'Burraco: combinazione o sequenza da almeno 7 carte, pulito o sporco.'
  },
  poker: {
    title: "Poker Texas Hold'em",
    deck: '52 carte francesi senza jolly',
    objective: 'Vincere il pot con la mano migliore o facendo foldare gli avversari',
    howTo: 'Fasi: pre-flop, flop, turn, river con giri di puntata ad ogni fase.',
    key: 'Azioni base: check, bet, call, raise, fold.'
  },
  blackjack: {
    title: 'Blackjack',
    deck: 'Da 1 a 8 mazzi francesi',
    objective: 'Battere il dealer senza superare 21',
    howTo: 'Flusso stato: bet -> play -> result. In play puoi fare hit o stand.',
    key: 'Asso vale 1 o 11. Blackjack naturale (asso + 10/figura) paga 3:2.'
  },
  millemiglia: {
    title: 'Mille Miglia',
    deck: 'Carte speciali distanza, ostacoli, rimedi, sicurezze',
    objective: 'Raggiungere esattamente 1000 km',
    howTo: 'Parti con semaforo verde, giochi km, subisci hazard e rispondi con remedy per ripartire.',
    key: 'Le safety danno immunita a specifici ostacoli.'
  },
  tressette: {
    title: 'Tressette',
    deck: '40 carte piacentine/napoletane',
    objective: 'Fare piu punti degli avversari (21 o 31)',
    howTo: 'Obbligo di rispondere al seme di mano quando possibile.',
    key: 'Gerarchia alta: 3, 2, Asso. Assi valgono 1, figure/2/3 valgono 1/3, ultima mano +1 punto.'
  }
};
