import TempStorage from "../../src/js/Services/TempStorage";
import { fake } from "../tools";

describe("TempStorage", () => {
  describe("ひととおり", () => {
    it("なんかする", async () => {
      const key = "my_key_123";
      const val = "my_val_456";
      fake(chrome.storage.local.get).callbacks({ [key]: val });
      fake(chrome.storage.local.set).callbacks({ [key]: val });
      const storage = new TempStorage();
      const genkey = await storage.store(key, val);
      expect(genkey).toBe(key);
      const value = await storage.draw(key);
      expect(value).toBe(val);
    });
  });
});