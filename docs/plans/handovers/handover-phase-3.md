# Handover: Phase 3 → Phase 4

## What Phase 3 Delivered

- `commands/commit.md` — slash command prompt, verbatim copy of `caveman-commit.md`
- `tests/commands.test.ts` — 11 tests: existence, no frontmatter, content checks, verbatim parity, markdown validity
- `decisions/0002-commit-command.md` — rationale for command design and parity constraint

## Good to Know

1. **Parity test.** `commands/commit.md` is identical to `opencode-caveman/commands/caveman-commit.md` (enforced by test 10). If upstream changes, this test catches divergence.

2. **Reference path.** The parity test uses `homedir() + "/.config/opencode/node_modules/opencode-caveman/commands/caveman-commit.md"`. This path is specific to this machine — verify it exists before running tests.

3. **No YAML frontmatter.** OpenCode treats plain `.md` body as the prompt. Don't add `---` blocks.

4. **No shell injection.** Command file has no `!command` markers — safe for AI-generated output.

5. **Phase 4 registers the plugin.** Modify `~/.config/opencode/opencode.jsonc` to add `file:///home/danie/Documents/local-repos/my-commands/.opencode/plugins/my-commands.js` to the `plugin` array. Also need to add `"my-commands"` to the plugin array (or use the file:// path directly). Verify OpenCode starts without errors and `/commit` appears in TUI.
