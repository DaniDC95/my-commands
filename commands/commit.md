Generate a terse git commit message for staged changes.

Run: git diff --cached

Summarize changes as a conventional commit message (type: description). One line. Body with bullet points (but no sub bullet points) and full of rich context. type must be one of: feat, fix, refactor, chore, docs, test, build, ci, sim. Based on the conversation context, if it's part of one or more phases implementation, include type(P1+P2+P#...), otherwise no parenthesis.
Output only the commit message — no explanation, no "here is your commit message", no quotes.
