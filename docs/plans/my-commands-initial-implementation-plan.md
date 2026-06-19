# MyCommands Plugin — Implementation Plan

## Overview

Create an OpenCode plugin named `my-commands` that provides custom slash commands. Initial
release: single `/commit` command (parity with `/caveman-commit`). Plugin structure is
npm-publish-ready from day one but developed locally via `file://` protocol.

## Location

```
/home/danie/Documents/local-repos/my-commands/
```

Standalone git repo. Independent publish path. Not inside opencode config repo (~/.config/opencode).

## Principles

- Each phase independently implementable and testable
- Every phase includes its own tests
- All tests deterministic — no time, network, or filesystem race conditions
- Zero skipped tests
- Full test suite must pass in single `npm test` run
- Error handling with clear messages
- Design decisions recorded in `decisions/` directory

---

## Phase 1 — Scaffold Plugin Package

Create npm-ready package structure with build pipeline.

### Files to Create

| File | Content |
|------|---------|
| `package.json` | `name: "my-commands"`, `type: "module"`, `exports` → `./dist/index.js`, `files: ["dist", "commands", ".opencode"]`, scripts: `build: tsc`, `test: vitest run`, devDeps: `typescript`, `vitest`, `@types/node`, peerDeps: `@opencode-ai/plugin` |
| `tsconfig.json` | target ES2022, module NodeNext, outDir dist, strict, include src |
| `vitest.config.ts` | Default vitest config with TypeScript support |
| `.gitignore` | `node_modules`, `dist` |

### Verification

```bash
npm install
npx tsc --noEmit
```

Both must pass with zero errors.

### Tests (tests/scaffold.test.ts)

1. `package.json` exists and is valid JSON
2. `package.json` contains required fields (`name`, `type`, `main`, `exports`, `files`, `scripts.build`, `scripts.test`)
3. `package.json` `name` equals `"my-commands"`
4. `tsconfig.json` exists and is valid JSON
5. `tsconfig.json` has `compilerOptions.outDir` set to `"dist"`
6. `vitest.config.ts` exists
7. `.gitignore` contains `node_modules` and `dist`

---

## Phase 2 — Plugin Source (Empty Hooks)

Create minimal TypeScript plugin that exports correct shape with empty hooks.
Expandable for future features without restructuring.

### Files to Create

| File | Content |
|------|---------|
| `src/index.ts` | `PluginModule` with `id: "my-commands"`, `server` returning empty hooks `{}` |
| `.opencode/plugins/my-commands.js` | Re-export: `export { default } from "../../dist/index.js"` |

### Source Design

```typescript
import type { PluginModule } from "@opencode-ai/plugin";

const MyCommandsPlugin: PluginModule = {
  id: "my-commands",
  server: async () => {
    return {
      // Empty hooks — ready for future expansion
      // Add hooks here as features are added
    };
  },
};

export default MyCommandsPlugin;
```

### Tests (tests/plugin.test.ts)

1. Default export has shape `{ id: string, server: Function }`
2. `id === "my-commands"`
3. `server()` is an async function
4. `await server()` returns an object (no throw)
5. Plugin type-checks against `PluginModule` type from `@opencode-ai/plugin`
6. `npm run build` exits 0
7. `dist/index.js` exists after build
8. `dist/index.d.ts` exists after build
9. `dist/index.js` is valid ESM (can be imported without error)
10. `.opencode/plugins/my-commands.js` exists
11. `.opencode/plugins/my-commands.js` has single re-export line

---

## Phase 3 — `/commit` Command

Create the slash command markdown file. Prompt is verbatim copy of `/caveman-commit`
behavior.

### Files to Create

| File | Content |
|------|---------|
| `commands/commit.md` | Prompt: "Generate a terse git commit message for staged changes. Run: git diff --cached. Summarize changes as a conventional commit message (type: description). One line, no body, no bullet points. type must be one of: feat, fix, refactor, chore, docs, test, build, ci. Output only the commit message — no explanation, no 'here is your commit message', no quotes." |

### Command File Properties

- No YAML frontmatter (no `---` block)
- No shell injection markers (`!command`)
- Plain markdown body sent as prompt to model
- File name `commit.md` → command `/commit`

### Tests (tests/commands.test.ts)

1. `commands/commit.md` exists
2. `commands/commit.md` has no YAML frontmatter (no `---` delimiters)
3. Content contains "git diff --cached"
4. Content contains all 7 conventional commit types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`, `ci`
5. Content requires one-line output (has "one line" or "One line")
6. Content prohibits bullet points (has "no bullet points" or "no bullet")
7. Content prohibits body (has "no body")
8. Content prohibits explanation and quotes around output
9. No shell injection markers (`!` followed by backtick)
10. **Parity:** Content matches reference file `opencode-caveman/commands/caveman-commit.md` verbatim
11. Content readable as valid markdown (no broken syntax)

---

## Phase 4 — Register Plugin Locally

Wire plugin into opencode config for local development testing.

### Files to Modify

| File | Change |
|------|--------|
| `~/.config/opencode/opencode.jsonc` | Add `"file:///home/danie/Documents/local-repos/my-commands/.opencode/plugins/my-commands.js"` to `plugin` array (or adjusted path after verification) |

### Registration Approaches (Test in Order)

**Primary approach:** `file://` protocol pointing to plugin entry point

