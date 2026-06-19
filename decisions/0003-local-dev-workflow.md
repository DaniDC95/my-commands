# 0003. Local Dev Workflow

## Status
Accepted

## Context
Phase 4 registers the plugin with OpenCode for local development. Need to wire the plugin so OpenCode discovers the `/commit` command.

## Decision
- Register via `file://` protocol in `opencode.jsonc`: `"file:///home/danie/Documents/local-repos/my-commands/.opencode/plugins/my-commands.js"`
- Bridge file `.opencode/plugins/my-commands.js` re-exports from `dist/index.js`
- No symlink fallback needed if OpenCode auto-discovers commands from plugin package

## Rationale
- `file://` registration points directly to the built plugin entry point
- No global install needed during development — rebuild + restart OpenCode picks up changes
- Avoids polluting global commands directory with symlinks

## Consequences
- `npm run build` required before OpenCode restarts
- Plugin path in config is absolute — won't work if repo moves
- If OpenCode fails to auto-discover commands from `file://` plugins, fallback to symlink in `~/.config/opencode/commands/`
