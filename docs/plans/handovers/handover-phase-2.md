# Handover: Phase 2 → Phase 3

## What Phase 2 Delivered

- `src/index.ts` — replaced stub with proper `PluginModule` export (`id: "my-commands"`, `server: async () => ({})`)
- `tsconfig.json` — added `rootDir: "src"` (TS6+ requirement)
- `.opencode/plugins/my-commands.js` — bridge re-export from `dist/index.js`
- `tests/plugin.test.ts` — 11 tests: shape, id, async server, return object, type-check (via build), build output, ESM import, bridge file
- `decisions/0004-plugin-identity.md` — plugin name and shape rationale

## Good to Know

1. **tsconfig.json got `rootDir`.** TS 5.9.3+ requires explicit `rootDir`. Without it, build fails on our structure.

2. **tsgo LSP is stricter than tsc.** tsgo (TS7 dev preview) reports false-positive errors:
   - `"rootDir" must be explicitly set` — despite being set, tsgo flags it. tsc is fine.
   - `Cannot find name 'node:fs'` — tsgo doesn't see @types/node in test files. tsc/vitest compile fine.
   - `Expected 1-2 arguments, but got 0` for `server()` — TS allows fewer args. tsgo stricter.
   
   Ignore these. Only `npx tsc --noEmit` output matters.

3. **`npm run build` happens in `beforeAll`.** Tests moved `npx tsc --noEmit` + `npm run build` into a 30s `beforeAll` hook to avoid per-test timeout. Build output tests verify dist files exist.

4. **Phase 3 creates `commands/commit.md`.** Slash command file, plain markdown, no YAML frontmatter. Content must match `opencode-caveman/commands/caveman-commit.md` verbatim (parity test).

5. **Phase 3 also creates `tests/commands.test.ts`.** 11 tests including a parity check against the caveman reference file. To run this, need access to the caveman package — check if it's installed globally or in opencode's node_modules.