```json
{
  "plugin": [
    "opencode-caveman",
    "file:///home/danie/Documents/local-repos/my-commands/.opencode/plugins/my-commands.js"
  ]
}
```

**Fallback (if commands not auto-discovered from file://):**
Symlink command file into global commands directory:

```bash
ln -s /home/danie/Documents/local-repos/my-commands/commands/commit.md \
      /home/danie/.config/opencode/commands/commit.md
```

### Verification

1. OpenCode starts without plugin load error
2. `/commit` command appears in TUI command palette
3. Typing `/commit` sends correct prompt to model
4. Command output matches expected conventional commit format

---

## Phase 5 — Build + Publish Preparation

Ensure package is ready for npm publish.

### Files to Create

| File | Content |
|------|---------|
| `README.md` | Install instructions, usage, plugin description, development setup |
| `LICENSE` | MIT License, 2026, Danie |

### README sections

- Overview
- Installation (local dev + npm)
- Usage (`/commit` command)
- Development (setup, build, test)
- Publishing

### Tests (tests/build.test.ts)

1. `npm run build` exits 0
2. `dist/index.js` exists and is valid ESM
3. `dist/index.d.ts` exists
4. `README.md` exists
5. `LICENSE` exists
6. `npm pack --dry-run` output includes: `dist/`, `commands/`, `.opencode/`, `package.json`, `README.md`, `LICENSE`
7. `npm pack --dry-run` output does NOT include: `src/`, `tests/`, `node_modules/`, `tsconfig.json`, `vitest.config.ts`

---

## Phase 6 — Full Test Suite

Execute all tests together. Verify zero regressions against existing config.

### Execution

```bash
cd /home/danie/Documents/local-repos/my-commands
npm test
```

### Requirements

- All tests pass in single run
- Zero skipped tests
- Zero flaky tests (no timeouts, no network-dependent assertions)
- Deterministic: same result every run on same code

### Test Structure

```
tests/
├── scaffold.test.ts    # Phase 1: package.json, tsconfig, vitest config
├── plugin.test.ts      # Phase 2: plugin shape, exports, build output
├── commands.test.ts    # Phase 3: commit.md content, syntax, parity
└── build.test.ts       # Phase 5: build output, pack contents
```

---

## Decision Records

Every design and implementation decision recorded in `decisions/` directory.

### Initial Decision Files

| File | Topic |
|------|-------|
| `decisions/0001-initial-scaffold.md` | Plugin structure, location, npm-ready layout, empty hooks |
| `decisions/0002-commit-command.md` | `/commit` command scope, prompt content, parity with `/caveman-commit` |
| `decisions/0003-local-dev-workflow.md` | `file://` protocol usage, opencode.jsonc config, fallback strategy |
| `decisions/0004-plugin-identity.md` | Plugin name, npm publish readiness, name collision check |

### Decision Template

```markdown
# NNNN. Title

## Status
Accepted / Proposed / Deprecated

## Context
What we were trying to do and why.

## Decision
What we chose.

## Rationale
Why this choice over alternatives. Key trade-offs considered.

## Consequences
What this means for implementation and future work. Risks and mitigations.
```

---

## Complete File Map

### Created (16 files)

```
my-commands/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── README.md
├── LICENSE
├── decisions/
│   ├── 0001-initial-scaffold.md
│   ├── 0002-commit-command.md
│   ├── 0003-local-dev-workflow.md
│   └── 0004-plugin-identity.md
├── docs/
│   └── plans/
│       └── plan.md              ← this file
├── src/
│   └── index.ts
├── .opencode/
│   └── plugins/
│       └── my-commands.js
├── commands/
│   └── commit.md
└── tests/
    ├── scaffold.test.ts
    ├── plugin.test.ts
    ├── commands.test.ts
    └── build.test.ts
```

### Modified (1 file)

```
~/.config/opencode/opencode.jsonc
```

---

## Edge Cases & Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `file://` plugin loading fails to discover commands from package `commands/` dir | Medium | High | Phase 4 verification step. Fallback: symlink command file |
| Plugin name collision with existing npm package | Low | Medium | Check npm registry before final name. Rename to `opencode-my-commands` if taken |
| `peerDependencies` version mismatch | Low | Medium | Use `"*"` in peerDep (same pattern as caveman) |
| TypeScript config incompatibility with current node/tsc version | Low | Low | Test `npx tsc --noEmit` during scaffold phase |
| Pre-existing bug in opencode config discovered during testing | Low | Medium | Flag and ask before fixing. Bug fix is separate scope |
