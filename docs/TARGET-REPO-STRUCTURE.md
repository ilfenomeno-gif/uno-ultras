# Target Repository Structure

## Goal

Transform the current mixed tree into a maintainable structure with one active product in main and legacy/history isolated.

## Target

- main branch:
  - active game app only (recommended source: uno-ultras-definitivo)
  - shared docs in markdown
  - no committed node_modules
  - no committed office binaries

## Recommended tree (main)

uno-ultras/
- .gitignore
- README.md
- package.json
- src/
- tests/
- docs/
- vite.config.ts

## Legacy strategy

- legacy/v1: historical content from uno/
- legacy/v2: historical content from uno-ultra/

## External project split

- openclaw-agent-system should be moved to its own repository:
  - openclaw-agent-system

## Current cleanup status

1. Root .gitignore added.
2. Tracked node_modules removed from Git index.
3. Tracked .docx removed from Git index.
4. Root governance docs added.

## Remaining manual repo operations (maintainer)

1. Commit cleanup changes in dedicated commit.
2. Create legacy branches and move historical trees there.
3. Remove openclaw-agent-system from this repository after extraction.
4. Optionally migrate office docs into markdown under docs/.
