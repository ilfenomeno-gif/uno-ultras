export class MpTimerManager {
  private startedAt = 0;

  start(): void {
    this.startedAt = Date.now();
  }

  elapsedMs(): number {
    if (this.startedAt === 0) return 0;
    return Date.now() - this.startedAt;
  }
}
