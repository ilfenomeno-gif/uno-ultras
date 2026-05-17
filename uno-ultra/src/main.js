import { createInitialState } from './core/state.js';
import { renderBootScreen } from './ui/screenRouter.js';

const state = createInitialState();
renderBootScreen(document.getElementById('app'), state);
