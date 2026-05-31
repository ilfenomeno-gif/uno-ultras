# Architecture

This project is organized by feature and runtime responsibility.

## core/

Core modules hold app-wide infrastructure:

- router.ts: path/screen resolution, navigation, and popstate handling.
- renderer.ts: layout shell rendering and screen composition.
- store.ts: profile persistence, rank calculation, and progression updates.
- notify.ts: toast notification helper.

## screens/

Each screen module renders one UI area:

- home.ts
- play.ts
- shop.ts
- settings.ts
- profile.ts
- leaderboard.ts

The play screen module also owns active match UI state and action routing for gameplay controls.

## game/

Gameplay-specific logic:

- uno.ts: UNO engine and rules.
- ai.ts: turn-based AI scheduler helper.
- types.ts: shared TypeScript types across core and screens.

## styles/

SCSS is split by concern:

- _variables.scss: CSS variables and global baseline.
- _layout.scss: app shell, sidebar, content, and responsive layout.
- _components.scss: reusable UI components (buttons, chips, cards, panels, notify).
- _screens.scss: screen-specific sections and gameplay board styles.
- main.scss: partial loader only.

## Bootstrap flow

src/main.ts wires:

1. router render callback
2. play render callback
3. delegated click/input/change listeners
4. initial render()
