# Repository Cleanup Checklist

## Completed in working tree

- [x] Root .gitignore created
- [x] node_modules removed from Git index (kept on disk)
- [x] .docx removed from Git index (kept on disk)
- [x] Root README expanded with structure and direction
- [x] Reorganization planning docs added

## Pending maintainer actions

- [ ] Commit the cleanup diff
- [ ] Push branch and open PR
- [ ] Create branches: legacy/v1 and legacy/v2
- [ ] Move historical folders out of main branch
- [ ] Split openclaw-agent-system into dedicated repository
- [ ] Convert document binaries into markdown where useful

## Verification commands

From repository root:

- git ls-files | findstr /I node_modules
- git ls-files | findstr /I .docx
- git status --short
