import type { DomainEvents } from '../types/events';
import type { Mp3pState } from '../types/mp';
import { Emitter } from '../utils/emitter';
import { createMp3pInitialState, reduceMp3p } from './mp3pStateMachine';

export class Mp3pLobbyController {
  private state: Mp3pState = createMp3pInitialState();

  constructor(private readonly events?: Emitter<DomainEvents>) {}

  hostInit(hostPeerId: string, hostName: string, roomCode: string): Mp3pState {
    const out = reduceMp3p(this.state, {
      type: 'host-init',
      hostPeerId,
      hostName,
      roomCode
    });
    this.state = out.state;
    this.events?.emit('mp3p:state', this.state);
    return this.state;
  }

  guestJoin(peerId: string, name: string): Mp3pState {
    const out = reduceMp3p(this.state, {
      type: 'guest-join',
      peerId,
      name
    });
    this.state = out.state;
    this.emitEffects(out.effects);
    this.events?.emit('mp3p:state', this.state);
    return this.state;
  }

  guestOnData(peerId: string, data: unknown): Mp3pState {
    const payload = data as { type?: string; ready?: boolean };
    if (payload.type === 'ready') {
      return this.guestReady(peerId, Boolean(payload.ready));
    }
    if (payload.type === 'leave') {
      const out = reduceMp3p(this.state, { type: 'guest-leave', peerId });
      this.state = out.state;
      this.emitEffects(out.effects);
      this.events?.emit('mp3p:state', this.state);
      return this.state;
    }
    if (payload.type === 'start') {
      return this.start();
    }
    return this.state;
  }

  guestReady(peerId: string, ready: boolean): Mp3pState {
    const out = reduceMp3p(this.state, {
      type: 'guest-ready',
      peerId,
      ready
    });
    this.state = out.state;
    this.emitEffects(out.effects);
    this.events?.emit('mp3p:state', this.state);
    return this.state;
  }

  start(): Mp3pState {
    const out = reduceMp3p(this.state, { type: 'start' });
    this.state = out.state;
    this.emitEffects(out.effects);
    this.events?.emit('mp3p:state', this.state);
    return this.state;
  }

  getState(): Mp3pState {
    return this.state;
  }

  private emitEffects(effects: Array<{ type: string; [k: string]: unknown }>): void {
    for (const effect of effects) {
      if (effect.type === 'joined') {
        this.events?.emit('mp3p:joined', { peerId: String(effect.peerId) });
      } else if (effect.type === 'ready-changed') {
        this.events?.emit('mp3p:ready-changed', {
          peerId: String(effect.peerId),
          ready: Boolean(effect.ready)
        });
      } else if (effect.type === 'started') {
        this.events?.emit('mp3p:start', { roomCode: String(effect.roomCode) });
      }
    }
  }
}
