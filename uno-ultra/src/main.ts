import './styles/main.scss';
import type { DomainEvents } from './types/events';
import { Emitter } from './utils/emitter';
import { ScreenRouter } from './ui/ScreenRouter';
import { Site } from './ui/Site';
import { ConnectionManager } from './multiplayer/ConnectionManager';
import { installLegacyMpBridge } from './multiplayer/legacyBridge';
import { FriendService } from './multiplayer/FriendService';
import { Mp3pLobbyController } from './multiplayer/Mp3pLobbyController';

const root = document.getElementById('app');
if (!root) {
  throw new Error('Missing #app root node');
}

const events = new Emitter<DomainEvents>();
const router = new ScreenRouter(events);
Site.getInstance();
const mpManager = new ConnectionManager();
const friendService = new FriendService(events);
const mp3pLobby = new Mp3pLobbyController(events);
installLegacyMpBridge(mpManager, friendService, mp3pLobby);

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
