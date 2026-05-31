# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Added
- Root-level repository setup for the active app.
- Modular architecture under src/core, src/screens, src/game, and split SCSS partials.
- ARIA improvements for gameplay interactions and persistent settings controls.
- Profile schema versioning with rank-up notification flow.

### Changed
- Migrated app from nested folder to repository root.
- Replaced fake leaderboard rows with local profile based output.
- Reduced visible play options to current supported mode (UNO 1v1).

### Removed
- Tracked node_modules from repository index.
- Legacy placeholder play options from active gameplay selector UI.
