import { expect, describe, it } from "vitest";

import { composeManifest } from "../scripts/build-manifest";

describe("composeManifest localhost host_permission 注入", () => {
  const template = () => ({
    name: "placeholder",
    permissions: ["storage", "webRequest"],
    host_permissions: ["<all_urls>"],
  });

  it("dev チャンネルでは http://127.0.0.1/* を host_permissions に注入する", () => {
    const manifest = composeManifest(template(), { channel: "dev", version: "4.8.3" });
    expect(manifest.host_permissions).toContain("http://127.0.0.1/*");
  });

  it("beta / prod チャンネルでは注入しない", () => {
    for (const channel of ["beta", "prod"] as const) {
      const manifest = composeManifest(template(), { channel, version: "4.8.3" });
      expect(manifest.host_permissions).not.toContain("http://127.0.0.1/*");
      expect(manifest.host_permissions).toEqual(["<all_urls>"]);
    }
  });

  it("template の host_permissions を破壊しない", () => {
    const t = template();
    composeManifest(t, { channel: "dev", version: "4.8.3" });
    expect(t.host_permissions).toEqual(["<all_urls>"]);
  });

  it("dev で二重注入しない（冪等）", () => {
    const t = { name: "x", host_permissions: ["<all_urls>", "http://127.0.0.1/*"] };
    const manifest = composeManifest(t, { channel: "dev", version: "4.8.3" });
    const count = (manifest.host_permissions as string[]).filter((p) => p === "http://127.0.0.1/*").length;
    expect(count).toBe(1);
  });
});
