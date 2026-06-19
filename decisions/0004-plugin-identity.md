# 0004. Plugin Identity

## Status
Accepted

## Context
Phase 2 establishes the plugin's source code identity. Need name, shape, and export strategy.

## Decision
- Plugin ID: `"my-commands"` (matches npm package name)
- Export default `PluginModule` via `server` async function returning empty hooks
- Bridge file `.opencode/plugins/my-commands.js` re-exports from `dist/index.js`

## Rationale
- `id` matches package name for discoverability
- `PluginModule` with `server` function is the standard OpenCode plugin contract
- Empty hooks keep phase minimal while establishing correct shape
- Bridge file via `file://` protocol lets OpenCode load plugin from local build output

## Consequences
- Build (`tsc`) required before plugin is loadable
- Bridge file points to dist — must match after build
- Adding hooks in future phases won't require structural changes
