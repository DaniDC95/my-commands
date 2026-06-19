# Handover: Phase 1 → Phase 2

## What Phase 1 Delivered

- `package.json` — npm-ready, peerDeps on `@opencode-ai/plugin:*`, devDeps for tsc+vitest
- `tsconfig.json` — ES2022, NodeNext, strict, outDir=dist
- `vitest.config.ts` — minimal config with globals + node env
- `.gitignore` — node_modules, dist
- `src/index.ts` — **stub** (`export const name = "my-commands"`). Required because Phase 1 verification (`npx tsc --noEmit`) needs at least one input file
- `tests/scaffold.test.ts` — 15 tests covering package.json fields, tsconfig outDir, vitest config existence, .gitignore contents
- `decisions/0001-initial-scaffold.md` — rationale for structure choices
- `package-lock.json` — locked deps

## Good to Know

1. **Replace `src/index.ts` entirely in Phase 2.** The stub won't pass Phase 2's `PluginModule` shape tests. Expected export:
   ```ts
   import type { PluginModule } from "@opencode-ai/plugin";
   const MyCommandsPlugin: PluginModule = {
     id: "my-commands",
     server: async () => ({}),
   };
   export default MyCommandsPlugin;
   ```

2. **Create `.opencode/plugins/my-commands.js` in Phase 2.** This is the bridge file that lets OpenCode discover the plugin via `file://` protocol. Content:
   ```js
   export { default } from "../../dist/index.js";
   ```

3. **`@opencode-ai/plugin` v1.15.0 installed.** Check its actual exports (has `./tool` and `./tui` subpaths). PluginModule type is the main interface.

4. **npm scripts:** `npm run build` (tsc), `npm test` (vitest run), `npm run dev` (tsc --watch).

5. **Vitest 4.x** — `import.meta.dirname` available in test files (Node 22+).

6. **Test pattern:** Create test files in `tests/`. Use `import.meta.dirname` for relative paths. Vitest auto-discovers `tests/*.test.ts`.
