# Handover: Phase 4 → Phase 5

## What Phase 4 Delivered

- `~/.config/opencode/opencode.jsonc` — added `"file:///home/danie/Documents/local-repos/my-commands/.opencode/plugins/my-commands.js"` to `plugin` array
- `decisions/0003-local-dev-workflow.md` — rationale for `file://` registration over symlink

## Good to Know

1. **Config change is outside repo.** `~/.config/opencode/opencode.jsonc` was modified — cannot git stage it from within `my-commands/`. If others clone this repo, they need to add the file:// entry manually.

2. **Plugin must be built before OpenCode restarts.** Bridge file `.opencode/plugins/my-commands.js` re-exports from `dist/index.js`. If dist is stale, plugin load fails silently.

3. **`opencode --version` returns 1.17.8** — loads without plugin error.

4. **No automated tests for Phase 4.** The plan's verification steps are manual (restart OpenCode, check `/commit` in TUI, test the prompt). No test file was created because the change is in a different repo.

5. **Phase 5 creates README.md + LICENSE.** Plus `tests/build.test.ts` to verify `npm pack --dry-run` includes/excludes the right files. This is the last code-creation phase before the final integration test sweep.

6. **Risk:** If `file://` plugin loading doesn't auto-discover commands from the package's `commands/` directory, the fallback is a symlink:
   ```bash
   ln -s /home/danie/Documents/local-repos/my-commands/commands/commit.md \
         /home/danie/.config/opencode/commands/commit.md
   ```
