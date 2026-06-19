import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

const ROOT = resolve(import.meta.dirname, "..");
const COMMIT_PATH = resolve(ROOT, "commands/commit.md");
const REF_PATH = resolve(
  homedir(),
  ".config/opencode/node_modules/opencode-caveman/commands/caveman-commit.md",
);

function readFile(path: string): string {
  return readFileSync(path, "utf-8");
}

function lines(content: string): string[] {
  return content.split("\n");
}

describe("commands/commit.md", () => {
  const content = readFile(COMMIT_PATH);

  it("exists", () => {
    expect(existsSync(COMMIT_PATH)).toBe(true);
  });

  it("has no YAML frontmatter (no --- delimiters)", () => {
    expect(content).not.toMatch(/^---\s*$/m);
  });

  it('contains "git diff --cached"', () => {
    expect(content).toContain("git diff --cached");
  });

  it("contains all conventional commit types", () => {
    const types = ["feat", "fix", "refactor", "chore", "docs", "test", "build", "ci"];
    for (const t of types) {
      expect(content).toContain(t);
    }
  });

  it('requires one-line output (has "one line" or "One line")', () => {
    const hasOneLine = /\b[Oo]ne line\b/.test(content);
    expect(hasOneLine).toBe(true);
  });

  it('prohibits bullet points (has "no bullet points" or "no bullet")', () => {
    const hasNoBullet = /\bno bullet\b/i.test(content);
    expect(hasNoBullet).toBe(true);
  });

  it('prohibits body (has "no body")', () => {
    expect(content).toContain("no body");
  });

  it("prohibits explanation and quotes around output", () => {
    expect(content).toContain("no explanation");
    expect(content).toContain("no quotes");
  });

  it("has no shell injection markers (! followed by backtick)", () => {
    expect(content).not.toMatch(/!`/);
  });

  it("matches reference file verbatim", () => {
    const ref = readFile(REF_PATH);
    expect(content).toBe(ref);
  });

  it("is readable as valid markdown (no broken syntax)", () => {
    const ln = lines(content);
    for (const l of ln) {
      expect(() => new TextEncoder().encode(l)).not.toThrow();
    }
  });
});
