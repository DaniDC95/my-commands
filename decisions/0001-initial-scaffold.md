# 0001. Initial Scaffold

## Status
Accepted

## Context
New OpenCode plugin project needs npm-ready package structure from day one. Phase 1 establishes build pipeline, test framework, and TypeScript config before any plugin logic.

## Decision
Create standard npm package with:
- TypeScript (ES2022 target, NodeNext module)
- Vitest for testing (same stack as opencode-caveman)
- `exports` field pointing to `./dist/index.js`
- `files` whitelist: `dist`, `commands`, `.opencode`
- Peer dependency on `@opencode-ai/plugin:*`

## Rationale
- Pattern-match opencode-caveman for consistency
- Vitest chosen over jest for native ESM + TypeScript support
- `files` whitelist prevents accidental publish of src/tests
- Peer dep with `*` avoids version conflicts with host OpenCode install

## Consequences
- Build step (`tsc`) required before plugin can run
- Consumers must have `@opencode-ai/plugin` in their own deps
- Source lives in `src/`, output in `dist/`
