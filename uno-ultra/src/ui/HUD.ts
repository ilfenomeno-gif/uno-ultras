export class HUD {
  constructor(private readonly root: HTMLElement) {}

  showMessage(message: string): void {
    this.root.textContent = message;
  }
}
