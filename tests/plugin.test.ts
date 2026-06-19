import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { describe, it, expect, beforeAll } from "vitest";

const ROOT = resolve(import.meta.dirname, "..");

let built = false;

beforeAll(() => {
  execSync("npx tsc --noEmit", { cwd: ROOT, stdio: "pipe" });
  execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
  built = true;
}, 30000);

describe("plugin module", () => {
  it("default export has shape { id: string, server: Function }", async () => {
    const mod = await import("../src/index.ts");
    const plugin = mod.default;
    expect(plugin).toHaveProperty("id");
    expect(typeof plugin.id).toBe("string");
    expect(plugin).toHaveProperty("server");
    expect(typeof plugin.server).toBe("function");
  });

  it('id === "my-commands"', async () => {
    const mod = await import("../src/index.ts");
    expect(mod.default.id).toBe("my-commands");
  });

  it("server() is an async function", async () => {
    const mod = await import("../src/index.ts");
    const serverFn = mod.default.server;
    const isAsync = serverFn.constructor.name === "AsyncFunction";
    expect(isAsync).toBe(true);
  });

  it("await server() returns an object (no throw)", async () => {
    const mod = await import("../src/index.ts");
    const hooks = await mod.default.server();
    expect(hooks).toBeInstanceOf(Object);
  });
});

describe("type safety", () => {
  it("Plugin type-checks against PluginModule type", () => {
    expect(built).toBe(true);
  });
});

describe("npm run build", () => {
  it("exits 0", () => {
    expect(built).toBe(true);
  });

  it("dist/index.js exists after build", () => {
    expect(existsSync(resolve(ROOT, "dist/index.js"))).toBe(true);
  });

  it("dist/index.d.ts exists after build", () => {
    expect(existsSync(resolve(ROOT, "dist/index.d.ts"))).toBe(true);
  });

  it("dist/index.js is valid ESM (can be imported without error)", async () => {
    const mod = await import(resolve(ROOT, "dist/index.js"));
    expect(mod.default).toBeDefined();
  });
});

describe(".opencode/plugins/my-commands.js", () => {
  const bridgePath = resolve(ROOT, ".opencode/plugins/my-commands.js");

  it("exists", () => {
    expect(existsSync(bridgePath)).toBe(true);
  });

  it("has single re-export line", () => {
    const content = readFileSync(bridgePath, "utf-8").trim();
    expect(content).toBe('export { default } from "../../dist/index.js";');
  });
});
