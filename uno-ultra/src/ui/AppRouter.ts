import type { DomainEvents } from '../types/events';
import { Emitter } from '../utils/emitter';

export class AppRouter {
  private current = 'boot';

  constructor(private readonly events: Emitter<DomainEvents>) {}

  go(screen: string): void {
    this.current = screen;
    this.events.emit('ui:screen', { screen });
  }

  getCurrent(): string {
    return this.current;
  }
}
