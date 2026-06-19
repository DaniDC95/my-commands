# my-commands

Custom slash commands plugin for [OpenCode](https://opencode.ai).

## Commands

- `/commit` — Generate a terse conventional commit message from staged changes

## Installation

### Local development

```jsonc
// ~/.config/opencode/opencode.jsonc
{
  "plugin": [
    "opencode-caveman",
    "file:///path/to/my-commands/.opencode/plugins/my-commands.js"
  ]
}
```

### npm registry (future)

```bash
npm install -g my-commands
```

Then add `"my-commands"` to your `opencode.jsonc` `plugin` array.

## Development

```bash
git clone <repo>
cd my-commands
npm install
npm run build
npm test
```

- `npm run build` — TypeScript compile
- `npm test` — Run test suite (vitest)
- `npm run dev` — Watch mode

## Publishing

```bash
npm run build
npm publish
```

## License

MIT
