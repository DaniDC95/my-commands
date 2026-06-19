# 0002. Commit Command

## Status
Accepted

## Context
Phase 3 creates the `/commit` slash command. Prompt must match `/caveman-commit` exactly for behavioral parity.

## Decision
- File: `commands/commit.md` — plain markdown, no YAML frontmatter
- Prompt text: verbatim copy from `opencode-caveman/commands/caveman-commit.md`
- Single conventional commit line output, no body, no bullet points, no explanation, no quotes

## Rationale
- Verbatim parity ensures identical model behavior to `/caveman-commit`
- No YAML frontmatter avoids parsing issues — OpenCode treats plain markdown body as the prompt
- No `!command` shell injection markers — safe for arbitrary model output

## Consequences
- File must stay in sync with upstream `caveman-commit.md` if that prompt evolves
- Test 10 enforces verbatim parity — will fail if either file diverges
- Command name `/commit` derived from filename `commit.md` per OpenCode convention
