import './styles/main.scss';
import type { DomainEvents } from './types/events';
import { Emitter } from './utils/emitter';
import { ScreenRouter } from './ui/ScreenRouter';
import { Site } from './ui/Site';

const root = document.getElementById('app');
if (!root) {
  throw new Error('Missing #app root node');
}

const events = new Emitter<DomainEvents>();
const router = new ScreenRouter(events);
Site.getInstance();

events.on('ui:screen', ({ screen }) => {
  root.innerHTML = `
    <main class="boot-shell">
      <h1>UNO ULTRA</h1>
      <p>Screen attiva: ${screen}</p>
      <p>Architettura modulare TypeScript integrata.</p>
    </main>
  `;
});

router.go('home');
