import PermissionService from "../../src/js/Services/Permission";
import {fake} from "../tools";

describe("PermissionService", () => {
  describe("request", () => {
    it("なんかする", async () => {
      fake(chrome.permissions.request).callbacks(true);
      const ps = new PermissionService();
      const res = await ps.request({origins: ["http://otiai10.com"]});
      expect(res).toBe(true);
    });
  });
  describe("contains", () => {
    it("なんかする", async () => {
      fake(chrome.permissions.contains).callbacks(true);
      const ps = new PermissionService();
      const res = await ps.contains({origins: ["http://otiai10.com"]});
      expect(res).toBe(true);
    });
  });
});