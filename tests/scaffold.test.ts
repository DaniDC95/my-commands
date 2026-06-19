import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

const ROOT = resolve(import.meta.dirname, "..");

function readJSON(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, "utf-8"));
}

describe("package.json", () => {
  const pkgPath = resolve(ROOT, "package.json");
  const pkg = readJSON(pkgPath);

  it("exists and is valid JSON", () => {
    expect(existsSync(pkgPath)).toBe(true);
    expect(pkg).toBeInstanceOf(Object);
  });

  it('has name "my-commands"', () => {
    expect(pkg.name).toBe("my-commands");
  });

  it('has type "module"', () => {
    expect(pkg.type).toBe("module");
  });

  it("has main field", () => {
    expect(typeof pkg.main).toBe("string");
    expect(pkg.main).toBe("./dist/index.js");
  });

  it("has exports field", () => {
    expect(pkg.exports).toBeDefined();
    const exp = pkg.exports as Record<string, unknown>;
    expect(exp["."]).toBeDefined();
  });

  it("has files array with required entries", () => {
    expect(Array.isArray(pkg.files)).toBe(true);
    const files = pkg.files as string[];
    expect(files).toContain("dist");
    expect(files).toContain("commands");
    expect(files).toContain(".opencode");
  });

  it("has build script", () => {
    expect(pkg.scripts).toBeDefined();
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts.build).toBe("tsc");
  });

  it("has test script", () => {
    expect(pkg.scripts).toBeDefined();
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts.test).toBe("vitest run");
  });

  it("has peerDependencies with @opencode-ai/plugin", () => {
    expect(pkg.peerDependencies).toBeDefined();
    const peerDeps = pkg.peerDependencies as Record<string, string>;
    expect(peerDeps["@opencode-ai/plugin"]).toBeDefined();
  });
});

describe("tsconfig.json", () => {
  const tsconfigPath = resolve(ROOT, "tsconfig.json");

  it("exists and is valid JSON", () => {
    expect(existsSync(tsconfigPath)).toBe(true);
    const cfg = readJSON(tsconfigPath);
    expect(cfg).toBeInstanceOf(Object);
  });

  it("has compilerOptions.outDir set to dist", () => {
    const cfg = readJSON(tsconfigPath);
    const opts = cfg.compilerOptions as Record<string, unknown>;
    expect(opts.outDir).toBe("dist");
  });
});

describe("vitest.config.ts", () => {
  it("exists", () => {
    expect(existsSync(resolve(ROOT, "vitest.config.ts"))).toBe(true);
  });
});

describe(".gitignore", () => {
  const gitignorePath = resolve(ROOT, ".gitignore");

  it("exists", () => {
    expect(existsSync(gitignorePath)).toBe(true);
  });

  it("contains node_modules", () => {
    const content = readFileSync(gitignorePath, "utf-8");
    expect(content).toContain("node_modules");
  });

  it("contains dist", () => {
    const content = readFileSync(gitignorePath, "utf-8");
    expect(content).toContain("dist");
  });
});
