import { expect, describe, it } from "vitest";

import { composeManifest } from "../scripts/build-manifest";

describe("composeManifest nativeMessaging 注入", () => {
  const template = () => ({
    name: "placeholder",
    permissions: ["storage", "webRequest"],
  });

  it("dev チャンネルでは nativeMessaging を注入する", () => {
    const manifest = composeManifest(template(), { channel: "dev", version: "4.8.3" });
    expect(manifest.permissions).toContain("nativeMessaging");
  });

  it("beta / prod チャンネルでは nativeMessaging を注入しない", () => {
    for (const channel of ["beta", "prod"] as const) {
      const manifest = composeManifest(template(), { channel, version: "4.8.3" });
      expect(manifest.permissions).not.toContain("nativeMessaging");
      expect(manifest.permissions).toEqual(["storage", "webRequest"]);
    }
  });

  it("template の permissions を破壊しない", () => {
    const t = template();
    composeManifest(t, { channel: "dev", version: "4.8.3" });
    expect(t.permissions).toEqual(["storage", "webRequest"]);
  });

  it("dev で二重注入しない（冪等）", () => {
    const t = { name: "x", permissions: ["storage", "nativeMessaging"] };
    const manifest = composeManifest(t, { channel: "dev", version: "4.8.3" });
    const count = (manifest.permissions as string[]).filter((p) => p === "nativeMessaging").length;
    expect(count).toBe(1);
  });
});
