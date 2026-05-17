import type { DomainEvents } from '../types/events';
import type { GameAction, GameState } from '../types/gamestate';
import { Emitter } from '../utils/emitter';
import { isPlayableCard } from './rules';

export class GameLoop {
  constructor(private readonly events: Emitter<DomainEvents>) {}

  applyAction(state: GameState, action: GameAction): GameState {
    if (state.winnerId) return state;

    if (action.type === 'draw-card') {
      return this.drawCard(state, action.playerId);
    }

    return this.playCard(state, action.playerId, action.cardId);
  }

  private drawCard(state: GameState, playerId: string): GameState {
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex < 0 || state.drawPile.length === 0) return state;

    const next = structuredClone(state);
    const drawn = next.drawPile.shift();
    if (drawn) {
      next.players[playerIndex].hand.push(drawn);
    }
    next.turn += 1;
    next.currentPlayer = this.nextPlayer(next.currentPlayer, next.players.length, next.direction);
    this.events.emit('game:state', next);
    return next;
  }

  private playCard(state: GameState, playerId: string, cardId: string): GameState {
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex < 0 || state.discardPile.length === 0) return state;

    const next = structuredClone(state);
    const hand = next.players[playerIndex].hand;
    const cardIndex = hand.findIndex((c) => c.id === cardId);
    if (cardIndex < 0) return state;

    const top = next.discardPile[next.discardPile.length - 1];
    const selected = hand[cardIndex];
    if (!isPlayableCard(selected, top)) return state;

    hand.splice(cardIndex, 1);
    next.discardPile.push(selected);

    if (hand.length === 0) {
      next.winnerId = playerId;
      this.events.emit('game:ended', { winnerId: playerId });
    }

    next.turn += 1;
    next.currentPlayer = this.nextPlayer(next.currentPlayer, next.players.length, next.direction);
    this.events.emit('game:state', next);
    return next;
  }

  private nextPlayer(current: number, players: number, direction: 1 | -1): number {
    return (current + direction + players) % players;
  }
}
