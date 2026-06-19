import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { describe, it, expect, beforeAll } from "vitest";

const ROOT = resolve(import.meta.dirname, "..");

let built = false;

beforeAll(() => {
  execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
  built = true;
}, 15000);

describe("build output", () => {
  it("npm run build exits 0", () => {
    expect(built).toBe(true);
  });

  it("dist/index.js exists", () => {
    expect(existsSync(resolve(ROOT, "dist/index.js"))).toBe(true);
  });

  it("dist/index.d.ts exists", () => {
    expect(existsSync(resolve(ROOT, "dist/index.d.ts"))).toBe(true);
  });
});

describe("package content", () => {
  it("README.md exists", () => {
    expect(existsSync(resolve(ROOT, "README.md"))).toBe(true);
  });

  it("LICENSE exists", () => {
    expect(existsSync(resolve(ROOT, "LICENSE"))).toBe(true);
  });

  it("npm pack --dry-run includes required files", () => {
    const output = execSync("npm pack --dry-run 2>&1", {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: "pipe",
    });
    expect(output).toContain("dist/");
    expect(output).toContain("commands/");
    expect(output).toContain(".opencode/");
    expect(output).toContain("package.json");
    expect(output).toContain("README.md");
    expect(output).toContain("LICENSE");
  });

  it("npm pack --dry-run excludes dev files", () => {
    const output = execSync("npm pack --dry-run 2>&1", {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: "pipe",
    });
    expect(output).not.toContain("src/");
    expect(output).not.toContain("tests/");
    expect(output).not.toContain("node_modules/");
    expect(output).not.toContain("tsconfig.json");
    expect(output).not.toContain("vitest.config.ts");
  });
});
